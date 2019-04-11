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
import { debounce } from 'lodash'

export default Vue.extend({
    name: 'compendium-search-bar',
    data: () => ({
      searchText: '',
      eventListener: null,
    }),
    methods: {
      doSearch() {
        this.$router.push(`/compendiumsearch/${this.searchText}`)
      },
    },
    mounted() {
      // window.addEventListener('keydown',
      //   debounce((e) => {
      //     if (!this.active) {
      //       if (e.keyCode === 70 && e.ctrlKey) {
      //         this.active = true
      //         const input = this.$refs.input as HTMLInputElement
      //         input.focus()
      //       }
      //     }
      //   }),
      // )
    },
  })
</script>