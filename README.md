# Color Names Explorer

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://musabadru.github.io/color-names/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautifully designed, Neo-Brutalist inspired static web application to search and discover over 30,000 named colors and their respective hex codes. 

[👉 **View the Live Demo**](https://musabadru.github.io/color-names/)

## Quick Start

To run this project locally, you don't need any build tools. Just serve the directory:

1. Clone the repository: `git clone https://github.com/musabadru/color-names.git`
2. Open `index.html` in your browser, or serve it using any local web server (e.g., `npx serve .` or `python -m http.server`).

---

## Data Sources

The color datasets aggregated and utilized in this project come from a massive variety of open-source projects, standard definitions, and general-purpose mappings. Below is an index of the data sources:

### Basic & Web Standards
* **A set of basic colors**: Standard Red, Green, Blue, etc. (Source: colorjs/color-namer)
* **HTML/CSS Colors**: Standard keywords usable in CSS, SVG, or HTML. (Source: colorjs/color-namer)
* **X11 Color Names**: Standard Xlib or the X11 protocol color names.
* **Microsoft Windows Color Names**: Legacy Microsoft Windows system color names.

### General-Purpose Name–Color Datasets
* **Wikipedia Color Names**: List of color names sourced from Wikipedia entries.
* **XKCD Colors**: The 954 most common RGB monitor colors defined by the XKCD color name survey.
* **NTC.js**: Color matching library names released in 2007 (Wikipedia, X11, Crayola, etc.).
* **Martin Krzywinski’s List**: A curated list of 9,284 named colors with hex codes for data visualization.
* **helightdev/ColorNames**: Dataset of color names linked to hex, RGB and LAB (merged from CC0 xkcd survey data, CC0 RAL, and The Color API).
* **Uvacoder/color-names**: General-purpose GitHub repo collecting color codes and their common names.
* **Smoltbob/XKCDColors-Dataset**: A "balanced" ML-oriented dataset built from the xkcd survey.
* **HuggingFace "color-names"**: Processed dataset of ~40,000 rows of color names and hex codes packaged with MIT licensing.

### Traditional & Historical
* **Traditional Colors of Japan**: Traditional colors used in Japanese art, literature, and textiles.
* **Traditional Colors of China**: Color Aesthetics in the Forbidden City (中国传统色：故宫里的色彩美学).
* **Wada Sanzō Japanese Color Dictionary Volume I**: Names from Wada Sanzō 和田 三造 Colors Dictionary.
* **Robert Ridgway's Color Standards and Color Nomenclature**: Published in 1912, added to Project Gutenberg in 2020 (Public Domain, USA).
* **Werner's Nomenclature of Colours**: Collected and described in the late 18th century.

### Commercial & Industrial Standards
* **RAL Color**: RAL color matching names.
* **Pantone Color Systems**: Official Color Finder named palettes (HEX/RGB/HSL).
* **Resene Paint Colors**: New Zealand paint manufacturer Resene's lists of architectural/paint colors.
* **BS 4800 / BS 381C (British Standard colors)**: Widely used architectural and industrial standard sets.
* **Federal Standard 595 / AMS-STD-595**: US government procurement color standards for military and federal coatings.
* **OS X Crayons**: Apple OS X GUI color picker crayon names.
* **Risograph Colors**: Popular colors for Risograph printers.

### Perceptual & Systemic Models
* **The Universal Color Language (ISCC–NBS System)**: Naming system based on 12 basic color terms and adjective modifiers.
* **Natural Color System (NCS)**: A perceptual system based on six elementary colors.
* **Le Corbusier**: Architectural colours in Le Corbusier's colour system.

### Linguistic & Cross-Language
* **Many Languages, Many Colors**: Research dataset with color-name judgments across 14 languages.
* **The Color Thesaurus**: By Ingrid Sundberg, a collection of descriptive names for writers to dig into the emotion of a scene.

---

## Disclaimers

> [!WARNING]  
> **Copyright and Trademarks:**
> Many of the commercial and industrial color standards referenced in the source lists (such as **Pantone**, **RAL**, **NCS**, **British Standards**, and **Federal Standards**) are protected by international trademarks, copyrights, and intellectual property laws. 
> 
> * The **names** of specific colors in systems like Pantone are often copyrighted and trademarked.
> * The numeric values (HEX, RGB) presented in datasets are approximations of the official physical swatches and are provided strictly for educational, reference, or developmental purposes.
> * This project and its maintainers are **not affiliated with, endorsed by, or sponsored by** Pantone LLC, RAL gGmbH, the Natural Color System (NCS), or any other commercial entity listed above.
> 
> If you require exact color matching for commercial use, you must purchase official guides and licenses directly from the respective organizations.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.
