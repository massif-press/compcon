<template>
  <v-container class="pb-12">
    <h1 class="heading" id="statuses">Statuses</h1>
    <masonry-wall
      :items="statuses"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </masonry-wall>

    <h1 class="heading" id="conditions">Conditions</h1>
    <masonry-wall
      :items="conditions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </masonry-wall>
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
import scrollTo from '@/util/scrollTo';
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Status } from '@/classes/Status';
import StatusCard from '../_components/StatusCard.vue';

export default {
  name: 'action-economy',
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
