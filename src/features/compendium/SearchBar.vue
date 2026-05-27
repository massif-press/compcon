<template>
  <div class="top-element">
    <v-text-field ref="input"
      v-model="searchText"
      class="search-field"
      tile
      flat
      variant="solo"
      density="compact"
      :disabled="disabled"
      :placeholder="`Search the ${loc}`"
      @update:focused="isFocused = $event"
      @keyup.enter="search">
      <template #prepend>
        <div class="prepend bg-panel"
          :class="isFocused && 'color-rotate'"
          style="min-width: 42px">
          <v-icon icon="mdi-magnify"
            size="34"
            class="mt-1 ml-3 mr-2" />
        </div>
      </template>
      <template #append>
        <div :class="`bg-panel ${isFocused && 'color-rotate'}`"
          style="
            transition: filter 0.2s ease-in-out;
            width: 3px;
            height: 100%;
            margin-left: 4px;
            z-index: 1;
          " />
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CompendiumSearchBar',
  props: {
    reference: {
      type: Boolean,
    },
    campaign: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
  emits: ['search'],
  data: () => ({
    searchText: '',
    isHovering: false,
    isFocused: false,
  }),
  computed: {
    loc() {
      return this.reference ? 'Reference' : 'Compendium';
    },
  },
  methods: {
    search() {
      if (this.campaign) {
        this.$emit('search', this.searchText);
        return;
      }
      this.$router.push(`srd/${this.loc.toLowerCase()}/search?search=${this.searchText}`);
    },
  },
};
</script>

<style scoped>
@import './search-bar.css';
</style>
