<template>
  <v-container class="pb-12">
    <h1 id="statuses"
      class="heading">Statuses</h1>
    <cc-masonry-grid :items="statuses">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </cc-masonry-grid>

    <h1 id="conditions"
      class="heading">Conditions</h1>
    <cc-masonry-grid :items="conditions">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </cc-masonry-grid>
  </v-container>
  <v-footer border
    app
    class="py-0 bg-primary">
    <v-tabs density="compact"
      center-active
      grow>
      <v-tab v-for="item in content"
        :key="item"
        @click="scrollTo(item)"
        v-text="item" />
    </v-tabs>
  </v-footer>

  <v-btn size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])">
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
import scrollTo from '@/util/scrollTo';
import * as _ from 'lodash-es';

import { CompendiumStore } from '@/stores';
import { Status } from '@/classes/Status';
import StatusCard from '../_components/StatusCard.vue';

export default {
  name: 'ActionEconomy',
  components: { StatusCard },
  props: {
    isModal: {
      type: Boolean,
    },
  },
  data: () => ({
    content: ['statuses', 'conditions'],
  }),
  computed: {
    widescreen() {
      return this.$vuetify.display.xlAndUp;
    },
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
