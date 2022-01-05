# Definiçaõ do projeto GCP
provider "google" {
  project = var.project_id
  credentials = file("../gcp_key_terraform.json")
  region  = var.region
}