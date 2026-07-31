package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	awscfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ses"
	"github.com/aws/aws-sdk-go-v2/service/ses/types"

	"github.com/zenzoom/utils-log"
)

var EMAIL_ADDRESS_FROM string
var EMAIL_ADDRESS_TO string

var sesClient *ses.Client

// The payload posted by the contact form.
type Contact struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
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

	var c Contact
	if err := json.Unmarshal([]byte(body), &c); err != nil {
		l.Error(err.Error())
		return respond(400, `{"error":"Bad Request"}`), nil
	}

	c.Name = strings.TrimSpace(c.Name)
	c.Email = strings.TrimSpace(c.Email)
	c.Message = strings.TrimSpace(c.Message)

	if len(c.Name) == 0 || len(c.Email) == 0 || len(c.Message) == 0 {
		return respond(400, `{"error":"Name, email and message are all required"}`), nil
	}

	if err := send(ctx, &c); err != nil {
		l.Error(err.Error())
		// The form relies on a non-2xx to tell the visitor the message did not arrive.
		return respond(502, `{"error":"Could not send the message"}`), nil
	}

	return respond(200, `{"status":"ok"}`), nil
}

// /////////////////////
func send(ctx context.Context, c *Contact) error {

	l := log.Start()
	defer l.End()

	sub := fmt.Sprintf("ClearByte contact form: %s", c.Name)
	from := "\"ClearByte\" <" + EMAIL_ADDRESS_FROM + ">"

	text := fmt.Sprintf("Name: %s\nEmail: %s\n\n%s\n", c.Name, c.Email, c.Message)

	htmlBody := fmt.Sprintf(
		"<p><b>Name:</b> %s<br><b>Email:</b> %s</p><hr><p>%s</p>",
		html.EscapeString(c.Name),
		html.EscapeString(c.Email),
		strings.ReplaceAll(html.EscapeString(c.Message), "\n", "<br>"),
	)

	ret, err := sesClient.SendEmail(ctx, &ses.SendEmailInput{
		Source: aws.String(from),
		Destination: &types.Destination{
			ToAddresses: []string{EMAIL_ADDRESS_TO},
		},
		// So a reply goes to the visitor rather than the noreply identity.
		ReplyToAddresses: []string{c.Email},
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
