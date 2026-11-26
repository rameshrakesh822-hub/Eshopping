#!/bin/bash
set -e

exec > >(tee -a /var/log/shopzone-setup.log) 2>&1

# Update Ubuntu
apt-get update -y

# Install basic packages and Java
apt-get install -y ca-certificates curl gnupg git unzip openjdk-21-jre

# Create 2GB Swap
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Docker installation
install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" \
  > /etc/apt/sources.list.d/docker.list

# Node.js 22 installation
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

# Jenkins installation
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key \
  -o /usr/share/keyrings/jenkins-keyring.asc

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
  > /etc/apt/sources.list.d/jenkins.list

# Install Docker, Node.js and Jenkins
apt-get update -y

apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin \
  nodejs \
  jenkins

# Give Jenkins and Ubuntu Docker access
usermod -aG docker jenkins
usermod -aG docker ubuntu

# Start services
systemctl enable docker
systemctl enable jenkins

systemctl restart docker
systemctl restart jenkins

echo "ShopZone server setup completed!"