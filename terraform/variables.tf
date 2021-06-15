#######################################
#Arquivos de configurações local
#######################################
locals {
  project_prefix          = "adinfo-files"
  project_name            = "project-name"
  code_bucket             = "${var.project_id}-adinfo-code-${var.company}"
  final_bucket_name       = "${var.project_id}-${local.project_prefix}-${var.company}"
}

#######################################
#Variaveis de configuração
#######################################
variable "company" {
  type        = string
  description = "O valor informado será usado em conjunto com o project_prefix para formar o nome do bucket"
}

variable "project_id" {
  type        = string
  description = "Id do projeto do GCP onde o modulo project-name será instalado"
}

variable "pre_config" {
  type        = string
  description = "Digite [1] para inserir uma configuracao previa para o Google Analytics ou [2] para uma configuracao previa para o Adobe Analytics"
}

# variable "service_account" {
#   type        = string
#   description = "Conta de servico do App Engine"
# }

variable "port" {
  type        = number
  description = "Porta onde a API irá rodar dentro do APP Engine"
  default     = 443
}

variable "project_version" {
  type        = string
  description = "Para escolher uma versão diferente da atual acesse https://github.com/DP6/penguin-adinfo/tags"
  default     = "local"
}

variable "region" {
  type        = string
  description = "Região do GCP onde os modulos do projeto serão criados https://cloud.google.com/compute/docs/regions-zones?hl=pt-br default us-central1"
  default     = "southamerica-east1"
}

variable "location" {
  type        = string
  description = "Localização do projeto GCP https://cloud.google.com/compute/docs/regions-zones?hl=pt-br default us"
  default     = "us"
}

# variable "service_account_email" {
#   type        = string
#   description = "Service account que será utilizadas pelo modulo project-name, as permissões necessárias são: Storage Object Admin, Cloud Functions Admin, BigQuery Admin e Service Account User"
# }