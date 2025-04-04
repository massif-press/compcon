<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 15px">DOWNTIME REFERENCE</div>

    <v-row dense>
      <v-col v-for="action in actions" cols="12" class="my-n1 caption">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            <v-icon icon="cc:downtime" />
            {{ action.Name }}
          </legend>
          <p v-html="action.Detail" class="my-1" />

          <div v-if="action.Table" class="pb-2">
            <v-row dense v-for="result in action.Table.results" class="mb-n2">
              <v-col cols="1" v-if="result.min === result.max" class="text-center">
                {{ result.min }}
              </v-col>
              <v-col cols="1" v-else class="text-center">
                {{ result.min }}&ndash;{{ result.max }}
              </v-col>
              <v-col v-html="result.text" class="text-black" />
            </v-row>
          </div>
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
      return CompendiumStore().DowntimeActions;
    },
  },
  methods: {
    diceQuantity(item): number {
      if (!item.Table) return 0;
      return item.Table.die.split('d')[0] || 1;
    },
    diceIcon(item): string {
      if (!item.Table) return 'mdi-dice-d6';
      return `mdi-dice-d${item.Table.die.split('d')[1]}`;
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
