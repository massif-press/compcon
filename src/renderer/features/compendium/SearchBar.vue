<template>
      <v-text-field
        ref="input"
        class="search-field"
        prepend-icon="search"
        v-model="searchText"
        solo
        hide-details
        single-line
        placeholder="Search the Compendium"
        @keyup.enter="doSearch"
      />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'compendium-search-bar',
    data: () => ({
      searchText: '',
      eventListener: null,
    }),
    methods: {
      doSearch() {
        this.$router.push(`/compendium/search?search=${this.searchText}`)
      },
    },
    mounted() {
      const thisAny: any = this
      thisAny.$mousetrap.bind(['ctrl+f', '/'], () => {
        (this.$refs.input as HTMLElement).focus()
      })
    },
  })
</script>