<template>
  <v-container class="pb-12">
    <v-row dense>
      <v-col>
        <div class="heading h1">Actions</div>
      </v-col>
      <v-col v-if="!mobile"
        cols="auto">
        <cc-switch v-model="expanded"
          label="Show Full" />
      </v-col>
    </v-row>

    <cc-masonry-grid :items="bothActions">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="mechactions"
      class="heading mt-3">
      Mech Actions
    </h1>

    <cc-masonry-grid :items="mechActions">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="pilotactions"
      class="heading mt-3">
      Pilot Actions
    </h1>
    <cc-masonry-grid :items="pilotActions">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="downtimeactions"
      class="heading mt-3">
      Downtime Actions
    </h1>
    <cc-masonry-grid :items="downtimeActions">
      <template #default="{ item }">
        <cc-dense-card :item="item" />
      </template>
    </cc-masonry-grid>
  </v-container>

  <v-footer v-if="!isModal"
    border
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
import ActionCard from '../_components/ActionCard.vue'
import scrollTo from '@/util/scrollTo'

import { CompendiumStore } from '@/stores'
import { useMobile } from '@/composables/useMobile';

export default {
  setup() {
    return useMobile()
  },
  name: 'ActionEconomy',
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
    pilotOnlyActions: ['act_fight', 'act_jockey', 'act_reload', 'act_mount', 'act_search_pilot'],
    mechOnlyActions: ['act_grapple', 'act_ram', 'act_skirmish', 'act_barrage', 'act_improvised_attack', 'act_stabilize', 'act_boot_up', 'act_stabilize', 'act_dismount', 'act_eject', 'act_self_destruct', 'act_shut_down', 'act_overcharge', 'act_brace', 'act_quick_tech', 'act_full_tech', 'act_lock_on', 'act_bolster', 'act_scan', 'act_search'],
    expanded: false,
  }),
  computed: {
    widescreen() {
      return this.$vuetify.display.lgAndUp
    },
    allActions() {
      return CompendiumStore().Actions.filter(a => a && !a.Hidden && !a.ID.includes('_npc'))
    },
    bothActions() {
      return this.allActions.filter(a => a && !a.IsDowntimeAction && !this.pilotOnlyActions.includes(a.ID) && !this.mechOnlyActions.includes(a.ID) && !a.ID.includes('jockey_') && !a.ID.includes('_inv_'))
    },
    mechActions() {
      return this.allActions.filter(a => a && this.mechOnlyActions.includes(a.ID))
    },
    pilotActions() {
      return this.allActions.filter(a => a && this.pilotOnlyActions.includes(a.ID))
    },
    downtimeActions() {
      return CompendiumStore().DowntimeActions
    },
  },
  created() {
    this.expanded = this.widescreen
  },
  methods: {
    scrollTo(item: any): void {
      const el = document.getElementById(`${item.replace(/\W/g, '')}`)
      if (el) scrollTo(el, this.isModal)
    },
  },
}
</script>
