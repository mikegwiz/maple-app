# MAPLE: Mapping Application for Private Local Exploration

A secure, browser-based GIS tool designed specifically for rapid spatial data exploration and visualization.

**Try it:** [mikegwiz.github.io/maple-app](https://mikegwiz.github.io/maple-app/)

<p align="left">
  <a href="#key-features">Key Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#run-locally">Run Locally</a>
</p>

---

## Overview

**MAPLE** empowers researchers and data scientists to move beyond static spreadsheets and visualize their spatial data instantly. Built with a "privacy-first" architecture, the application processes all data locally within your browser—ensuring sensitive project information never leaves your machine.

Whether you're analyzing survey locations, demographic shifts, or facility distributions, MAPLE transforms raw data (Excel, CSV, JSON, GeoJSON) into interactive, exportable thematic maps in seconds.

## Key Features

- 🔒 **Data Confidentiality:** Files are read and processed entirely client-side. No data is uploaded to any server.
- 🗺️ **Interactive Mapping:** Powered by Leaflet for smooth zooming, panning, and detailed feature inspection, with Positron, Liberty, and World Imagery basemaps.
- 🎨 **Thematic Visualization:** Style point and polygon maps three ways:
  - **Unique values:** a distinct color for each category.
  - **Graduated:** numeric fields classified by natural breaks (Jenks), quantile, or equal interval into 3–7 classes, using sequential color ramps.
  - **Diverging:** numeric values colored outward from a midpoint (zero, mean, median, or a custom value), with a class break always at the midpoint.
- 📤 **Standalone HTML Export:** Download your map as a single HTML file, with legend, popups, and basemap switcher, that you can open or share without MAPLE.
- 📂 **Flexible Format Support:** Drag-and-drop support for `.csv`, `.xlsx`, `.xls`, `.geojson`, and `.json` (GeoJSON or an array of records with coordinates).
- ⚡ **Instant Config:** Automatically detects latitude/longitude columns and numeric fields, and defaults numeric fields to graduated colors.

## How It Works

1. **Upload:** Drag and drop your spatial dataset.
2. **Configure:** Choose the popup fields, a field to color by, and a color style.
3. **Explore:** Interact with your data on a dynamic map, clicking features to reveal detailed attributes.
4. **Export:** Save the map as a standalone HTML file.

> **Note:** Exported HTML files contain your full dataset, including fields hidden from popups. Treat them as confidentially as the original data.

## Tech Stack

This project is built with a modern, high-performance frontend stack to ensure speed and reliability:

- **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Mapping:** [React Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.com/), with vector basemaps rendered by [MapLibre GL](https://maplibre.org/) from [OpenFreeMap](https://openfreemap.org/)
- **Color Schemes:** [ColorBrewer](https://colorbrewer2.org/) sequential and diverging ramps, plus viridis
- **Data Processing:** [PapaParse](https://www.papaparse.com/) & [SheetJS](https://sheetjs.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Run Locally

To get started with development or run the tool on your local machine:

**Prerequisites:** Node.js 18 or newer (deployment uses Node 20)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the Development Server:**

   ```bash
   npm run dev
   ```

3. **Build for Production:**

   ```bash
   npm run build
   npm run preview   # serve the production build locally
   ```

4. **Lint and Format:**

   ```bash
   npm run lint
   npm run format
   ```

## ✒️ Author & Attribution

MAPLE was designed and developed by **Michael Giangrande**.

*   [LinkedIn](https://www.linkedin.com/in/mg-gis/)
*   [X / Twitter](https://x.com/mikeGeoWiz)
*   [Medium](https://medium.com/@giangrande_m)

## License

This project is licensed under the [MIT License](LICENSE) - Copyright (c) 2026 Michael Giangrande.
