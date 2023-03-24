<template>
  <div>
    <v-select
      v-model="arr"
      :label="label"
      :items="items"
      item-text="name"
      multiple
      color="accent"
      item-color="accent"
      dense
      hide-details
      variant="outlined"
      clearable
    >
      <template v-slot:selection="{ item }">
        <v-menu v-if="item.effects" bottom offset-y open-on-hover>
          <template v-slot:activator="{ props }">
            <v-chip small :dark="dark" :color="color" v-bind="props">
              <b>{{ item.name }}</b>
            </v-chip>
          </template>
          <v-card>
            <v-card-text>
              <p v-html-safe="item.effects" class="body-text ma-0 pa-1" />
            </v-card-text>
          </v-card>
        </v-menu>
        <v-chip v-else small :dark="dark" :color="color">
          <b>{{ item.name }}</b>
        </v-chip>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCStatusSelect',
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
      required: false,
    },
  },
  computed: {
    arr: {
      get() {
        return this.model;
      },
      set(val) {
        if (!Array.isArray(val)) val = [val];
        this.$emit('set', val);
      },
    },
  },
};
</script>
