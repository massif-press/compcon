<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <v-col cols="12">
      <v-select v-model="typeFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:trait"
        chips
        clearable
        variant="outlined"
        label="Item Type"
        :items="types"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="tagFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="gearTags"
        item-value="ID"
        multiple
        item-title="Name"
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'pilot-gear-filter',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    gearTags: { type: Array, default: () => [] },
  },
  data: () => ({
    tagFilter: [] as string[],
    typeFilter: [] as string[],
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Tags) this.tagFilter = f.Tags;
    if (f.ItemType) this.typeFilter = f.ItemType;
  },
  computed: {
    types() {
      return [
        { title: 'Armor', value: 'PilotArmor' },
        { title: 'Gear', value: 'PilotGear' },
        { title: 'Weapon', value: 'PilotWeapon' },
      ];
    },
  },
  methods: {
    clear() {
      this.tagFilter = [];
      this.typeFilter = [];
      this.updateFilters();
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.tagFilter && this.tagFilter.length > 0) fObj.Tags = this.tagFilter;
      if (this.typeFilter && this.typeFilter.length > 0) fObj.ItemType = this.typeFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
