package main

import (
	"context"
	"os"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

// init() panics when these are unset, and package-level initialisers run before
// init(), so this is what makes `go test` work without a preconfigured shell.
var _ = func() bool {
	os.Setenv("EMAIL_ADDRESS_FROM", "noreply@clearbyte.com")
	os.Setenv("EMAIL_ADDRESS_TO", "test@example.com")
	return true
}()

// Only the paths that reject before SES is reached, so no AWS call is made.
func TestHandleRequestRejects(t *testing.T) {

	tests := []struct {
		name   string
		method string
		body   string
		want   int
	}{
		{"non-POST", "GET", "", 405},
		{"malformed json", "POST", "{not json", 400},
		{"empty body", "POST", "{}", 400},
		{"missing message", "POST", `{"name":"A","email":"a@b.c"}`, 400},
		{"missing email", "POST", `{"name":"A","message":"hi"}`, 400},
		{"missing name", "POST", `{"email":"a@b.c","message":"hi"}`, 400},
		{"whitespace only", "POST", `{"name":" ","email":" ","message":" "}`, 400},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			req := events.APIGatewayV2HTTPRequest{Body: tt.body}
			req.RequestContext.HTTP.Method = tt.method

			resp, err := HandleRequest(context.Background(), req)
			if err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if resp.StatusCode != tt.want {
				t.Errorf("got status %d, want %d (body:%s)", resp.StatusCode, tt.want, resp.Body)
			}
		})
	}
}

func TestDecodeBody(t *testing.T) {

	req := events.APIGatewayV2HTTPRequest{Body: "eyJuYW1lIjoiQSJ9", IsBase64Encoded: true}

	got, err := decodeBody(req)
	if err != nil {
		t.Fatalf("unexpected error: %s", err)
	}

	if got != `{"name":"A"}` {
		t.Errorf("got %s", got)
	}
}
