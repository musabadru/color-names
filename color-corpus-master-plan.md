# Definitive Color Corpus Platform Plan

This document defines the product, data, architecture, deployment, and delivery plan for building a definitive color-name corpus and explorer. It consolidates the current project direction, expands the earlier roadmap, and sets a clear target architecture: **Astro + Svelte on Vercel**, **Turso as the sole system of record**, and a **maintained static GitHub Pages branch** for continuity, archival value, and simplified public distribution.

The project should evolve from a useful color browser into a durable color knowledge system: source-aware, citation-friendly, historically grounded, technically consistent, and prepared for a future public API. The current project already includes a browser UI, fast search, virtual scrolling, click-to-copy behavior, GitHub Pages deployment, and documentation around color datasets and their disclaimers.[web:100][file:137]

## Objectives

The platform should serve four goals at once:

- Build a **definitive corpus** of color names across standards, books, surveys, historical dictionaries, industrial systems, and curated datasets.
- Present the corpus through a **fast public web experience** optimized for browsing, comparison, filtering, and source exploration.
- Preserve rigorous **provenance and normalization**, so every color value and every name can be traced back to its source edition, notation, or dataset.[web:9][web:68][web:77]
- Prepare the data model and application architecture for a **future first-party API**, while avoiding external runtime APIs today.

## Strategic decisions

The following decisions are foundational and should be treated as project constraints unless deliberately revised:

- The primary application stack should be **Astro with Svelte islands**, deployed on **Vercel**.[web:125][web:133]
- **Turso/libSQL** should be the only production datastore and the canonical source of truth for all structured data.
- There should be **no dependency on third-party runtime data APIs**. All data should be stored, transformed, queried, and served from project-controlled infrastructure.
- A **static GitHub Pages version must continue to exist as a maintained branch**, both as a backward-compatible public artifact and as a low-complexity fallback distribution channel.[web:115][file:137]
- The system should be designed now for a **future internal and public API layer**, even if the first releases remain mostly page-driven and DB-backed.

## Product vision

The long-term product is not just “a list of color names.” It is a multi-layered reference system with the following capabilities:

- Browse colors by source family, historical period, language, standard, region, palette type, or perceptual neighborhood.
- View a color detail page with raw source spelling, normalized names, alternative names, source metadata, numeric representations, and nearby equivalents.
- Compare how multiple systems define or approximate a color concept like “vermilion,” “sky blue,” or “olive.”
- Track ambiguity explicitly: one name may map to different colors across sources, and one color may have many names.
- Support future exports, downloads, embeds, packages, and API queries without rebuilding the entire architecture.

## Architecture overview

The recommended architecture is a hybrid content-and-data system.

### Frontend

Use **Astro** as the page and route framework, with **Svelte** only where interactivity is worth the hydration cost.[web:126][web:133] Astro is well suited to content-heavy, source-rich pages and allows selective interactivity via islands, which keeps the site fast while still enabling advanced UI controls.[web:123][web:133]

Use Astro for:

- Home page
- Source index pages
- Source detail pages
- Color detail pages
- Essays, docs, methodology pages
- Static exports and dataset landing pages

Use Svelte islands for:

- Autocomplete search
- Faceted filtering
- Compare drawer
- Similar-color inspector
- Multi-format copy tools
- Interactive swatch explorers
- Session-only preferences and client UI state

### Hosting and deployment

Deploy the main application to **Vercel**, which has first-class Astro support and allows a gradual shift from static pages to server-side or function-backed routes when needed.[web:125][web:131][web:135]

Use Vercel for:

- Static page deployment
- On-demand rendering where needed
- Future server endpoints
- Scheduled or manual revalidation if adopted later
- Environment variable management for Turso credentials

### Database

Use **Turso/libSQL** as the sole system of record. All source data, normalized names, conversions, source metadata, and future API-facing query structures should live in Turso.

Turso should hold:

- Raw source records
- Normalized lexical records
- Cross-reference and alias tables
- Source documents and editions
- Derived color conversions
- Similarity clusters or lookup tables
- Ingest metadata and ETL history
- Future user curation and moderation tables

### GitHub Pages branch

Maintain a separate static branch for GitHub Pages. This branch should not be the main development target, but it should remain functional and intentionally supported.

The GitHub Pages branch should serve these roles:

- Public fallback version if the dynamic stack is unavailable
- Lightweight archival/demo build
- Simplified no-backend distribution
- Historical continuity with the current project direction.[file:137]

This branch can be generated from the main codebase using static exports or a dedicated stripped-down build profile. It should not become a divergent hand-maintained app unless absolutely necessary.

## Static vs dynamic strategy

The platform should adopt a **static-first, database-backed** strategy.

That means:

- Build as many pages as possible at build time.
- Keep read-heavy content cacheable and cheap.
- Use Svelte islands only for rich UI.
- Introduce server-side endpoints only when query complexity, write paths, or protected access truly require them.

### What should remain static

- Editorial pages
- Methodology pages
- Source documentation
- Color detail pages for popular or preselected colors
- Source landing pages
- Changelog and roadmap pages
- Download catalog pages

### What can be dynamic later

- Advanced fuzzy search
- Large-scale cross-source comparison queries
- Similar-color and nearest-neighbor lookup
- Administrative ingestion dashboards
- Curator workflows
- Public API responses

This approach preserves most of Astro’s performance advantage while keeping the project ready for data-heavy features.[web:118][web:120][web:133]

## Data ownership policy

All project data should be internalized and managed by the project team.

### Rules

- No external runtime API should be required to render core product functionality.
- Third-party source material may be used during ingestion, but the project should store the resulting structured records in Turso under clear provenance and licensing rules.
- Each source should be versioned by edition, revision, or import batch where possible.
- Any values derived from source material should be marked as derived, with the transformation method recorded.

This policy avoids operational fragility and gives the project control over availability, consistency, and future API design.

## Canonical data model

The data model should separate **source truth**, **lexical normalization**, and **perceptual relationships**.

### Recommended core tables

#### `sources`

Stores the identity of each source family.

Suggested fields:

- `id`
- `slug`
- `name`
- `kind` (`standard`, `historical_book`, `survey`, `commercial_system`, `dataset`, `web_collection`)
- `organization`
- `edition_or_version`
- `publication_year`
- `language`
- `license`
- `source_url`
- `notes`

#### `documents`

Stores bibliographic or publication-level metadata.

Suggested fields:

- `id`
- `source_id`
- `title`
- `authors`
- `publisher`
- `year`
- `isbn_or_identifier`
- `url`
- `notes`

#### `source_colors`

Stores the raw color record from a source.

Suggested fields:

- `id`
- `source_id`
- `document_id`
- `local_code`
- `primary_name_raw`
- `language`
- `script`
- `sample_type`
- `color_space`
- `coord_1`
- `coord_2`
- `coord_3`
- `coord_4`
- `coords_source`
- `page_or_plate`
- `is_obsolete`
- `notes`

#### `names`

Stores normalized lexical forms.

Suggested fields:

- `id`
- `normalized_form`
- `display_form`
- `language`
- `script`
- `sort_key`
- `search_key`

#### `name_aliases`

Stores spelling or transliteration variants.

Suggested fields:

- `id`
- `name_id`
- `alias_form`
- `kind`

#### `color_name_assignments`

Links names to raw source colors.

Suggested fields:

- `id`
- `source_color_id`
- `name_id`
- `role` (`primary`, `alternate`, `translation`, `alias`, `index_only`)
- `confidence`
- `created_by`
- `created_at`

#### `color_conversions`

Stores converted values in additional color spaces.

Suggested fields:

- `id`
- `source_color_id`
- `from_color_space`
- `to_color_space`
- `coord_1`
- `coord_2`
- `coord_3`
- `coord_4`
- `algorithm`
- `params_json`
- `computed_at`

#### `color_clusters`

Groups visually similar colors across systems.

Suggested fields:

- `id`
- `method`
- `reference_color_space`
- `reference_coord_1`
- `reference_coord_2`
- `reference_coord_3`
- `max_delta_e`
- `notes`

#### `cluster_members`

Links colors to perceptual clusters.

Suggested fields:

- `id`
- `cluster_id`
- `source_color_id`
- `delta_e`
- `role`

#### `ingest_batches`

Tracks data imports and transformations.

Suggested fields:

- `id`
- `source_id`
- `started_at`
- `ended_at`
- `schema_version`
- `raw_location`
- `status`
- `summary_json`

### Key modeling rules

- Never overwrite raw source values with normalized ones.
- Never collapse many-to-many name relationships into a single canonical string.
- Keep original coordinates separate from computed conversions.
- Treat “same name, different color” and “same color, different names” as first-class realities, not edge cases.
- Preserve provenance at row level.

## Source coverage plan

The corpus should cover multiple source families rather than overfitting to popular web-color datasets. The current project already references broad color-name collections and source disclaimers.[file:137] The next stage should formalize source-family coverage.

### Priority source families

- CSS/HTML/X11 color names
- Wikipedia and curated GitHub color name lists
- Traditional colors of Japan
- Wada Sanzō dictionaries
- Traditional colors of China
- Le Corbusier colors
- ISCC–NBS / Universal Color Language
- Werner’s *Nomenclature of Colours*
- Ridgway’s *Color Standards and Color Nomenclature*
- RAL
- JIS color names
- Munsell mappings and traditional-name charts
- XKCD survey colors
- OS X Crayons
- Crayola core color sets
- Resene
- Pantone where license terms allow usable metadata handling
- BS 4800 / BS 381C
- NCS
- Federal Standard / AMS standard colors
- Artist or data-viz palettes such as ColorBrewer where relevant

### Source ingestion tiers

#### Tier 1: Public and technically easy

Open datasets, CC0/CC-BY/MIT lists, public-domain books, standards with accessible tables, and source files already structured as CSV/JSON.

#### Tier 2: Structured but needs cleaning

Wikipedia-derived lists, scans, historical books, multilingual tables, or data requiring OCR cleanup and careful normalization.

#### Tier 3: Restricted or license-sensitive

Commercial standards and systems where the project may only be able to store limited metadata, identifiers, or transformed derivatives depending on rights.

## Licensing and rights policy

The project needs a strict internal policy around rights because color names, swatches, and standard identifiers have mixed legal status.

### Policy rules

- Keep a per-source license record in the `sources` table.
- Distinguish public-domain sources, open datasets, and restricted commercial systems.
- Do not assume that because a color system is widely referenced, its swatches and names are fully reusable.
- Support limited metadata mode for restricted systems when necessary.
- Separate “stored raw text” from “derived coordinates” and from “display assets.”

## Ingestion and ETL pipeline

The ingestion layer should be treated as a product subsystem, not an ad hoc script folder.

### Pipeline phases

1. **Acquire** source files, scans, tables, or manually curated source extracts.
2. **Parse** into a source-specific staging format.
3. **Normalize** names, language tags, scripts, spacing, punctuation, and code formats.
4. **Validate** records for duplicate keys, malformed coordinates, and impossible values.
5. **Convert** into common color spaces such as sRGB, Lab, LCH, OKLab, and OKLCH where feasible.
6. **Link** names, aliases, and probable cross-source matches.
7. **Load** into Turso.
8. **Publish** site artifacts and optional static exports.

### ETL implementation guidance

- Use repeatable import scripts per source family.
- Record every import in `ingest_batches`.
- Add validation reports for duplicates, orphaned names, bad conversions, and unresolved conflicts.
- Store source-level parser configs in version control.
- Make imports idempotent where possible.

## Search and retrieval strategy

Search is central to this product and should be designed in layers.

### Phase 1 search

- Exact name search
- Prefix search
- Hex search
- Source filtering
- Alias matching
- Basic sorting

### Phase 2 search

- Fuzzy string matching
- Transliteration-aware search
- Search across raw and normalized names
- Search by source family, language, period, and type
- Similar-color lookup by Lab/OKLCH distance

### Phase 3 search

- Hybrid lexical + perceptual ranking
- Concept search (“dusty pink”, “warm gray”, “indigo-like”)
- Future API-friendly query grammar

For the frontend, the initial interactive search experience can remain browser-assisted, but it should be backed by project-owned data structures rather than external APIs.

## API strategy

There should be **no external API dependency now**, but the architecture should prepare for a future first-party API.

### Principles

- The database schema should be API-ready from the start.
- Route and serializer design should assume future public consumers.
- Internal query services should avoid tight coupling to page rendering.

### Likely future API surfaces

- `/colors/:id`
- `/colors?name=`
- `/sources/:slug`
- `/search?q=`
- `/clusters/:id`
- `/compare?ids=`
- `/exports/:source`

### Rollout recommendation

- Phase 1: no public API, direct server-side DB access from the app where necessary.
- Phase 2: internal server routes for app features.
- Phase 3: documented external API with rate limits, versioning, and stable response contracts.

## Frontend information architecture

The site should be structured around a few durable page types.

### Core page types

- Home
- Browse all colors
- Browse by source
- Color detail page
- Name detail page or lexical concept page
- Compare view
- Methodology
- Source notes and rights pages
- Downloads/exports
- Roadmap/changelog

### Color detail page content

Each color page should aim to show:

- Primary display name
- Raw source name
- Source and edition
- Swatch
- Hex/RGB/HSL/Lab/OKLCH when available
- Alternative names and spellings
- Similar colors
- Same-name variants across sources
- Provenance and notes
- Copy/export actions

### Browse experience

The browse UI should support:

- Infinite or paginated browsing
- Faceted filtering by source, language, type, and era
- Sort by name, hue, lightness, popularity, or source
- Search and compare entry points
- Clear visual distinction between historical, commercial, scientific, and crowd-sourced systems

## UI and design direction

The current product uses a Neo-Brutalist direction.[file:137] The next version should decide whether to preserve that fully, soften it, or evolve into a more editorial-reference style better suited to a definitive corpus.

### Recommended design direction

A hybrid of **editorial reference site + analytical tool** is likely stronger long-term than pure novelty styling. The UI should feel opinionated and memorable, but the information should remain the star.

### UI principles

- Fast, swatch-first browsing
- Strong typography
- Clear source identity and labels
- Excellent contrast and keyboard usability
- Minimal chrome around the data
- Distinct visual handling for ambiguous or disputed names

### Accessibility goals

The current roadmap already identifies accessibility improvements as a key phase.[file:137] Those should be elevated to non-negotiable quality requirements.

Required standards:

- Keyboard-complete search and browse flow
- Accessible dialogs/modals
- Proper focus states
- Strong text-to-background contrast
- Screen-reader-friendly labeling for swatches and codes
- Reduced-motion handling
- Copy actions with accessible feedback

## Performance strategy

The existing project already uses virtual or infinite scrolling to control DOM cost.[file:137] The next architecture should retain that performance mindset while taking advantage of Astro’s static output and selective hydration.[web:133]

### Performance priorities

- Minimize client JavaScript by default
- Hydrate only interactive islands
- Use route-level code splitting
- Precompute derived values where practical
- Cache common queries and page payloads
- Use Web Workers if client-side search becomes heavy
- Add offline/PWA support only after core architecture stabilizes

## Branching and repository strategy

A dual-track repository model is recommended.

### Branches

- `main`: primary Astro + Svelte + Vercel codebase
- `gh-pages-static` (or equivalent): maintained static GitHub Pages branch
- `data` or `etl` branches optional for heavy import work if needed

### Branch responsibilities

#### `main`

- Active product development
- Turso-backed application
- Vercel deployment target
- Future server routes and API implementation

#### `gh-pages-static`

- Static export or static-compatible variant
- Maintained public fallback
- Lightweight browsing experience
- No dependence on external runtime APIs

### Strategy for keeping branches aligned

- Derive the static branch from the main codebase whenever possible.
- Use a build/export pipeline rather than manual duplication.
- Keep visual branding and public content aligned across both experiences.
- Allow the static branch to omit features that truly require protected DB access, but preserve the core browsing value.

## Deployment workflow

### Environments

- Local development
- Preview deployments on Vercel
- Production deployment on Vercel
- Static branch deployment on GitHub Pages

### CI/CD responsibilities

- Lint and type-check application code
- Run tests for parsers and key data transforms
- Validate schema migrations
- Build Astro site
- Deploy preview and production builds
- Generate and publish static branch artifacts

## Recommended project structure

```text
/apps/web                Astro app
/apps/static-export      Optional export tooling or static profile
/packages/db             Schema, migrations, query helpers
/packages/etl            Ingestion pipelines and parsers
/packages/shared         Types, utilities, color math helpers
/content                 Editorial docs and methodology
/data-staging            Raw or intermediate source files
/scripts                 Automation scripts
```

## Roadmap

### Phase 0: Consolidation

- Audit the current project and preserve useful UI and interaction patterns.[file:137]
- Migrate away from CDN-only dataset dependence into project-controlled storage.[file:137]
- Define repository conventions, naming, and schema standards.
- Stand up Turso and initial migration workflow.

### Phase 1: Foundation rebuild

- Create Astro + Svelte application shell.
- Set up Vercel deployment.
- Implement core schema in Turso.
- Build ETL for first ingestion wave.
- Create maintained static GitHub Pages branch.
- Reproduce current browsing, search, and copy features in the new stack.

### Phase 2: Source-aware browsing

- Add source pages and filters.
- Add color detail pages.
- Add normalized names and aliases.
- Add multiple color format displays and copy helpers.
- Add rights and provenance UI.

### Phase 3: Knowledge features

- Add similarity clusters.
- Add name ambiguity handling.
- Add compare workflows.
- Add multilingual and transliteration-aware search.
- Add editorial source notes and historical context.

### Phase 4: Platform maturity

- Improve accessibility and test coverage.[file:137]
- Add workerized search or server-assisted search where justified.[file:137]
- Add PWA/offline features if still valuable after the architecture settles.[file:137]
- Add export surfaces and developer-facing package artifacts.

### Phase 5: Future API

- Introduce internal API routes.
- Version response contracts.
- Expose carefully designed public endpoints.
- Add rate limiting, auth tiers if needed, and documentation.

## Immediate action list

### Technical

- Create the Astro workspace.
- Add Svelte integration.
- Add Turso connection layer.
- Design and apply first DB migrations.
- Build importer for the current seed datasets.
- Model the static export path for the GitHub Pages branch.

### Product

- Decide exact design direction for the next public version.
- Define the first 5–10 priority sources.
- Decide what a “color detail page” must contain for launch.
- Define the minimum useful compare flow.

### Operational

- Write source intake rules.
- Write licensing review checklist.
- Write data quality checklist.
- Decide backup/export strategy for Turso.

## Non-goals for the first major rebuild

To keep scope sane, the following should not block the first serious release:

- Full public API
- User accounts
- Public submissions UI
- Full moderation back office
- Exhaustive ingestion of every possible color source before launch
- Perfect cross-source disambiguation from day one

## Success criteria

The project can be considered on the right trajectory when the following are true:

- The main app runs on Astro + Svelte and is deployed on Vercel.
- Turso is the sole source of production data.
- The static GitHub Pages branch remains available and maintained.
- At least several major source families are fully ingested with provenance.
- Users can browse by source, search by name, inspect a color detail page, and compare related colors.
- The schema and route design can support a future first-party API without major rewrites.

## Final direction

The best path is to treat this as a **reference platform**, not merely a visual toy. The frontend should be elegant and fast, but the real asset is the corpus: structured, normalized, source-aware, historically broad, and controlled end-to-end by the project. Astro + Svelte on Vercel is a strong delivery stack for that goal, Turso gives a clean relational backbone, and the maintained static GitHub Pages branch preserves reach, resilience, and project continuity.[web:125][web:133][web:135][web:115]
