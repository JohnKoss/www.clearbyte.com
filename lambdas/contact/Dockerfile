ARG BUILDPLATFORM
ARG TARGETPLATFORM
ARG TARGETARCH

FROM --platform=$BUILDPLATFORM golang:1.26-alpine AS builder
ARG TARGETARCH

RUN apk add --no-cache git

RUN --mount=type=secret,id=github_token \
    echo "machine github.com login x-token password $(cat /run/secrets/github_token)" > /root/.netrc && \
    chmod 600 /root/.netrc

ENV GOPRIVATE=github.com/zenzoom/*
ENV GONOSUMCHECK=github.com/zenzoom/*

WORKDIR /app

# Passed by the terraform module as a hash of the context, so a source change
# rebuilds rather than reusing a cached layer.
ARG CACHE_BUST

COPY context ./

RUN go mod download

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=$TARGETARCH go build \
    -tags lambda.norpc \
    -trimpath \
    -ldflags="-s -w" \
    -o bootstrap .

###################################
FROM alpine:3.23

# The handler calls SES over HTTPS, so the image needs a trust store.
RUN apk add --no-cache ca-certificates

COPY --from=builder /app/bootstrap /bootstrap
ENTRYPOINT [ "/bootstrap" ]
