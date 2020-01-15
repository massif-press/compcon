<template>
  <v-dialog width="70vw">
    <template v-slot:activator="{ on }">
      <v-btn :color="npc.Class.Color" outlined tile dark class="ma-1" v-on="on">
        <v-btn v-if="reinforce" icon color="primary" class="ml-n2" @click.stop="$emit('move')">
          <v-icon>mdi-chevron-double-left</v-icon>
        </v-btn>
        {{ npc.Name }}
      </v-btn>
    </template>
    <npc-panel :npc="npc" :side-select="!readonly">
      <v-btn v-if="!readonly" block outlined color="error" class="mt-2" @click="$emit('remove')">
        <v-icon left>mdi-delete</v-icon>
        remove npc
      </v-btn>
      <v-btn v-if="reinforce" block outlined color="primary" class="mt-2" @click="$emit('move')">
        <v-icon left>mdi-chevron-double-left</v-icon>
        add npc to current encounter
      </v-btn>
    </npc-panel>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcPanel from './NpcPanel.vue'

export default Vue.extend({
  name: 'npc-chip',
  components: { NpcPanel },
  props: {
    npc: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
    reinforce: {
      type: Boolean,
    },
  },
})
</script>
