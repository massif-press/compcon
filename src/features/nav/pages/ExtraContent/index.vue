<template>
  <cc-solo-modal v-model="modal" title="Content Pack Management" icon="cc:content_manager">
    <cc-tabs modal fixed>
      <template #tabs>
        <v-tab>
          <v-icon start icon="mdi-list-box" />
          Content Packs
        </v-tab>
        <v-tab>
          <v-icon start icon="mdi-download" />
          Install .LCP File
        </v-tab>
        <v-tab>
          <v-icon start icon="mdi-format-list-text" />
          LCP Directory
        </v-tab>
      </template>
      <v-window-item>
        <v-card-text :style="mobile ? 'margin-top: 8px' : ''">
          <packs-list />
          <missing-content />
        </v-card-text>
      </v-window-item>
      <v-window-item>
        <pack-install @installed="onInstalled" />
      </v-window-item>
      <v-window-item>
        <packs-directory />
      </v-window-item>
    </cc-tabs>
  </cc-solo-modal>
</template>

<script lang="ts">
import PacksList from './PacksList.vue';
import MissingContent from './MissingContent.vue';
import PackInstall from './PackInstall.vue';
import PacksDirectory from './PacksDirectory.vue';

export default {
  name: 'ExtraContent',
  components: { PacksList, PackInstall, PacksDirectory, MissingContent },
  props: {
    modelValue: Boolean,
  },
  data: () => ({
    tabs: 0,
    modal: false,
  }),
  watch: {
    modelValue: {
      handler(val) {
        this.modal = val;
      },
      immediate: true,
    },
    modal(val) {
      this.$emit('update:modelValue', val);
    },
  },
  emits: ['update:modelValue'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    onInstalled(): void {
      (this.$refs.pl as any as any).reload();
      this.tabs = 0;
    },
  },
};
</script>
