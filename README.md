# Penguin Adinfo

<div align="center">
<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/centro_de_inovacao_dp6.png" height="100px" />
</div>

O Penguin Adinfo é um recurso que tem como objetivo o **controle** e **padronização** do uso de parametrização e nomenclatura de mídia digital. 

A solução proposta é uma **API** open source que através de rotas de requisição trabalha *inputs* de URLs a parametrizar e seus respectivos campos para devolver a parametrização já com uma **validação** dos campos preenchidos e de status de requisição dos links.

Os principais componentes no uso da aplicação são a **configuração**, um JSON contendo quais campos são aceitos na taxonomia de mídia, o **permissionamento** para controle de ações permitidas por nível de acesso, e o **arquivo de parametrização**, um CSV contendo a lista de URLs e os campos preenchidos conforme o que foi configurado.

## Principais propostas de valor

- Independência de qualquer programa para a abertura das planilhas durante o processo de parametrização, o que comumente compromete a performance pelo uso extensivo de fórmulas.
- Possibilidade do uso da API em planilhas, externalizando o processamento para uma transformação puramente sobre os dados.Controle de permissões com 3 níveis, cada qual incluindo os seguintes: Controle de **acessos**, edição de **configurações**, realização da **parametrização**. 
- Os acessos podem ser divididos em grupos ou projetos, para que por exemplo diferentes agências possam todas ter seu nível de configuração, mas apenas para suas próprias campanhas.
- Escalabilidade de uso por suportar grandes tamanhos de arquivo e histórico.

## NPM Run

- **start**: executa a aplicação;
- **unit-test**: Realiza uma bateria de testes unitários dos arquivos de typescript presentes na pasta test/;
- **test**: Realiza uma bateria de testes unitários dos arquivos de typescript presentes na pasta test/;
- **lint**: Submete o código a uma avaliação do [ESLint](https://eslint.org/);
- **lint-fix**: Submete o código a uma avaliação do [ESLint](https://eslint.org/) e aplica correções automaticamente ao código;
- **compile**: Exclui os arquivos da pasta /src/js e compila o código do typescript para javascript, guardando-o na pasta src/js;
- **auto-compile**: Realiza a compilação dos arquivos typescript em tempo real, armazenando o resultado dentro da pasta src/js, sem excluir o conteúdo anterior;
- **prettier**: Formata todo o código das pastas src/ e test/, utilizando o [Prettier](https://prettier.io/), de acordo com a configuração descrita no arquivo .prettierrc;
- **build**: Executa o compile do código typescript para javascript.

## Requisitos para utilização

- Ambiente de hospedagem de aplicações, em nuvem ou on-premise;
- Banco de dados para armazenamento de arquivos no formato csv;
- Banco de dados NoSQL para armazenamento de objetos JSON.

### Produtos do GCP (sugestão)

O adinfo pode ser implementado em diferentes provedores de nuvem ou em ambientes on-premise. Listaremos aqui sugestões de serviços do GCP que podem ser utilizados para complementar a infraestrutura da API.

- App Engine
- Cloud Storage
- Firestore

## Instalação

Clone o projeto do github para sua máquina local ou Cloud Shell

```console
git clone https://github.com/DP6/penguin-adinfo.git
```

### Instalação GCP (sugerida)

Durante toda a etapa de desenvolvimento do adinfo ele é hospedado no serviço de App Engine do GCP, além de armazenar informações no Firestore e Storage.

#### Configuração do Firestore e Storage

Por padrão, ao utilizar o adinfo dentro do App Engine, basta conceder acesso à conta de serviço para o Storage e Firestore para que todos os recursos funcionem corretamente. Caso o adinfo esteja hospedado fora do GCP ou em outro projeto, é necessário informar a chave de autenticação na inicialização das classes, dentro nos arquivos **FirestoreConnectionSingleton** e **StorageConnectionSingleton**.

##### Configuração inicial do Storage

Crie um bucket para armazenar os arquivos do adinfo. O bucket em questão deve ser informado no atributo _bucket da classe **StorageConnectionSingleton**, por padrão os arquivos serão salvos dentro do bucket informado e separados dentro de pastas para cada agência.

##### Configuração inicial do Firestore

Para a configuração inicial do Firestore, são necessárias duas coleções.

- **companies**: essa coleção deve ser criada na raiz do firestore e deve conter um documento com o nome da empresa. Dentro desse documento, uma segunda coleção deve ser criada com o nome *config*. Seguindo a estrutura: companies > [nome_empresa] > config;

- **tokens**: essa coleção também deve ser criada na raiz do firestore com um documento seguindo a estrutura: 

  ```
  {
  	company: "arthurltda" (string)
  	permission: "owner"(string)
  }
  ```

  Para esse documento, é importante manter o Código do Documento gerado automaticamente pelo google. O código gerado para cada documento será o token de acesso utilizado na API.

### Banco de dados alternativos

Atualmente o adinfo não disponibiliza por padrão um código de acesso à banco de dados diferentes do Storage e Firestore. Para conexões com outros ambientes a criação dos scripts se faz necessária.

### Criação dos novos scripts

Caso o usuário opte por utilizar um banco de arquivos diferentes do Storage, é necessário que o script da nova classe herde de **FileStore**.

No caso de substituir o uso do Firestore para armazenamento de chaves. A nova classe deve herdar de **ObjectStore**.

## Configuração do ambiente de desenvolvimento

1. **Arquivo .env**: O arquivo .env deve estar localizado na raiz do projeto. É necessário editar as seguintes variáveis

- DEVELOPMENT: Deve apresentar o valor true, caso o ambiente atual seja o ambiente de desenvolvimento local. Caso nenhum valor seja informado, a API irá assumir como padrão o valor false, indicando o ambiente de produção;

- PORT: Deve conter o número da porta onde a API será acessada. Em caso de omissão desse parâmetro, a porta considerada será 443.

2. **Chave de acesso - GCP**: A chave de acesso aos serviços do gcp também deve estar localizada na pasta raiz do projeto, assim como o .env. O arquivo json da chave de acesso deve ser nomeado como gcp_key.json.

3. **Arquivo .gitignore**: Checar se o arquivo .gitignore está ignorando o versionamento da chave e do arquivo .env.

## Como contribuir

Pull requests são bem-vindos! Nós vamos adorar ajuda para evoluir esse modulo. Sinta-se livre para navegar por issues abertas buscando por algo que possa fazer. Caso tenha uma nova feature ou bug, por favor abra uma nova issue para ser acompanhada pelo nosso time.

### Requisitos obrigatórios

Só serão aceitas contribuições que estiverem seguindo os seguintes requisitos:

- [Padrão de commit](https://www.conventionalcommits.org/en/v1.0.0/)
- [Padrão de criação de branches](https://www.atlassian.com/br/git/tutorials/comparing-workflows/gitflow-workflow)

### Api Docs

- [Index.js](https://github.com/dp6/template-js-cloudfunction-with-terraform/blob/master/docs/index.md)

## Suporte:

**DP6 Koopa-troopa Team**

_e-mail: <koopas@dp6.com.br>_

<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/koopa.png" height="100px" width=50px/>