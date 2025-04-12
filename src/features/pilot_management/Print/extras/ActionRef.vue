<template>
  <div class="pa-2 mt-3">
    <div class="text-cc-overline text-primary mb-3" style="line-height: 15px">ACTION REFERENCE</div>

    <masonry-wall :items="actions" :column-width="450" :gap="6" :min-columns="3" :max-columns="4">
      <template #default="{ item }">
        <v-card flat tile variant="text">
          <fieldset class="px-2">
            <legend class="text-cc-overline text-primary px-2 font-weight-bold">
              <v-icon :icon="item.Icon" :color="item.Color" />
              {{ item.Name }}
              <v-icon
                v-if="item.IsMechAction"
                icon="cc:frame"
                color="grey-darken-2"
                class="mt-n1" />
              <v-icon
                v-if="item.IsPilotAction"
                icon="cc:pilot"
                color="grey-darken-2"
                class="mt-n1" />
            </legend>
            <div class="caption" v-html-safe="item.Terse" />
          </fieldset>
        </v-card>
      </template>
    </masonry-wall>
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
