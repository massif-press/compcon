<template>
  <v-select
    v-model="arr"
    :label="label"
    :items="items"
    item-text="name"
    multiple
    :color="color"
    dense
    hide-details
    outlined
    clearable
  >
    <template v-slot:selection="{ item, index }">
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-chip small :dark="dark" :color="color" v-on="on">
            <b>{{ item.name }}</b>
          </v-chip>
        </template>
        <div>
          <ul>
            <li v-for="e in item.effects" :key="e" v-html="e" />
          </ul>
        </div>
      </v-menu>
    </template>
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'status-select',
  props: {
    items: {
      type: Array,
      required: true,
    },
    model: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    dark: {
      type: Boolean,
    },
  },
  computed: {
    arr: {
      get() {
        return this.model
      },
      set(val) {
        this.$emit('set', val)
      },
    },
  },
})
</script>
