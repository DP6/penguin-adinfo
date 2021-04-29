# API - Rotas

## Dicionário de Parâmetros

| Parâmetro  | Header/Body | Tipo   | Descrição                                                                    |
| ---------- | ----------- | ------ | ---------------------------------------------------------------------------- |
| token      | Header      | String | Token de permissão do usuário                                                |
| agency     | Header      | String | Agência do usuário                                                           |
| company    | Header      | String | Empresa proprietária do adinfo                                               |
| permission | Header      | String | Nível de permissão do usuário, podendo ser: **user**, **admin** ou **owner** |
| data       | Body        | File   | Arquivo CSV                                                                  |
| file       | Header      | String | Nome do arquivo salvo no banco de arquivos (não informar a extensão)         |
| config     | Body        | String | String correspondente ao JSON de configuração                                |
| campaign   | Header      | String | Nome da campanha                                                             |

## Rotas

### (GET) /user

**Parâmetros**: token

**Descrição**: Recupera os dados do usuários(agência, nível de permissão e empresa) por meio do token informado.

### (GET) /template

**Parâmetros**: token

**Descrição**: Retorna um CSV com as colunas a serem preenchidas, baseando-se no campo **columns** (colunas) da configuração.

### (POST) /register

**Parâmetros**: token, agency, permission, company.

**Restrição**: Apenas tokens de usuários com nível de permissão **adm** ou **owner** podem acessar esta rota.

**Descrição**: Cria um novo usuário da API de acordo com os parâmetros de: **agency**, **company** e **permission** informados, e retorna um o tkoen de acesso do novo usuário. Caso o nível de permissão informado para o novo usuário seja **admin**, não é necessário informar o parâmetro **agency**.

### (POST) /csv

**Parâmetros**: token, data, campaign.

**Descrição**: Armazena o arquivo CSV passado no data no banco arquivos.

### (GET) /csv

**Parâmetros**: token, file, campaign.

**Descrição**: Recupera o arquivo CSV especificado no parâmetro **file**.

### (GET) /csv/list

**Parâmetros**: token, campaign.

**Descrição**: Retorna uma lista de todos os CSVs disponíveis no banco de arquivos, exibindo apenas os CSVs enviados pela agência do usuário solicitante.

### (POST) /config

**Parâmetros**: token, config.

**Descrição**: Cria uma nova versão da configuração, de acordo com o parâmetro **config** informado.

### (GET) /config

**Parâmetros**: token.

**Descrição**: Retorna o JSON referente a configuração atual.

### (POST) /build/:media

**Parâmetros**: token, data.

**Descrição**: Armazena o arquivo passado no parâmetro **data** no banco de arquivos e retorna um CSV com os campos de parametrização preenchidos, de acordo com a mídia informada na variável **:media**.
