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
    <template v-slot:selection="{ item }">
      <v-menu top offset-y open-on-hover>
        <template v-slot:activator="{ on }">
          <v-chip small :dark="dark" :color="color" v-on="on">
            <b>{{ item.name }}</b>
          </v-chip>
        </template>
        <v-card>
          <v-card-text>
            <ul>
              <li v-for="e in item.effects" :key="e" v-html="e" />
            </ul>
          </v-card-text>
        </v-card>
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
