#!/bin/bash 
cd terraform && \ 
terraform init && \ 
# terraform state rm 'null_resource.code_zip'  &&  \ 
# terraform state rm 'null_resource.create_dotenv'  &&  \ 
# terraform state rm 'google_storage_bucket.adinfo_code'  &&  \ 
# terraform state rm 'google_storage_bucket.adinfo_bucket'  &&  \ 
# terraform state rm 'google_firestore_document.mydoc'  &&  \ 
# terraform state rm 'google_firestore_document.sub_document'  &&  \ 
# terraform state rm 'google_app_engine_standard_app_version.adinfo'  &&  \ 
terraform apply -auto-approve 