<template>
  <v-container class="pb-12">
    <h1 class="heading text-center mb-4">Damage Tables</h1>

    <cc-rollable-table v-for="t in tables"
      :id="t.ID"
      :key="t.ID"
      :table="t"
      class="mb-6"
      show-description
      readonly />
  </v-container>
  <v-footer v-if="!isModal"
    border
    app
    class="py-0 bg-primary">
    <v-tabs density="compact"
      center-active
      grow>
      <v-tab v-for="item in tables.map(t => t.ID)"
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
    @click="scrollTo(tables[0].ID)">
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import scrollTo from '@/util/scrollTo'

export default {
  name: 'DamageTables',
  props: {
    isModal: {
      type: Boolean,
    },
  },
  computed: {
    tables() {
      return CompendiumStore().Tables
    }
  },
  methods: {
    scrollTo(item: any): void {
      const el = document.getElementById(`${item.replace(/\W/g, '')}`)
      if (el) scrollTo(el, this.isModal)
    },
  },
}
</script>
