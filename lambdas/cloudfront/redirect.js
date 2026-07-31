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

    // SvelteKit's static adapter prerenders "/about" to "about.html", so an
    // extensionless request has to be rewritten or S3 returns 403.
    var uri = request.uri;

    if (uri === "/") {
        request.uri = "/index.html";
        return request;
    }

    // "/about/" and "/about" resolve to the same file.
    if (uri.endsWith("/")) {
        uri = uri.slice(0, -1);
    }

    var lastSegment = uri.slice(uri.lastIndexOf("/") + 1);
    if (lastSegment.indexOf(".") === -1) {
        uri = uri + ".html";
    }

    request.uri = uri;

    return request;
}
