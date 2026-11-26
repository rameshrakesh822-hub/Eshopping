variable "aws_region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "t2.small"
}

variable "key_name" {
  description = "Existing EC2 Key Pair name"
  type        = string
}

variable "security_group_id" {
  description = "Existing Security Group ID"
  type        = string
}