<template>
  <div>
    <gm-collection-view
      title="Factions"
      item-type="Faction"
      :items="item.Factions"
      @add-new="item.AddFaction()"
      @open="openItem($event)"
    />
    <v-dialog v-model="dialog">
      <v-card flat>
        <editor v-if="faction" :faction="faction" @close="saveAndClose()" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../../../_views/GMCollectionView.vue'
import Editor from './editor.vue'

export default Vue.extend({
  name: 'factions-roster',
  components: { GmCollectionView, Editor },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    id: '',
    dialog: false,
  }),
  computed: {
    faction() {
      if (!this.id) return null
      return this.item.Factions.find(x => x.ID === this.id)
    },
  },
  methods: {
    openItem(id) {
      this.id = id
      this.dialog = true
    },
    saveAndClose() {
      console.error('Save not implemented!!')
      this.dialog = false
    },
  },
})
</script>
