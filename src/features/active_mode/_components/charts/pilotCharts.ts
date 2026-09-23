import {
  accuracyOverTime,
  checkOutcomes,
  cumulativeDamage,
  damageByType,
  damagePerRound,
  dealtVsTaken,
  eventTimeline,
  heatCurve,
  heatSources,
  rankedBag,
} from '@/classes/components/combat/log/charts'
import { DAMAGE_ORDER } from './chartBase'
import { baseOptions, cartesianScales, countTicks, MARKS } from './chartBase'
import type { IChartTheme } from './chartBase'
import type { IChartRecord } from '@/classes/components/combat/log/charts'
import type { ILogStream } from '@/classes/components/combat/log/events'
import type { IEncounterRollup } from '@/classes/components/combat/log/telemetry'

interface IChartSpec {
  id: string
  title: string
  subtitle?: string
  type: 'bar' | 'line' | 'doughnut' | 'bubble'
  data: any
  options: any
  table: Record<string, string | number>[]
  height?: number
}

type T = (key: string, params?: Record<string, unknown>) => string

const bar = (color: string, surface: string, extra: Record<string, any> = {}) => ({
  backgroundColor: color,
  borderColor: surface,
  borderWidth: MARKS.segmentGap,
  borderRadius: MARKS.barRadius,
  borderSkipped: false,
  maxBarThickness: MARKS.barThickness,
  ...extra,
})

const stacked = (color: string, surface: string, horizontal = false) =>
  bar(color, surface, {
    borderWidth: horizontal ? { left: MARKS.segmentGap } : { top: MARKS.segmentGap },
  })

const line = (color: string, extra: Record<string, any> = {}) => ({
  borderColor: color,
  backgroundColor: color,
  borderWidth: MARKS.lineWidth,
  pointRadius: MARKS.pointRadius,
  pointHoverRadius: MARKS.pointHoverRadius,
  tension: 0.25,
  ...extra,
})

function pilotCharts(
  theme: IChartTheme,
  t: T,
  rollup: IEncounterRollup,
  records: IChartRecord[],
  stream?: ILogStream,
  actorId?: string
): IChartSpec[] {
  const p = theme.palette
  const unnamed = t('pm.logbook.unnamed')
  const out: IChartSpec[] = []

  // P1 - damage dealt by type
  const byType = damageByType(rollup, 'dealt', DAMAGE_ORDER)
  out.push({
    id: 'P1',
    title: t('active.charts.damageDealtByType'),
    subtitle: t('active.charts.damageDealtByTypeSub'),
    type: 'doughnut',
    data: {
      labels: byType.map(s => s.label),
      datasets: [
        {
          data: byType.map(s => s.value),
          backgroundColor: byType.map(s => p.damage(s.key)),
          borderColor: theme.surface,
          borderWidth: MARKS.segmentGap,
        },
      ],
    },
    options: baseOptions(theme, { cutout: '58%' }),
    table: byType.map(s => ({
      [t('active.charts.colType')]: s.label,
      [t('active.charts.colDamage')]: s.value,
    })),
  })

  const dvt = dealtVsTaken(records, unnamed)
  out.push({
    id: 'P2',
    title: t('active.charts.dealtAndTakenPerEncounter'),
    type: 'bar',
    data: {
      labels: dvt.labels,
      datasets: [
        {
          label: t('active.charts.dealt'),
          data: dvt.series[0].data,
          ...bar(p.positive, theme.surface),
        },
        {
          label: t('active.charts.taken'),
          data: dvt.series[1].data,
          ...bar(p.negative, theme.surface),
        },
      ],
    },
    options: baseOptions(theme, { scales: cartesianScales(theme) }),
    table: dvt.labels.map((label, i) => ({
      [t('active.charts.colEncounter')]: label,
      [t('active.charts.dealt')]: dvt.series[0].data[i],
      [t('active.charts.taken')]: dvt.series[1].data[i],
    })),
  })

  const cumulative = cumulativeDamage(records, unnamed)
  out.push({
    id: 'P3',
    title: t('active.charts.careerDamage'),
    type: 'line',
    data: {
      labels: cumulative.labels,
      datasets: [
        {
          label: t('active.charts.cumulative'),
          data: cumulative.series[0].data,
          ...line(p.series(0), { fill: true, backgroundColor: `${p.series(0)}22` }),
        },
      ],
    },
    options: baseOptions(theme, {
      scales: cartesianScales(theme),
      plugins: { legend: { display: false } },
    }),
    table: cumulative.labels.map((label, i) => ({
      [t('active.charts.colEncounter')]: label,
      [t('active.charts.cumulative')]: cumulative.series[0].data[i],
    })),
  })

  const acc = accuracyOverTime(records, unnamed)
  out.push({
    id: 'P4',
    title: t('active.charts.accuracyOverTime'),
    subtitle: t('active.charts.accuracyOverTimeSub', { n: Math.round(acc.average) }),
    type: 'line',
    data: {
      labels: acc.labels,
      datasets: [
        {
          label: t('common.accuracy'),
          data: acc.series[0].data,
          spanGaps: true,
          ...line(p.series(0)),
        },
      ],
    },
    options: baseOptions(theme, {
      scales: cartesianScales(theme, {
        y: { max: 100, ticks: { color: theme.muted, callback: (v: number) => `${v}%` } },
      }),
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: {
            average: {
              type: 'line',
              yMin: acc.average,
              yMax: acc.average,
              borderColor: theme.muted,
              borderWidth: 1,
              borderDash: [4, 4],
              label: {
                display: true,
                content: t('active.charts.careerAverage'),
                position: 'end',
                color: theme.muted,
                backgroundColor: 'transparent',
                font: { size: 10 },
              },
            },
          },
        },
      },
    }),
    table: acc.labels.map((label, i) => ({
      [t('active.charts.colEncounter')]: label,
      [t('common.accuracy')]: Number.isNaN(acc.series[0].data[i])
        ? '-'
        : `${Math.round(acc.series[0].data[i])}%`,
    })),
  })

  const checks = checkOutcomes(rollup)
  out.push({
    id: 'P5',
    title: t('active.charts.savesAndChecks'),
    type: 'bar',
    data: {
      labels: [t('active.charts.saves'), t('active.charts.checks')],
      datasets: [
        {
          label: t('active.charts.passed'),
          data: checks.series[0].data,
          ...stacked(p.positive, theme.surface, true),
        },
        {
          label: t('active.charts.failed'),
          data: checks.series[1].data,
          ...stacked(p.negative, theme.surface, true),
        },
      ],
    },
    options: baseOptions(theme, {
      indexAxis: 'y',
      scales: {
        x: { ...cartesianScales(theme).y, stacked: true, ticks: countTicks(theme) },
        y: { ...cartesianScales(theme).x, stacked: true },
      },
    }),
    height: 180,
    table: [
      {
        [t('active.charts.colKind')]: t('active.charts.saves'),
        [t('active.charts.passed')]: checks.series[0].data[0],
        [t('active.charts.failed')]: checks.series[1].data[0],
      },
      {
        [t('active.charts.colKind')]: t('active.charts.checks'),
        [t('active.charts.passed')]: checks.series[0].data[1],
        [t('active.charts.failed')]: checks.series[1].data[1],
      },
    ],
  })

  const heat = heatSources(records, unnamed)
  out.push({
    id: 'P6',
    title: t('active.charts.heatPerEncounter'),
    subtitle: t('active.charts.heatPerEncounterSub'),
    type: 'bar',
    data: {
      labels: heat.labels,
      datasets: [
        {
          label: t('active.charts.overchargeHeat'),
          data: heat.series[0].data,
          ...stacked(p.damage('heat'), theme.surface),
        },
        {
          label: t('active.charts.otherHeat'),
          data: heat.series[1].data,
          ...stacked(p.damage('kinetic'), theme.surface),
        },
      ],
    },
    options: baseOptions(theme, {
      scales: {
        x: { ...cartesianScales(theme).x, stacked: true },
        y: { ...cartesianScales(theme).y, stacked: true },
      },
    }),
    table: heat.labels.map((label, i) => ({
      [t('active.charts.colEncounter')]: label,
      [t('active.charts.overchargeHeat')]: heat.series[0].data[i],
      [t('active.charts.otherHeat')]: heat.series[1].data[i],
    })),
  })

  for (const [id, which, title] of [
    ['P7', 'actions', t('active.charts.mostUsedActions')],
    ['P8', 'statuses', t('active.charts.statusesSuffered')],
  ] as const) {
    const ranked = rankedBag(rollup, which)
    out.push({
      id,
      title,
      type: 'bar',
      data: {
        labels: ranked.map(s => s.label),
        datasets: [
          {
            label: t('active.charts.count'),
            data: ranked.map(s => s.value),
            ...bar(p.series(which === 'actions' ? 0 : 4), theme.surface),
          },
        ],
      },
      options: baseOptions(theme, {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ...cartesianScales(theme).y, ticks: countTicks(theme) },
          y: { ...cartesianScales(theme).x, ticks: { color: theme.muted, font: { size: 11 } } },
        },
      }),
      height: Math.max(180, ranked.length * 28 + 40),
      table: ranked.map(s => ({
        [t('common.name')]: s.label,
        [t('active.charts.count')]: s.value,
      })),
    })
  }

  if (!stream || !actorId) return out

  const perRound = damagePerRound(stream, actorId)
  out.push({
    id: 'P9',
    title: t('active.charts.damagePerRound'),
    type: 'line',
    data: {
      labels: perRound.labels,
      datasets: [
        { label: t('active.charts.taken'), data: perRound.series[0].data, ...line(p.negative) },
        { label: t('active.charts.dealt'), data: perRound.series[1].data, ...line(p.positive) },
      ],
    },
    options: baseOptions(theme, {
      scales: cartesianScales(theme, {
        x: { title: { display: true, text: t('active.charts.round'), color: theme.muted } },
      }),
    }),
    table: perRound.labels.map((label, i) => ({
      [t('active.charts.round')]: label,
      [t('active.charts.taken')]: perRound.series[0].data[i],
      [t('active.charts.dealt')]: perRound.series[1].data[i],
    })),
  })

  const curve = heatCurve(stream, actorId)
  const dangerFrom = curve.cap ? curve.cap / 2 : 0
  out.push({
    id: 'P10',
    title: t('active.charts.heatCurve'),
    subtitle: curve.cap ? t('active.charts.heatCurveSub', { n: curve.cap }) : undefined,
    type: 'line',
    data: {
      labels: curve.labels,
      datasets: [
        {
          label: t('active.charts.heat'),
          data: curve.series[0].data,
          stepped: true,
          ...line(p.damage('heat'), { tension: 0 }),
        },
      ],
    },
    options: baseOptions(theme, {
      scales: cartesianScales(theme, {
        x: { title: { display: true, text: t('active.charts.round'), color: theme.muted } },
        y: curve.cap ? { max: curve.cap } : {},
      }),
      plugins: {
        legend: { display: false },
        annotation: curve.cap
          ? {
              annotations: {
                dangerZone: {
                  type: 'box',
                  yMin: dangerFrom,
                  yMax: curve.cap,
                  backgroundColor: `${p.damage('burn')}1f`,
                  borderWidth: 0,
                  label: {
                    display: true,
                    content: t('active.charts.dangerZone'),
                    position: { x: 'start', y: 'start' },
                    color: theme.muted,
                    backgroundColor: 'transparent',
                    font: { size: 10 },
                  },
                },
              },
            }
          : {},
      },
    }),
    table: curve.labels.map((label, i) => ({
      [t('active.charts.round')]: label,
      [t('active.charts.heat')]: curve.series[0].data[i],
    })),
  })

  const timeline = eventTimeline(stream, actorId)
  out.push({
    id: 'P11',
    title: t('active.charts.encounterTimeline'),
    subtitle: t('active.charts.encounterTimelineSub'),
    type: 'bar',
    data: {
      labels: timeline.labels,
      datasets: timeline.series.map((s, i) => ({
        label: s.label,
        data: s.data,
        ...stacked(p.series(i), theme.surface),
      })),
    },
    options: baseOptions(theme, {
      scales: {
        x: {
          ...cartesianScales(theme).x,
          stacked: true,
          title: { display: true, text: t('active.charts.round'), color: theme.muted },
        },
        y: { ...cartesianScales(theme).y, stacked: true, ticks: countTicks(theme) },
      },
    }),
    table: timeline.labels.map((label, i) => ({
      [t('active.charts.round')]: label,
      ...Object.fromEntries(timeline.series.map(s => [s.label, s.data[i]])),
    })),
  })

  return out
}

export { pilotCharts, bar, stacked, line }
export type { IChartSpec, T }
