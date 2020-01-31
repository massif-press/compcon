<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-icon small class="fadeSelect" v-on="on">mdi-circle-edit-outline</v-icon>
    </template>
    <v-list dense>
      <v-list-item v-for="(item, i) in items" :key="`mi_${i}`" @click="$emit('set', item.value)">
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-short-string-editor',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
})
</script>