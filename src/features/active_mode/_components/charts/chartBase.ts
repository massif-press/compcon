import {
  Chart,
  ArcElement,
  BarElement,
  BarController,
  BubbleController,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { useTheme } from 'vuetify'
import { computed } from 'vue'

Chart.register(
  ArcElement,
  BarElement,
  BarController,
  BubbleController,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  annotationPlugin
)

const DAMAGE_ORDER = ['burn', 'energy', 'explosive', 'variable', 'heat', 'kinetic'] as const

const SERIES_ORDER = ['energy', 'explosive', 'variable', 'burn', 'heat', 'kinetic']

interface IChartPalette {
  categorical: string[]
  positive: string
  negative: string
  damage: (type: string) => string
  series: (index: number) => string
  side: (side: string) => string
}

function chartPalette(colors: Record<string, string>): IChartPalette {
  const damage = (type: string) => {
    const key = `damage--${type.toLowerCase().replace(/[\s_]+/g, '-')}`
    return colors[key] ?? colors['damage--variable']
  }
  const categorical = SERIES_ORDER.map(damage)
  return {
    categorical,
    positive: colors.success,
    negative: colors.error,
    damage,
    series: (index: number) => categorical[index % categorical.length],
    side: (side: string) => colors[side] ?? colors.neutral,
  }
}

const MARKS = {
  barRadius: 4,
  barThickness: 22,
  lineWidth: 2,
  pointRadius: 4,
  pointHoverRadius: 8,
  segmentGap: 2,
}

interface IChartTheme {
  palette: IChartPalette
  surface: string
  text: string
  muted: string
  grid: string
  isDark: boolean
}

function useChartTheme() {
  const theme = useTheme()

  return computed<IChartTheme>(() => {
    const current = theme.current.value
    const colors = current.colors
    const isDark = current.dark
    return {
      palette: chartPalette(colors),
      surface: colors.background,
      text: colors.text ?? colors['on-surface'],
      muted: colors.subtle ?? colors['light-text'] ?? colors.text,
      grid: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)',
      isDark,
    }
  })
}

function baseOptions(t: IChartTheme, over: Record<string, any> = {}): Record<string, any> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    layout: { padding: { top: 4, right: 8, bottom: 0, left: 0 } },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: t.muted,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: 'rectRounded',
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: t.isDark ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.96)',
        titleColor: t.text,
        bodyColor: t.text,
        borderColor: t.grid,
        borderWidth: 1,
        padding: 8,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
      },
      ...(over.plugins ?? {}),
    },
    ...Object.fromEntries(Object.entries(over).filter(([k]) => k !== 'plugins')),
  }
}

const countTicks = (t: IChartTheme) => ({
  color: t.muted,
  font: { size: 11 },
  padding: 6,
  precision: 0,
})

function cartesianScales(t: IChartTheme, over: Record<string, any> = {}): Record<string, any> {
  return {
    x: {
      grid: { display: false },
      border: { color: t.grid },
      ticks: { color: t.muted, font: { size: 11 }, maxRotation: 0, autoSkipPadding: 12 },
      ...(over.x ?? {}),
    },
    y: {
      beginAtZero: true,
      grid: { color: t.grid, drawTicks: false },
      border: { display: false },
      ticks: { color: t.muted, font: { size: 11 }, padding: 6 },
      ...(over.y ?? {}),
    },
  }
}

export {
  useChartTheme,
  chartPalette,
  baseOptions,
  cartesianScales,
  countTicks,
  MARKS,
  DAMAGE_ORDER,
}
export type { IChartTheme, IChartPalette }
