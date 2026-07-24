# Dossiê Técnico — SANEPAR · PE 1050/2026

**Projeto:** Solução integrada de análise de dados de telemetria em nuvem  
**Data da consolidação:** 22/07/2026  
**Fonte:** artefatos Microsoft 365 (emails, reuniões, chats, transcrições e documentos)  
**Fatos estruturados:** [`pe-1050-2026-telemetria.yaml`](pe-1050-2026-telemetria.yaml)

---

## 1. Visão geral

A SANEPAR contratou a Engineering para implantação de uma **solução integrada de análise de dados de telemetria em nuvem**, envolvendo:

- Coleta de dados industriais e operacionais (OT)
- Integração de sistemas OT
- Exposição e governança de APIs
- Plataforma analítica em nuvem
- Conectividade segura SANEPAR ⇄ cloud
- Plataforma **DHuO**
- Hospedagem em **GCP** (`southamerica-east1`)

## 2. Contrato

| Campo | Valor |
|-------|-------|
| Processo | Pregão Eletrônico **PE 1050/2026** |
| Objeto | Solução integrada para análise de dados de telemetria em nuvem |
| Proposta técnica | Formalizada em maio/2026 (Engineering) |

## 3. Escopo técnico

### Camada OT

Fontes: SCADA, telemetria, medidores de energia, sensores de campo, TimescaleDB.

| Item | Quantidade |
|------|------------|
| Equipamentos | ~1.352 |
| Medidores de energia | 353 |
| Equipamentos de telemetria | 994 |
| Sensores estimados | ~4.682 |
| Registros históricos | ~30 milhões |
| Base histórica | ~1.5 GB |

**Projeção:** 5.000 equipamentos · ~20.000 sensores.

### Camada de APIs

- ~**150 APIs** (novas e legadas)
- Governança centralizada no **DHuO**
- Regra do cliente: *todas as APIs passam pelo DHuO*, qualquer método HTTP
- Objetivos: consumo, throughput, segurança, monitoramento, rate limiting, gestão de consumidores

### Camada analítica — ML e dashboards

No escopo do projeto:

- **Modelos de Machine Learning** sobre séries de telemetria (anomalias, tendências, indicadores operacionais), consumindo Historian / measures e fontes OT.
- **Dashboards analíticos** para visualização operacional/gerencial, alimentados por APIs DHuO, camada analítica (`measures_analytical`) e saídas dos modelos.

Consumo: dashboards · integrações via API · resultados de ML.

## 4. Arquitetura

**Modelo:** SaaS Dedicado (GCP isolado, PROD/NON-PROD, serviços DHuO).

**Produtos:** API Gateway · API Manager · Developer Portal · iPaaS · Data Integration.

**Ambientes:** Produção + Não produção (Dev/HML com **segregação lógica**, permitida no edital).

Documentos de referência: `sanepar-conectividade-v1.pdf`, `ENG_Alinhamento_Inicial_SANEPAR_PTBR.pptx`, `PT_Sanepar_PE1050_Engineering_v7 1.docx`.

## 5. Conectividade

Requisito: **VPN** SANEPAR ⇄ Engineering/DHuO/GCP.

| Alternativa | Perfil |
|-------------|--------|
| HA VPN | Rápida, menor custo |
| PSC (Private Service Connect) | Aderente (LZ GCP existente), baixa complexidade |
| Cloud Interconnect | Alta capacidade, maior complexidade/custo |

IPs iniciais (jul/2026): PROD `10.120.100.23` · HML `10.100.1.212`.

## 6. Historian REST API

Documento: `SANEPAR-HISTORIAN-REST-API.docx.pdf`.

Fluxo: cadastro de dispositivo → tag → envio de medições. Auth: `user-key` (header).

Endpoints principais: `/device`, `/device_tag`, `/supplier/{nodeid}`, `/measures`, `/measures_history`, `/measures_analytical`.

Nomenclatura de tags: `CODMUNICIPIO_SIGLA_CODSANEPAR` (ex. `0023_CR_3001`).

## 7. Premissas e riscos

**Premissas:** projeto estratégico; margem reduzida; reaproveitamento; go-live rápido; certificações pós-assinatura; rastreabilidade documental.

**Riscos (interpretação a partir das evidências):** conectividade indefinida; inventário incompleto de APIs; dependência de interlocutor técnico; escala futura de telemetria (1.352 → 5.000).

## 8. Situação atual

Fase de definição de atividades finais, detalhamento de APIs, integração Historian, governança DHuO e arquitetura de conectividade.

## 9. Conclusão executiva

Espinha dorsal: telemetria/SCADA → ingestão GCP → ~150 APIs governadas no DHuO → conectividade segura → **ML + dashboards** → padronização Historian REST API.

## 10. Rastreabilidade Forge

Capacidades: D1 (água), D2 (esgoto), D5 (ativos), D10 (TI), D11 (inovação).  
Ofertas: **Data Journey** + **API Journey** + **AI Journey** (DHuO / ML / analytics).
