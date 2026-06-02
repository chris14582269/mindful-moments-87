output "s3_bucket" {
  value = aws_s3_bucket.meal_images.bucket
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  value     = aws_db_instance.postgres.endpoint
  sensitive = true
}
