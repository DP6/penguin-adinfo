#!/bin/bash 
cd terraform && \ 
terraform init && \ 
# terraform destroy -auto-approve && \ 
terraform apply -auto-approve 