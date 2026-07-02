# Rubber Stock Analyzer

> Client-side Excel matrix analyzer — upload a recycled-rubber-stock spreadsheet and download a grouped summary. No server required.

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| UI        | React 18 + TypeScript       |
| Build     | Vite                        |
| Styling   | Tailwind CSS 3              |
| Excel I/O | SheetJS (`xlsx`)            |
| Deploy    | GitHub Pages (static build) |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (hot-reload)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview
```

---

## How It Works

1. **Upload** your `.xlsx` / `.xls` recycled-stock matrix.
2. The app reads the hardcoded layout:
   - **Row 5** → Main Rubber headers (columns)
   - **Column C** → Secondary Rubber labels (rows)
   - **D6 onward** → Matrix values (`3`, `5`, `10`, or `X`)
3. For each Main Rubber, secondary rubbers are grouped by their percentage.
4. **Download** the generated `Summary.xlsx`.

---

## Deploy to GitHub Pages

### Option A — `gh-pages` package (included)

```bash
# Build and publish to the gh-pages branch
npm run deploy
```

Then in your repo settings → **Pages** → set source to the `gh-pages` branch.

### Option B — GitHub Actions (automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - uses: actions/deploy-pages@v4
```

Then in your repo settings → **Pages** → set source to **GitHub Actions**.

---

## Project Structure

```
├── index.html                 # Entry HTML
├── package.json
├── vite.config.ts             # Vite + React config
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── src/
    ├── main.tsx               # React DOM bootstrap
    ├── App.tsx                # Root component (flow orchestration)
    ├── index.css              # Tailwind directives + custom styles
    ├── types/
    │   └── index.ts           # Shared TypeScript interfaces
    ├── utils/
    │   ├── excelParser.ts     # Reads Excel → MatrixData
    │   ├── summaryGenerator.ts# MatrixData → SummaryRow[]
    │   └── excelExporter.ts   # SummaryRow[] → Summary.xlsx download
    └── components/
        ├── Header.tsx
        ├── FileUpload.tsx
        ├── ResultTable.tsx
        ├── StatusMessage.tsx
        └── LoadingSpinner.tsx
```

---

## License

Private project — all rights reserved.
# RubberFilter
