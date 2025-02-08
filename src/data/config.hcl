// This is the list of services needed for this lab activity.
resource "config" "services" {
  services {
    create = ["iam"]
    delete = [
      "iam",
      "s3",
      "cloudwatch",
    ]
    snapshot = ["s3"]
  }
}

resource "user" "Student1" {
  login      = true
  access_key = true
  git_ssh    = false

  managed_policies = [
    "arn:aws:iam::aws:policy/AmazonS3FullAccess",
    "arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess"
  ]
}