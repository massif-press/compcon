<template>
  <v-text-field
    ref="input"
    v-model="searchText"
    class="search-field"
    :prepend-icon="$vuetify.breakpoint.lgAndUp ? 'search' : ''"
    solo
    hide-details
    single-line
    placeholder="Search the Compendium"
    @keyup.enter="search"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'compendium-search-bar',
  data: () => ({
    searchText: '',
  }),
  mounted() {
    const vm = this
    vm.$mousetrap.bind(['ctrl+f', '/'], () => {
      ;(vm.$refs.input as HTMLElement).focus()
    })
  },
  methods: {
    search() {
      this.$router.push(`/compendium/search?search=${this.searchText}`)
    },
  },
})
</script>
