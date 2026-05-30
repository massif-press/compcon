<template>
  <div>
    <fieldset
      v-for="n in extraMounts ? 5 : 4"
      :key="`mount-${n}`"
      class="my-1 pb-1 no-print-break">
      <legend class="heading h4 ml-1 px-2">
        <v-row dense
          align="center">
          <v-col cols="auto">
            <blank-line :width="160"
              :height="lineHeight" />
          </v-col>
          <v-col cols="auto"
            class="text-primary">MOUNT</v-col>
        </v-row>
      </legend>
      <div v-for="m in 2"
        :key="`slot-${m}`">
        <v-row dense>
          <v-col>
            <div class="caption text-grey">WEAPON</div>
            <blank-line :height="lineHeight" />
          </v-col>
          <v-col cols="2">
            <div class="caption text-grey">TYPE</div>
            <blank-line :height="lineHeight" />
          </v-col>
          <v-col cols="1">
            <div class="caption text-grey">RANGE</div>
            <blank-line :height="lineHeight" />
          </v-col>
          <v-col cols="1">
            <div class="caption text-grey">DAMAGE</div>
            <blank-line :height="lineHeight" />
          </v-col>
        </v-row>
        <blank-line :height="slotHeight"
          class="mt-1" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import BlankLine from './blank/line.vue';

const props = withDefaults(defineProps<{
  extraMounts?: boolean
  lineHeight?: number
  slotHeight?: number
}>(), {
  extraMounts: false,
  lineHeight: 28,
  slotHeight: 80
})
</script>
