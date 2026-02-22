# MAPLE: Mapping Application for Private Local Exploration

A secure, browser-based GIS tool designed specifically for rapid spatial data exploration and visualization.

<p align="left">
  <a href="#key-features">Key Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#run-locally">Run Locally</a>
</p>

---

## Overview

**MAPLE** empowers researchers and data scientists to move beyond static spreadsheets and visualize their spatial data instantly. Built with a "privacy-first" architecture, the application processes all data locally within your browser—ensuring sensitive project information never leaves your machine.

Whether you're analyzing survey locations, demographic shifts, or facility distributions, MAPLE transforms raw data (Excel, CSV, GeoJSON) into interactive, exportable thematic maps in seconds.

## Key Features

- 🔒 **Data Confidentiality:** Files are read and processed entirely client-side. No data is uploaded to any server.
- 🗺️ **Interactive Mapping:** Powered by Leaflet for smooth zooming, panning, and detailed feature inspection.
- 🎨 **Thematic Visualization:** Create categorical choropleth and point maps with customizable color palettes and data-driven styling.
- 📂 **Universal Format Support:** Drag-and-drop support for `.csv`, `.xlsx`, and `.geojson` files.
- ⚡ **Instant Config:** Automatically detects spatial columns and suggests optimal visualization settings.

## How It Works

1. **Upload:** Drag and drop your spatial dataset.
2. **Configure:** Select the fields you want to visualize and choose your color categories.
3. **Explore:** Interact with your data on a dynamic map, clicking features to reveal detailed attributes.

## Tech Stack

This project is built with a modern, high-performance frontend stack to ensure speed and reliability:

- **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Mapping:** [React Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.com/)
- **Data Processing:** [PapaParse](https://www.papaparse.com/) & [SheetJS](https://sheetjs.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Run Locally

To get started with development or run the tool on your local machine:

**Prerequisites:** Node.js (v16+)

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
   ```

## ✒️ Author & Attribution

MAPLE was designed and developed by **Michael Giangrande**.

*   [LinkedIn](https://www.linkedin.com/in/mg-gis/)
*   [X / Twitter](https://x.com/mikeGeoWiz)
*   [Medium](https://medium.com/@giangrande_m)

## License

This project is licensed under the [MIT License](LICENSE) - Copyright (c) 2026 Michael Giangrande.
