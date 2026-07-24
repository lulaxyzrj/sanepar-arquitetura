# Google Cloud Architecture Icons

Official sources:

| Source | Role |
|--------|------|
| [cloud.google.com/icons](https://cloud.google.com/icons) | ZIP downloads (core / category / legacy) |
| [Google Cloud Official Icons and Solution Architectures](https://docs.google.com/presentation/d/1fD1AwQo4E9Un6012zyPEb7NvUAGlzF6L-vo5DbUe4NQ/edit) | Slides deck (copy icons into decks; same library lineage) |
| `product-icons-overview.pdf` | 2025 icon system guide |

## Layout

| Path | Contents |
|------|----------|
| `core-products-icons/` | 2025 unique core product SVGs (BigQuery, Cloud Storage, Vertex AI, Looker, …) |
| `category-icons/` | 2025 category icons (Data Analytics, Networking, …) |
| `legacy/` | Pre-2025 **unique** product SVGs (Pub/Sub, Dataflow, Composer, Dataproc, …) |
| `_flat/` | Short aliases used by the site (`pub-sub.svg`, `dataflow.svg`, …) |

### Why legacy for Pub/Sub / Dataflow?

In early 2025 Google reduced unique icons to ~40. Pub/Sub, Dataflow, Composer and Dataproc now share the **Data Analytics** category icon. For SANEPAR architecture diagrams we still use **legacy unique SVGs** so Path A vs Path B nodes stay visually distinct. Labels always name the real product.

## Rebuild flat aliases

```bash
python3 forge/catalog/shared/assets/icons/gcp/build_flat.py
python3 -m forge.engine generate -e forge/engagements/sanepar-telemetria-dhuo.yaml
```

Refresh packs from Google:

```bash
curl -sL -o /tmp/category-icons.zip https://services.google.com/fh/files/misc/category-icons.zip
curl -sL -o /tmp/core-products-icons.zip https://services.google.com/fh/files/misc/core-products-icons.zip
curl -sL -o /tmp/google-cloud-legacy-icons.zip https://services.google.com/fh/files/misc/google-cloud-legacy-icons.zip
```

**Usage:** [Google Cloud icon terms](https://cloud.google.com/icons) — product logos may be used to accurately reference Google technology in architecture diagrams.
