<template>
  <v-row align="center">
    <v-col>
      <v-row dense
        align="center">
        <v-col cols="auto">
          <div class="text-overline mb-n4 text-primary">MECH</div>
          <blank-line v-if="blank"
            :height="46"
            :width="500"
            class="my-2" />
          <div v-else
            class="heading h2">
            {{ mech.Name }}
          </div>
          <div v-if="!blank"
            class="heading h3 my-n2"
            style="opacity: 0.7">
            <v-icon :icon="`cc:${mech.Frame.Source.toLowerCase()}`"
              size="small"
              class="mt-n1" />
            {{ mech.Frame.Source }}
            {{ mech.Frame.Name }}
          </div>
        </v-col>
      </v-row>
    </v-col>
    <print-overcharge />
  </v-row>
  <print-stat-row :mech="mech"
    :blank="blank" />
</template>

<script setup lang="ts">
import BlankLine from './blank/line.vue';
import PrintOvercharge from './PrintOvercharge.vue';
import PrintStatRow from './PrintStatRow.vue';

const props = withDefaults(defineProps<{
  mech: object
  blank?: boolean
}>(), {
  blank: false
})
</script>
