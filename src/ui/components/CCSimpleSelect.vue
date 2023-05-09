<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-icon small class="fade-select" v-bind="props">mdi-circle-edit-outline</v-icon>
    </template>
    <v-list density="compact">
      <v-list-item v-for="(item, i) in items" @click="$emit('set', item.value)">
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'CCSimpleSelect',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
