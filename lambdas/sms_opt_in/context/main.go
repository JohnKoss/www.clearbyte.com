// See: https://stackoverflow.com/questions/66738035/converting-jwk-json-into-a-public-key-golang-lestrrat-go
package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"github.com/zenzoom/utils-log"
)


// /////////////////////
func HandleRequest(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {

	l := log.Start().Debugf("request:%+v", request)
	defer l.End()

	if request.RequestContext.HTTP.Method != "POST" {
		return events.APIGatewayV2HTTPResponse{StatusCode: 405, Headers: map[string]string{"Content-Type": "application/json; charset=UTF-8"}, Body: string("Method Not Allowed")}, nil
	}

	return events.APIGatewayV2HTTPResponse{StatusCode: 200, Headers: map[string]string{"Content-Type": "application/json; charset=UTF-8"}, Body: string("success")},nil
}

// /////////////////////
func main() {

	lambda.Start(HandleRequest)
}


