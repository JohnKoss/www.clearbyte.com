package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	awscfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ses"
	"github.com/aws/aws-sdk-go-v2/service/ses/types"

	"github.com/zenzoom/utils-log"
)

// The consent language shown next to the checkbox on the opt-in page. Kept here
// so the record says what the person actually agreed to.
const CONSENT_TEXT = "I consent to receive ClearByte-related messages. " +
	"Message & data rates may apply. Reply STOP to opt-out."

var EMAIL_ADDRESS_FROM string
var EMAIL_ADDRESS_TO string

var sesClient *ses.Client

// The payload posted by the opt-in form.
type OptIn struct {
	PhoneNumber string `json:"phoneNumber"`
	Agreed      bool   `json:"agreed"`
}

// /////////////////////
func init() {

	l := log.Start()
	defer l.End()

	// Who the message is sent as. Must be a verified SES identity.
	EMAIL_ADDRESS_FROM = os.Getenv("EMAIL_ADDRESS_FROM")
	if len(EMAIL_ADDRESS_FROM) == 0 {
		l.Panic("Environment variable 'EMAIL_ADDRESS_FROM' is empty!")
	}

	// Where the message is delivered.
	EMAIL_ADDRESS_TO = os.Getenv("EMAIL_ADDRESS_TO")
	if len(EMAIL_ADDRESS_TO) == 0 {
		l.Panic("Environment variable 'EMAIL_ADDRESS_TO' is empty!")
	}

	cfg, err := awscfg.LoadDefaultConfig(context.Background())
	if err != nil {
		l.Panic("could not create AWS config")
	}

	sesClient = ses.NewFromConfig(cfg)
}

// /////////////////////
func HandleRequest(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {

	l := log.Start().Debugf("request:%+v", request)
	defer l.End()

	if request.RequestContext.HTTP.Method != "POST" {
		return respond(405, `{"error":"Method Not Allowed"}`), nil
	}

	body, err := decodeBody(request)
	if err != nil {
		l.Error(err.Error())
		return respond(400, `{"error":"Bad Request"}`), nil
	}

	var o OptIn
	if err := json.Unmarshal([]byte(body), &o); err != nil {
		l.Error(err.Error())
		return respond(400, `{"error":"Bad Request"}`), nil
	}

	// Never record an opt-in that was not actually given.
	if !o.Agreed {
		return respond(400, `{"error":"Consent is required"}`), nil
	}

	digits := digitsOnly(o.PhoneNumber)
	if len(digits) < 10 || len(digits) > 15 {
		return respond(400, `{"error":"Invalid phone number"}`), nil
	}

	if err := send(ctx, digits, request); err != nil {
		l.Error(err.Error())
		// A non-2xx tells the visitor the opt-in was not recorded.
		return respond(502, `{"error":"Could not record the opt-in"}`), nil
	}

	return respond(200, `{"status":"ok"}`), nil
}

// /////////////////////
func send(ctx context.Context, phone string, request events.APIGatewayV2HTTPRequest) error {

	l := log.Start()
	defer l.End()

	// The record needs to show who consented, to what, and when.
	when := time.Now().UTC().Format(time.RFC3339)
	sourceIp := request.RequestContext.HTTP.SourceIP
	userAgent := request.RequestContext.HTTP.UserAgent

	sub := fmt.Sprintf("ClearByte SMS opt-in: %s", phone)
	from := "\"ClearByte\" <" + EMAIL_ADDRESS_FROM + ">"

	text := fmt.Sprintf(
		"Phone: %s\nConsented (UTC): %s\nSource IP: %s\nUser agent: %s\n\nConsent text shown:\n%s\n",
		phone, when, sourceIp, userAgent, CONSENT_TEXT,
	)

	htmlBody := fmt.Sprintf(
		"<p><b>Phone:</b> %s<br><b>Consented (UTC):</b> %s<br><b>Source IP:</b> %s<br><b>User agent:</b> %s</p>"+
			"<hr><p><b>Consent text shown:</b><br>%s</p>",
		html.EscapeString(phone),
		html.EscapeString(when),
		html.EscapeString(sourceIp),
		html.EscapeString(userAgent),
		html.EscapeString(CONSENT_TEXT),
	)

	ret, err := sesClient.SendEmail(ctx, &ses.SendEmailInput{
		Source: aws.String(from),
		Destination: &types.Destination{
			ToAddresses: []string{EMAIL_ADDRESS_TO},
		},
		Message: &types.Message{
			Subject: &types.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String(sub),
			},
			Body: &types.Body{
				Html: &types.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(htmlBody),
				},
				Text: &types.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(text),
				},
			},
		},
	})
	if err != nil {
		return err
	}

	l.Debugf("ret:%+v", ret)
	return nil
}

// /////////////////////
func digitsOnly(s string) string {

	var b strings.Builder
	for _, r := range s {
		if r >= '0' && r <= '9' {
			b.WriteRune(r)
		}
	}

	return b.String()
}

// /////////////////////
// APIGateway base64-encodes the body depending on the content type negotiated.
func decodeBody(request events.APIGatewayV2HTTPRequest) (string, error) {

	if !request.IsBase64Encoded {
		return request.Body, nil
	}

	raw, err := base64.StdEncoding.DecodeString(request.Body)
	if err != nil {
		return "", err
	}

	return string(raw), nil
}

// /////////////////////
func respond(code int, body string) events.APIGatewayV2HTTPResponse {
	return events.APIGatewayV2HTTPResponse{
		StatusCode: code,
		Headers:    map[string]string{"Content-Type": "application/json; charset=UTF-8"},
		Body:       body,
	}
}

// /////////////////////
func main() {

	lambda.Start(HandleRequest)
}
