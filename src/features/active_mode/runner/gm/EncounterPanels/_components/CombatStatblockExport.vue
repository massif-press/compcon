<template>
  <cc-dialog
    icon="mdi-export-variant"
    :title="`${actor.Name} Current Stats`"
    :close-on-click="false"
    min-width="900"
    max-width="900"
  >
    <template #activator="{ open }">
      <slot
        name="activator"
        :open="open"
      >
        <v-btn
          size="x-small"
          flat
          tile
          @click="open"
        >
          <v-icon
            icon="mdi-export-variant"
            start
          />
          {{ $t('active.statblockExport.title') }}
        </v-btn>
      </slot>
    </template>
    <template #default>
      <div class="text-cc-overline text-disabled mt-2">// {{ $t('common.options') }}</div>
      <statblock-justify-options
        v-model:enable-justify="enableJustify"
        v-model:line-width="lineWidth"
      />
      <div class="text-cc-overline text-disabled">{{ $t('active.statblockExport.include') }}</div>
      <v-row
        dense
        justify="space-around"
      >
        <v-col cols="auto">
          <cc-switch
            v-model="showUntracked"
            :label="$t('common.statsLabel')"
          />
        </v-col>
        <v-col cols="auto">
          <cc-switch
            v-model="showActions"
            :label="$t('common.actions')"
          />
        </v-col>
        <v-col cols="auto">
          <cc-switch
            v-model="showLoadout"
            :label="$t('common.loadout')"
          />
        </v-col>
        <v-col cols="auto">
          <cc-switch
            v-model="showReserves"
            :label="$t('common.reserves')"
          />
        </v-col>
      </v-row>
      <cc-panel
        color="background"
        class="my-2"
        density="compact"
        style="position: relative"
      >
        <div style="font-family: 'Consolas'; font-size: 14px; white-space: pre; overflow: auto">
          {{ statblockPreview }}
        </div>
        <v-btn
          icon="mdi-content-copy"
          size="x-small"
          flat
          tile
          class="fade-select"
          style="position: absolute; bottom: 0; right: 0"
          @click.stop="copyContent()"
        />
      </cc-panel>

      <div>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <cc-button
              size="small"
              block
              color="primary"
              prepend-icon="mdi-export"
              :tooltip="$t('active.tooltips.exportsAPlainTextVersion2')"
              @click.stop="exportBlock()"
            >
              {{ $t('active.statblockExport.exportText') }}
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
  import type { ICombatant } from '@/classes/components/combat/ICombatant'
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { computed, ref, onMounted } from 'vue'
  import { useDisplay } from 'vuetify'
  import StatblockJustifyOptions from './_StatblockJustifyOptions.vue'

  defineOptions({ name: 'ActorLogs' })

  const display = useDisplay()

  const props = defineProps<{
    actor: ICombatant
    encounterInstance: EncounterInstance
  }>()

  const showUntracked = ref(true)
  const showActions = ref(false)
  const showLoadout = ref(true)
  const showReserves = ref(false)
  const enableJustify = ref(true)
  const lineWidth = ref(110)

  const rootActor = computed(() => (props.actor as any).CombatController.RootActor)
  const isPilot = computed(() => rootActor.value.ItemType === 'Pilot')
  const mech = computed(() => rootActor.value.ActiveMech)
  const pilotController = computed(() => (props.actor as any).CombatController)
  const mechController = computed(() => mech.value?.CombatController ?? null)
  const controller = computed(() => {
    if (isPilot.value && pilotController.value.Mounted && mechController.value)
      return mechController.value
    return pilotController.value
  })
  const cover = computed(() => {
    if (controller.value.Cover === 'none') return 'Not in cover'
    if (controller.value.Cover === 'soft') return 'In soft cover'
    if (controller.value.Cover === 'hard') return 'In hard cover'
    return ''
  })
  function corepowerFor(c: any) {
    if (!c.CorePower) return ''
    return `Core Power: ${c.CoreActive ? 'CORE ACTIVE' : !!c.CorePower}`
  }
  const combatSpecials = computed(() => {
    const out = [] as string[]
    if (controller.value.AIControl) out.push('⟦ AI CONTROLLED ⟧')
    if (controller.value.IsInSelfDestruct)
      out.push(
        `⟦ SELF-DESTRUCT INITIATED // T-${(props.encounterInstance as any).Round - controller.value.SelfDestructRound} ⟧`
      )
    return out.length ? ' ' + out.join('  ') : ''
  })
  const availableActions = computed(() => {
    if (!showActions.value) return ''
    const actions = [] as string[]
    if (controller.value.CanActivate('protocol')) actions.push('⦗ PROTOCOL ⦘')
    if (controller.value.CanActivate('full')) actions.push('⦗ FULL ⦘')
    else if (controller.value.CanActivate('quick')) actions.push('⦗ QUICK ⦘')
    if (controller.value.CanActivate('overcharge')) actions.push('⦗ OVERCHARGE ⦘')
    if (controller.value.CanActivate('reaction')) actions.push('⦗ REACTION ⦘')
    const actionUses: [string, any][] = Object.entries(
      controller.value.ActionPoolController.ActionUses
    )
    actionUses.forEach(([id, record]) => {
      if (record.max < 2) return
      const name = controller.value.FindAction(id)?.Name || id
      actions.push(`⦗ ${name.toUpperCase()} ${record.max - record.used}/${record.max} ⦘`)
    })
    return actions.join(' ') + '\n'
  })
  function statusesFor(c: any) {
    let out = ''
    out += `${c.Statuses.map((s: any) => `// ${s.status.Name.toUpperCase()} //`).join('  ')}`
    if (c.CustomStatuses.length > 0) {
      out += `${c.CustomStatuses.map((s: any) => ` // ${s.status.Attribute.toUpperCase()} //`).join(' ')}`
    }
    if (c.Resistances.length) {
      out += `\n${c.Resistances.map((r: any) => `${r.type} ${r.condition}`.toUpperCase()).join(', ')}`
    }
    if (out.length === 0) return ''
    return `\n${out}\n`
  }
  function countersFor(c: any) {
    const cc = c.CounterController
    if (cc.CounterData.length === 0) return ''
    const assembledCounters = cc.CounterData.map((c: any) => {
      const saveData = cc.CounterSaveData.find((sd: any) => sd.id === c.id)
      return { name: c.name, val: saveData ? saveData.val : (c.default_value ?? 0), max: c.max }
    })
    if (assembledCounters.length === 0) return ''
    return (
      '\n' +
      assembledCounters.map((x: any) => `${x.name}: ${x.val}${x.max ? `/${x.max}` : ''}`).join('  ')
    )
  }
  function untrackedStatsFor(c: any, kind: 'pilot' | 'mech' | 'npc') {
    if (!showUntracked.value) return ''
    let out = ''
    if (kind === 'pilot') {
      out +=
        justify([
          `GRIT: ${c.Grit}`,
          getMaxStat(c, 'evasion', 'Evasion'),
          getMaxStat(c, 'edef', 'E-Def'),
          getMaxStat(c, 'speed', 'Speed'),
        ]) + '\n'
      return out
    }
    out +=
      justify([
        getMaxStat(c, 'hull', 'H'),
        getMaxStat(c, 'agi', 'A'),
        getMaxStat(c, 'sys', 'S'),
        getMaxStat(c, 'eng', 'E'),
      ]) + '\n'
    const secondLine = [
      getMaxStat(c, 'evasion', 'Evasion'),
      getMaxStat(c, 'edef', 'E-Def'),
      getMaxStat(c, ['sensorRange', 'sensors'], 'Sensors'),
      getMaxStat(c, 'saveTarget', 'Save'),
    ]
    if (kind === 'mech') secondLine.push(getMaxStat(c, 'techAttack', 'Tech Atk.'))
    out += justify(secondLine) + '\n'
    return out
  }
  function trackedStatsFor(c: any, kind: 'pilot' | 'mech' | 'npc') {
    let out = ''
    if (kind === 'pilot') {
      out += justify([
        getStat(c, 'hp', 'HP'),
        getCurrentStat(c, 'armor', 'Armor'),
        getCurrentStat(c, 'overshield', 'Overshield', 0),
        getStat(c, 'speed', 'Movement'),
      ])
      return out
    }
    out +=
      justify([
        getStat(c, 'hp', 'HP'),
        getStat(c, 'structure', 'Structure'),
        getCurrentStat(c, 'armor', 'Armor'),
        getCurrentStat(c, 'overshield', 'Overshield', 0),
      ]) + '\n'
    out +=
      justify([
        getStat(c, 'heatcap', 'Heat'),
        getStat(c, 'stress', 'Stress'),
        '',
        getCurrentStat(c, 'overcharge', 'Overcharge', 0),
      ]) + '\n'
    out += justify([
      getStat(c, 'speed', 'Movement'),
      getStat(c, ['repairCapacity', 'repcap'], 'Repairs'),
      '',
      corepowerFor(c),
    ])
    return out
  }
  function equipmentRow(item: any, range = '', damage = '') {
    if (item.Destroyed) return `${justify([item.Name, '', '', '', '✖ DESTROYED'])}\n`
    const arr = [item.Name, range, damage]
    if (item.MaxUses) arr.push(`${item.Uses} / ${item.MaxUses} Uses`)
    else arr.push('')
    arr.push(item.Used ? (item.IsLoading ? '[ reload ]' : '[   used ]') : '[ READY ]')
    return justify(arr) + '\n'
  }
  const mechLoadout = computed(() => {
    if (!mech.value) return ''
    const loadout = mech.value.MechLoadoutController?.ActiveLoadout
    if (!loadout) return ''
    let out = ''
    loadout.Weapons.forEach((w: any) => {
      out += equipmentRow(
        w,
        w.Range.map((r: any) => r.Text).join(', '),
        w.Damage.map((d: any) => d.Text).join(', ')
      )
    })
    loadout.Systems.forEach((sys: any) => {
      out += equipmentRow(sys)
    })
    return out || 'None\n'
  })
  const pilotGearLoadout = computed(() => {
    const loadout = rootActor.value.PilotLoadoutController?.ActiveLoadout
    if (!loadout) return ''
    let out = ''
    loadout.Armor.filter(Boolean).forEach((a: any) => {
      out += equipmentRow(a)
    })
    loadout.Weapons.filter(Boolean).forEach((w: any) => {
      out += equipmentRow(
        w,
        (w.Range || []).map((r: any) => r.Text).join(', '),
        (w.Damage || []).map((d: any) => d.Text).join(', ')
      )
    })
    loadout.Gear.filter(Boolean).forEach((g: any) => {
      out += equipmentRow(g)
    })
    return out || 'None\n'
  })
  const npcLoadout = computed(() => {
    if (!showLoadout.value) return ''
    let out = ''
    const features = (props.actor as any).NpcFeatureController?.Features || []
    features.forEach((feature: any) => {
      const arr = [feature.Name]
      if (feature.RangeData) {
        const mods = (props.actor as any).NpcFeatureController?.GetModifiers(feature) || []
        arr.push(
          feature
            .Range(controller.value.Tier, mods)
            .map((r: any) => r.Text)
            .join(', ')
        )
      } else {
        arr.push('')
      }
      if (feature.DamageData) {
        const mods = (props.actor as any).NpcFeatureController?.GetModifiers(feature) || []
        arr.push(
          feature
            .Damage(controller.value.Tier, mods)
            .map((r: any) => r.Text)
            .join(', ')
        )
      } else {
        arr.push('')
      }
      arr.push(
        feature.Used
          ? feature.Recharge
            ? `[recharge ${feature.Recharge}+]`
            : '[   used ]'
          : '[ READY ]'
      )
      out += justify(arr) + '\n'
    })
    return out
  })
  const features = computed(() => {
    if (!showLoadout.value) return ''
    return '\n// LOADOUT\n' + npcLoadout.value
  })
  const reserves = computed(() => {
    if (!showReserves.value) return ''
    let out = '// RESERVES\n'
    const rc = (props.actor as any).CombatController.ReserveController
    if (!rc || !rc.Reserves.length) {
      out += 'None\n'
      return out
    }
    rc.Reserves.filter((x: any) => x.Type !== 'Organization' && x.Type !== 'Project').forEach(
      (r: any) => {
        out += `${r.Name}: ${r.Description}\n`
      }
    )
    return out
  })
  function flagsFor(c: any) {
    return `${c.Braced ? `[ BRACED ] ` : ''}${c.Overwatch ? `[ OVERWATCH ] ` : ''}${c.Prepared ? `[ PREPARED ] ` : ''}`
  }
  function blockFor(c: any, kind: 'pilot' | 'mech' | 'npc') {
    return `${untrackedStatsFor(c, kind)}${statusesFor(c)}
${trackedStatsFor(c, kind)}
${countersFor(c)}`
  }
  const pilotBlock = computed(() => {
    const c = pilotController.value
    return `
// PILOT ${'-'.repeat(60)}
${rootActor.value.CombatController.CombatName}${rootActor.value.Level ? ` - LL ${rootActor.value.Level}` : ''} ${c.Mounted && mechController.value ? '[ MOUNTED ]' : '[ UNMOUNTED ]'}
${flagsFor(c)}${blockFor(c, 'pilot')}${showLoadout.value ? `\n// PILOT LOADOUT\n${pilotGearLoadout.value}` : ''}`
  })
  const mechBlock = computed(() => {
    if (!mech.value || !mechController.value) return `\n// MECH ${'-'.repeat(61)}\nNo active mech\n`
    const c = mechController.value
    return `
// MECH ${'-'.repeat(61)}
${mech.value.Name} - ${mech.value.Frame.Source} ${mech.value.Frame.Name}
${flagsFor(c)}${blockFor(c, 'mech')}${showLoadout.value ? `\n// MECH LOADOUT\n${mechLoadout.value}` : ''}`
  })
  const statblockPreview = computed(() => {
    const enc = props.encounterInstance as any
    const header = `${enc.Name} - Round ${enc.Round} (${new Date().toLocaleString()})
${'-'.repeat(75)}`
    if (isPilot.value) {
      return `${header}
⟦ ${cover.value} ⟧  ${combatSpecials.value}${showActions.value ? `\n${getStat(controller.value, 'activations', 'Activations')}\n${availableActions.value}` : ''}
${pilotBlock.value}
${mechBlock.value}
${reserves.value}`
    }
    return `${header}
${rootActor.value.ItemType} ${rootActor.value.CombatController.CombatName} ${controller.value.Tier ? ` - Tier ${controller.value.Tier}` : ''}${showActions.value ? ` |  ${getStat(controller.value, 'activations', 'Activations')}` : ''}
${flagsFor(controller.value)}⟦ ${cover.value} ⟧  ${combatSpecials.value}
${untrackedStatsFor(controller.value, 'npc')}${availableActions.value}${statusesFor(controller.value)}
${trackedStatsFor(controller.value, 'npc')}
${countersFor(controller.value)}
${features.value}
${reserves.value}`
  })

  onMounted(() => {
    if (display.smAndDown.value) enableJustify.value = false
  })

  function justify(arr: string[]) {
    if (!enableJustify.value) return arr.filter(x => x.length).join('   ')
    if (!arr.length) return ''
    const cols = arr.length
    const step = lineWidth.value / cols
    const starts = [] as number[]
    for (let i = 0; i < cols; i++) starts.push(Math.floor(i * step))
    const line = Array(lineWidth.value).fill(' ')
    for (let i = 0; i < cols; i++) {
      const start = starts[i]
      const text = arr[i]
      for (let j = 0; j < text.length && start + j < lineWidth.value; j++) {
        line[start + j] = text[j]
      }
    }
    return line.join('')
  }
  function statKey(c: any, keys: string[], store: 'MaxStats' | 'CurrentStats') {
    for (const key of keys) {
      const val = c.StatController[store][key]
      if (val !== undefined && val !== null) return val
    }
    return undefined
  }
  function getMaxStat(c: any, stat: string | string[], shortHand: string, separator = '') {
    const keys = Array.isArray(stat) ? stat : [stat]
    const max = statKey(c, keys, 'MaxStats')
    if (max === undefined) return ''
    return `${shortHand}: ${max}${separator}`
  }
  function getCurrentStat(c: any, stat: string | string[], shortHand: string, fallback?: number) {
    const keys = Array.isArray(stat) ? stat : [stat]
    let current = statKey(c, keys, 'CurrentStats')
    if (!current && fallback !== undefined) current = fallback
    if (current === undefined) return ''
    return `${shortHand}: ${current}`
  }
  function getStat(c: any, stat: string | string[], shortHand: string) {
    const keys = Array.isArray(stat) ? stat : [stat]
    const current = statKey(c, keys, 'CurrentStats')
    const max = statKey(c, keys, 'MaxStats')
    if (current === undefined && max === undefined) return ''
    return `${shortHand}: ${current}/${max}`
  }
  function copyContent() {
    navigator.clipboard.writeText(statblockPreview.value)
  }
  function exportBlock() {
    const out = statblockPreview.value
    const blob = new Blob([out], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(props.actor as any).Name} ${(props.encounterInstance as any).Name} round ${(props.encounterInstance as any).Round}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
</script>
