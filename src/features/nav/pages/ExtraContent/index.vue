<template>
  <v-card flat tile class="containerCard">
    <v-tabs v-model="tabs" background-color="panel" color="accent" icons-and-text>
      <v-tab>
        Content Packs
        <v-icon>list_alt</v-icon>
      </v-tab>
      <v-tab>
        Install Content
        <v-icon>open_in_browser</v-icon>
      </v-tab>
      <v-tab>
        LCP Directory
        <v-icon>mdi-format-list-text</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <packs-list />
      </v-tab-item>
      <v-tab-item>
        <pack-install @installed="onInstalled" />
      </v-tab-item>
      <v-tab-item>
        <packs-directory />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import PacksList from './PacksList.vue'
import PackInstall from './PackInstall.vue'
import PacksDirectory from './PacksDirectory.vue'

@Component({
  components: { PacksList, PackInstall, PacksDirectory },
})
export default class ExtraContent extends Vue {
  public tabs = null

  public onInstalled(): void {
    this.tabs = 0
  }
}
</script>

<style scoped>
.containerCard >>> .v-window__container,
.containerCard >>> .v-window-item {
  height: 100%;
}
.v-tabs >>> .v-slide-group__prev {
  display: none !important;
}
</style>
