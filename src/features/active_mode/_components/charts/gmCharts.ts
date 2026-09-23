import {
  attackMix,
  damageBySide,
  damageShare,
  lethalityPerAppearance,
  roundHistogram,
  threatScatter,
} from '@/classes/components/combat/log/charts'
import { baseOptions, cartesianScales, countTicks, MARKS } from './chartBase'
import { bar, stacked, line } from './pilotCharts'
import type { IChartSpec, T } from './pilotCharts'
import type { IChartTheme } from './chartBase'
import type { IActorGroup } from '@/classes/components/combat/log/grouping'
import type { ILogStream } from '@/classes/components/combat/log/events'

const SERIES_CAP = 8

const sideLabel = (t: T, side: string) =>
  ({
    ally: t('active.charts.sideAlly'),
    enemy: t('active.charts.sideEnemy'),
    neutral: t('active.charts.sideNeutral'),
  })[side] ?? t('common.unknown')

function gmCharts(
  theme: IChartTheme,
  t: T,
  groups: IActorGroup[],
  allGroups: IActorGroup[],
  streams: ILogStream[],
  focusStreams: ILogStream[] = []
): IChartSpec[] {
  const p = theme.palette
  const out: IChartSpec[] = []
  const top = groups.slice(0, SERIES_CAP)

  out.push({
    id: 'G1',
    title: t('active.charts.damageByGroup'),
    type: 'bar',
    data: {
      labels: top.map(g => g.label),
      datasets: [
        {
          label: t('active.charts.dealt'),
          data: top.map(g => g.rollup.totalDealt),
          ...bar(p.series(0), theme.surface),
        },
      ],
    },
    options: baseOptions(theme, {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: cartesianScales(theme).y, y: cartesianScales(theme).x },
    }),
    height: Math.max(200, top.length * 30 + 40),
    table: top.map(g => ({
      [t('active.charts.colGroup')]: g.label,
      [t('active.charts.dealt')]: g.rollup.totalDealt,
    })),
  })

  const points = threatScatter(top)
  const maxSize = Math.max(1, ...points.map(pt => pt.size ?? 1))
  out.push({
    id: 'G2',
    title: t('active.charts.threatVsDurability'),
    subtitle: t('active.charts.threatVsDurabilitySub'),
    type: 'bubble',
    data: {
      datasets: [
        {
          label: t('active.charts.colGroup'),
          data: points.map(pt => ({
            x: pt.x,
            y: pt.y,
            r: 6 + ((pt.size ?? 1) / maxSize) * 12,
            label: pt.label,
          })),
          backgroundColor: `${p.series(0)}cc`,
          borderColor: theme.surface,
          borderWidth: MARKS.segmentGap,
          hoverBorderColor: p.series(0),
        },
      ],
    },
    options: baseOptions(theme, {
      interaction: { mode: 'point', intersect: true },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) =>
              `${ctx.raw.label}: ${ctx.raw.x} ${t('active.charts.dealt')}, ${ctx.raw.y} ${t('active.charts.taken')}`,
          },
        },
      },
      scales: cartesianScales(theme, {
        x: {
          type: 'linear',
          beginAtZero: true,
          grid: { color: theme.grid, drawTicks: false },
          border: { display: false },
          ticks: { color: theme.muted, font: { size: 11 } },
          title: { display: true, text: t('active.charts.dealt'), color: theme.muted },
        },
        y: { title: { display: true, text: t('active.charts.taken'), color: theme.muted } },
      }),
    }),
    height: 300,
    table: points.map(pt => ({
      [t('active.charts.colGroup')]: pt.label,
      [t('active.charts.dealt')]: pt.x,
      [t('active.charts.taken')]: pt.y,
      [t('active.charts.appearances')]: pt.size ?? 0,
    })),
  })

  const lethality = lethalityPerAppearance(top)
  out.push({
    id: 'G3',
    title: t('active.charts.lethalityPerAppearance'),
    subtitle: t('active.charts.lethalityPerAppearanceSub'),
    type: 'bar',
    data: {
      labels: lethality.map(s => s.label),
      datasets: [
        {
          label: t('active.charts.killsPer'),
          data: lethality.map(s => Number(s.value.toFixed(2))),
          ...bar(p.negative, theme.surface),
        },
      ],
    },
    options: baseOptions(theme, {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: cartesianScales(theme).y, y: cartesianScales(theme).x },
    }),
    height: Math.max(200, lethality.length * 30 + 40),
    table: lethality.map(s => ({
      [t('active.charts.colGroup')]: s.label,
      [t('active.charts.killsPer')]: s.value.toFixed(2),
    })),
  })

  const classes = allGroups.filter(g => g.by === 'class').slice(0, SERIES_CAP)
  const templates = allGroups.filter(g => g.by === 'template').slice(0, SERIES_CAP)
  const g4 = [...classes, ...templates]
  out.push({
    id: 'G4',
    title: t('active.charts.classVsTemplate'),
    subtitle: t('active.charts.classVsTemplateSub'),
    type: 'bar',
    data: {
      labels: g4.map(g => g.label),
      datasets: [
        {
          label: t('active.charts.dealtPer'),
          data: g4.map(g => (g.encounters ? +(g.rollup.totalDealt / g.encounters).toFixed(1) : 0)),
          backgroundColor: g4.map(g => (g.by === 'class' ? p.series(0) : p.series(1))),
          borderRadius: MARKS.barRadius,
          borderSkipped: false,
          maxBarThickness: MARKS.barThickness,
        },
      ],
    },
    options: baseOptions(theme, {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: cartesianScales(theme).y, y: cartesianScales(theme).x },
    }),
    height: Math.max(200, g4.length * 30 + 40),
    table: g4.map(g => ({
      [t('active.charts.colGroup')]: g.label,
      [t('active.charts.colKind')]:
        g.by === 'class' ? t('active.gmTelemetry.byClass') : t('active.gmTelemetry.byTemplate'),
      [t('active.charts.dealtPer')]: g.encounters
        ? (g.rollup.totalDealt / g.encounters).toFixed(1)
        : 0,
    })),
  })

  const hist = roundHistogram(streams.map(s => ({ rounds: s.rounds })))
  out.push({
    id: 'G5',
    title: t('active.charts.encounterLength'),
    type: 'bar',
    data: {
      labels: hist.map(h => h.label),
      datasets: [
        {
          label: t('common.encounters'),
          data: hist.map(h => h.value),
          ...bar(p.series(2), theme.surface),
        },
      ],
    },
    options: baseOptions(theme, {
      plugins: { legend: { display: false } },
      scales: cartesianScales(theme, {
        x: { title: { display: true, text: t('active.charts.round'), color: theme.muted } },
        y: { ticks: countTicks(theme) },
      }),
    }),
    table: hist.map(h => ({
      [t('active.charts.round')]: h.label,
      [t('common.encounters')]: h.value,
    })),
  })

  const mix = attackMix(top)
  out.push({
    id: 'G7',
    title: t('active.charts.attackOutcomes'),
    type: 'bar',
    data: {
      labels: mix.labels,
      datasets: [
        {
          label: t('active.charts.crit'),
          data: mix.series[0].data,
          ...stacked(p.series(4), theme.surface, true),
        },
        {
          label: t('active.charts.hit'),
          data: mix.series[1].data,
          ...stacked(p.positive, theme.surface, true),
        },
        {
          label: t('active.charts.miss'),
          data: mix.series[2].data,
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
    height: Math.max(200, mix.labels.length * 34 + 60),
    table: mix.labels.map((label, i) => ({
      [t('active.charts.colGroup')]: label,
      [t('active.charts.crit')]: mix.series[0].data[i],
      [t('active.charts.hit')]: mix.series[1].data[i],
      [t('active.charts.miss')]: mix.series[2].data[i],
    })),
  })

  for (const focus of focusStreams) out.push(...encounterCharts(theme, t, focus))

  return out
}

function encounterCharts(theme: IChartTheme, t: T, focus: ILogStream): IChartSpec[] {
  const p = theme.palette
  const out: IChartSpec[] = []
  const share = damageShare(focus)
  out.push({
    id: `G6:${focus.encounterId}`,
    title: t('active.charts.partyDamageShare'),
    subtitle: focus.encounterName,
    type: 'doughnut',
    data: {
      labels: share.map(s => s.label),
      datasets: [
        {
          data: share.map(s => s.value),
          backgroundColor: share.map((_, i) => p.series(i)),
          borderColor: theme.surface,
          borderWidth: MARKS.segmentGap,
        },
      ],
    },
    options: baseOptions(theme, { cutout: '58%' }),
    table: share.map(s => ({
      [t('common.name')]: s.label,
      [t('active.charts.dealt')]: s.value,
    })),
  })

  const sides = damageBySide(focus)
  out.push({
    id: `G8:${focus.encounterId}`,
    title: t('active.charts.damageBySide'),
    subtitle: focus.encounterName,
    type: 'line',
    data: {
      labels: sides.labels,
      datasets: sides.series.map(s => ({
        label: sideLabel(t, s.label),
        data: s.data,
        ...line(p.side(s.label)),
      })),
    },
    options: baseOptions(theme, {
      scales: cartesianScales(theme, {
        x: { title: { display: true, text: t('active.charts.round'), color: theme.muted } },
      }),
    }),
    table: sides.labels.map((label, i) => ({
      [t('active.charts.round')]: label,
      ...Object.fromEntries(sides.series.map(s => [sideLabel(t, s.label), s.data[i]])),
    })),
  })

  return out
}

export { gmCharts, encounterCharts }
