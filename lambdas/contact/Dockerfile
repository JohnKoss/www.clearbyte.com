FROM golang AS builder

# Some of our dependencies are private, so we need to use SSH to clone them.
# Therefore, set git conifig so that SSH is the protocol instead of HTTP, 
# which will prompt for a username and password.
RUN mkdir -p -m 0600 /etc/ssh && ssh-keyscan github.com >> /etc/ssh/ssh_known_hosts
RUN git config --global --add url."git@github.com:".insteadOf "https://github.com/"

# Get and cache the app dependencies...
WORKDIR /app
COPY lambdas/contact/context ./
RUN --mount=type=ssh go mod download

# Build (speedily) - https://stackoverflow.com/questions/50520103/speeding-up-go-builds-with-go-1-10-build-cache-in-docker-containers
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \ 
    --mount=type=ssh GOOS=linux GOARCH=arm64 go build -tags lambda.norpc -o bootstrap .

###################################
# Copy artifacts to a clean image
FROM alpine

# Copy over the function...
COPY --from=builder /app/bootstrap /bootstrap

ENTRYPOINT [ "/bootstrap" ]
