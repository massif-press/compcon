<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <v-col cols="12">
      <v-select v-model="roleFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:role_support"
        chips
        clearable
        variant="outlined"
        label="Role"
        :items="roles"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'npc-class-filter',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    roles: { type: Array, default: () => [] },
  },
  data: () => ({
    roleFilter: [] as string[],
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Role) this.roleFilter = f.Role;
  },
  methods: {
    clear() {
      this.roleFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.roleFilter && this.roleFilter.length > 0) fObj.Role = this.roleFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
