/**
 * <chart-card> Custom Element (shadcn chart-area-interactive)
 * Handles lazy loading of vendored Chart.js, token color resolution (OKLCH -> RGB),
 * theme change reactivity, and time range switching.
 */

import { loadScript, readJSONIsland } from '../core/dom.js';

let colorCanvas = null;
let colorCtx = null;

/**
 * Resolves any CSS color token (including oklch(...)) to canvas-safe rgba() string.
 */
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
  colorCtx.fillStyle = raw;
  colorCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
  const finalAlpha = (a / 255) * alpha;
  return `rgba(${r}, ${g}, ${b}, ${finalAlpha.toFixed(3)})`;
}

export class ChartCard extends HTMLElement {
  connectedCallback() {
    this.canvas = this.querySelector('canvas');
    this.loadingEl = this.querySelector('.chart-loading');
    this.scriptSrc = this.getAttribute('data-chartjs-src') || '/static/vendor/chart.umd.min.js';
    this.chart = null;

    this.initChart();
    this.bindRangeButtons();

    this.themeHandler = () => this.handleThemeChange();
    document.addEventListener('ui:theme-changed', this.themeHandler);
  }

  disconnectedCallback() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    document.removeEventListener('ui:theme-changed', this.themeHandler);
  }

  async initChart() {
    try {
      if (!window.Chart) {
        await loadScript(this.scriptSrc);
      }
      this.render();
      if (this.loadingEl) this.loadingEl.style.display = 'none';
    } catch (err) {
      console.error('[web-dashboard] Could not load Chart.js:', err);
      if (this.loadingEl) {
        this.loadingEl.textContent = 'Chart library unavailable.';
      }
    }
  }

  getDatasetPayload() {
    const dataIslandId = this.getAttribute('data-island');
    if (dataIslandId) {
      const parsed = readJSONIsland(dataIslandId);
      if (parsed) return parsed;
    }

    // Default sample data matching shadcn dashboard-01 area chart
    return {
      labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5'],
      ranges: {
        '90d': [120, 190, 150, 280, 220, 310, 340, 290, 410, 480],
        '30d': [280, 295, 310, 320, 340, 330, 390, 410, 450, 480],
        '7d': [390, 400, 410, 425, 440, 460, 480],
      },
    };
  }

  render(range = '90d') {
    if (!this.canvas || !window.Chart) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const payload = this.getDatasetPayload();
    const values = (payload.ranges && payload.ranges[range]) || payload.ranges['90d'];
    const labels = payload.labels.slice(payload.labels.length - values.length);

    const primaryColor = resolveTokenColor('--chart-1');
    const primaryFill = resolveTokenColor('--chart-1', 0.15);
    const borderColor = resolveTokenColor('--border');
    const mutedColor = resolveTokenColor('--muted-foreground');
    const popoverBg = resolveTokenColor('--popover');
    const popoverFg = resolveTokenColor('--popover-foreground');

    const ctx = this.canvas.getContext('2d');

    // Gradient fill under the area curve
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, primaryFill);
    gradient.addColorStop(1, resolveTokenColor('--chart-1', 0.0));

    this.chart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Visitors',
            data: values,
            fill: true,
            backgroundColor: gradient,
            borderColor: primaryColor,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: primaryColor,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: popoverBg,
            titleColor: popoverFg,
            bodyColor: popoverFg,
            borderColor: borderColor,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: mutedColor, font: { size: 11 } },
          },
          y: {
            grid: { color: borderColor, drawBorder: false },
            ticks: { color: mutedColor, font: { size: 11 }, maxTicksLimit: 5 },
          },
        },
      },
    });
  }

  bindRangeButtons() {
    const buttons = this.querySelectorAll('.chart-range-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.setAttribute('aria-checked', 'false');
          b.classList.remove('active');
        });
        btn.setAttribute('aria-checked', 'true');
        btn.classList.add('active');
        const range = btn.dataset.range || '90d';
        this.render(range);
      });
    });
  }

  handleThemeChange() {
    if (this.chart) {
      const activeBtn = this.querySelector('.chart-range-btn.active, .chart-range-btn[aria-checked="true"]');
      const range = (activeBtn && activeBtn.dataset.range) || '90d';
      this.render(range);
    }
  }
}

if (!customElements.get('chart-card')) {
  customElements.define('chart-card', ChartCard);
}
