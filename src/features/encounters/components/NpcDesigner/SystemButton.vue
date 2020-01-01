<template>
  <div>
    <v-chip
      class="system-chip"
      v-ripple
      @click="closable ? $emit('close') : $emit('add')"
      label
      outline
      :color="`system--${system.type}`"
      style="cursor: pointer!important"
    >
      <v-icon
        left
        small
        size="24"
        :color="`system--${system.type}`"
        v-if="closable"
        v-html="'mdi-minus'"
      />
      <v-icon
        left
        small
        size="24"
        :color="`system--${system.type}`"
        v-if="addable"
        v-html="'mdi-plus'"
      />
      <v-icon left small>{{ icon }}</v-icon>
      {{ system.name }}
      <v-icon class="rightbtn" small right @click.stop="dialog = true">
        mdi-information-outline
      </v-icon>
    </v-chip>
    <v-dialog v-model="dialog" max-width="40%">
      <system-dialog-card :npc="npc" :system="system" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { NPCSystem } from '../../logic/interfaces/NPCSystem'
import NPC from '../../logic/NPC'

import SystemDialogCard from '../SystemDialogCard.vue'

export default Vue.extend({
  name: 'system-button',
  components: { SystemDialogCard },
  props: {
    system: { type: Object, required: true },
    npc: { type: NPC },
    closable: { type: Boolean, default: false },
    addable: { type: Boolean, default: false },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    icon(): string {
      switch (this.system.type) {
        case 'system':
          return 'mdi-settings'
          break
        case 'trait':
          return 'mdi-account-circle'
          break
        case 'weapon':
          return 'mdi-sword-cross'
          break
      }
    },
  },
})
</script>

<style>
.v-chip.system-chip {
  padding: 0.1em 0.5em;
  text-transform: uppercase;
  font-size: 0.85em;
}
.v-chip.system-chip * {
  cursor: pointer !important;
}
.v-chip.system-chip:focus {
  box-shadow: none !important;
}
.v-chip.system-chip:focus::after {
  display: none;
}

.v-chip .rightbtn:hover {
  opacity: 0.7 !important;
}
</style>
