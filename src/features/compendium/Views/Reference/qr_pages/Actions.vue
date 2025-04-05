<template>
  <v-container class="pb-12">
    <v-row dense>
      <v-col>
        <h1 class="heading" id="mechactions">Mech Actions</h1>
      </v-col>
      <v-col v-if="!mobile" cols="auto">
        <cc-switch v-model="expanded" label="Show Full" />
      </v-col>
    </v-row>
    <masonry-wall
      :items="actions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <action-card :action="item" :clickable="!expanded" />
      </template>
    </masonry-wall>

    <h1 class="heading" id="pilotactions">Pilot Actions</h1>
    <masonry-wall
      :items="pilotActions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <action-card :action="item" :clickable="!expanded" />
      </template>
    </masonry-wall>

    <h1 class="heading" id="downtimeactions">Downtime Actions</h1>
    <masonry-wall
      :items="downtimeActions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <cc-dense-card :item="item" />
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
import ActionCard from '../_components/ActionCard.vue';
import scrollTo from '@/util/scrollTo';

import { CompendiumStore } from '@/stores';

export default {
  name: 'action-economy',
  components: { ActionCard },
  props: {
    isModal: {
      type: Boolean,
    },
  },
  data: () => ({
    content: ['mech actions', 'pilot actions', 'downtime actions'],
    actionTypes: [
      { action: 'move', icon: 'mdi-arrow-right-bold-hexagon-outline' },
      { action: 'overcharge', icon: 'cc:overcharge' },
      { action: 'reaction', icon: 'cc:reaction' },
      { action: 'free', icon: 'cc:free' },
    ],
    expanded: false,
  }),
  created() {
    this.expanded = this.widescreen;
  },
  computed: {
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    actions() {
      return CompendiumStore().Actions.filter((a) => a && !a.IsDowntimeAction && !a.IsPilotAction);
    },
    pilotActions() {
      return CompendiumStore().Actions.filter((a) => a && a.IsPilotAction);
    },
    downtimeActions() {
      return CompendiumStore().DowntimeActions;
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
