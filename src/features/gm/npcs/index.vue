<template>
  <div>
    <gm-collection-view
      title="NPCs"
      item-type="Npc"
      :items="npcs"
      :groupings="groupings"
      :sortings="sortings"
      @add-new="addNew()"
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
          <builder slot="upper" :item="selected" />
          <features slot="lower" :item="selected" />
        </editor>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../_views/GMCollectionView.vue'
import Editor from './editor.vue'
import Builder from './builder.vue'
import Features from './features.vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore } from '@/store'

export default Vue.extend({
  name: 'npc-roster',
  components: { GmCollectionView, Editor, Builder, Features },
  data: () => ({
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Size', 'Tag', 'Role', 'Tier', 'Campaign'],
    sortings: ['Name', 'Size', 'Tier'],
  }),
  computed: {
    npcs() {
      return getModule(NpcStore, this.$store).Npcs
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
    SaveAndClose() {
      const store = getModule(NpcStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.addNpc(this.selected)
      this.$set(this, 'selected', null)
      this.dialog = false
    },
  },
})
</script>
