<template>
  <div>
    <v-btn @click="testGen()">test gen</v-btn>
    <gm-collection-view
      title="Characters"
      item-type="Character"
      :items="characters"
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
import { CharacterStore } from '@/store'
import { exampleCharGen } from '@/classes/campaign/generators/CharacterGenerator'

export default Vue.extend({
  name: 'characters-roster',
  components: { GmCollectionView, Editor },
  data: () => ({
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Campaign'],
    sortings: ['Name'],
  }),
  computed: {
    characters() {
      return getModule(CharacterStore, this.$store).Characters
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
      const store = getModule(CharacterStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.addCharacter(this.selected)
      this.$set(this, 'selected', null)
      this.dialog = false
    },
    testGen() {
      console.log(
        `%c${new exampleCharGen().Generate()}`,
        'border: 1px solid; border-radius: 2px; padding: 4px; font-family:sans-serif; font-size: 15px'
      )
    },
  },
})
</script>
