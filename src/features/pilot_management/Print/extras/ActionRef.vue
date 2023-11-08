<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 15px">ACTION REFERENCE</div>

    <v-row dense>
      <v-col v-for="action in actions" style="min-width: 15vw" class="my-n1">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            <v-icon :icon="action.Icon" :color="action.Color" /> {{ action.Name }}
            <v-icon
              v-if="action.IsMechAction"
              icon="cc:frame"
              color="grey-darken-2"
              class="mt-n1"
            />
            <v-icon
              v-if="action.IsPilotAction"
              icon="cc:pilot"
              color="grey-darken-2"
              class="mt-n1"
            />
          </legend>
          <div class="caption" v-html-safe="action.Terse" />
        </fieldset>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'action-ref-print',
  computed: {
    actions() {
      return CompendiumStore()
        .Actions.filter((a) => a && !a.IsDowntimeAction)
        .sort((a, b) => (a.Name > b.Name ? 1 : -1));
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
