import { computed, type WritableComputedRef } from 'vue'
import { useDisplay } from 'vuetify'
import { UserStore } from '@/stores'

export type LabelMode = 'icon' | 'icon+text' | 'text'
export type Density = 'compact' | 'default' | 'comfortable'
export type TickbarMode = 'auto' | 'simple' | 'standard'

export type ActiveModeLayoutOptions = {
  labels: LabelMode
  density: Density
  tickbars: TickbarMode
  columns: boolean
  maxColumns: number
  coreStatsOnly: boolean
  showPortraits: boolean
  showFlavor: boolean
}

const LAYOUT_VIEW_KEY = 'activeModeLayout'

const CORE_STATS = [
  'hp',
  'overshield',
  'structure',
  'stress',
  'heatcap',
  'repairCapacity',
  'armor',
  'evasion',
  'edef',
  'saveTarget',
]

export const DEFAULTS: ActiveModeLayoutOptions = {
  labels: 'icon',
  density: 'default',
  tickbars: 'auto',
  columns: false,
  maxColumns: 1,
  coreStatsOnly: false,
  showPortraits: true,
  showFlavor: true,
}

const DENSITY: Record<
  Density,
  {
    btnSize: string
    iconSize: string | number
    tile: [number, number]
    tileIcon: [number, number]
    pad: [number, number]
  }
> = {
  compact: { btnSize: 'x-small', iconSize: 18, tile: [30, 40], tileIcon: [24, 20], pad: [1, 1] },
  default: {
    btnSize: 'small',
    iconSize: 'x-large',
    tile: [48, 58],
    tileIcon: [36, 28],
    pad: [2, 1],
  },
  comfortable: {
    btnSize: 'default',
    iconSize: 48,
    tile: [60, 74],
    tileIcon: [44, 34],
    pad: [4, 3],
  },
}

export const PRESETS: Record<string, Partial<ActiveModeLayoutOptions>> = {
  default: {},
  textFirst: { labels: 'text', showPortraits: false },
  dense: { labels: 'icon', density: 'compact', maxColumns: 3 },
  phone: {
    labels: 'icon+text',
    columns: false,
    tickbars: 'simple',
    coreStatsOnly: true,
    showPortraits: false,
    showFlavor: false,
  },
}

export const PRESET_KEYS = Object.keys(PRESETS)

function readLayoutOptions(): ActiveModeLayoutOptions {
  const { statSet, ...stored } = (UserStore().User.View(LAYOUT_VIEW_KEY, null) || {}) as any
  if (statSet !== undefined) stored.coreStatsOnly = statSet !== 'all'
  return { ...DEFAULTS, ...stored }
}

export function applyPreset(name: string): void {
  UserStore().User.SetView(LAYOUT_VIEW_KEY, { ...DEFAULTS, ...(PRESETS[name] || {}) })
}

export function matchedPreset(opts: ActiveModeLayoutOptions): string | null {
  for (const [name, partial] of Object.entries(PRESETS)) {
    const candidate = { ...DEFAULTS, ...partial }
    if (JSON.stringify(candidate) === JSON.stringify(opts)) return name
  }
  return null
}

export type ResolvedLayout = ActiveModeLayoutOptions & {
  mobile: boolean
  simpleTickbars: boolean
  showLabel: boolean
  showIcon: boolean
  btnSize: string
  iconSize: string | number
  tileHeight: number
  tileIconSize: number
  padX: number
  padY: number
}

export function resolveLayout(opts: ActiveModeLayoutOptions, mobile: boolean): ResolvedLayout {
  const density = mobile ? 'compact' : opts.density
  const simpleTickbars = opts.tickbars === 'auto' ? mobile : opts.tickbars === 'simple'
  const showLabel = opts.labels !== 'icon'
  const d = DENSITY[density]
  return {
    ...opts,
    density,
    maxColumns: mobile ? 1 : opts.maxColumns,
    columns: mobile ? false : opts.columns,
    mobile,
    simpleTickbars,
    showLabel,
    showIcon: opts.labels !== 'text',
    btnSize: d.btnSize,
    iconSize: mobile ? 20 : d.iconSize,
    tileHeight: d.tile[showLabel ? 1 : 0],
    tileIconSize: d.tileIcon[showLabel ? 1 : 0],
    padX: d.pad[0],
    padY: d.pad[1],
  }
}

export function useLayoutOptions() {
  const { mdAndDown } = useDisplay()

  const options: WritableComputedRef<ActiveModeLayoutOptions> = computed({
    get: () => readLayoutOptions(),
    set: v => UserStore().User.SetView(LAYOUT_VIEW_KEY, { ...DEFAULTS, ...v }),
  })

  const layout = computed(() => resolveLayout(options.value, mdAndDown.value))

  function field<K extends keyof ActiveModeLayoutOptions>(key: K) {
    return computed({
      get: () => options.value[key],
      set: (v: ActiveModeLayoutOptions[K]) => {
        options.value = { ...options.value, [key]: v }
      },
    })
  }

  return { options, layout, field }
}

export function filterStats(stats: any[], coreStatsOnly: boolean): any[] {
  if (!coreStatsOnly) return stats
  return stats.filter(s => s.key === '__spacer__' || CORE_STATS.includes(s.key))
}
