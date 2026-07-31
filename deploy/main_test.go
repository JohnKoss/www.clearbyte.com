// main_test.go
//
// These tests must never touch the live bucket. Deploying is `go run . create`,
// not `go test` - an earlier version ran the create and destroy paths as tests,
// which emptied the production bucket on a bare `go test ./...`.
package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestExecuteRejectsBadPlan(t *testing.T) {

	for _, plan := range []string{"", "nonsense", "CREATE"} {
		if err := Execute(plan); err == nil {
			t.Errorf("Execute(%q) returned nil, expected an error", plan)
		}
	}
}

func TestWriteKVUpdatesExistingKey(t *testing.T) {

	path := filepath.Join(t.TempDir(), ".env")
	if err := os.WriteFile(path, []byte("FOO=\"one\"\nLAB_DESC=\"old\"\nBAR=\"two\"\n"), 0644); err != nil {
		t.Fatal(err)
	}

	WriteKV(path, "LAB_DESC", "new")

	got := readFile(t, path)
	if !strings.Contains(got, `LAB_DESC="new"`) {
		t.Errorf("key not updated:\n%s", got)
	}
	if strings.Contains(got, `LAB_DESC="old"`) {
		t.Errorf("old value still present:\n%s", got)
	}
	if !strings.Contains(got, `FOO="one"`) || !strings.Contains(got, `BAR="two"`) {
		t.Errorf("other keys were lost:\n%s", got)
	}
}

func TestWriteKVAppendsMissingKey(t *testing.T) {

	path := filepath.Join(t.TempDir(), ".env")
	if err := os.WriteFile(path, []byte("FOO=\"one\"\n"), 0644); err != nil {
		t.Fatal(err)
	}

	WriteKV(path, "LAB_DESC", "added")

	got := readFile(t, path)
	if !strings.Contains(got, `LAB_DESC="added"`) {
		t.Errorf("key not appended:\n%s", got)
	}
	if !strings.Contains(got, `FOO="one"`) {
		t.Errorf("existing key was lost:\n%s", got)
	}
}

func readFile(t *testing.T, path string) string {
	t.Helper()

	b, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}

	return string(b)
}
