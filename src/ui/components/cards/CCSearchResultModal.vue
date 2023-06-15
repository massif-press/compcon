<template>
  <v-dialog v-model="dialog" width="90vw">
    <v-card tile>
      <cc-titlebar :icon="item.Icon" :color="item.Color">
        <template #title> {{ item.Source }} {{ item.Name }} </template>
      </cc-titlebar>
      <v-card-text>
        <cc-item-card :item="item" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">dismiss</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'CCSearchResultModal',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    show() {
      this.dialog = true;
    },
  },
};
</script>
