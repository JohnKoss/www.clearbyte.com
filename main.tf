# provider "aws" {
#   region = "us-east-1"
# }

# ##############
# data "aws_caller_identity" "current" {}
# data "aws_region" "current" {}

# locals {
#   root_domain_name = "clearbyte.com"
#   www_domain_name  = "www.clearbyte.com"
#   api_version      = "v1"
#   account_id       = data.aws_caller_identity.current.account_id
#   region           = data.aws_region.current.id
# }

# // This needs to already exists.
# data "aws_s3_bucket" "clearbyte_com" {
#   bucket = local.www_domain_name
# }

# # Find a certificate that is issued
# data "aws_acm_certificate" "clearbyte_com" {
#   domain      = local.root_domain_name
#   statuses    = ["ISSUED"]
#   most_recent = true
# }

# // clearbyte.com bucket, bucket policy
# resource "aws_s3_bucket_policy" "clearbyte_com_origin_access_control" {

#   bucket = data.aws_s3_bucket.clearbyte_com.id
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid    = "AllowCloudFrontServicePrincipalReadOnly"
#         Effect = "Allow"
#         Principal = {
#           Service = "cloudfront.amazonaws.com"
#         },
#         Action   = "s3:GetObject",
#         Resource = "${data.aws_s3_bucket.clearbyte_com.arn}/*",
#         Condition = {
#           StringEquals = {
#             "AWS:SourceArn" : "${aws_cloudfront_distribution.clearbyte_com.arn}"
#           }
#         }
#       }
#     ]
#   })
# }

# resource "aws_s3_bucket_cors_configuration" "clearbyte_cors" {
#   bucket = data.aws_s3_bucket.clearbyte_com.id

#   cors_rule {
#     allowed_methods = ["GET", "HEAD", "POST"]
#     allowed_origins = ["*"] # ✅ Allow all origins (or restrict to specific domains)
#     allowed_headers = ["*"] # ✅ Allow all headers
#     expose_headers  = []
#     max_age_seconds = 2
#   }
# }


# //////////////////////
# // Will be fronted by "Cloudfront"
# resource "aws_apigatewayv2_api" "api_clearbyte_com" {
#   name          = local.www_domain_name
#   description   = "Routes for ${local.www_domain_name}"
#   protocol_type = "HTTP"
#   cors_configuration {
#     allow_headers = ["*"]
#     allow_methods = ["GET", "POST", "OPTIONS"]
#     allow_origins = ["*"]
#     //max_age       = 86400 // 24 hours
#     max_age = 2 // Debug
#   }
# }

# // The "api_version" stage.
# resource "aws_apigatewayv2_stage" "develop" {
#   api_id = aws_apigatewayv2_api.api_clearbyte_com.id

#   name        = local.api_version
#   auto_deploy = true

#   access_log_settings {
#     destination_arn = aws_cloudwatch_log_group.api_gw.arn

#     format = jsonencode({
#       requestId               = "$context.requestId"
#       sourceIp                = "$context.identity.sourceIp"
#       requestTime             = "$context.requestTime"
#       protocol                = "$context.protocol"
#       httpMethod              = "$context.httpMethod"
#       resourcePath            = "$context.resourcePath"
#       routeKey                = "$context.routeKey"
#       status                  = "$context.status"
#       responseLength          = "$context.responseLength"
#       integrationErrorMessage = "$context.integrationErrorMessage"
#       }
#     )
#   }
# }

# // A log group for the API.
# resource "aws_cloudwatch_log_group" "api_gw" {
#   name              = "/aws/api_gw/${aws_apigatewayv2_api.api_clearbyte_com.name}"
#   retention_in_days = 1
# }


# ///////////////////////
# resource "aws_cloudfront_origin_access_control" "clearbyte_com" {
#   name                              = "Clearbyte_com"
#   description                       = "Clearbyte.com bucket"
#   origin_access_control_origin_type = "s3"
#   signing_behavior                  = "always"
#   signing_protocol                  = "sigv4"
# }



# resource "aws_cloudfront_function" "redirect" {
#   name    = "cf-redirect"
#   runtime = "cloudfront-js-2.0"
#   comment = "URL to redirect to WWW"
#   code    = file("${path.module}/lambdas/cloudfront/redirect.js")
#   publish = true # Publishes a specific version for use in a distribution
# }

# ################## The Cloudfront Dist. ##################
# resource "aws_cloudfront_distribution" "clearbyte_com" {

#   price_class         = "PriceClass_100"
#   enabled             = true
#   is_ipv6_enabled     = true
#   comment             = local.www_domain_name
#   default_root_object = "index.html" # Ensures https://www.clearbyte.com loads index.html
#   // Alternate domain names.
#   aliases = [
#     "clearbyte.com",
#     "www.clearbyte.com",
#     "*.zenzoom.com",
#     "*.mightysystems.com",
#     "zenzoom.com",
#     "mightysystems.com"
#   ] # CNAMEs added

#   restrictions {
#     geo_restriction {
#       restriction_type = "whitelist"
#       locations        = ["US", "CA"]
#     }
#   }

#   // TLS certificate...
#   viewer_certificate {
#     acm_certificate_arn      = data.aws_acm_certificate.clearbyte_com.arn
#     ssl_support_method       = "sni-only"
#     minimum_protocol_version = "TLSv1.2_2021"
#   }

#   // Logging stuff...
#   logging_config {
#     bucket          = "clearbytelogs.s3.amazonaws.com"
#     prefix          = "www"
#     include_cookies = false
#   }

#   // Not sure if this works.
#   # custom_error_response {
#   #   error_code            = 403
#   #   response_code         = 200
#   #   response_page_path    = "/index.html" # ✅ Redirects unknown routes to index.html
#   #   error_caching_min_ttl = 10
#   # }

#   ////////////// Origins /////////////////
#   /// Apigateway origin ...
#   origin {
#     domain_name = replace(aws_apigatewayv2_stage.develop.invoke_url, "/^https?://([^/]*).*/", "$1")
#     origin_id   = "apigateway"
#     origin_path = "/${local.api_version}"

#     custom_origin_config {
#       http_port              = 80
#       https_port             = 443
#       origin_protocol_policy = "https-only"
#       origin_ssl_protocols   = ["TLSv1.2"]
#     }
#   }

#   origin {
#     domain_name              = data.aws_s3_bucket.clearbyte_com.bucket_domain_name
#     origin_id                = "clearbyte_com"
#     origin_access_control_id = aws_cloudfront_origin_access_control.clearbyte_com.id
#   }

#   ////////////// Cache Behaviors /////////////////
#   // default
#   default_cache_behavior {
#     target_origin_id = "clearbyte_com"
#     allowed_methods  = ["GET", "HEAD", "OPTIONS"]
#     cached_methods   = ["GET", "HEAD"]
#     compress         = true
#     //viewer_protocol_policy = "allow-all"
#     viewer_protocol_policy = "redirect-to-https"
#     // For developing....
#     // cache_policy_id       = "658327ea-f89d-4fab-a63d-7e88639e58f6" // Managed-CachingOptimized
#     cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" // Managed-CachingDisabled

#     // CORS stuff...
#     origin_request_policy_id   = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" //Managed-CORS-S3Origin
#     response_headers_policy_id = "60669652-455b-4ae9-85a4-c4c02393f86c" // Managed-SimpleCORS

#     // Cloudfront function
#     function_association {
#       event_type   = "viewer-request"
#       function_arn = aws_cloudfront_function.redirect.arn
#     }
#   }

#   // Cache behavior with precedence 0
#   ordered_cache_behavior {
#     target_origin_id       = "apigateway"
#     path_pattern           = "/api/*" # ✅ Matches only API calls
#     allowed_methods        = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
#     cached_methods         = ["GET", "HEAD"]
#     viewer_protocol_policy = "redirect-to-https"
#     compress               = true

#     cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" // Managed-CachingDisabled - Recommended for APIGateway (that's what it says)
#     origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" // Managed-AllViewerExceptHostHeader - Recommended for APIGateway (that's what it says)  

#   }
# }

# #########################################################
# // Route53 stuff.
# data "aws_route53_zone" "this" {
#   name         = "${local.root_domain_name}."
#   private_zone = false
# }

# resource "aws_route53_record" "clearbyte_root_a" {
#   name    = local.root_domain_name
#   zone_id = data.aws_route53_zone.this.id
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "clearbyte_root_aaaa" {
#   name    = local.root_domain_name
#   zone_id = data.aws_route53_zone.this.id
#   type    = "AAAA"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "clearbyte_www_a" {
#   name    = local.www_domain_name
#   zone_id = data.aws_route53_zone.this.id
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "clearbyte_www_aaaa" {
#   name    = local.www_domain_name
#   zone_id = data.aws_route53_zone.this.id
#   type    = "AAAA"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# ######### Alternate domain names ################

# data "aws_route53_zone" "clearbyte" {
#   name         = "${local.root_domain_name}."
#   private_zone = false
# }

# data "aws_route53_zone" "zenzoom" {
#   name         = "zenzoom.com."
#   private_zone = false
# }

# data "aws_route53_zone" "mightysystems" {
#   name         = "mightysystems.com."
#   private_zone = false
# }

# ######

# resource "aws_route53_record" "zenzoom_root" {
#   zone_id = data.aws_route53_zone.zenzoom.zone_id
#   name    = "zenzoom.com"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "zenzoom_wildcard" {
#   zone_id = data.aws_route53_zone.zenzoom.zone_id
#   name    = "*.zenzoom.com"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "mightysystems_root" {
#   zone_id = data.aws_route53_zone.mightysystems.zone_id
#   name    = "mightysystems.com"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "mightysystems_wildcard" {
#   zone_id = data.aws_route53_zone.mightysystems.zone_id
#   name    = "*.mightysystems.com"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.clearbyte_com.domain_name
#     zone_id                = aws_cloudfront_distribution.clearbyte_com.hosted_zone_id
#     evaluate_target_health = false
#   }
# }


# ####### This was added because I deleted the CNAME record. Oops
# resource "aws_route53_record" "clearbyte_validation" {
#   zone_id = data.aws_route53_zone.clearbyte.zone_id
#   name    = "_2ba5e82807fe37ab6e8cd23a3308e998.clearbyte.com"
#   type    = "CNAME"
#   ttl     = 300
#   records = ["_cbc1ae51400c7d624e40039e10f32f74.mzlfeqexyx.acm-validations.aws."]
# }

# ####### API Gateway Lambda Functions ########
# module "contact" {
#   source = "github.com/johnkoss/terraform_apigw_lambda"

#   lambda = {
#     name             = "clearbyte_contact"
#     path             = "${path.module}/lambdas/contact"
#     description      = "Used to store contact information"
#     managed_policies = []
#     env_vars = {
#       DEBUG = "yes"
#     }
#   }

#   apigateway = {
#     id  = aws_apigatewayv2_api.api_clearbyte_com.id
#     arn = aws_apigatewayv2_api.api_clearbyte_com.execution_arn
#     routes = [
#       {
#         method = "POST"
#         path   = "/api/contact"
#       }
#     ]
#   }
# }

# module "sms_opt_in" {
#   source = "github.com/johnkoss/terraform_apigw_lambda"

#   lambda = {
#     name             = "clearbyte_sms_opt_in"
#     path             = "${path.module}/lambdas/sms_opt_in"
#     description      = "Used to store SMS opt-in data"
#     managed_policies = []
#     env_vars = {
#       DEBUG = "yes"
#     }
#   }

#   apigateway = {
#     id  = aws_apigatewayv2_api.api_clearbyte_com.id
#     arn = aws_apigatewayv2_api.api_clearbyte_com.execution_arn
#     routes = [
#       {
#         method = "POST"
#         path   = "/api/sms-opt-in"
#       }
#     ]
#   }
# }

# ############################################
# output "api_clearbyte_com_id" {
#   value = aws_apigatewayv2_api.api_clearbyte_com.id
# }

