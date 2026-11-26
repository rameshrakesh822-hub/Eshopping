variable "aws_region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "t2.small"
}

variable "key_name" {
  description = "chellama"
  type        = string
}

variable "security_group_id" {
  description = "sg-049323ce6c168dc4d"
  type        = string
}