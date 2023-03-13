<template>
  <editor-base
    :item="faction"
    show-description
    :isNew="!!newFaction"
    @exit="$emit('exit')"
    @add-new="saveAsNew($event)"
    @save="save()"
    @delete="deleteItem()"
    @copy="dupe()"
  >
    <v-container slot="builder">
      <v-row dense align="center">
        <v-col>
          <v-text-field v-model="faction.Name" label="Name" />
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
import { Faction } from '@/classes/campaign/Faction'
// import { faction } from '@/io/Generators'

export default Vue.extend({
  name: 'faction-editor',
  components: { EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    newFaction: null,
  }),
  computed: {
    faction() {
      if (this.id === 'new') {
        if (!this.newFaction) this.newFaction = new Faction()
        return this.newFaction
      }
      return getModule(FactionStore, this.$store).Factions.find(x => x.ID === this.id)
    },
  },
  methods: {
    randomName() {
      // return faction()
    },
    exit() {
      this.$set(this, 'newFaction', null)
      this.$emit('exit')
    },
    saveAsNew() {
      const store = getModule(FactionStore, this.$store)
      store.addFaction(this.faction)
      this.exit()
    },
    save() {
      const store = getModule(FactionStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.saveFactionData()
      this.$emit('exit')
    },
    deleteItem() {
      this.faction.SaveController.delete()
      this.$emit('exit')
    },
    dupe() {
      const store = getModule(FactionStore, this.$store)
      const dupe = Faction.Deserialize(Faction.Serialize(this.faction))
      dupe.RenewID()
      store.addFaction(dupe)
      this.$emit('exit')
    },
  },
})
</script>
