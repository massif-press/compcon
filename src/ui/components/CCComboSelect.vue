<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-icon small class="fadeSelect" v-on="on">mdi-circle-edit-outline</v-icon>
    </template>
    <v-card outlined>
      <v-card-text>
        <v-combobox
          v-model="sel"
          autofocus
          background-color="stark-panel"
          dense
          outlined
          hide-details
          :items="items"
          item-value="value"
        />
      </v-card-text>
    </v-card>
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
  data: () => ({
    sel: '',
    menu: false,
  }),
  watch: {
    sel() {
      const s = typeof this.sel === 'string' ? this.sel : this.sel.value
      this.$emit('set', s)
    },
  },
})
</script>
