echo "Executando $1 para o bucket $2" 
cd .. 
echo "Criando Zip" 
zip -r ./terraform/files-copy-to-gcs/adinfo-code-$1.zip dist/ .env index.js package.json package-lock.json app.yaml cloudbuild.yaml

cd terraform 
echo "Iniciando copia para GCP" 
gsutil cp -r ./files-copy-to-gcs/adinfo-code-$1.zip "gs://$2" 

echo "excluindo zip" 
rm -rf ./files-copy-to-gcs/adinfo-code-$1.zip 

cd .. 
echo "Voltando o .env de desenvolvimento" 
rm .env 
mv .env_bkp .env 
echo "FIM script $0" 
