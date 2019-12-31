<template>
  <v-card outlined color="secondary" class="mt-4 containerCard white">
    <v-tabs v-model="tabs" background-color="secondary accent-4" dark icons-and-text>
      <v-tab>
        Content Packs
        <v-icon>list_alt</v-icon>
      </v-tab>
      <v-tab>
        Install Content
        <v-icon>open_in_browser</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <packs-list />
      </v-tab-item>
      <v-tab-item>
        <div>
          <pack-install @installed="onInstalled" />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'

import PacksList from './PacksList.vue'
import PackInstall from './PackInstall.vue'


@Component({
  components: { PacksList, PackInstall }
})
export default class ExtraContent extends Vue {
  public tabs = null

  public onInstalled() {
    this.tabs = 0
  }

}
</script>

<style scoped>
.containerCard {
  min-height: 350px;
  max-height: 750px;
}
.containerCard >>> .v-window__container,
.containerCard >>> .v-window-item {
  height: 100%;
}
</style>