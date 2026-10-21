import { BASEMAPS, FEATURE_STYLE } from '../constants';
import { GeoJSONData, Basemap } from '../types';
import { ColorScheme, LegendItem, resolveColor } from './symbology';

const escapeHtml = (value: unknown) =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

// JSON that is safe to embed in a <script> block (a literal "</script>" in the data can't end it)
const toScriptJSON = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

const MAP_STYLES = `
    body, html { margin: 0; padding: 0; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    #map { height: 100vh; width: 100%; }
    .map-title {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        background: white;
        padding: 8px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        font-weight: 700;
        font-size: 1.1rem;
        color: #0f172a;
        max-width: 80%;
        text-align: center;
    }
    .maple-branding {
        position: absolute;
        bottom: 24px;
        right: 10px;
        z-index: 1000;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 8px 12px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: 1px solid #059669; /* emerald-600 */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
    }
    .maple-title {
        font-family: 'Outfit', -apple-system, sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        color: #059669; /* emerald-600 */
        letter-spacing: -0.02em;
    }
    .social-links {
        display: flex;
        gap: 12px;
    }
    .social-links a {
        color: #64748b; /* slate-500 */
        transition: color 0.15s ease;
        text-decoration: none;
    }
    .social-links a:hover {
        color: #059669; /* emerald-600 */
    }
    .legend-control {
        position: absolute;
        bottom: 30px;
        left: 30px;
        z-index: 1000;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        max-height: 40vh;
        overflow-y: auto;
        width: 250px;
        border: 1px solid #e2e8f0;
    }
    .legend-header {
        padding: 10px;
        border-bottom: 1px solid #e2e8f0;
        background: #f8fafc;
        font-weight: bold;
        font-size: 0.8rem;
        text-transform: uppercase;
        color: #64748b;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
    }
    .legend-content {
       padding: 10px;
    }
    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
    }
    .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        flex-shrink: 0;
        border: 1px solid rgba(0,0,0,0.1);
    }
    .legend-label {
        font-size: 0.9rem;
        color: #334155;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

/**
 * Generates the HTML for the legend control if coloring is enabled.
 */
const getLegendHTML = (scheme: ColorScheme | null, legend: LegendItem[]) => {
    if (!scheme) return '';

    return `
      <div id="legend" class="legend-control">
        <div class="legend-header">
           <span>${escapeHtml(scheme.field)}</span>
           <button onclick="toggleLegend()">_</button>
        </div>
        <div id="legend-content">
          ${legend
            .map(
                ({ label, color }) => `
             <div class="legend-item">
               <span class="legend-color" style="background-color: ${escapeHtml(color)}"></span>
               <span class="legend-label">${escapeHtml(label)}</span>
             </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
};

export const generateMapHTML = (
    title: string,
    data: GeoJSONData,
    selectedFields: string[],
    activeBasemap: Basemap,
    scheme: ColorScheme | null,
    legend: LegendItem[]
): string => {
    const safeTitle = escapeHtml(title);

    const legendHtml = getLegendHTML(scheme, legend);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css"/>
    <script src="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js"></script>
    <script src="https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.1.4/leaflet-maplibre-gl.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        ${MAP_STYLES}
    </style>
</head>
<body>
    <div id="map"></div>
    <div class="map-title">${safeTitle}</div>
    <div class="maple-branding">
        <div class="maple-title">MAPLE</div>
        <div class="social-links">
            <a href="https://github.com/mikegwiz/maple-app" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i class="fa-brands fa-github"></i>
            </a>
        </div>
    </div>
    ${legendHtml}

    <script>
        const geoData = ${toScriptJSON(data)};
        const displayFields = ${toScriptJSON(selectedFields)};
        const initialBasemapName = ${toScriptJSON(activeBasemap.name)};
        const basemapDefinitions = ${toScriptJSON(BASEMAPS)};
        const colorScheme = ${toScriptJSON(scheme)};
        const featureStyle = ${toScriptJSON(FEATURE_STYLE)};
        // Same color logic as the MAPLE app
        const resolveColor = ${resolveColor.toString()};

        const escapeHtml = (value) => String(value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

        function toggleLegend() {
           const content = document.getElementById('legend-content');
           if (content.style.display === 'none') {
               content.style.display = 'block';
           } else {
               content.style.display = 'none';
           }
        }

        const map = L.map('map');
        
        // Basemaps: vector styles render via MapLibre GL, others as raster tiles
        const createBasemapLayer = (def) => def.type === 'vector'
            ? L.maplibreGL({ style: def.url, attributionControl: { customAttribution: def.attribution } })
            : L.tileLayer(def.url, { attribution: def.attribution });

        // Layer Control
        const baseLayers = {};
        Object.keys(basemapDefinitions).forEach(key => {
            const def = basemapDefinitions[key];
            baseLayers[def.name] = createBasemapLayer(def);
        });
        // Reuse the matching control layer so the selected basemap shows as checked
        baseLayers[initialBasemapName].addTo(map);
        L.control.layers(baseLayers).addTo(map);

        // Style functions
        const getFeatureColor = (feature) =>
            resolveColor(colorScheme, feature ? feature.properties : null, featureStyle);

        const pointToLayer = (feature, latlng) => {
            if (colorScheme) {
                return L.circleMarker(latlng, { ...featureStyle.point, fillColor: getFeatureColor(feature) });
            }
            return L.marker(latlng);
        };

        const style = (feature) => {
             return { ...featureStyle.shape, fillColor: getFeatureColor(feature) };
        };

        // Add Data
        const geoJsonLayer = L.geoJSON(geoData, {
            pointToLayer: pointToLayer,
            style: style,
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    const color = getFeatureColor(feature);
                    let popupContent = \`<div style="min-width: 220px; max-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">\`;
                    
                    popupContent += \`<div style="display: flex; gap: 12px;">\`;
                    
                    // Colored strip
                    popupContent += \`<div style="background-color: \${color}; width: 6px; border-radius: 4px; flex-shrink: 0; opacity: 0.8; margin: 4px 0;"></div>\`;
                    
                    // List
                    popupContent += \`<div style="flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 4px 0;">\`;

                    displayFields.forEach(field => {
                        const val = feature.properties[field];
                        if (val !== undefined && val !== null && String(val).trim() !== "") {
                            popupContent += \`
                                <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">
                                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 2px;">\${escapeHtml(field)}</div>
                                    <div style="font-size: 14px; color: #334155; font-weight: 500; line-height: 1.4; word-break: break-word;">\${escapeHtml(val)}</div>
                                </div>
                            \`;
                        }
                    });
                    
                    popupContent += '</div></div></div>';
                    layer.bindPopup(popupContent);
                }
            }
        }).addTo(map);

        // Fit Bounds
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        } else {
             map.setView([0, 0], 2);
        }
    </script>
</body>
</html>`;
};
