package main

import (
	"context"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

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
		{"no consent", "POST", `{"phoneNumber":"5551234567","agreed":false}`, 400},
		{"consent missing", "POST", `{"phoneNumber":"5551234567"}`, 400},
		{"phone too short", "POST", `{"phoneNumber":"555123","agreed":true}`, 400},
		{"phone too long", "POST", `{"phoneNumber":"5551234567890123","agreed":true}`, 400},
		{"phone empty", "POST", `{"phoneNumber":"","agreed":true}`, 400},
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

func TestDigitsOnly(t *testing.T) {

	tests := []struct {
		in   string
		want string
	}{
		{"5551234567", "5551234567"},
		{"(555) 123-4567", "5551234567"},
		{"+1 555 123 4567", "15551234567"},
		{"abc", ""},
	}

	for _, tt := range tests {
		if got := digitsOnly(tt.in); got != tt.want {
			t.Errorf("digitsOnly(%q) = %q, want %q", tt.in, got, tt.want)
		}
	}
}
