<template>
  <div class="pa-2 mt-3">
    <div class="text-cc-overline text-primary mb-3"
      style="line-height: 15px">ACTION REFERENCE</div>

    <cc-masonry-grid :items="actions">
      <template #default="{ item }">
        <v-card flat
          tile
          variant="text">
          <fieldset class="px-2">
            <legend class="text-cc-overline text-primary px-2 font-weight-bold">
              <v-icon :icon="item.Icon"
                :color="item.Color" />
              {{ item.Name }}
              <v-icon v-if="item.IsMechAction"
                icon="cc:frame"
                color="grey-darken-2"
                class="mt-n1" />
              <v-icon v-if="item.IsPilotAction"
                icon="cc:pilot"
                color="grey-darken-2"
                class="mt-n1" />
            </legend>
            <div v-html-safe="item.Terse"
              class="caption" />
          </fieldset>
        </v-card>
      </template>
    </cc-masonry-grid>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores';

defineOptions({ name: 'ActionRefPrint' })

const actions = computed(() => {
      return CompendiumStore()
        .Actions.filter((a) => a && !a.IsDowntimeAction)
        .sort((a, b) => (a.Name > b.Name ? 1 : -1));
    })
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
