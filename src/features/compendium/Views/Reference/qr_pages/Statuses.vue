<template>
  <v-container class="pb-12">
    <h1 class="heading" id="statuses">Statuses</h1>
    <v-container class="px-12">
      <v-row justify="center">
        <v-col v-for="s in statuses" style="min-width: 35%">
          <v-card border flat>
            <v-toolbar dense color="primary" density="compact">
              <v-toolbar-title class="text-uppercase heading h3">
                <v-icon :icon="s.Icon" class="mt-n2" size="x-large" />
                {{ s.Name }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-2">
              <p v-text="s.Terse" class="text-center font-weight-bold body-text" />
              <v-divider class="my-1" />
              <p v-html="s.Effects" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <h1 class="heading" id="conditions">Conditions</h1>
    <v-container class="px-12">
      <v-row justify="center">
        <v-col v-for="s in conditions" style="min-width: 35%">
          <v-card border flat>
            <v-toolbar dense color="primary" density="compact">
              <v-toolbar-title class="text-uppercase heading h3">
                <v-icon :icon="s.Icon" class="mt-n2" size="x-large" />
                {{ s.Name }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-2">
              <p v-text="s.Terse" class="text-center font-weight-bold body-text" />
              <v-divider class="my-1" />
              <p v-html="s.Effects" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
  <v-footer border app class="py-0 bg-primary">
    <v-tabs density="compact" center-active grow>
      <v-tab v-for="item in content" v-text="item" @click="scrollTo(item)" />
    </v-tabs>
  </v-footer>

  <v-btn
    size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])">
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
import ActionCard from '../_components/ActionCard.vue';
import scrollTo from '@/util/scrollTo';
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Status } from '@/classes/Status';

export default {
  name: 'action-economy',
  components: { ActionCard },
  props: {
    isModal: {
      type: Boolean,
    },
  },
  data: () => ({
    content: ['statuses', 'conditions'],
  }),
  computed: {
    statuses() {
      return _.sortBy(
        CompendiumStore().Statuses.filter((s: Status) => s && s.StatusType !== 'Condition'),
        'Name'
      );
    },
    conditions() {
      return _.sortBy(
        CompendiumStore().Statuses.filter((s: Status) => s && s.StatusType === 'Condition'),
        'Name'
      );
    },
  },
  methods: {
    scrollTo(item: any): void {
      const el = document.getElementById(`${item.replace(/\W/g, '')}`);
      if (el) scrollTo(el, this.isModal);
    },
  },
};
</script>
