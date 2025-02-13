// Example: https://github.com/aws-samples/amazon-cloudfront-functions/tree/main/url-rewrite-single-page-apps
function handler(event) {
    var request = event.request;
    var host = request.headers.host.value;
    
    if (host === "clearbyte.com") {
        var response = {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: {
                "location": { "value": "https://www.clearbyte.com" }
            }
        };
        return response;
    }
    
    return request;
}
