# Project Plan & Roadmap

## Current Status (Phase 1: Minimum Viable Product)
- [x] Basic Neo-Brutalist UI with custom CSS.
- [x] Integrated `color-name-list` with over 30,000 colors dynamically loaded via CDN.
- [x] Implemented virtual/infinite scrolling to manage DOM performance.
- [x] Fast text-based search filtering by hex code or color name.
- [x] Click-to-copy functionality with toast notifications.
- [x] Automated deployment to GitHub Pages via Actions.
- [x] Extensive documentation of color datasets, sources, and commercial disclaimers.

## Phase 2: Feature Enhancements
- [ ] **Categorization & Tagging**: Group colors by their source dataset (e.g., "Show only Japanese Traditional Colors" or "Show only XKCD survey colors"). This requires parsing the source data if available from the API, or mapping the datasets manually.
- [ ] **Color Space Conversions**: When a user clicks a color, show a modal or expanded view allowing them to copy the color in multiple formats (HEX, RGB, HSL, CMYK).
- [ ] **Dark Mode Toggle**: While Neo-Brutalism often embraces harsh, bright backgrounds, a high-contrast dark mode variant would improve accessibility.
- [ ] **Accessibility (a11y) Improvements**: Ensure contrast ratios are acceptable across the UI, and that the search bar and color cards are fully navigable via keyboard.

## Phase 3: Performance & Architecture
- [ ] **Offline Support & PWA**: Add a Service Worker to cache the `colornames.json` file and static assets so the app works offline and can be installed as a PWA.
- [ ] **Web Worker for Search**: If the dataset grows or search operations become laggy on lower-end devices, move the filtering logic to a Web Worker to keep the main thread unblocked.
- [ ] **Bundling & Build Tools**: Transition from a raw HTML/JS/CSS structure to a modern bundler (like Vite) to optimize asset delivery, minify CSS/JS, and implement stronger linting.

## Phase 4: Community & Ecosystem
- [ ] **User Submissions**: Allow users to propose new color names or variations via GitHub Issues/Pull Requests.
- [ ] **NPM Package or API**: Expose the filtered/searchable data via a lightweight API or NPM package for other developers to integrate seamlessly into their own tools.
