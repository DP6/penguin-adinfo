######################################################
#Configurações Cloud Storage
######################################################
resource "google_storage_bucket" "adinfo_bucket_files" {
  name          = local.final_bucket_name
  location      = var.location
  labels = {
    produto = local.project_name
  }
}

resource "google_storage_bucket" "adinfo_bucket_code" {
  name          = local.code_bucket
  location      = var.location
  labels = {
    produto = local.project_name
  }
}

# ######################################################
# #Shell Script
# ######################################################
resource "null_resource" "copy_files_to_zip" {
  provisioner "local-exec" {
    command = "bash scripts/copy-files-to-zip.sh"
  }
}

data "archive_file" "zip_code" {
  type        = "zip"
  source_dir = "files-copy-to-gcs"
  output_path = "files-copy-to-gcs/zip/adinfo-code-${var.project_version}.zip"
  depends_on = [null_resource.copy_files_to_zip]
}

resource "google_storage_bucket_object" "adinfo_code" {
  name   = "adinfo-code-${var.project_version}.zip"
  source = "./files-copy-to-gcs/zip/adinfo-code-${var.project_version}.zip"
  bucket = local.code_bucket
  depends_on = [data.archive_file.zip_code, google_storage_bucket.adinfo_bucket_files, google_storage_bucket.adinfo_bucket_code]
}

resource "null_resource" "remove_support_files" {
  provisioner "local-exec" {
    command = "bash scripts/remove-support-files.sh"
  }
  depends_on = [google_storage_bucket_object.adinfo_code]
}

######################################################
#Configurações App Engine
######################################################
resource "google_app_engine_standard_app_version" "adinfo" {
  version_id = "v1"
  service    = "adinfo-api"
  runtime    = "nodejs12"
  entrypoint {
    shell = "npm start"
  }
  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${local.code_bucket}/adinfo-code-${var.project_version}.zip"
    }
  }
  env_variables = {
    port = var.port
  }
  delete_service_on_destroy = true
  depends_on = [google_storage_bucket_object.adinfo_code]
}


######################################################
#Configurações Firestore
######################################################
resource "google_firestore_document" "companies_collection" {
  project     = var.project_id
  collection  = "companies"
  document_id = var.company
  fields      = "{}"
}

resource "google_firestore_document" "company_config" {
  project     = var.project_id
  collection  = "${google_firestore_document.companies_collection.path}/config"
  document_id = "config_1"
  fields      = var.pre_config == "2" ? file("config_schemas/adobe.json") : file("config_schemas/ga.json")
  depends_on  = [google_firestore_document.companies_collection]
}

resource "google_firestore_document" "blocklist_collection" {
  project     = var.project_id
  collection  = "blocklist"
  document_id = "blocklist - instance"
  fields      = "{}"
}

resource "google_firestore_document" "adOpsTeams_collection" {
  project     = var.project_id
  collection  = "adOpsTeams"
  document_id = "adOpsTeams - instance"
  fields      = "{}"
}

resource "google_firestore_document" "campaigns_collection" {
  project     = var.project_id
  collection  = "campaigns"
  document_id = "campaigns - instance"
  fields      = "{}"
}

resource "google_firestore_document" "tokens_collection" {
  project     = var.project_id
  collection  = "tokens"
  document_id = "owner instance"
  fields      = "{\"active\": {\"booleanValue\": true}, \"company\": {\"stringValue\": \"${var.company}\"},\"email\": {\"stringValue\": \"${var.email}\"},\"password\": {\"stringValue\": \"${var.password}\"},\"permission\": {\"stringValue\": \"owner\"}}"
}