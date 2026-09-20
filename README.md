# 🌦️ AeroPulse

> A responsive, zero-dependency weather intelligence dashboard built with vanilla JavaScript, modern glassmorphism bento grids, and high-resolution Open-Meteo data.

[![Live Demo](https://img.shields.io/badge/demo-online-emerald?style=flat-square)](https://nesvv.github.io/aeropulse-weather/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/)

**Live URL:** [https://nesvv.github.io/aeropulse-weather/](https://nesvv.github.io/aeropulse-weather/)

---

## 💡 Overview

Most weather websites either overwhelm users with cluttered tables or hide practical information behind ads. **AeroPulse** was built with a focused goal: deliver real-time meteorological data in an intuitive Apple-style bento grid while providing human-friendly recommendations (what to wear, upcoming rain alerts, and UV exposure warnings).

Everything runs directly in the client without external frameworks or build tooling—keeping the footprint under 65KB.

---

## ✨ Features

- **Apple Weather Bento Grid**: Clean visual hierarchy showcasing current temperature, weather conditions, feels-like metrics, and 7-day outlook.
- **Dynamic Weather Ambience**: The page theme and ambient backdrop glow dynamically adjust to match the local weather (clear skies, thunderstorms, overcast, snowfall, rainy slate).
- **Custom HTML5 Canvas 24-Hour Curve**: Native cubic-bezier temperature visualization with interactive hover crosshairs, rain probability bars, and tooltips (no Chart.js or D3 dependencies).
- **Today's Activity & Outfit Brief**: An atmospheric rule engine that evaluates temperature, humidity, wind vectors, and hourly precipitation probabilities to output natural advice (e.g. umbrella warnings, high UV alerts).
- **Telemetry Bento Cards**:
  - **Live Wind Compass**: Real-time rotating needle calculating cardinal direction and velocity.
  - **Solar Orbit Arc**: Semi-elliptical visual progress tracker for sunrise and sunset.
  - **UV Exposure Index & Humidity/Dew Point**: Graded exposure indicators.
- **Zero API Key Requirement**: Direct integration with the Open-Meteo weather and geocoding services, eliminating API key leak risks and rate limits during live demos.
- **Offline Resilient**: Integrated fallback dataset ensuring the interface renders smoothly even under unstable network conditions.
- **Unit Toggle**: Instant seamless conversion between Metric (°C, km/h) and Imperial (°F, mph).

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 with SVG iconography
- **Styles**: Modern CSS3 (Glassmorphism, CSS Grid, Backdrop Filter, CSS Custom Properties)
- **Scripting**: Vanilla ES6+ JavaScript (Fetch API, HTML5 Canvas 2D API, Geolocation API)
- **Data Source**: [Open-Meteo Weather API](https://open-meteo.com/) (NOAA / ECMWF models)
- **Hosting**: GitHub Pages

---

## 🚀 Quick Start

To run the project locally, clone the repository and open `index.html`:

```bash
git clone https://github.com/nesvv/aeropulse-weather.git
cd aeropulse-weather
```

You can open `index.html` directly in any web browser, or serve it with a lightweight local server:

```bash
# Python 3
python -m http.server 8000

# or Node/npx
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## 👤 Author

- **Saurbh Virkar** — [@nesvv](https://github.com/nesvv)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
