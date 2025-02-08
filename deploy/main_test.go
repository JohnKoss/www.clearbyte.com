// main_test.go
package main

import (
	"testing"
)

func TestLabCreate(t *testing.T) {
	if !Execute(PLAN_CREATE) {
		t.Fail()
	}
}
func TestLabDestroy(t *testing.T) {
	Execute(PLAN_DESTROY)
}

func TestWriteDescription(t *testing.T) {
	WriteKV("..\\.env","LAB_DESC", "This is a test")
}
// The old terraform file...
// locals {
// 	lab_id      = "LabId-x"
// 	bucket_name = "lti13.clearbyte.io"
  
// 	path_html_src  = "../src"
// 	path_html_dist = "../dist"
  
// 	path_hcl     = "../hcl"
// 	path_scoring = "../scoring"
// 	path_objects = "../objects"
//   }
  
//   ####################
  
//   // Add the lab to the database using Golang Tests. 
//   locals {
// 	sha1_dir = filesha1("./main.go")
// 	root_path = "labs/${local.lab_id}/html/"
//   }
  
//   resource "terraform_data" "lab_database_entry_apply" {
  
// 	triggers_replace = {
// 	  sha1_dir = local.sha1_dir
// 	}
  
// 	provisioner "local-exec" {
// 	  when    = create
// 	  command = "go build && go run . && del lab-aid.exe"
// 	  environment = {
// 		WHEN     = "create"
// 		IMG_PATH = "labs/${local.lab_id}/html/img/"
// 		BUBBA = terraform.workspace
// 	  }
// 	}
//   }
  
//   resource "terraform_data" "lab_database_entry_destroy" {
  
// 	triggers_replace = {
// 	  sha1_dir = local.sha1_dir
// 	}
  
// 	provisioner "local-exec" {
// 	  when    = destroy
// 	  command = "go build && go run . && del lab-aid.exe"
// 	  environment = {
// 		WHEN     = "destroy"
// 		IMG_PATH = "labs/${local.root_path}/html/img/"
// 	  }
// 	}
//   }
  
//   /////////////
//   locals {
// 	sha1 = sha1(join("", [for f in fileset("${path.root}/${local.path_html_src}", "**") : filesha1("${path.root}/${local.path_html_src}/${f}")]))
// 	sha2 = sha1(join("", [for f in fileset("${path.root}/${local.path_html_dist}", "**") : filesha1("${path.root}/${local.path_html_dist}/${f}")]))
//   }
  
//   resource "terraform_data" "website_create" {
// 	triggers_replace = [local.sha1, local.sha2]
  
// 	provisioner "local-exec" {
// 	  when        = create
// 	  command     = "npm run build && aws s3 sync ../dist s3://lti13.clearbyte.io/labs/${local.lab_id}/html/"
// 	  working_dir = path.root
// 	}
  
// 	input = "${local.sha1}${local.sha2}}"
//   }
  
//   resource "terraform_data" "website_destroy" {
// 	triggers_replace = [local.sha1, local.sha2]
  
// 	provisioner "local-exec" {
// 	  when        = destroy
// 	  command     = "aws s3 rm --recursive s3://lti13.clearbyte.io/labs/${local.sha1}/html"
// 	  working_dir = path.root
// 	}
  
// 	input = "${local.sha1}${local.sha2}}"
//   }
  
  
  
//   resource "aws_s3_object" "hcl" {
// 	for_each = fileset("${local.path_hcl}", "**")
  
// 	bucket = local.bucket_name
// 	key    = "labs/${local.lab_id}/hcl/${each.value}"
// 	source = "${local.path_hcl}/${each.value}"
//   }
  
//   resource "aws_s3_object" "scoring" {
// 	for_each = fileset("${local.path_scoring}", "**")
  
// 	bucket = local.bucket_name
// 	key    = "labs/${local.lab_id}/scoring/${each.value}"
// 	source = "${local.path_scoring}/${each.value}"
//   }
  
//   resource "aws_s3_object" "objects" {
// 	for_each = fileset("${local.path_objects}", "**")
  
// 	bucket = local.bucket_name
// 	key    = "labs/${local.lab_id}/objects/${each.value}"
// 	source = "${local.path_objects}/${each.value}"
//   }
  
  
//   # module "lab" {
//   #   source = "github.com/JohnKoss/terraform_web_s3"
  
//   #   name        = "labs/${local.lab_name}"
//   #   bucket_name = local.bucket_name
  
//   #   # The defaults for the other vars are correct.  
//   # }
  
//   # ##################
//   # resource "terraform_data" "html_sync" {
  
//   #   triggers_replace = {
//   #     level    = local.level
//   #     lab_name = local.lab_name
//   #   }
  
//   #   provisioner "local-exec" {
//   #     when    = create
//   #     command = "aws s3 sync ../dist s3://lti13.clearbyte.io/labs/LabId-x/html/"
//   #   }
//   # }
  