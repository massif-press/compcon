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
      <v-menu v-if="item.effects" top offset-y open-on-hover>
        <template v-slot:activator="{ on }">
          <v-chip small :dark="dark" :color="color" v-on="on">
            <b>{{ item.name }}</b>
          </v-chip>
        </template>
        <v-card>
          <v-card-text>
            <p class='flavor-text' v-html="item.effects" />
          </v-card-text>
        </v-card>
      </v-menu>
      <v-chip v-else small :dark="dark" :color="color">
        <b>{{ item.name }}</b>
      </v-chip>
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
