<template>
    <v-toolbar :manual-scroll="!active" class="tbar" ref="main">
      <v-text-field
        ref="input"
        class="search-field"
        prepend-icon="search"
        v-model="searchText"
        solo
        hide-details
        single-line
        @blur="active = false"
      />
    </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'

export default Vue.extend({
    name: 'compendium-search-bar',
    data: () => ({
      active: false,
      searchText: '',
    }),
    mounted() {
      window.addEventListener('keydown',
        debounce((e) => {
          if (!this.active) {
            if (e.keyCode === 70 && e.ctrlKey) {
              this.active = true
              const input = this.$refs.input as HTMLInputElement
              input.focus()
            }
          }
        }),
      )
    },
  })
</script>

<style scoped>
.tbar {
  width: 96vw;
  position: fixed;
}
.search-field {
  width: 96vw;
  margin-left: auto;
}
</style>
