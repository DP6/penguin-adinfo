## Repositório do Adinfo DP6

### Configuração do ambiente de desenvolvimento

1. Arquivo .env

O arquivo .env deve estar localizado na raiz do projeto.
É necessário editar as seguintes variáveis

- DEVELOPMENT: Deve apresentar o valor true, caso o ambiente atual seja o ambiente de desenvolvimento local. Caso nenhum valor seja informado, a API irá assumir como padrão o valor false, indicando o ambiente de produção;

- PORT: Deve conter o número da porta onde a API será acessada. Em caso de omissão desse parâmetro, a porta considerada será 443.

2. Chave de acesso - GCP

A chave de acesso aos serviços do gcp também deve estar localizada na pasta raiz do projeto, assim como o .env. O arquivo json da chave de acesso deve ser nomeado como gcp_key.json.

3. checar se o arquivo gitignore está ignorando o versionamento da chave e do arquivo .env.
