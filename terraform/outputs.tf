output "instance_id" {
  value = aws_instance.shopzone_server.id
}

output "public_ip" {
  value = aws_instance.shopzone_server.public_ip
}

output "jenkins_url" {
  value = "http://${aws_instance.shopzone_server.public_ip}:8080"
}

output "ssh_command" {
  value = "ssh -i YOUR_KEY.pem ubuntu@${aws_instance.shopzone_server.public_ip}"
}