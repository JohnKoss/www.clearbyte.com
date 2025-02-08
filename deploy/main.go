package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"sync"
)

// const (
// 	ID          = "itcc1000_s3_1v1" // 
// 	LEVEL       = "1"
// 	NAME        = "S3 Lab 1"
// 	VERSION     = "1.0.0"
// 	DESCRIPTION = "An activity to create an S3 bucket to host a static website."
// 	POINTS      = 35
// 	ATTEMPTS    = defs.LAB_ATTEMPTS_DEFAULT
// 	DURATION    = 7200 // Minutes

// 	QTI_FILE_NAME = "qti_1.xml"
// )

const (
	CLIENT_ID = "ClientId-63020000000000260"
	CLASS_ID  = "ClassId-6efa21560506cd9fa3085a10883aec6a61f733f3" // sandbox
	//CLASS_ID  = "ClassId-94b5a90f84095764f84075f4fd9cdd528e8b8657" //ITCC 1000 O0801 2024SS
)

// ---------------------------------------------------- //


const PATH = "s3://lti13.clearbyte.io/lti13/instructor"

const PLAN_CREATE = "create"
const PLAN_DESTROY = "destroy"

// ////////////
func Execute(when string) bool {

	if len(when) == 0 {
		panic("'when' is not set")
	}


	fmt.Printf("when:%s, root_path:%s\n", when, PATH)
	if when == PLAN_CREATE {

		// if _, ok := ValidateHcl("../hcl/config.hcl"); !ok {
		// 	fmt.Println("Error: HCL validation failed")
		// 	return false
		// }

		// Build the lab activity objects...
		err := runCommand("npm", "run", "build")
		if err != nil {
			fmt.Println("Error running npm install:", err)
			return false
		}

		// Define upload commands...
		commands := [][]string{{"aws", "s3", "sync", "../dist", PATH}}


		// Run upload commands in parallel
		if err := runCommandsConcurrently(commands); err != nil {
			panic("Error running commands:")
		}

	} else if when == PLAN_DESTROY {

		// Destroy the lab activity objects...
		err := runCommand("aws", "s3", "rm", "--recursive", PATH)
		if err != nil {
			fmt.Println("Error running npm install:", err)
			return false
		}
	}

	//ApplyToDb(when, &q)
	fmt.Println("Success: Execute")

	return true
}


// //////
func runCommandsConcurrently(commands [][]string) error {
	var wg sync.WaitGroup

	// Use a channel to signal completion of each command
	done := make(chan bool, len(commands))

	for _, cmdArgs := range commands {
		wg.Add(1)

		go func(args []string) {
			defer wg.Done()

			err := runCommand(args...)
			if err != nil {
				fmt.Printf("Error running %s: %s\n", args[0], err)
			}

			// Signal completion
			done <- true
		}(cmdArgs)
	}

	// Wait for all commands to finish
	go func() {
		wg.Wait()
		close(done)
	}()

	// Wait for completion signal for each command
	for range commands {
		<-done
	}

	fmt.Println("All commands executed successfully.")
	return nil
}

func runCommand(args ...string) error {
	cmd := exec.Command(args[0], args[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
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
