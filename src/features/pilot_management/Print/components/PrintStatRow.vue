<template>
  <v-row justify="space-around"
    align="center"
    class="mt-n4 mb-1">
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary"><span class="text-uppercase">{{ $t('pm.link.hull') }}</span></div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Hull" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary">{{ $t('stats.agility') }}</div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Agi" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary">{{ $t('stats.systems') }}</div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Sys" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary">{{ $t('stats.engineering') }}</div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Eng" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div v-if="blank">
        <div class="font-weight-bold overline text-primary"><span class="text-uppercase">{{ $t('ui.fields.size') }}</span></div>
        <blank-line v-if="blank"
          :width="120"
          :height="35"
          class="mt-n1" />
      </div>
      <v-icon v-else
        color="primary"
        size="40">{{ mech.SizeIcon }}</v-icon>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { h } from 'vue'

const BlankLine = {
  props: { width: Number, height: Number },
  render(this: any) {
    return h('div', { style: { width: this.width + 'px', height: this.height + 'px', borderBottom: '2px solid currentColor' } })
  },
}

withDefaults(defineProps<{
  mech: Mech
  blank?: boolean
}>(), {
  blank: false,
})
</script>