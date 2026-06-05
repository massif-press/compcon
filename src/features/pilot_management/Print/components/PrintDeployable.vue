<template>
  <div v-if="deployables?.length > 0"
    :class="`mb-3 mx-2 ${compact ? 'mt-1' : 'mt-2'}`">
    <div v-for="(d, index) in deployables"
      :key="`deployable-${index}`"
      class="py-1 no-print-break">
      <v-row dense
        class="mt-n4 pl-2">
        <v-col v-if="(d as any).Size"
          cols="auto">
          <div v-html-safe="`Size ${(d as any).Size === 0.5 ? '½' : (d as any).Size}`"
            class="caption font-weight-bold" />
        </v-col>
        <v-col v-if="(d as any).Armor"
          cols="auto">
          <div v-html-safe="`<b>Armor</b>: ${(d as any).Armor}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).MaxHP || (d as any).Size"
          cols="auto">
          <div v-html-safe="`<b>HP</b>: ${(d as any).MaxHP
              ? (d as any).MaxHP.toString().replace(/[{}]/gim, '')
              : parseFloat((d as any).Size || 0.5) * 10
            }`
            "
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).Evasion"
          cols="auto">
          <div v-html-safe="`<b>Evasion:</b> ${(d as any).Evasion || 10}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).EDefense"
          cols="auto">
          <div v-html-safe="`<b>E-Defense:</b> ${(d as any).EDefense}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).Heatcap"
          cols="auto">
          <div v-html-safe="`<b>Heat Capacity:</b> ${(d as any).Heatcap}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).Sensors"
          cols="auto">
          <div v-html-safe="`<b>Sensor Range:</b> ${(d as any).Sensors}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).TechAttack"
          cols="auto">
          <div v-html-safe="`<b>Tech Attack:</b> ${(d as any).TechAttack}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).Repcap"
          cols="auto">
          <div v-html-safe="`<b>Repair Capacity:</b> ${(d as any).Repcap}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).Save"
          cols="auto">
          <div v-html-safe="`<b>Save Target:</b> ${(d as any).Save}`"
            class="caption" />
        </v-col>
        <v-col v-if="(d as any).Speed"
          cols="auto">
          <div v-html-safe="`<b>Speed:</b> ${(d as any).Speed}`"
            class="caption" />
        </v-col>
      </v-row>
      <div>
        <p v-html-safe="(d as any).Detail"
          class="caption mb-0 px-2" />
      </div>
      <v-card v-if="actions(d).length"
        variant="outlined"
        :class="`mt-1${compact ? '' : ' ml-3'}`"
        style="border-color: rgba(0, 0, 0, 0.4)">
        <print-action :actions="actions(d)"
          :compact="compact" />
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Deployable } from '@/classes/components/feature/deployable/Deployable';
import PrintAction from './PrintAction.vue';

defineOptions({ name: 'PrintDeployable' })
withDefaults(defineProps<{
  deployables: Deployable[]
  compact?: boolean
}>(), {
  compact: false
})

function actions(deployable) {
  return deployable.Actions;
}
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
