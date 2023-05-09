<template>
  <v-dialog v-model="dialog" width="90vw">
    <v-card tile>
      <cc-titlebar :icon="'cc:' + $_.kebabCase(item.ItemType)" :color="$_.kebabCase(item.ItemType)">
        {{ item.Source }} {{ item.Name }}
      </cc-titlebar>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">dismiss</v-btn>
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
