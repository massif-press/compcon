<template>
  <v-text-field
    ref="input"
    v-model="searchText"
    class="search-field"
    :prepend-icon="$vuetify.display.lgAndUp ? 'search' : ''"
    solo
    hide-details
    single-line
    :disabled="disabled"
    :placeholder="`Search the ${loc}`"
    @keyup.enter="search" />
</template>

<script lang="ts">
export default {
  name: 'compendium-search-bar',
  props: {
    reference: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
  data: () => ({
    searchText: '',
  }),
  computed: {
    loc() {
      return this.reference ? 'Reference' : 'Compendium';
    },
  },
  methods: {
    search() {
      this.$router.push(`srd/${this.loc.toLowerCase()}/search?search=${this.searchText}`);
    },
  },
};
</script>
