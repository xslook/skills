# Charts & Visualizations Specification

This guide specifies how to implement interactive analytical charts matching shadcn's `chart-area-interactive` block using vendored Chart.js and native CSS design tokens.

---

## 1. Zero-Node Vendoring Strategy

Rather than importing massive charting packages via npm or linking to third-party CDNs, Chart.js is:
1. Vendored locally into `static/vendor/chart.umd.min.js` using `scripts/vendor_chartjs.sh`.
2. Embedded directly into the Go/Rust binary.
3. **Lazy-loaded on demand**: The chart library is **not** included in the global `<head>`. Instead, `<chart-card>` downloads it via `loadScript()` only when a chart element is mounted on the page.

---

## 2. Resolving OKLCH Tokens for HTML5 Canvas

### 2.1 The Challenge
HTML5 `<canvas>` 2D contexts and Chart.js internally parse color strings and **cannot directly parse CSS OKLCH functions** (e.g., `oklch(0.646 0.222 41.116)`).

### 2.2 The OffscreenCanvas Solution
`js/components/chart-card.js` provides an efficient resolution helper using a 1x1 scratch canvas:

```javascript
let colorCanvas = null;
let colorCtx = null;

export function resolveTokenColor(varName, alpha = 1, el = document.documentElement) {
  if (!colorCanvas) {
    colorCanvas = document.createElement('canvas');
    colorCanvas.width = 1;
    colorCanvas.height = 1;
    colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });
  }

  const raw = getComputedStyle(el).getPropertyValue(varName).trim();
  if (!raw) return `rgba(0, 0, 0, ${alpha})`;

  colorCtx.clearRect(0, 0, 1, 1);
  colorCtx.fillStyle = raw; // Browser CSS engine evaluates OKLCH internally
  colorCtx.fillRect(0, 0, 1, 1);

  const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
  const finalAlpha = (a / 255) * alpha;
  return `rgba(${r}, ${g}, ${b}, ${finalAlpha.toFixed(3)})`;
}
```

This ensures that all chart series colors, tooltips, and gridlines strictly mirror the CSS design tokens (`--chart-1`, `--border`, `--popover`, `--muted-foreground`) across both light and dark modes.

---

## 3. `<chart-card>` Component Contract

### 3.1 HTML Markup Structure
```html
<chart-card class="chart-card" data-island="traffic-data-island" data-chartjs-src="/static/vendor/chart.umd.min.js">
  <div class="chart-header">
    <div>
      <h3 class="card-title">Interactive Traffic Overview</h3>
      <p class="card-description">Showing visitor engagement across timeframes</p>
    </div>

    <!-- Time Range Buttons -->
    <div class="chart-range-toggle" role="group" aria-label="Select timeframe">
      <button type="button" class="chart-range-btn active" data-range="90d" aria-checked="true">Last 3 months</button>
      <button type="button" class="chart-range-btn" data-range="30d" aria-checked="false">Last 30 days</button>
      <button type="button" class="chart-range-btn" data-range="7d" aria-checked="false">Last 7 days</button>
    </div>
  </div>

  <div class="chart-canvas-container">
    <div class="chart-loading">Rendering chart...</div>
    <canvas id="traffic-chart"></canvas>
  </div>
</chart-card>

<!-- JSON Data Island (Server Rendered) -->
<script type="application/json" id="traffic-data-island">
{
  "labels": ["Jan 1", "Jan 15", "Feb 1", "Feb 15", "Mar 1"],
  "ranges": {
    "90d": [120, 240, 190, 310, 480],
    "30d": [280, 310, 330, 410, 480],
    "7d": [420, 440, 460, 475, 480]
  }
}
</script>
```

---

## 4. Visual Styling Rules (Matching shadcn/ui)

1. **Area Gradient Fill**:
   - The fill must transition from an opacity of `0.15` at the top of the curve to `0.0` at the baseline.
2. **Clean Axes**:
   - The X-axis must hide vertical grid lines (`grid: { display: false }`).
   - The Y-axis should show clean, subtle horizontal borders matching `resolveTokenColor('--border')`.
3. **Floating Popover Tooltip**:
   - Tooltips should use the card/popover design tokens (`--popover`, `--popover-foreground`, `--border`) with a 6px corner radius.
4. **Theme Reactivity**:
   - When the user toggles dark/light theme, `<chart-card>` listens for the `ui:theme-changed` custom event, recalculates token colors, and immediately invokes `chart.update()`.

---

## 5. High-Frequency Real-Time Alternative: uPlot

When building telemetry monitors, real-time CPU/RAM meters, or streaming metrics that exceed **100,000 data points per second**:
- Chart.js can suffer performance overhead due to animation and canvas re-creation.
- **Recommended Alternative**: Vendor `uPlot.iife.min.js` (~35 KB) and `uPlot.min.css`.
- uPlot is 20–50x faster for massive time series streams while still accepting canvas RGB colors resolved via `resolveTokenColor()`.
