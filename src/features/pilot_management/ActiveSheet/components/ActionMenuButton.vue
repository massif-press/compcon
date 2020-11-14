<template>
  <v-menu offset-y top>
    <template v-slot:activator="{ on }">
      <v-btn
        class="mx-1"
        small
        fab
        elevation="0"
        :color="available ? color : 'grey darken-2'"
        v-on="on"
      >
        <slot name="icon" />
      </v-btn>
    </template>
    <div>
      <v-toolbar dense flat class="heading h3" style="min-width: 80px">
        {{ title }}
        <v-spacer />
        <v-btn small icon color="accent" class="ml-4" @click="$emit('open-menu')">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list class="px-2 py-3" dense color="panel">
        <v-list-item
          v-for="(a, i) in baseActions"
          :key="`${title}_action${i}_${a.Name}_${a.Used}`"
          @click="$emit('open-dialog', a)"
        >
          <v-list-item-title class="text-button">
            <v-icon left :style="!available && !a.Used ? 'opacity:0.3' : ''">
              {{ a.Used ? 'mdi-check-circle' : a.Icon }}
            </v-icon>
            {{ a.Name }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="baseActions.length && itemActions.length" />
        <v-list-item
          v-for="(a, i) in itemActions"
          :key="`${title}_action${i}_${a.Name}_${a.Used}`"
          @click="$emit('open-dialog', a)"
        >
          <v-list-item-title class="text-button">
            <v-icon left :style="!available && !a.Used ? 'opacity:0.3' : ''">
              {{ a.Used ? 'mdi-check-circle' : a.Icon }}
            </v-icon>
            {{ a.Name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-menu-button',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    baseActions: {
      type: Array,
      required: true,
    },
    itemActions: {
      type: Array,
      required: true,
    },
    available: {
      type: Boolean,
    },
  },
})
</script>
