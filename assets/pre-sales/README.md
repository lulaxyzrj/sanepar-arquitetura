# Pre-sales / RFP — SANEPAR PE 1050/2026

Artefatos da proposta técnica e diagramas de arquitetura usados no pregão e no alinhamento inicial.

## Conteúdo

| Artefato | Tipo |
|----------|------|
| `PT_Sanepar_PE1050_Engineering_v7 1.docx` | Proposta técnica (05/05/2026) |
| `ENG_Alinhamento_Inicial_SANEPAR_PTBR.pdf` | Kickoff / mobilização (jul/2026) |
| `sanepar-conectividade-v1 2.pdf` | Conectividade |
| `Arquitetura_Sanepar_Dados_OT_v2 5.png` | Arquitetura integrada GCP |
| `Sanepar_ZoomIN_Ingestao_v2 2.png` | Zoom ingestão/streaming (TR 4.1.4) |
| `Sanepar_ZoomIN_ETL_v2 2.png` | Zoom ETL/ELT (TR 4.1.5) |

Catálogo machine-readable: [`manifest.yaml`](manifest.yaml)  
Stack de referência: [`architecture-stack.yaml`](architecture-stack.yaml)

## Ligação Forge

- DHuO = **API Manager** → offer `api-journey`
- Lakehouse / streaming / Dataplex → `data-journey`
- Vertex MLOps + Looker + GenAI controlada → `ai-journey`
- Dossiê de execução: `../dossiers/`

## Geração do site

Com `packs: [dossiers]`, o generator copia imagens de `pre-sales/` para `docs/assets/pre-sales/` e o dossiê HTML referencia os diagramas.
