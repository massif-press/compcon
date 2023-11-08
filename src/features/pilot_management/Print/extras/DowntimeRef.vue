<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 15px">DOWNTIME REFERENCE</div>

    <v-row dense>
      <v-col v-for="action in actions" cols="12" class="my-n1">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            <v-icon :icon="action.Icon" :color="action.Color" /> {{ action.Name }}
          </legend>
          <div class="caption" v-html-safe="action.Detail" />
        </fieldset>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'downtime-ref-print',
  computed: {
    actions() {
      return CompendiumStore().Actions.filter((a) => a && a.IsDowntimeAction);
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
