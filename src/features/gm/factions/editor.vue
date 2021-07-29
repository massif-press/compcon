<template>
  <editor-base :item="faction" :new="id === 'new'" @exit="$router.push('/gm/factions')">
    <v-row dense align="center">
      <v-col>
        <v-text-field v-model="faction.Name" label="Name" />
        <v-textarea
          v-model="faction.Description"
          label="Description"
          hint="A brief description of this faction"
          outlined
          auto-grow
          rows="3"
        />
        <v-combobox
          v-model="faction.CoreMission"
          chips
          deletable-chips
          multiple
          filled
          labels
          label="Core Mission"
        />
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import { Faction } from '@/classes/campaign/Faction'
import Vue from 'vue'
import EditorBase from '../_components/EditorBase.vue'

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
    mountFaction() {
      if (this.id === 'new') this.faction = new Faction()
      else this.faction = this.$store.getters['factions/getFactions'].find(x => x.ID === this.id)
    },
  },
})
</script>
