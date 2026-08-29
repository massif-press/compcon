<template>
  <div class="mt-1 mx-2 no-print-break">
    <div
      v-for="(d, index) in deployables"
      :key="`deployable-${index}`"
      style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 3px"
    >
      <div class="caption font-weight-bold px-2 pt-1">
        <v-icon
          size="x-small"
          :icon="d.Icon"
          class="mr-1"
        />
        {{ d.Name }}
        <span class="text-grey">// {{ d.Type }}</span>
      </div>
      <v-row
        justify="center"
        dense
        class="text-center"
      >
        <v-col
          v-if="d.Size"
          cols="auto"
        >
          <div
            class="caption font-weight-bold"
            v-html-safe="`Size ${d.Size === 0.5 ? '½' : d.Size}`"
          />
        </v-col>
        <v-col
          v-for="s in shownStats(d)"
          :key="s.key"
          cols="auto"
        >
          <div
            class="caption"
            v-html-safe="`<b>${s.label}:</b> ${s.value}`"
          />
        </v-col>
      </v-row>
      <div>
        <p
          class="caption mb-0 px-2"
          v-html-safe="d.getDetail(tier)"
        />
      </div>
      <div v-if="d.Actions.length">
        <print-action
          :actions="d.Actions"
          :tier="tier"
        />
      </div>
      <cc-tags
        v-if="d.Tags?.length"
        print
        :tags="d.Tags"
        :tier="tier"
        class="px-2 pb-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import PrintAction from './PrintAction.vue'
  import type { Deployable } from '@/classes/components/feature/deployable/Deployable'
  import type { DeployableOwner } from '@/classes/components/feature/IFeatureController'

  defineOptions({ name: 'print-deployable' })

  const STATS: { key: string; label: string; prop: string }[] = [
    { key: 'armor', label: 'Armor', prop: 'Armor' },
    { key: 'hp', label: 'HP', prop: 'MaxHP' },
    { key: 'evasion', label: 'Evasion', prop: 'Evasion' },
    { key: 'edef', label: 'E-Defense', prop: 'EDefense' },
    { key: 'heatcap', label: 'Heat Capacity', prop: 'Heatcap' },
    { key: 'sensors', label: 'Sensor Range', prop: 'Sensors' },
    { key: 'techattack', label: 'Tech Attack', prop: 'TechAttack' },
    { key: 'repcap', label: 'Repair Capacity', prop: 'Repcap' },
    { key: 'save', label: 'Save Target', prop: 'SaveTarget' },
    { key: 'speed', label: 'Speed', prop: 'Speed' },
  ]

  const props = withDefaults(
    defineProps<{
      deployables: Deployable[]
      tier?: number
      owner?: DeployableOwner | null
    }>(),
    {
      tier: 1,
      owner: null,
    }
  )

  function shownStats(d: Deployable) {
    return STATS.filter(s => (d as any)[s.prop]).map(s => ({
      key: s.key,
      label: s.label,
      value: d.getStat(s.key, props.tier, props.owner),
    }))
  }
</script>
