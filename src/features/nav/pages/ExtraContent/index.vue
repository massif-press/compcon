<template>
  <v-card flat tile>
    <v-tabs v-model="tabs" background-color="panel" color="accent" icons-and-text>
      <v-tab>
        <v-icon icon="mdi-list-box" />
        Content Packs
      </v-tab>
      <v-tab>
        <v-icon icon="mdi-download" />
        Install Content
      </v-tab>
      <v-tab>
        <v-icon icon="mdi-format-list-text" />
        LCP Directory
      </v-tab>
    </v-tabs>
    <v-window v-model="tabs">
      <v-window-item>
        <v-container>
          <packs-list
            ref="pl"
            @start-load="($refs as any).mc.loading = true"
            @end-load="($refs as any).mc.loading = false"
          />
          <v-divider class="my-6" />
          <missing-content ref="mc" />
        </v-container>
      </v-window-item>
      <v-window-item>
        <v-container>
          <pack-install @installed="onInstalled" />
        </v-container>
      </v-window-item>
      <v-window-item>
        <v-container>
          <packs-directory />
        </v-container>
      </v-window-item>
    </v-window>
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
      tabs: 0,
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
