// Deploys the built site to S3 and invalidates CloudFront.
//
// Run from this directory:
//
//	go run . create
//	CONFIRM_DESTROY=www.clearbyte.com go run . destroy
//
// 'destroy' empties the production bucket, so it refuses to run without the
// confirmation variable. It is deliberately not a test - a bare `go test ./...`
// used to wipe the live site.
package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// ---------------------------------------------------- //

const PATH = "s3://www.clearbyte.com"

// The site the bucket is served as, used to find the CloudFront distribution.
const ALIAS = "www.clearbyte.com"

// Everything runs relative to the repository root, one level up from here.
const ROOT = ".."

const PLAN_CREATE = "create"
const PLAN_DESTROY = "destroy"

// The value CONFIRM_DESTROY must hold before a destroy is allowed.
const CONFIRM_ENV = "CONFIRM_DESTROY"

// ////////////
func main() {

	args := os.Args[1:]
	if len(args) != 1 {
		usage()
		os.Exit(2)
	}

	switch args[0] {

	case PLAN_CREATE:
		if err := Execute(PLAN_CREATE); err != nil {
			fmt.Fprintf(os.Stderr, "deploy failed: %s\n", err)
			os.Exit(1)
		}

	case PLAN_DESTROY:
		// Emptying the production bucket must be deliberate.
		if os.Getenv(CONFIRM_ENV) != ALIAS {
			fmt.Fprintf(os.Stderr,
				"refusing to destroy %s: set %s=%s to confirm\n", PATH, CONFIRM_ENV, ALIAS)
			os.Exit(1)
		}
		if err := Execute(PLAN_DESTROY); err != nil {
			fmt.Fprintf(os.Stderr, "destroy failed: %s\n", err)
			os.Exit(1)
		}

	default:
		usage()
		os.Exit(2)
	}
}

// ////////////
func usage() {
	fmt.Fprintf(os.Stderr, "usage: go run . %s|%s\n", PLAN_CREATE, PLAN_DESTROY)
	fmt.Fprintf(os.Stderr, "  %s requires %s=%s\n", PLAN_DESTROY, CONFIRM_ENV, ALIAS)
}

// ////////////
func Execute(when string) error {

	if len(when) == 0 {
		return fmt.Errorf("'when' is not set")
	}

	fmt.Printf("when:%s, root_path:%s\n", when, PATH)

	switch when {

	case PLAN_CREATE:
		if err := runCommandIn(ROOT, "npm", "run", "build"); err != nil {
			return fmt.Errorf("npm run build: %w", err)
		}

		// --delete removes objects that are no longer in dist, so files taken
		// out of the site stop being served from their old URLs.
		dist := filepath.Join(ROOT, "dist")
		if err := runCommand("aws", "s3", "sync", dist, PATH, "--delete"); err != nil {
			return fmt.Errorf("aws s3 sync: %w", err)
		}

		// Without this the default cache behaviour keeps serving the old HTML.
		if err := invalidate(); err != nil {
			return fmt.Errorf("cloudfront invalidation: %w", err)
		}

	case PLAN_DESTROY:
		if err := runCommand("aws", "s3", "rm", "--recursive", PATH); err != nil {
			return fmt.Errorf("aws s3 rm: %w", err)
		}

	default:
		return fmt.Errorf("unknown plan %q", when)
	}

	fmt.Println("Success: Execute")

	return nil
}

// ////////////
// Finds the distribution serving ALIAS and invalidates everything on it.
func invalidate() error {

	id, err := distributionId()
	if err != nil {
		return err
	}

	fmt.Printf("invalidating distribution %s\n", id)

	return runCommand("aws", "cloudfront", "create-invalidation",
		"--distribution-id", id, "--paths", "/*")
}

// ////////////
// Looked up rather than hardcoded so the id cannot drift from the infrastructure.
func distributionId() (string, error) {

	query := fmt.Sprintf(
		"DistributionList.Items[?contains(Aliases.Items,'%s')].Id", ALIAS)

	out, err := runCommandOutput("aws", "cloudfront", "list-distributions",
		"--query", query, "--output", "text")
	if err != nil {
		return "", err
	}

	id := strings.Fields(out)
	if len(id) == 0 || id[0] == "None" {
		return "", fmt.Errorf("no distribution found with alias %s", ALIAS)
	}

	return id[0], nil
}

// //////
func runCommand(args ...string) error {
	return runCommandIn("", args...)
}

// //////
func runCommandIn(dir string, args ...string) error {
	cmd := exec.Command(args[0], args[1:]...)
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// //////
func runCommandOutput(args ...string) (string, error) {
	cmd := exec.Command(args[0], args[1:]...)
	cmd.Stderr = os.Stderr
	out, err := cmd.Output()
	return string(out), err
}

func WriteKV(fileName, key, value string) {
	// Open the file for reading
	file, err := os.Open(fileName)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}

	// Read the file line by line
	scanner := bufio.NewScanner(file)
	lines := []string{}
	found := false
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, key+"=") {
			// If the key is found, update its value
			line = fmt.Sprintf(`%s="%s"`, key, value) // Add quotes around the value
			found = true
		}
		lines = append(lines, line)
	}
	file.Close()

	// If the key is not found, add a new key-value pair
	if !found {
		lines = append(lines, fmt.Sprintf(`%s="%s"`, key, value)) // Add quotes around the value
	}

	// Open the file for writing
	file, err = os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// Write the lines to the file
	for _, line := range lines {
		_, err = fmt.Fprintln(file, line)
		if err != nil {
			fmt.Println("Error writing to file:", err)
			return
		}
	}

	fmt.Println("Successfully wrote to the file.")
}
