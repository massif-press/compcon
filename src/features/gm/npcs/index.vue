<template>
  <div>
    <v-tabs v-if="eidolons" v-model="tab">
      <v-tab>NPC Roster</v-tab>
      <v-tab>Eidolon Roster</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <gm-collection-view
          title="NPCs"
          item-type="Npc"
          :items="npcs"
          :groupings="groupings"
          :sortings="sortings"
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
              <builder slot="upper" :item="selected" />
              <features slot="lower" :item="selected" />
            </editor>
          </v-card>
        </v-dialog>
      </v-tab-item>
      <v-tab-item>
        <eidolon-index />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../_views/GMCollectionView.vue'
import Editor from './editor.vue'
import Builder from './builder.vue'
import Features from './features.vue'
import EidolonIndex from '../eidolons/index.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, NpcStore } from '@/store'

export default Vue.extend({
  name: 'npc-roster',
  components: { GmCollectionView, Editor, Builder, Features, EidolonIndex },
  data: () => ({
    tab: 0,
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Size', 'Tag', 'Role', 'Tier', 'Campaign', 'Collection'],
    sortings: ['Name', 'Size', 'Tier'],
  }),
  computed: {
    npcs() {
      return getModule(NpcStore, this.$store).Npcs
    },
    eidolons() {
      return getModule(CompendiumStore, this.$store).AllowEidolons
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
      console.log('index on saveandclose')
      const store = getModule(NpcStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.addNpc(this.selected)
      this.$set(this, 'selected', null)
      this.dialog = false
    },
  },
})
</script>
