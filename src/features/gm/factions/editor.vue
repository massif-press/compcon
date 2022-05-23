<template>
  <editor-base
    :item="faction"
    show-description
    :isNew="!!newNpc"
    @exit="$emit('exit')"
    @add-new="SaveAsNew($event)"
    @save="Save()"
    @delete="deleteNpc()"
    @copy="dupeNpc()"
  >
    <v-container slot="builder">
      <v-row dense align="center">
        <v-col>
          <v-text-field v-model="faction.Name" label="Name" />
          <v-combobox
            v-model="faction.CoreMission"
            chips
            deletable-chips
            multiple
            filled
            labels
            label="Core Mission"
            color="accent"
          />
        </v-col>
      </v-row>
    </v-container>
  </editor-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EditorBase from '../_components/EditorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { FactionStore } from '@/store'

export default Vue.extend({
  name: 'faction-editor',
  components: { EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    faction: null,
  }),
  created() {
    this.mountFaction()
  },
  watch: {
    id() {
      this.mountFaction()
    },
  },
  methods: {
    exit() {
      this.$set(this, 'newNpc', null)
      this.$emit('exit')
    },
    saveAsNew() {
      const store = getModule(NpcStore, this.$store)
      store.addNpc(this.npc)
      this.exit()
    },
    save() {
      const store = getModule(NpcStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.saveNpcData()
      this.$emit('exit')
    },
    deleteItem() {
      const store = getModule(NpcStore, this.$store)
      store.delete_npc(this.npc)
      this.$emit('exit')
    },
    dupe() {
      const store = getModule(NpcStore, this.$store)
      const dupe = Npc.Deserialize(Npc.Serialize(this.npc))
      dupe.RenewID()
      store.addNpc(dupe)
      this.$emit('exit')
    },
  },
})
</script>
