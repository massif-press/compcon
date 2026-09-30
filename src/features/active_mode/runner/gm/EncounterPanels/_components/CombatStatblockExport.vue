<template>
  <cc-dialog
    icon="mdi-export-variant"
    :title="$t('active.actorLogs.currentStatsTitle', { name: actor.Name })"
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
      <div class="text-cc-overline text-disabled">
        // {{ $t('active.statblockExport.include') }}
      </div>
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
              :tooltip="$t('active.runner.exportCombatantStatsHint')"
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
  import { useI18n } from 'vue-i18n'
  import { enumLabel } from '@/i18n/enumLabel'

  const { t } = useI18n()

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
    if (controller.value.Cover === 'none') return t('active.statblockExport.notInCover')
    if (controller.value.Cover === 'soft') return t('active.statblockExport.inSoftCover')
    if (controller.value.Cover === 'hard') return t('active.statblockExport.inHardCover')
    return ''
  })
  function corepowerFor(c: any) {
    if (!c.CorePower) return ''
    return t('active.statblockExport.corePower', {
      value: c.CoreActive ? t('pm.print.coreActive').toUpperCase() : String(!!c.CorePower),
    })
  }
  const combatSpecials = computed(() => {
    const out = [] as string[]
    if (controller.value.AIControl) out.push(`⟦ ${t('active.statblockExport.aiControlled')} ⟧`)
    if (controller.value.IsInSelfDestruct)
      out.push(
        `⟦ ${t('active.statblockExport.selfDestruct', { n: (props.encounterInstance as any).Round - controller.value.SelfDestructRound })} ⟧`
      )
    return out.length ? ' ' + out.join('  ') : ''
  })
  const availableActions = computed(() => {
    if (!showActions.value) return ''
    const actions = [] as string[]
    if (controller.value.CanActivate('protocol')) actions.push(actionTag('protocol'))
    if (controller.value.CanActivate('full')) actions.push(actionTag('full'))
    else if (controller.value.CanActivate('quick')) actions.push(actionTag('quick'))
    if (controller.value.CanActivate('overcharge')) actions.push(actionTag('overcharge'))
    if (controller.value.CanActivate('reaction')) actions.push(actionTag('reaction'))
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
  function actionTag(activation: string) {
    return `⦗ ${enumLabel('activationType', activation).toUpperCase()} ⦘`
  }
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
          `${t('pm.print.grit').toUpperCase()}: ${c.Grit}`,
          getMaxStat(c, 'evasion', t('stats.evasion')),
          getMaxStat(c, 'edef', t('stats.edef')),
          getMaxStat(c, 'speed', t('stats.speed')),
        ]) + '\n'
      return out
    }
    out +=
      justify([
        getMaxStat(c, 'hull', t('common.haseHullShort')),
        getMaxStat(c, 'agi', t('common.haseAgilityShort')),
        getMaxStat(c, 'sys', t('common.haseSystemsShort')),
        getMaxStat(c, 'eng', t('common.haseEngineeringShort')),
      ]) + '\n'
    const secondLine = [
      getMaxStat(c, 'evasion', t('stats.evasion')),
      getMaxStat(c, 'edef', t('stats.edef')),
      getMaxStat(c, ['sensorRange', 'sensors'], t('stats.sensors')),
      getMaxStat(c, 'saveTarget', t('active.statblockExport.save')),
    ]
    if (kind === 'mech')
      secondLine.push(getMaxStat(c, 'techAttack', t('active.statblockExport.techAttackShort')))
    out += justify(secondLine) + '\n'
    return out
  }
  function trackedStatsFor(c: any, kind: 'pilot' | 'mech' | 'npc') {
    let out = ''
    if (kind === 'pilot') {
      out += justify([
        getStat(c, 'hp', t('stats.hp')),
        getCurrentStat(c, 'armor', t('stats.armor')),
        getCurrentStat(c, 'overshield', t('common.overshield'), 0),
        getStat(c, 'speed', t('active.runner.movement')),
      ])
      return out
    }
    out +=
      justify([
        getStat(c, 'hp', t('stats.hp')),
        getStat(c, 'structure', t('stats.structure')),
        getCurrentStat(c, 'armor', t('stats.armor')),
        getCurrentStat(c, 'overshield', t('common.overshield'), 0),
      ]) + '\n'
    out +=
      justify([
        getStat(c, 'heatcap', t('enums.damageType.heat')),
        getStat(c, 'stress', t('stats.stress')),
        '',
        getCurrentStat(c, 'overcharge', t('common.overcharge'), 0),
      ]) + '\n'
    out += justify([
      getStat(c, 'speed', t('active.runner.movement')),
      getStat(c, ['repairCapacity', 'repcap'], t('common.repairs')),
      '',
      corepowerFor(c),
    ])
    return out
  }
  function reloadTag() {
    return `[ ${t('active.equipCmd.reload').toLowerCase().padStart(6)} ]`
  }
  function usedTag() {
    return `[ ${t('common.used').toLowerCase().padStart(6)} ]`
  }
  function readyTag() {
    return `[ ${t('active.statblockExport.ready')} ]`
  }
  function equipmentRow(item: any, range = '', damage = '') {
    if (item.Destroyed)
      return `${justify([item.Name, '', '', '', `✖ ${t('common.destroyed').toUpperCase()}`])}\n`
    const arr = [item.Name, range, damage]
    if (item.MaxUses)
      arr.push(t('active.statblockExport.usesCount', { uses: item.Uses, max: item.MaxUses }))
    else arr.push('')
    arr.push(item.Used ? (item.IsLoading ? reloadTag() : usedTag()) : readyTag())
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
    return out || `${t('common.none')}\n`
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
    return out || `${t('common.none')}\n`
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
            ? `[${t('active.statblockExport.recharge', { n: feature.Recharge })}]`
            : usedTag()
          : readyTag()
      )
      out += justify(arr) + '\n'
    })
    return out
  })
  const features = computed(() => {
    if (!showLoadout.value) return ''
    return `\n// ${t('common.loadout').toUpperCase()}\n` + npcLoadout.value
  })
  const reserves = computed(() => {
    if (!showReserves.value) return ''
    let out = `// ${t('common.reserves').toUpperCase()}\n`
    const rc = (props.actor as any).CombatController.ReserveController
    if (!rc || !rc.Reserves.length) {
      out += `${t('common.none')}\n`
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
    const flag = (on: boolean, key: string) => (on ? `[ ${t(key).toUpperCase()} ] ` : '')
    return `${flag(c.Braced, 'active.runner.braced')}${flag(c.Overwatch, 'active.runner.overwatch')}${flag(c.Prepared, 'active.common.prepared')}`
  }
  function blockFor(c: any, kind: 'pilot' | 'mech' | 'npc') {
    return `${untrackedStatsFor(c, kind)}${statusesFor(c)}
${trackedStatsFor(c, kind)}
${countersFor(c)}`
  }
  const pilotBlock = computed(() => {
    const c = pilotController.value
    return `
// ${t('common.pilot').toUpperCase()} ${'-'.repeat(60)}
${rootActor.value.CombatController.CombatName}${rootActor.value.Level ? ` - ${t('active.roster.ll', { n: rootActor.value.Level })}` : ''} [ ${(c.Mounted && mechController.value ? t('active.shared.mounted') : t('active.sheetItem.unmounted')).toUpperCase()} ]
${flagsFor(c)}${blockFor(c, 'pilot')}${showLoadout.value ? `\n// ${t('common.pilotLoadout').toUpperCase()}\n${pilotGearLoadout.value}` : ''}`
  })
  const mechBlock = computed(() => {
    if (!mech.value || !mechController.value)
      return `\n// ${t('common.mech').toUpperCase()} ${'-'.repeat(61)}\n${t('active.statblockExport.noActiveMech')}\n`
    const c = mechController.value
    return `
// ${t('common.mech').toUpperCase()} ${'-'.repeat(61)}
${mech.value.Name} - ${mech.value.Frame.Source} ${mech.value.Frame.Name}
${flagsFor(c)}${blockFor(c, 'mech')}${showLoadout.value ? `\n// ${t('active.statblockExport.mechLoadoutHeader')}\n${mechLoadout.value}` : ''}`
  })
  const statblockPreview = computed(() => {
    const enc = props.encounterInstance as any
    const header = `${t('active.statblockExport.roundHeader', { name: enc.Name, round: enc.Round, date: new Date().toLocaleString() })}
${'-'.repeat(75)}`
    if (isPilot.value) {
      return `${header}
⟦ ${cover.value} ⟧  ${combatSpecials.value}${showActions.value ? `\n${getStat(controller.value, 'activations', t('active.customStatEditor.activations'))}\n${availableActions.value}` : ''}
${pilotBlock.value}
${mechBlock.value}
${reserves.value}`
    }
    return `${header}
${rootActor.value.ItemType} ${rootActor.value.CombatController.CombatName} ${controller.value.Tier ? ` - ${t('common.tierN', { n: controller.value.Tier })}` : ''}${showActions.value ? ` |  ${getStat(controller.value, 'activations', t('active.customStatEditor.activations'))}` : ''}
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
