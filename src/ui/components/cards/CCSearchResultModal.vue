<template>
  <v-dialog v-model="dialog" width="90vw">
    <v-card tile>
      <cc-titlebar
        :icon="'cci-' + $_.kebabCase(item.ItemType)"
        :color="$_.kebabCase(item.ItemType)"
      >{{ item.Source }} {{ item.Name }}</cc-titlebar>
      <v-card-text>
        <cc-item-card :item="item" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">dismiss</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-search-result-modal',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true
    },
  },
})
</script>
