// main_test.go
package main

import (
	"testing"
)

func TestWebsiteCreate(t *testing.T) {
	if !Execute(PLAN_CREATE) {
		t.Fail()
	}
}
func TestWebsiteDestroy(t *testing.T) {
	Execute(PLAN_DESTROY)
}

func TestWriteDescription(t *testing.T) {
	WriteKV("..\\.env","LAB_DESC", "This is a test")
}