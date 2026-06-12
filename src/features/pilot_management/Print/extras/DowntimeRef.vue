<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary"
      style="line-height: 15px">{{ $t('pm.print.downtimeREFERENCE') }}</div>

    <v-row dense>
      <v-col v-for="action in actions"
        :key="action.ID"
        cols="12"
        class="my-n1 caption no-print-break">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            <v-icon icon="cc:downtime" />
            {{ action.Name }}
          </legend>
          <p v-html-safe="action.Detail"
            class="my-1" />

          <div v-if="action.Table"
            class="pb-2">
            <v-row v-for="(result, index) in action.Table.results"
              :key="`result-${index}`"
              dense
              class="mb-n2">
              <v-col v-if="result.min === result.max"
                cols="1"
                class="text-center">
                {{ result.min }}
              </v-col>
              <v-col v-else
                cols="1"
                class="text-center">
                {{ result.min }}&ndash;{{ result.max }}
              </v-col>
              <v-col v-html-safe="result.text"
                class="text-black" />
            </v-row>
          </div>
        </fieldset>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores';

const actions = computed(() => {
  return CompendiumStore().DowntimeActions;
})

</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
