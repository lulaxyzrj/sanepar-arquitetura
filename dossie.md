Encontrei 432 resultados em arquivos, diversos chats ativos do projeto, e 99 reuniões relacionadas à SANEPAR. Abaixo está uma versão consolidada do dossiê técnico baseada exclusivamente nas informações que encontrei nos chats, reuniões e documentos.

DOSSIÊ TÉCNICO CONSOLIDADO – PROJETO SANEPAR DADOS & IA
1. Objetivo do Projeto

O projeto contratado pela SANEPAR tem como objetivo implantar uma plataforma integrada de dados, APIs, analytics e IA sobre ambiente GCP, utilizando o DHuO como plataforma corporativa de gestão de APIs. A solução contempla:

Governança e gerenciamento das APIs da SANEPAR
Ingestão de dados operacionais e industriais
Plataforma analítica em nuvem
Dashboards operacionais
Modelos preditivos de Machine Learning
Governança e catálogo de dados
MLOps
Operação assistida e transferência de conhecimento

A proposta técnica foi estruturada para atender ao Pregão Eletrônico PE 1050/2026.

2. Arquitetura Funcional Confirmada

Dos alinhamentos realizados com a SANEPAR foi confirmado que:

O DHuO será a plataforma corporativa oficial de gestão de APIs.
Todas as APIs da SANEPAR deverão passar pelo gateway.
Nem todas serão utilizadas para analytics.
Apenas APIs GET alimentarão dashboards e modelos preditivos.
APIs POST, PUT e demais operações serão publicadas principalmente para monitoramento e governança.

Essa definição foi formalizada em reunião técnica com a SANEPAR.

3. Estratégia de Duas Esteiras

A própria SANEPAR confirmou uma abordagem dividida em duas frentes.

Esteira Analítica

Consome aproximadamente 21 APIs de telemetria.

Responsável por:

Dashboards
IA
Lakehouse
Modelagem de dados
Streaming
Esteira de Proxies

Utiliza as demais APIs.

Objetivo:

Cadastro no DHuO
Controle de acesso
Monitoramento
Auditoria
Gestão de tráfego

Sem desenvolvimento analítico associado.

4. Arquitetura Técnica Identificada
Camada Origem

Dados provenientes de:

Medidores
Sensores
Bombas
Estações
CLPs
RTUs
Sistemas operacionais expostos via APIs

Foi explicitamente definido que não haverá integração direta com equipamentos OT/SCADA no nível de controle. O consumo ocorrerá apenas através de APIs previamente disponibilizadas pela SANEPAR.

Camada Integração

DHuO

Responsável por:

API Gateway
Segurança
Proxy APIs
Monitoramento
Controle de acesso
Autenticação

Foi confirmado internamente que:

DHuO será SaaS
Infraestrutura será conduzida pela equipe Cloud liderada por Heinrich Arlin Rossow Filho.
Camada Streaming

Discussões de engenharia apontam para:

Consumo das APIs GET
Publicação em tópicos de mensageria
Processamento assíncrono

Durante as atividades de definição técnica foi registrada a necessidade de validar o Pub/Sub como mecanismo padrão de ingestão.

Isto coincide com a arquitetura que você já vinha propondo:

APIs GET
    ↓
DHuO
    ↓
Pub/Sub
    ↓
Consumidores
    ↓
Lakehouse
    ↓
Dashboards e IA


Essa parte ainda aparece como definição técnica em andamento.

5. Estrutura de Dados
Dados Históricos

Volumetria identificada:

aproximadamente 30 milhões de medições históricas

Estimativa:

1,5 GB carga inicial
Crescimento Operacional

Base inicial prevista:

1352 equipamentos

Estimativa expansão:

aproximadamente 5000 equipamentos

Volume acumulado estimado:

aproximadamente 2 TB após horizonte completo projetado

Informação utilizada para sizing da plataforma.

6. Componentes Planejados
Governança

Equipe:

Pablo Teixeira
José Jorge

Atividades:

Catálogo
Data Owners
Linhagem
Qualidade de dados
Inventário de ativos
Classificação
Streaming

Equipe:

Diego
Davi

Atividades:

Producers
Consumers
Topologias
Reprocessamento
Observabilidade
Performance
MLOps

Equipe:

Evair

Atividades:

CI/CD modelos
Deploy automatizado
Versionamento
Monitoramento de drift
Retreinamento
Modelos Preditivos

Equipe:

Evair

Atividades:

Feature engineering
Treinamento
Validação
Monitoramento
7. Dashboards

O projeto contempla:

5 dashboards

Foi confirmado em reuniões recentes que os dashboards serão operacionais e apresentados ao centro de controle da SANEPAR.

8. Infraestrutura
GCP

Foi confirmado:

Landing Zone existente na SANEPAR
Projeto em GCP
VPN Site-to-Site
Rede segregada

Pendências até o momento:

Finalização VPN
Peer
VPC
Subnets
DevOps

Escopo identificado:

Kubernetes
Pipelines
Git
Cloud Build / Artifact Registry
IaC
Observabilidade
ELK
9. Segurança

Itens explicitamente encontrados:

VPN Site-to-Site
OAuth2
OpenID Connect
SAML
SSO SANEPAR

O edital proíbe utilização de Password Grant.

A autenticação ocorrerá via IDP da SANEPAR.

10. Historian API

Localizei o documento:

SANEPAR-HISTORIAN-REST-API.docx.pdf.

Nos chats recentes a equipe estava tratando essa API como uma das fontes principais de telemetria para consumo analítico. Também foi reforçado que para os dashboards somente APIs GET serão utilizadas.

11. Riscos Técnicos Identificados

Extraídos dos chats e reuniões.

Dependências do Cliente
Disponibilização das APIs GET
Contratos técnicos das APIs
Definição da VPN
Dependências de Infra
Finalização da conectividade
Sizing definitivo do DHuO
Licenciamento Looker
Dependências Funcionais

Ainda não definidos:

KPIs dos 5 dashboards
Critérios finais dos modelos preditivos
Periodicidade dos dados
12. Conclusão Arquitetural

Com base em tudo que foi encontrado até agora, a arquitetura que emerge do material é:

APIs GET SANEPAR
        │
        ▼
      DHuO
(API Gateway SaaS)
        │
        ▼
      Pub/Sub
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
Lake   ML    Catálogo
house         Dados
 │
 ▼
Dashboards


Fatos encontrados nas fontes

DHuO é o gateway corporativo.
Somente APIs GET alimentam analytics.
Há aproximadamente 21 APIs analíticas identificadas até agora.
O projeto prevê 5 dashboards e 2 modelos de ML.
A plataforma será baseada em GCP.
Há stream de dados e migração histórica contemplados.

Inferência técnica (não confirmada nas fontes):

A arquitetura mais coerente com o backlog definido hoje seria usar Pub/Sub como backbone de ingestão, Dataflow para processamento e armazenamento em um Lakehouse temporal para suportar dashboards operacionais e modelos preditivos. Isso aparece alinhado às discussões encontradas, mas a decisão final ainda não foi formalmente registrada nas fontes pesquisadas.