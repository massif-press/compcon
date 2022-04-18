<template>
  <div>
    <gm-collection-view
      title="Locations"
      item-type="Location"
      :items="item.Locations"
      @add-new="item.AddLocation()"
      @open="openItem($event)"
    />
    <v-dialog v-model="dialog">
      <v-card flat>
        <editor v-if="location" :location="location" @close="saveAndClose()" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../../../_views/GMCollectionView.vue'
import Editor from './editor.vue'

export default Vue.extend({
  name: 'locations-roster',
  components: { GmCollectionView, Editor },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    id: '',
    dialog: false,
  }),
  computed: {
    location() {
      if (!this.id) return null
      return this.item.Locations.find(x => x.ID === this.id)
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
