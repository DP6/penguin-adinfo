
# Penguin Adinfo

<div align="center">
	<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/centro_de_inovacao_dp6.png" height="100px" />
</div>
<div align="center">
    <img src="https://img.shields.io/codacy/grade/6276f660577e41e0a7b7e4605c4f0434">
    <img src="https://img.shields.io/codacy/coverage/6276f660577e41e0a7b7e4605c4f0434">
    <img src="https://img.shields.io/github/issues/DP6/penguin-adinfo">
	<img src="https://img.shields.io/github/license/DP6/penguin-adinfo">
</div>

O Penguin Adinfo é um recurso que tem como objetivo o **controle** e **padronização** do uso de parametrização e nomenclatura de mídia digital.

A solução proposta é uma **API** open source que através de rotas de requisição trabalha _inputs_ de URLs a parametrizar e seus respectivos campos para devolver a parametrização já com uma **validação** dos campos preenchidos e de status de requisição dos links.

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
- **compile**: Compila o código do typescript para javascript, guardando-o na pasta dist/;
- **auto-compile**: Realiza a compilação dos arquivos typescript em tempo real, armazenando o resultado dentro da pasta dist/, sem excluir o conteúdo anterior;
- **prettier**: Formata todo o código das pastas src/ e test/, utilizando o [Prettier](https://prettier.io/), de acordo com a configuração descrita no arquivo .prettierrc;
- **coverage**: Análise da cobertura dos testes;
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

### Instalação GCP via Terraform

#### Pré-requisitos

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install?hl=pt-br);
2. Pacote zip;
3. [Terraform](https://www.terraform.io/);
4. Habilitar o App Engine em ambiente de execução Node.js, Firestore e Cloud Storage (necessário ter um billing ativo), no GCP.

#### Passos

1. Execute o script **terraform_deploy.sh**;

2. Informe o nome da empresa, ferramenta analítica utilizada para a criação de um exemplo de configuração (Adobe Analytics ou Google Analytics) e o id do projeto. Também é possível informar o número da porta onde o adinfo irá rodar, entretanto esse último valor é opcional, caso nenhuma porta seja específica, por padrão ele executará na porta 443;

3. Crie uma coleção no Firestore com o nome de **tokens** e insira um primeiro token com os seguintes campos (deixe o id do documento vazio para que seja gerado automaticamente):

```
{
	company: "NOME_EMPRESA" (string),
    agency: "agencia do usuário" (string,
	permission: "owner" (string)
	email: "email_do_usuario" (string)
	password: "senha_criptografada" (string),
    activate: true (boolean)
}
```

### Instalação manual - GCP

Durante toda a etapa de desenvolvimento do adinfo ele é hospedado no serviço de App Engine do GCP, além de armazenar informações no Firestore e Storage.

#### Configuração do Firestore e Storage

Por padrão, ao utilizar o adinfo dentro do App Engine, basta conceder acesso à conta de serviço para o Storage e Firestore para que todos os recursos funcionem corretamente. Caso o adinfo esteja hospedado fora do GCP ou em outro projeto, é necessário informar a chave de autenticação na inicialização das classes, dentro nos arquivos **FirestoreConnectionSingleton** e **StorageConnectionSingleton**.

##### Configuração inicial do Storage

Crie um bucket para armazenar os arquivos do adinfo, o bucket em questão deve ser informado no .env. Por padrão os arquivos serão salvos dentro do bucket informado e separados dentro de pastas para cada agência.

##### Configuração inicial do Firestore

Para a configuração inicial do Firestore, são necessárias quatro coleções.

- **companies**: essa coleção deve ser criada na raiz do firestore e deve conter um documento com o nome da empresa. Dentro desse documento, uma segunda coleção deve ser criada com o nome _config_. Seguindo a estrutura: companies > [nome_empresa] > config;

- **tokens**: essa coleção também deve ser criada na raiz do firestore com um documento seguindo a estrutura:

  ```
  {
  	company: "NOME_EMPRESA" (string),
      agency: "agencia do usuário" (string,
  	permission: "owner" (string),
  	email: "email_do_usuario" (string),
  	password: "senha_criptografada" (string),
      activate: true (boolean)
  }
  ```

  Para esse documento, é importante manter o Código do Documento gerado automaticamente pelo google, pois ele será utilizado como o ID do usuário em alguns processos.
  Para geração da senha criptografada, basta utilizar um gerador de senhas que use o _bcrypt_ como função de hash, como por exemplo, [este site](https://www.browserling.com/tools/bcrypt). Desta forma, insira o hash da senha no campo _password_ do documento, e use a senha escolhida na área de login da interface.
  O campo _agency_ diz respeito a agência a qual pertence o usuário que está sendo criado. Caso o nível de permissão desse usuário seja "owner" ou "admin", deixe este campo em branco.

- **campaigns**: Essa coleção deve ser criada na raiz do firestore , mas não há a necessidade de criar nenhum documento dentro dela. Os documentos serão gerados automaticamente conforme o uso do adinfo, armazenando as campanhas que serão criadas e seus atributos

- **blocklist**: Essa coleção deve ser criada na raiz do firestore , mas não há a necessidade de criar nenhum documento dentro dela. Os documentos serão gerados automaticamente conforme o uso do adinfo, adicionando os tokens dos usuários que derem logout na aplicação, pois este token, mesmo que ainda válido, não deve ser usado ainda para acessar a interface.

###### Padrão do Objeto de Configuração

Para utilizar a API, é necessário criar um documento de configuração no Firestore dentro da coleção: companies > [nome_empresa] > config. O nome do documento deve ser **config_1** e ele deve conter os campos: **version** inicialmente com o valor 1 (number), **insertTime** no formato *yyyyMMddHHmmss*, **csvSeparator**, **separator**, **spaceSeparator**, **columns** e um campo para a ferramenta de analytics, sendo esse o valor de **ga** ou **adobe**.

Todos estes campos serão utilizados para realizar a parametrização do arquivo CSV que a API irá receber.

Aqui a API disponibiliza a funcionalidade de definirmos no campo **csvSeparator** uma lista contendo a prioridade de todos os possíveis caracteres que poderão ser utilizados como separadores no arquivo CSV pelos usuários. Com isso, a aplicação irá consultar essa fonte e utilizar o devido separador para parametrizar o arquivo submetido.

Entretanto, este campo no arquivo de configuração não é obrigatório. Caso o campo não seja preenchido, a aplicação irá tentar verificar se o arquivo submetido está utilizando _vírgula_ ou _ponto e vírgula_ como separador e utilizar o separador identificado para a parametrização. Caso não encontre nenhum dos dois caracteres, a API irá utilizar a vírgula como separador.

Abaixo segue uma explicação e um exemplo de todos os campos das configurações.

| Chave                       | Tipo   | Descrição                                                                                                                                                                       | Obrigatório |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| csvSeparator                | Array  | Array que irá conter todos os separadores de colunas que os arquivos CSV poderão conter.                                                                                        | Não         |
| separator                   | String | String que será utilizada na concatenação dos campos.                                                                                                                           | Sim         |
| spaceSeparator              | String | String que substituirá o espaço na URL, caso alguma campo tenha preenchido com mais de uma palavra.                                                                             | Sim         |
| columns                     | Objeto | Objeto contendo as colunas do CSV e seus valores de aceitação.                                                                                                                  | Sim         |
| dependenciesConfig          | Objeto | Objeto contendo as regras de dependências de validação.                                                                                                                         | Não         |
| insertTime          | String | Data da criação do config no formato *yyyyMMddHHmmss*.                                                                                                                         | Sim         |
| version          | Number | Número da versão do config.                                                                                                                         | Sim         |
| {{veículo}}                 | Objeto | Chave do veículo de mídia com suas configurações e quais colunas pertencem a cada configuração.                                                                                 | Não         |
| {{ferramenta de analytics}} | Objeto | Chave da ferramenta de analytics com suas configurações e quais colunas pertencem a cada configuração. Essa chave precisa obrigatoriamente receber o valor **ga** ou **adobe**. | Sim         |

**Exemplo de configuração**:

```javascript
{
	"separator": ":",
	"spaceSeparator": "_",
	"csvSeparator": [",", ";", "|"],
	"columns": {
		//Colunas que aparecerão no CSV
		//A chave representa a coluna do CSV e o vetor de valores
		//representam os possíveis valores de preenchimento dos campos.
		//É possível informar valores ou expressões regulares para a validação.
		//As expressão regulares devem estar entre /,
		//assim como na chave "Produto"
		"Tipo de Compra": ["cpa", "cpc"],
		"Dispositivo": ["desktop e mobile"],
		"Produto": ["/.*/"]
	},
	"ga": {
		//Ferramenta de analytics, um outro valor possível seria "adobe"
		//As chaves são os parâmetros que a ferramenta aceita
		//Os valores passados no vetor são referentes às
		//colunas do CSV que o formam
		"utm_source": ["Tipo de Compra", "Dispositivo"],
		"utm_campaign": ["Produto"]
	},
	"googleads": {
		//Configuração do veículo de mídia
		//As chaves são os parâmetros do veículos.
		//Os valores passados no vetor são referentes às
		//colunas do CSV que o formam,
		//semelhante à ferramenta de analytics.
		"campanha": ["Tipo de Compra", "Dispositivo"],
		"ad": ["Produto"]
	},
	"dependenciesConfig": [
		//Campo de configurações de depêndencias
		{
			//De acordo com o exemplo, se a coluna "Dispositivo"
			//for preenchida com algum valor que contenha
			//a palavra "mobile", então a coluna "Tipo de Compra"
			//só poderá ser preenchida com os valores: cpc ou cpa.
			//Se a chave hasMatch estivesse com o valor "false"
			//significaria que a regra para a coluna "Tipo de Compra"
			//só seria aplicada, caso o valor preenchido na coluna "Dispositivo"
			//não contivesse a palavra "mobile".
			"columnReference": "Dispositivo",
			"valuesReference": ["/.*mobile.*/"],
			"hasMatch": true,
			"columnDestiny": "Tipo de Compra",
			"matches": ["cpc", "cpa"]
		}
	],
	"insertTime": "20211201193242",
	"version": 1,
}
```

### Banco de dados alternativos

Atualmente o adinfo não disponibiliza por padrão um código de acesso à banco de dados diferentes do Storage e Firestore. Para conexões com outros ambientes a criação dos scripts se faz necessária.

### Criação dos novos scripts

Caso o usuário opte por utilizar um banco de arquivos diferentes do Storage, é necessário que o script da nova classe herde de **FileStore**.

No caso de substituir o uso do Firestore para armazenamento de chaves. A nova classe deve herdar de **ObjectStore**.

## Configuração do ambiente de desenvolvimento

1. **Arquivo .env**: O arquivo .env deve estar localizado na raiz do projeto. É necessário editar as seguintes variáveis

- ENV: Deve apresentar o valor 'development', caso o ambiente atual seja o ambiente de desenvolvimento local, ou 'prod', caso o ambiente seja de produção;
- PORT: Deve conter o número da porta onde a API será acessada. Em caso de omissão desse parâmetro, a porta considerada será 443;
- BUCKET: Deve conter o nome do bucket do storage onde os arquivos CSVs serão salvos;
- GCP_PROJECT_ID: Deve conter o id do projeto no GCP, caso o adinfo esteja hospedado no GCP;
- GCP_KEY: Deve conter o JSON da chave de acesso aos serviços do GCP;
- JWT_KEY: Chave para geração de assinaturas do JWT;
- SALT: Configuração de salt do JWT;
- EXPIRES_TOKEN: Duração do token JWT.

2. **Arquivo .gitignore**: Checar se o arquivo .gitignore está ignorando do arquivo .env.

## Como contribuir

Pull requests são bem-vindos! Nós vamos adorar ajuda para evoluir esse modulo. Sinta-se livre para navegar por issues abertas buscando por algo que possa fazer. Caso tenha uma nova feature ou bug, por favor abra uma nova issue para ser acompanhada pelo nosso time.

### Requisitos obrigatórios

Só serão aceitas contribuições que estiverem seguindo os seguintes requisitos:

- [Padrão de commit](https://www.conventionalcommits.org/en/v1.0.0/)
- [Padrão de criação de branches](https://www.atlassian.com/br/git/tutorials/comparing-workflows/gitflow-workflow)

### Documentação de desenvolvimento

A [documentação do código](./docs/index.html) pode ser encontrada em docs/index.html.

A [documentação de rotas da API](./Routes.md) se encontra no arquivo Routes.md.

## Suporte:

**DP6 Koopa-troopa Team**

_e-mail: <koopas@dp6.com.br>_

<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/koopa.png" height="100px" width=50px/>