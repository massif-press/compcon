<template>
  <div class="mt-1 mb-3 mx-2 no-print-break">
    <div
      v-for="(d, index) in deployables"
      :key="`deployable-${index}`"
      style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 3px"
    >
      <div class="text-center mb-1">
        <v-chip size="x-small">
          <b>{{ (d as any).name }}</b>
        </v-chip>
      </div>

      <v-row
        justify="center"
        dense
        class="text-center"
      >
        <v-col
          v-if="(d as any).size"
          cols="auto"
        >
          <div
            v-html-safe="`Size ${(d as any).size === 0.5 ? '½' : (d as any).size}`"
            class="caption font-weight-bold"
          />
        </v-col>
        <v-col
          v-if="(d as any).armor"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Armor</b>: ${(d as any).armor}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).hp || (d as any).size"
          cols="auto"
        >
          <div
            v-html-safe="
              `<b>HP</b>: ${
                (d as any).hp
                  ? (d as any).hp.toString().replace(/[{}]/gim, '')
                  : parseFloat((d as any).size || 0.5) * 10
              }`
            "
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).size"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Evasion:</b> ${(d as any).evasion || 10}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).edef"
          cols="auto"
        >
          <div
            v-html-safe="`<b>E-Defense:</b> ${(d as any).edef}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).heatcap"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Heat Capacity:</b> ${(d as any).heatcap}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).sensor"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Sensor Range:</b> ${(d as any).sensor}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).tech_attack"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Tech Attack:</b> ${(d as any).tech_attack}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).repcap"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Repair Capacity:</b> ${(d as any).repcap}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).save"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Save Target:</b> ${(d as any).save}`"
            class="caption"
          />
        </v-col>
        <v-col
          v-if="(d as any).speed"
          cols="auto"
        >
          <div
            v-html-safe="`<b>Speed:</b> ${(d as any).speed}`"
            class="caption"
          />
        </v-col>
      </v-row>
      <div>
        <p
          v-html-safe="(d as any).detail"
          class="caption mb-0 px-2"
        />
      </div>
      <div v-if="actions(d).length">
        <print-action :actions="actions(d)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Action } from '@/classes/Action'
  import PrintAction from './PrintAction.vue'

  defineOptions({ name: 'print-deployable' })

  const props = defineProps<{
    deployables: any[]
  }>()

  function actions(deployable) {
    return deployable.actions ? deployable.actions.map(x => new Action(x)) : []
  }
</script>
