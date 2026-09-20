/**
 * AeroPulse - Weather Intelligence Dashboard
 * Author: Saurbh Virkar (https://github.com/nesvv)
 * License: MIT
 */

// Global app state
const state = {
  city: "London",
  country: "United Kingdom",
  lat: 51.5074,
  lon: -0.1278,
  unit: "metric", // 'metric' (°C, km/h) or 'imperial' (°F, mph)
  weatherData: null,
  isLive: true
};

// -------------------------------------------------------------
// 2. WMO WEATHER CODE MAPPINGS (Official World Meteorological Org)
// -------------------------------------------------------------
const WEATHER_CODES = {
  0: { label: "Clear Sky", theme: "theme-clear-day", nightTheme: "theme-clear-night", icon: "sun" },
  1: { label: "Mainly Clear", theme: "theme-clear-day", nightTheme: "theme-clear-night", icon: "sun-cloud" },
  2: { label: "Partly Cloudy", theme: "theme-cloudy", nightTheme: "theme-clear-night", icon: "partly-cloudy" },
  3: { label: "Overcast", theme: "theme-cloudy", nightTheme: "theme-cloudy", icon: "cloud" },
  45: { label: "Foggy Mist", theme: "theme-cloudy", nightTheme: "theme-cloudy", icon: "fog" },
  48: { label: "Depositing Rime Fog", theme: "theme-cloudy", nightTheme: "theme-cloudy", icon: "fog" },
  51: { label: "Light Drizzle", theme: "theme-rain", nightTheme: "theme-rain", icon: "drizzle" },
  53: { label: "Moderate Drizzle", theme: "theme-rain", nightTheme: "theme-rain", icon: "drizzle" },
  55: { label: "Dense Drizzle", theme: "theme-rain", nightTheme: "theme-rain", icon: "drizzle" },
  61: { label: "Slight Rain", theme: "theme-rain", nightTheme: "theme-rain", icon: "rain" },
  63: { label: "Moderate Rain", theme: "theme-rain", nightTheme: "theme-rain", icon: "rain" },
  65: { label: "Heavy Rain", theme: "theme-rain", nightTheme: "theme-rain", icon: "rain-heavy" },
  71: { label: "Slight Snow", theme: "theme-snow", nightTheme: "theme-snow", icon: "snow" },
  73: { label: "Moderate Snow", theme: "theme-snow", nightTheme: "theme-snow", icon: "snow" },
  75: { label: "Heavy Snow", theme: "theme-snow", nightTheme: "theme-snow", icon: "snow" },
  80: { label: "Passing Showers", theme: "theme-rain", nightTheme: "theme-rain", icon: "rain" },
  81: { label: "Heavy Showers", theme: "theme-rain", nightTheme: "theme-rain", icon: "rain-heavy" },
  82: { label: "Violent Rain", theme: "theme-rain", nightTheme: "theme-rain", icon: "rain-heavy" },
  95: { label: "Thunderstorm", theme: "theme-storm", nightTheme: "theme-storm", icon: "thunder" },
  96: { label: "Thunderstorm w/ Hail", theme: "theme-storm", nightTheme: "theme-storm", icon: "thunder" }
};

function getWeatherInfo(code, isDay = 1) {
  const base = WEATHER_CODES[code] || { label: "Partly Cloudy", theme: "theme-cloudy", nightTheme: "theme-clear-night", icon: "partly-cloudy" };
  const currentTheme = isDay ? base.theme : (base.nightTheme || base.theme);
  return { ...base, activeTheme: currentTheme, isDay };
}

// -------------------------------------------------------------
// 3. SVG ICONS GENERATOR
// -------------------------------------------------------------
function getSvgIcon(iconType, size = 24) {
  switch (iconType) {
    case "sun":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path><path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path><path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
      </svg>`;
    case "sun-cloud":
    case "partly-cloudy":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="M20 12h2"></path>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      </svg>`;
    case "cloud":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      </svg>`;
    case "rain":
    case "drizzle":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path>
      </svg>`;
    case "rain-heavy":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M16 14v8"></path><path d="M8 14v8"></path><path d="M12 16v8"></path>
      </svg>`;
    case "snow":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#e0f2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 15h.01"></path><path d="M8 9h.01"></path><path d="M12 12h.01"></path>
        <path d="M16 15h.01"></path><path d="M16 9h.01"></path>
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
      </svg>`;
    case "thunder":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
        <polyline points="13 11 9 17 15 17 11 23"></polyline>
      </svg>`;
    case "fog":
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="14" x2="20" y2="14"></line>
        <line x1="6" y1="18" x2="18" y2="18"></line>
        <line x1="4" y1="10" x2="20" y2="10"></line>
      </svg>`;
  }
}

// Rules-based heuristic engine for outfit & activity recommendations
class SmartAdvisor {
  static generateAdvice(current, hourly, daily) {
    const tips = [];
    const temp = current.temperature_2m;
    const uv = current.uv_index || 0;
    const wind = current.wind_speed_10m || 0;
    const precip = current.precipitation || 0;

    // Check hourly rain anticipation for the next 8 hours
    const next8HoursRain = (hourly.precipitation_probability || []).slice(0, 8);
    const maxRainProb = Math.max(...next8HoursRain, 0);
    const rainyHourIndex = next8HoursRain.findIndex(p => p > 40);

    if (rainyHourIndex !== -1) {
      const targetTime = new Date(hourly.time[rainyHourIndex]).getHours();
      const formatTime = targetTime === 0 ? "12 AM" : targetTime > 12 ? `${targetTime - 12} PM` : `${targetTime} AM`;
      tips.push(`☔ Umbrella recommended: Rain likelihood reaches ${maxRainProb}% around ${formatTime}.`);
    } else if (precip > 0.5) {
      tips.push("🌧️ Wet conditions currently: Drive with caution and carry waterproof gear.");
    } else {
      tips.push("✨ Dry conditions expected for the next 8 hours.");
    }

    // Temperature & Outfits
    if (temp < 10) {
      tips.push("🧣 Crisp & cold: Wear a thermal layer or warm winter coat.");
    } else if (temp > 28) {
      tips.push("☀️ Hot weather alert: Stay hydrated and seek shade during peak afternoon.");
    } else {
      tips.push("👕 Comfortable ambient temperature: Ideal for light casual layers.");
    }

    // UV Index
    if (uv >= 6) {
      tips.push(`🧴 Very High UV (${uv}): Apply SPF 30+ sunscreen if outdoors.`);
    }

    // Wind Speed
    if (wind > 35) {
      tips.push(`💨 High wind gusts (${Math.round(wind)} km/h): Secure loose outdoor items.`);
    }

    return tips.join(" ");
  }
}

// -------------------------------------------------------------
// 5. OPEN-METEO WEATHER & GEOCODING API SERVICE
// -------------------------------------------------------------
class WeatherService {
  static async searchCity(query) {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      return data.results || [];
    } catch (err) {
      console.warn("Geocoding lookup error:", err);
      return [];
    }
  }

  static async fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather API error");
      return await response.json();
    } catch (error) {
      console.warn("Network error, switching to resilient fallback data", error);
      return WeatherService.getMockFallbackData();
    }
  }

  // Graceful offline fallback so the hackathon presentation never fails
  static getMockFallbackData() {
    const now = new Date();
    const hours = Array.from({ length: 24 }, (_, i) => {
      const d = new Date(now);
      d.setHours(d.getHours() + i);
      return d.toISOString();
    });
    return {
      current: {
        temperature_2m: 19.5,
        relative_humidity_2m: 65,
        apparent_temperature: 18.8,
        is_day: 1,
        precipitation: 0.0,
        weather_code: 1,
        cloud_cover: 25,
        pressure_msl: 1014.2,
        wind_speed_10m: 14.8,
        wind_direction_10m: 215,
        uv_index: 4.2
      },
      hourly: {
        time: hours,
        temperature_2m: [19, 20, 21, 22, 23, 22, 21, 19, 18, 17, 16, 15, 15, 16, 17, 18, 20, 21, 22, 21, 19, 18, 17, 16],
        precipitation_probability: [0, 5, 10, 15, 20, 10, 5, 0, 0, 0, 0, 0, 5, 10, 25, 45, 60, 30, 10, 0, 0, 0, 0, 0],
        weather_code: Array(24).fill(1)
      },
      daily: {
        time: ["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        weather_code: [1, 2, 61, 0, 2, 1, 3],
        temperature_2m_max: [23, 24, 20, 22, 25, 23, 21],
        temperature_2m_min: [14, 15, 13, 12, 14, 15, 13],
        sunrise: [new Date().toISOString()],
        sunset: [new Date(Date.now() + 43200000).toISOString()],
        uv_index_max: [5, 6, 3, 7, 6, 5, 4]
      }
    };
  }
}

// -------------------------------------------------------------
// 6. 24-HOUR INTERACTIVE CANVAS CHART
// -------------------------------------------------------------
class CanvasChartRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.tooltip = document.getElementById("chartTooltip");
    this.points = [];
    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener("mousemove", (e) => this.handleHover(e));
    this.canvas.addEventListener("mouseleave", () => {
      this.tooltip.classList.add("hidden");
      this.render(); // Clear crosshair
    });
    window.addEventListener("resize", () => this.render());
  }

  handleHover(e) {
    if (!this.points || this.points.length === 0) return;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Find closest data point
    let closest = this.points[0];
    let minDiff = Math.abs(mouseX - closest.x);

    for (let pt of this.points) {
      const diff = Math.abs(mouseX - pt.x);
      if (diff < minDiff) {
        minDiff = diff;
        closest = pt;
      }
    }

    // Render crosshair
    this.render(closest);

    // Show tooltip
    const tempStr = formatTemp(closest.temp);
    this.tooltip.innerHTML = `<strong>${closest.timeLabel}</strong> &bull; ${tempStr} | Rain: ${closest.rainProb}%`;
    this.tooltip.style.left = `${closest.x}px`;
    this.tooltip.style.top = `${closest.y - 15}px`;
    this.tooltip.classList.remove("hidden");
  }

  render(activePoint = null) {
    if (!state.weatherData) return;

    // Handle high DPI crisp displays
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    // Take next 24 hours of data
    const hourlyTemps = state.weatherData.hourly.temperature_2m.slice(0, 24);
    const hourlyRain = state.weatherData.hourly.precipitation_probability.slice(0, 24);
    const hourlyTimes = state.weatherData.hourly.time.slice(0, 24);

    const minT = Math.min(...hourlyTemps) - 2;
    const maxT = Math.max(...hourlyTemps) + 2;
    const tRange = maxT - minT || 1;

    const padLeft = 10;
    const padRight = 10;
    const padTop = 20;
    const padBottom = 25;
    const drawW = width - padLeft - padRight;
    const drawH = height - padTop - padBottom;

    this.points = [];

    // Calculate coordinates
    for (let i = 0; i < hourlyTemps.length; i++) {
      const x = padLeft + (i / (hourlyTemps.length - 1)) * drawW;
      const normalizedY = (hourlyTemps[i] - minT) / tRange;
      const y = padTop + drawH - normalizedY * drawH;
      const d = new Date(hourlyTimes[i]);
      const hours = d.getHours();
      const timeLabel = hours === 0 ? "12 AM" : hours > 12 ? `${hours - 12} PM` : `${hours} AM`;

      this.points.push({
        x,
        y,
        temp: hourlyTemps[i],
        rainProb: hourlyRain[i] || 0,
        timeLabel
      });
    }

    // 1. Draw Rain Probability Subtle Bars
    for (let pt of this.points) {
      if (pt.rainProb > 0) {
        const barHeight = (pt.rainProb / 100) * (drawH * 0.5);
        ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
        ctx.fillRect(pt.x - 4, padTop + drawH - barHeight, 8, barHeight);
      }
    }

    // 2. Draw Smooth Bezier Gradient Curve
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 0; i < this.points.length - 1; i++) {
      const p0 = this.points[i];
      const p1 = this.points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);
    }

    // Area Fill
    const gradient = ctx.createLinearGradient(0, padTop, 0, height);
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.35)");
    gradient.addColorStop(1, "rgba(56, 189, 248, 0.0)");

    ctx.lineTo(this.points[this.points.length - 1].x, height);
    ctx.lineTo(this.points[0].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 3. Curve Stroke
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 0; i < this.points.length - 1; i++) {
      const p0 = this.points[i];
      const p1 = this.points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);
    }
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. Active Crosshair if hovering
    if (activePoint) {
      ctx.beginPath();
      ctx.moveTo(activePoint.x, padTop);
      ctx.lineTo(activePoint.x, height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight orb
      ctx.beginPath();
      ctx.arc(activePoint.x, activePoint.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }
}

// -------------------------------------------------------------
// 7. BACKGROUND WEATHER PARTICLES CANVAS
// -------------------------------------------------------------
class WeatherParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mode = "stars"; // 'rain', 'snow', 'stars'
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  setMode(theme) {
    if (theme.includes("rain") || theme.includes("storm")) {
      this.mode = "rain";
    } else if (theme.includes("snow")) {
      this.mode = "snow";
    } else {
      this.mode = "stars";
    }
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    const count = this.mode === "rain" ? 80 : this.mode === "snow" ? 60 : 45;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        len: Math.random() * 15 + 10,
        speed: Math.random() * 6 + 3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.mode === "rain") {
      this.ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      this.ctx.lineWidth = 1.5;
      for (let p of this.particles) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - 2, p.y + p.len);
        this.ctx.stroke();

        p.y += p.speed * 2;
        p.x -= 1;
        if (p.y > this.height) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }
      }
    } else if (this.mode === "snow") {
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      for (let p of this.particles) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        p.y += p.speed * 0.4;
        p.x += Math.sin(p.y * 0.02) * 0.5;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      }
    } else {
      // Twinkling stars / dust
      for (let p of this.particles) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        p.y -= 0.15;
        if (p.y < 0) p.y = this.height;
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

// -------------------------------------------------------------
// 8. UNIT CONVERSION HELPERS
// -------------------------------------------------------------
function convertTemp(celsius) {
  if (state.unit === "imperial") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function formatTemp(celsius) {
  return `${convertTemp(celsius)}°`;
}

function convertSpeed(kmh) {
  if (state.unit === "imperial") {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

function getCardinalDirection(deg) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

// -------------------------------------------------------------
// 9. UI RENDERING ORCHESTRATOR
// -------------------------------------------------------------
let chartInstance = null;
let particleInstance = null;

async function loadWeather(lat, lon, cityName, countryName) {
  state.lat = lat;
  state.lon = lon;
  state.city = cityName || state.city;
  state.country = countryName || state.country;

  document.getElementById("currentCity").innerText = `${state.city}`;
  document.getElementById("currentDate").innerText = `Connecting to Open-Meteo satellites...`;

  const data = await WeatherService.fetchWeather(lat, lon);
  state.weatherData = data;

  renderDashboard(data);
}

function renderDashboard(data) {
  const current = data.current;
  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);

  // 1. Update Body Theme and Particles
  document.body.className = weatherInfo.activeTheme;
  if (particleInstance) {
    particleInstance.setMode(weatherInfo.activeTheme);
  }

  // 2. City Header & Subtitle
  const now = new Date();
  const options = { weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  document.getElementById("currentCity").innerText = `${state.city}, ${state.country}`;
  document.getElementById("currentDate").innerText = now.toLocaleDateString("en-US", options);

  // 3. Hero Card
  document.getElementById("currentTemp").innerText = convertTemp(current.temperature_2m);
  document.getElementById("weatherCondition").innerText = weatherInfo.label;
  document.getElementById("mainWeatherIcon").innerHTML = getSvgIcon(weatherInfo.icon, 74);

  const dailyMax = data.daily.temperature_2m_max[0];
  const dailyMin = data.daily.temperature_2m_min[0];
  document.getElementById("tempRange").innerHTML = `H: ${formatTemp(dailyMax)} &bull; L: ${formatTemp(dailyMin)}`;
  document.getElementById("feelsLike").innerText = `Feels like ${formatTemp(current.apparent_temperature)}`;

  // 4. Smart Copilot Advisory
  const advice = SmartAdvisor.generateAdvice(current, data.hourly, data.daily);
  document.getElementById("copilotText").innerText = advice;

  // 5. Render Hourly Canvas Chart
  if (chartInstance) {
    chartInstance.render();
  }

  // 6. Hourly Mini Slider
  renderHourlySlider(data.hourly);

  // 7. 7-Day Forecast
  renderWeeklyForecast(data.daily);

  // 8. Bento Metrics
  renderBentoMetrics(current, data.daily);
}

function renderHourlySlider(hourly) {
  const listEl = document.getElementById("hourlyForecastList");
  listEl.innerHTML = "";

  // Show 12 hours
  for (let i = 0; i < 12; i++) {
    const timeStr = hourly.time[i];
    const temp = hourly.temperature_2m[i];
    const code = hourly.weather_code[i];
    const rain = hourly.precipitation_probability[i] || 0;

    const hourNum = new Date(timeStr).getHours();
    const label = i === 0 ? "Now" : hourNum === 0 ? "12 AM" : hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} AM`;
    const info = getWeatherInfo(code, 1);

    const col = document.createElement("div");
    col.className = `hourly-col ${i === 0 ? "active-now" : ""}`;
    col.innerHTML = `
      <span class="hourly-time">${label}</span>
      <div class="hourly-icon">${getSvgIcon(info.icon, 22)}</div>
      <span class="hourly-temp">${formatTemp(temp)}</span>
      <span class="hourly-rain">${rain > 0 ? `${rain}%` : ""}</span>
    `;
    listEl.appendChild(col);
  }
}

function renderWeeklyForecast(daily) {
  const listEl = document.getElementById("weeklyForecastList");
  listEl.innerHTML = "";

  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const spread = allMax - allMin || 1;

  for (let i = 0; i < daily.time.length; i++) {
    const dateObj = new Date(daily.time[i]);
    const dayName = i === 0 ? "Today" : dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const code = daily.weather_code[i];
    const info = getWeatherInfo(code, 1);
    const min = daily.temperature_2m_min[i];
    const max = daily.temperature_2m_max[i];

    // Bar percentages for temperature range visualization
    const leftPct = ((min - allMin) / spread) * 100;
    const widthPct = Math.max(((max - min) / spread) * 100, 15);

    const row = document.createElement("div");
    row.className = "weekly-row";
    row.innerHTML = `
      <span class="weekly-day">${dayName}</span>
      <div class="weekly-icon-group">
        <div class="weekly-icon">${getSvgIcon(info.icon, 20)}</div>
        <span class="weekly-precip">${info.label.split(" ")[0]}</span>
      </div>
      <div class="weekly-bar-container">
        <span class="weekly-min">${formatTemp(min)}</span>
        <div class="temp-bar-bg">
          <div class="temp-bar-inner" style="margin-left: ${leftPct}%; width: ${widthPct}%;"></div>
        </div>
        <span class="weekly-max">${formatTemp(max)}</span>
      </div>
    `;
    listEl.appendChild(row);
  }
}

function renderBentoMetrics(current, daily) {
  // Wind & Compass
  document.getElementById("windSpeed").innerText = convertSpeed(current.wind_speed_10m);
  const cardinal = getCardinalDirection(current.wind_direction_10m);
  document.getElementById("windDirection").innerText = `${cardinal} (${current.wind_direction_10m}°)`;
  document.getElementById("compassNeedle").style.transform = `rotate(${current.wind_direction_10m}deg)`;

  // UV Index
  const uv = current.uv_index || 0;
  document.getElementById("uvIndex").innerText = uv.toFixed(1);
  const uvBar = Math.min((uv / 11) * 100, 100);
  document.getElementById("uvBarFill").style.width = `${uvBar}%`;

  let uvText = "Low exposure";
  if (uv >= 8) uvText = "Very High - Extreme risk";
  else if (uv >= 6) uvText = "High - Protection needed";
  else if (uv >= 3) uvText = "Moderate exposure";
  document.getElementById("uvDescription").innerText = uvText;

  // Humidity & Dew Point
  document.getElementById("humidity").innerText = `${current.relative_humidity_2m}%`;
  // Simple Dew Point approximation formula
  const t = current.temperature_2m;
  const rh = current.relative_humidity_2m;
  const dewPoint = Math.round(t - ((100 - rh) / 5));
  document.getElementById("dewPoint").innerText = `Dew point is ${formatTemp(dewPoint)}`;

  // Sunrise / Sunset & Solar Arc
  if (daily.sunrise && daily.sunrise[0]) {
    const sunriseDate = new Date(daily.sunrise[0]);
    const sunsetDate = new Date(daily.sunset[0]);
    document.getElementById("sunriseTime").innerText = sunriseDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    document.getElementById("sunsetTime").innerText = sunsetDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Calculate daytime progress for sun orb position
    const nowMs = Date.now();
    const riseMs = sunriseDate.getTime();
    const setMs = sunsetDate.getTime();
    let sunProgress = (nowMs - riseMs) / (setMs - riseMs);
    sunProgress = Math.max(0, Math.min(1, sunProgress));

    // Calculate position along semi-ellipse arc
    const arcX = 20 + sunProgress * 160;
    const arcY = 70 - Math.sin(sunProgress * Math.PI) * 45;
    const sunOrb = document.getElementById("sunOrb");
    if (sunOrb) {
      sunOrb.setAttribute("cx", arcX);
      sunOrb.setAttribute("cy", arcY);
    }
  }

  // Pressure & Cloud Cover
  document.getElementById("pressure").innerText = `${Math.round(current.pressure_msl)} hPa`;
  document.getElementById("precipAmount").innerText = `${current.precipitation.toFixed(1)} mm`;
  document.getElementById("cloudCover").innerText = `Cloud Cover: ${current.cloud_cover}%`;
}

// -------------------------------------------------------------
// 10. SETUP EVENT LISTENERS (Search, Geolocation, Unit Switch)
// -------------------------------------------------------------
function setupEventListeners() {
  const cityInput = document.getElementById("cityInput");
  const searchResults = document.getElementById("searchResults");
  const geoBtn = document.getElementById("geoBtn");
  const unitToggle = document.getElementById("unitToggle");
  const quickChips = document.getElementById("quickChips");

  // Search input debouncer
  let debounceTimeout = null;
  cityInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimeout);
    const query = e.target.value;
    if (query.length < 2) {
      searchResults.classList.add("hidden");
      return;
    }
    debounceTimeout = setTimeout(async () => {
      const results = await WeatherService.searchCity(query);
      if (results.length === 0) {
        searchResults.classList.add("hidden");
        return;
      }
      searchResults.innerHTML = "";
      results.forEach(res => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = `
          <span class="dropdown-city">${res.name}</span>
          <span class="dropdown-country">${res.admin1 ? `${res.admin1}, ` : ""}${res.country || ""}</span>
        `;
        item.addEventListener("click", () => {
          searchResults.classList.add("hidden");
          cityInput.value = "";
          // Remove active state from chips
          document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
          loadWeather(res.latitude, res.longitude, res.name, res.country || "");
        });
        searchResults.appendChild(item);
      });
      searchResults.classList.remove("hidden");
    }, 300);
  });

  // Close search dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      searchResults.classList.add("hidden");
    }
  });

  // Geolocation button
  geoBtn.addEventListener("click", () => {
    if ("geolocation" in navigator) {
      geoBtn.classList.add("spinning");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          geoBtn.classList.remove("spinning");
          const { latitude, longitude } = position.coords;
          document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
          loadWeather(latitude, longitude, "My Location", "GPS");
        },
        (error) => {
          geoBtn.classList.remove("spinning");
          alert("Location access denied or unavailable. You can search any city in the search bar!");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  // Unit switch (°C vs °F)
  unitToggle.addEventListener("click", (e) => {
    if (!e.target.classList.contains("unit-btn")) return;
    document.querySelectorAll(".unit-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    state.unit = e.target.dataset.unit;
    if (state.weatherData) {
      renderDashboard(state.weatherData);
    }
  });

  // Quick chips
  const CITY_COORDS = {
    "London": { lat: 51.5074, lon: -0.1278, country: "United Kingdom" },
    "New York": { lat: 40.7128, lon: -74.0060, country: "United States" },
    "Tokyo": { lat: 35.6762, lon: 139.6503, country: "Japan" },
    "Paris": { lat: 48.8566, lon: 2.3522, country: "France" },
    "San Francisco": { lat: 37.7749, lon: -122.4194, country: "United States" },
    "Mumbai": { lat: 19.0760, lon: 72.8777, country: "India" },
    "Dubai": { lat: 25.2048, lon: 55.2708, country: "United Arab Emirates" }
  };

  quickChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const cityName = chip.dataset.city;
    const coords = CITY_COORDS[cityName];
    if (coords) {
      loadWeather(coords.lat, coords.lon, cityName, coords.country);
    }
  });
}

// Initialize app
window.addEventListener("DOMContentLoaded", () => {
  console.log(
    "%c AeroPulse %c Crafted by Saurbh Virkar %c https://github.com/nesvv/aeropulse-weather ",
    "background:#0284c7;color:#fff;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px;",
    "background:#1e293b;color:#38bdf8;font-weight:600;padding:4px 8px;",
    "background:#0f172a;color:#94a3b8;padding:4px 8px;border-radius:0 4px 4px 0;"
  );

  chartInstance = new CanvasChartRenderer("hourlyCanvas");
  particleInstance = new WeatherParticles("weatherParticleCanvas");
  setupEventListeners();

  // Default initial load: London
  loadWeather(51.5074, -0.1278, "London", "United Kingdom");
});
