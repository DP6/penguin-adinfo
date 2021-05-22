echo "Criando dotenv de produção" 
cd .. 
if test -f ".env"; then 
    echo "Salvando o .env atual como backup" 
    mv .env .env_bkp 
fi 
touch .env 

echo "Setando .env para o ambiente de produção" 
echo "ENV=prod" >> .env 

echo "Adicionando o bucket $1 no o .env" 
echo "BUCKET=$1" >> .env 

echo "Adicionando a porta $2 no o .env" 
echo "PORT=$2" >> .env 

cd terraform 