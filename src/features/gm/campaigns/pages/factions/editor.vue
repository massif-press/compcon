<template>
  <editor-base :item="faction" @exit="$router.push('/gm/factions')">
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
import Vue from 'vue'
import EditorBase from '../../../_components/EditorBase.vue'

export default Vue.extend({
  name: 'faction-editor',
  components: { EditorBase },
  props: {
    faction: { type: Object, required: true },
  },
})
</script>
