<template>
  <div>
    <v-row
      dense
      class="mb-1"
    >
      <v-col
        v-for="stat in headline"
        :key="stat.label"
        cols="4"
      >
        <cc-panel color="background">
          <div class="text-center py-1">
            <div class="heading h1">{{ stat.value }}</div>
            <div class="text-caption text-disabled">{{ stat.label }}</div>
          </div>
        </cc-panel>
      </v-col>
    </v-row>

    <cc-panel
      color="background"
      class="mb-2"
      :title="$t('active.telemetry.offense')"
    >
      <v-row
        dense
        class="mb-1"
      >
        <v-col
          v-for="stat in offense"
          :key="stat.label"
          cols="6"
          sm="3"
        >
          <div class="text-center">
            <div class="heading h2">{{ stat.value }}</div>
            <div class="text-caption text-disabled">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-2" />
      <div class="text-caption text-disabled">
        {{ $t('active.telemetry.damageDealt') }}
        <b class="text-accent">{{ rollup.totalDealt }}</b>
      </div>
      <div
        v-for="bar in dealtBars"
        :key="bar.type"
        class="d-flex align-center my-1"
      >
        <div
          class="text-caption"
          style="width: 90px"
        >
          {{ bar.label }}
        </div>
        <div
          :class="`bg-${bar.color}`"
          :style="`height: 10px; width: ${bar.pct}%; min-width: 2px`"
        />
        <div class="text-caption ml-2">{{ bar.value }}</div>
      </div>
      <div
        v-if="!dealtBars.length"
        class="text-caption text-disabled font-italic"
      >
        {{ $t('active.telemetry.none') }}
      </div>
    </cc-panel>

    <cc-panel
      color="background"
      class="mb-2"
      :title="$t('active.telemetry.defense')"
    >
      <div class="text-caption text-disabled">
        {{ $t('active.telemetry.damageTaken') }}
        <b class="text-accent">{{ rollup.totalTaken }}</b>
      </div>
      <div
        v-for="bar in takenBars"
        :key="bar.type"
        class="d-flex align-center my-1"
      >
        <div
          class="text-caption"
          style="width: 90px"
        >
          {{ bar.label }}
        </div>
        <div
          :class="`bg-${bar.color}`"
          :style="`height: 10px; width: ${bar.pct}%; min-width: 2px`"
        />
        <div class="text-caption ml-2">{{ bar.value }}</div>
      </div>
      <div
        v-if="!takenBars.length"
        class="text-caption text-disabled font-italic"
      >
        {{ $t('active.telemetry.none') }}
      </div>
      <v-row
        dense
        class="mt-1"
      >
        <v-col
          v-for="stat in defense"
          :key="stat.label"
          cols="6"
          sm="3"
        >
          <div class="text-center">
            <div class="heading h2">{{ stat.value }}</div>
            <div class="text-caption text-disabled">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
    </cc-panel>

    <cc-panel
      color="background"
      class="mb-2"
      :title="$t('active.telemetry.checks')"
    >
      <v-row dense>
        <v-col
          v-for="stat in checks"
          :key="stat.label"
          cols="6"
          sm="3"
        >
          <div class="text-center">
            <div class="heading h2">{{ stat.value }}</div>
            <div class="text-caption text-disabled">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
    </cc-panel>

    <cc-panel
      color="background"
      class="mb-2"
      :title="$t('stats.systems')"
    >
      <v-row dense>
        <v-col
          v-for="stat in systems"
          :key="stat.label"
          cols="6"
          sm="3"
        >
          <div class="text-center">
            <div class="heading h2">{{ stat.value }}</div>
            <div class="text-caption text-disabled">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
    </cc-panel>

    <cc-panel
      color="background"
      class="mb-2"
      :title="$t('active.telemetry.unmounted')"
    >
      <v-row dense>
        <v-col
          v-for="stat in unmounted"
          :key="stat.label"
          cols="6"
          sm="3"
        >
          <div class="text-center">
            <div class="heading h2">{{ stat.value }}</div>
            <div class="text-caption text-disabled">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
    </cc-panel>

    <cc-panel
      v-if="statuses.length"
      color="background"
      class="mb-2"
      :title="$t('active.telemetry.statuses')"
    >
      <v-chip
        v-for="s in statuses"
        :key="s.key"
        size="small"
        label
        class="ma-1"
      >
        {{ s.label }}
        <b class="ml-2 text-accent">{{ s.count }}</b>
      </v-chip>
    </cc-panel>

    <cc-panel
      v-if="actions.length"
      color="background"
      :title="$t('active.telemetry.actions')"
    >
      <v-chip
        v-for="a in actions"
        :key="a.key"
        size="small"
        label
        class="ma-1"
      >
        {{ a.label }}
        <b class="ml-2 text-accent">{{ a.count }}</b>
      </v-chip>
    </cc-panel>
  </div>
</template>

<script setup lang="ts">
  import { titleCase } from '@/classes/components/combat/log/charts'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { IEncounterRollup } from '@/classes/components/combat/log/telemetry'

  const props = defineProps<{ rollup: IEncounterRollup }>()

  const labelFor = (key: string) => props.rollup.labels?.[key] ?? titleCase(key)

  const { t } = useI18n()

  const DAMAGE_COLORS: Record<string, string> = {
    kinetic: 'damage--kinetic',
    energy: 'damage--energy',
    explosive: 'damage--explosive',
    heat: 'damage--heat',
    burn: 'damage--burn',
    'applied burn': 'damage--burn',
  }

  function bars(breakdown: Record<string, number>) {
    const entries = Object.entries(breakdown).filter(([, v]) => v > 0)
    const max = Math.max(1, ...entries.map(([, v]) => v))
    return entries.map(([type, value]) => ({
      type,
      label: titleCase(type),
      value,
      color: DAMAGE_COLORS[type] ?? 'damage--variable',
      pct: Math.round((value / max) * 100),
    }))
  }

  const dealtBars = computed(() => bars(props.rollup.damageDealt))
  const takenBars = computed(() => bars(props.rollup.damageTaken))

  const headline = computed(() => [
    { label: t('active.telemetry.rounds'), value: props.rollup.rounds },
    { label: t('active.telemetry.turns'), value: props.rollup.turns },
    { label: t('active.telemetry.movementSpent'), value: props.rollup.movementSpent },
  ])

  const offense = computed(() => [
    {
      label: t('active.telemetry.attacks'),
      value: `${props.rollup.attacks.hit}/${props.rollup.attacks.made}`,
    },
    { label: t('active.telemetry.crits'), value: props.rollup.attacks.crit },
    { label: t('active.telemetry.misses'), value: props.rollup.attacks.missed },
    {
      label: t('active.telemetry.kills'),
      value: props.rollup.killsSelfReported
        ? `${props.rollup.killsConfirmed} (+${props.rollup.killsSelfReported})`
        : props.rollup.killsConfirmed,
    },
  ])

  const defense = computed(() => [
    { label: t('active.telemetry.reducedByArmor'), value: props.rollup.damageArmorReduced },
    { label: t('active.telemetry.structureChecks'), value: props.rollup.structureChecks },
    { label: t('active.telemetry.stressChecks'), value: props.rollup.stressChecks },
    { label: t('active.telemetry.mechsLost'), value: props.rollup.mechsLost },
  ])

  const checks = computed(() => [
    { label: t('active.telemetry.savesPassed'), value: props.rollup.savesPassed },
    { label: t('active.telemetry.savesFailed'), value: props.rollup.savesFailed },
    { label: t('active.telemetry.checksPassed'), value: props.rollup.checksPassed },
    { label: t('active.telemetry.checksFailed'), value: props.rollup.checksFailed },
  ])

  const systems = computed(() => [
    {
      label: t('active.telemetry.overcharges'),
      value: `${props.rollup.overcharges} (${props.rollup.overchargeHeat})`,
    },
    { label: t('active.telemetry.deployablesLaunched'), value: props.rollup.deployablesLaunched },
    { label: t('active.telemetry.deployablesDestroyed'), value: props.rollup.deployablesDestroyed },
    { label: t('active.telemetry.equipmentDestroyed'), value: props.rollup.equipmentDestroyed },
    { label: t('active.telemetry.coreEnergySpent'), value: props.rollup.coreEnergySpent },
  ])

  const unmounted = computed(() => [
    { label: t('active.telemetry.roundsUnmounted'), value: props.rollup.roundsUnmounted ?? 0 },
    { label: t('active.telemetry.actionsUnmounted'), value: props.rollup.actionsUnmounted ?? 0 },
    {
      label: t('active.telemetry.damageDealtUnmounted'),
      value: props.rollup.damageDealtUnmounted ?? 0,
    },
    {
      label: t('active.telemetry.damageTakenUnmounted'),
      value: props.rollup.damageTakenUnmounted ?? 0,
    },
    { label: t('active.telemetry.movementUnmounted'), value: props.rollup.movementUnmounted ?? 0 },
  ])

  const statuses = computed(() =>
    Object.entries(props.rollup.statusesGained)
      .filter(([k]) => !!k)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, label: labelFor(key), count }))
  )

  const actions = computed(() =>
    Object.entries(props.rollup.actionsTaken)
      .filter(([k]) => !!k)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, label: labelFor(key), count }))
  )
</script>
