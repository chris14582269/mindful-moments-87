variable "aws_region" {
  description = "AWS Singapore region for PDPA-aware deployment."
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  type    = string
  default = "food-ai-singapore"
}

variable "container_image_frontend" {
  type = string
}

variable "container_image_backend" {
  type = string
}

variable "database_username" {
  type      = string
  default   = "food_ai"
  sensitive = true
}

variable "database_password" {
  type      = string
  sensitive = true
}
