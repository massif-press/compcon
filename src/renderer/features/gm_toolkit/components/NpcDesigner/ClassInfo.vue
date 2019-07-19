<template>
  <v-card>
    <v-card-title :class="color" class="white--text">
      <h1 class="headline text-uppercase text-sm-center">{{ cls.name }}</h1>
    </v-card-title>
    <v-card-text class="text-sm-center">
      <div>
        <i v-html="cls.info.flavor" />
      </div>
      <v-divider class="my-3" />
      <h1 class="title mb-2">Tactics</h1>
      <div>
        <p v-html="cls.info.tactics" />
      </div>
      <h1 class="title mb-2">Systems</h1>
      <div>
        <h1 class="caption mb-1 font-weight-bold">BASE</h1>
        <v-layout wrap justify-center grow-shrink-0>
          <v-flex v-for="system in baseSystems" :key="system.name">
            <system-card :system="system" />
          </v-flex>
        </v-layout>
        <h1 class="caption mt-3 mb-1 font-weight-bold">OPTIONAL</h1>
        <v-layout px-5 wrap justify-center grow-shrink-0>
          <v-flex v-for="system in optionalSystems" :key="system.name">
            <system-card :system="system" />
          </v-flex>
        </v-layout>
      </div>
    </v-card-text>
    <v-divider class="my-1" />
    <v-card-actions class="mb-1">
      <v-spacer />
      <v-btn flat :color="color" @click="$emit('chosen')">Choose</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import NPCClass from '../../logic/interfaces/NPCClass'
import { NPCSystem } from '../../logic/interfaces/NPCSystem'
import SystemCard from '../../components/NpcDesigner/SystemButton.vue'
import { type } from 'os'
import { npc_systems } from 'lancer-data'

const allSystems: NPCSystem.Any[] = npc_systems

export default Vue.extend({
  name: 'class-info',
  components: { SystemCard },
  props: { cls: { type: Object, required: true } },
  computed: {
    color() {
      if (!this.cls) return 'primary'
      else return `role--${this.cls.role}`
    },

    baseSystems() {
      return allSystems.filter(s => s.class === this.cls.name && s.base)
    },

    optionalSystems() {
      return allSystems.filter(s => s.class === this.cls.name && !s.base)
    },
  },
})
</script>
