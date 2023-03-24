<template>
  <v-card flat tile class="containerCard">
    <v-tabs
      v-model="tabs"
      background-color="panel"
      color="accent"
      icons-and-text
    >
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
        <v-container>
          <packs-list
            ref="pl"
            @start-load="$refs.mc.loading = true"
            @end-load="$refs.mc.loading = false"
          />
          <missing-content ref="mc" />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <pack-install @installed="onInstalled" />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <packs-directory />
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import PacksList from './PacksList.vue';
import MissingContent from './MissingContent.vue';
import PackInstall from './PackInstall.vue';
import PacksDirectory from './PacksDirectory.vue';

export default {
  name: 'ExtraContent',
  components: { PacksList, PackInstall, PacksDirectory, MissingContent },
  data: () => {
    return {
      tabs: null,
    };
  },

  methods: {
    onInstalled(): void {
      (this.$refs.pl as any as any).reload();
      this.tabs = 0;
    },
  },
};
</script>

<style scoped>
.containerCard >>> .v-window__container,
.containerCard >>> .v-window-item {
  height: 100%;
}
</style>
