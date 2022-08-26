<template>
  <div>
    <gm-collection-view
      title="Locations"
      item-type="Location"
      :items="locations"
      :groupings="['Campaign', 'Labels']"
      :sortings="['Name']"
      @add-new="addNew()"
      @import-item="importItem()"
      @open="openItem($event)"
    />
    <v-dialog v-model="dialog" fullscreen>
      <v-card flat>
        <editor
          v-if="dialog"
          :id="selected"
          @exit="dialog = false"
          @copy="copyItem()"
          @deleteItem="deleteItem()"
          @save="SaveAndClose()"
        >
          <!-- <builder slot="upper" :item="selected" />
          <features slot="lower" :item="selected" /> -->
        </editor>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../_views/GMCollectionView.vue'
import Editor from './editor.vue'
import { getModule } from 'vuex-module-decorators'
import { LocationStore } from '@/store'

export default Vue.extend({
  name: 'locations-roster',
  components: { GmCollectionView, Editor },
  data: () => ({
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Campaign'],
    sortings: ['Name'],
  }),
  computed: {
    locations() {
      return getModule(LocationStore, this.$store).Locations
    },
  },
  methods: {
    openItem(id) {
      this.selected = id
      this.dialog = true
    },
    addNew() {
      this.selected = 'new'
      this.dialog = true
    },
    importItem() {
      console.error('NOT YET IMPLEMENTED')
    },
    deleteItem() {
      console.error('NOT YET IMPLEMENTED')
    },
    SaveAndClose() {
      const store = getModule(LocationStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.addLocation(this.selected)
      this.$set(this, 'selected', null)
      this.dialog = false
    },
  },
})
</script>
