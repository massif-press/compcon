<template>
  <v-text-field
    ref="input"
    v-model="searchText"
    class="search-field"
    :prepend-icon="$vuetify.display.lgAndUp ? 'search' : ''"
    solo
    hide-details
    single-line
    placeholder="Search the Compendium"
    @keyup.enter="search"
  />
</template>

<script lang="ts">
export default {
  name: 'compendium-search-bar',
  data: () => ({
    searchText: '',
  }),
  methods: {
    search() {
      this.$router.push(`/compendium/search?search=${this.searchText}`);
    },
  },
};
</script>
