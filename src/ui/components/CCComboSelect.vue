<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-icon small class="fade-select" v-bind="props"
        >mdi-circle-edit-outline</v-icon
      >
    </template>
    <v-card outlined>
      <v-card-text>
        <v-combobox
          v-model="sel"
          autofocus
          background-color="stark-panel"
          density="compact"
          variant="outlined"
          hide-details
          :items="items"
          item-value="value"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'cc-combo-select',
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
      const s = typeof this.sel === 'object' ? this.sel.value : this.sel;
      this.$emit('set', s);
    },
  },
  methods: {
    onSelChange() {
      const s = typeof this.sel === 'object' ? this.sel.value : this.sel;
      this.$emit('set', s);
    },
  },
};
</script>
