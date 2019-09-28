<template>
  <v-card :color="roleColor" :class="`${roleColor}--text`">
    <v-row align-center pl-4 pr-2 py-2 class="white--text">
      <v-col>
        <v-text-field dark v-model="npc.name" color="white" class="namefield">
          <v-tooltip slot="prepend" bottom>
            <v-icon slot="activator">mdi-account</v-icon>
            <span>{{ npc.name }}</span>
          </v-tooltip>
        </v-text-field>
      </v-col>
      <v-col ml-auto class="body-2">
        <v-chip label outline dark color="white" disabled>
          NPC:
          <span style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;">
            {{ encounterNPC.npc.name }}
          </span>
        </v-chip>
      </v-col>
      <v-btn style="margin-left: 0" small icon dark @click="$emit('deleted')">
        <v-icon small>delete</v-icon>
      </v-btn>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { EncounterBaseNPC } from '../../logic/EncounterBase'
import _ from 'lodash'

export default Vue.extend({
  name: 'encounter-npc-object',
  props: { npc: { type: Object, required: true } },
  data: function() {
    return {
      encounterNPC: _.clone(this.npc),
    }
  },
  computed: {
    roleColor() {
      return `role--${this.npc.npc.npcClass.role}`
    },
  },
})
</script>

<style scoped>
.namefield {
  font-size: 1em !important;
  margin-top: 0.3em !important;
}
.namefield input {
  padding: 1px !important;
  margin-top: 0.2em;
}
</style>
