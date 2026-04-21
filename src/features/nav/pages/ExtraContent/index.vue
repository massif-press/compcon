<template>
  <cc-solo-modal v-model="modal"
    :title="CM.packManagement"
    icon="cc:content_manager">
    <cc-tabs modal
      fixed>
      <template #tabs>
        <v-tab>
          <v-icon start
            icon="mdi-list-box" />
          {{ CM.contentPacks }}
        </v-tab>
        <v-tab>
          <v-icon start
            icon="mdi-download" />
          {{ CM.installLcp }}
        </v-tab>
        <v-tab>
          <v-icon start
            icon="mdi-format-list-text" />
          {{ CM.lcpDirectory }}
        </v-tab>
        <v-tab>
          <v-icon start
            icon="mdi-list-status" />
          {{ CM.contentConfig }}
        </v-tab>
      </template>
      <v-window-item>
        <v-card-text :style="mobile ? 'margin-top: 8px' : ''">
          <packs-list />
          <v2-imports />
        </v-card-text>
      </v-window-item>
      <v-window-item>
        <pack-install />
      </v-window-item>
      <v-window-item>
        <packs-directory />
      </v-window-item>
      <v-window-item>
        <pack-config />
      </v-window-item>
    </cc-tabs>
  </cc-solo-modal>
</template>

<script lang="ts">
import PacksList from './PacksList.vue'
import PackInstall from './PackInstall.vue'
import PacksDirectory from './PacksDirectory.vue'
import PackConfig from './PackConfig.vue'
import { useMobile } from '@/mixins/useMobile';
import V2Imports from './components/v2Imports.vue';
import { NAV_STRINGS } from '@/features/nav/strings'

export default {
  name: 'ExtraContent',
  components: { PacksList, PackInstall, PacksDirectory, PackConfig, V2Imports },
  mixins: [useMobile],
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup() {
    return { CM: NAV_STRINGS.contentManager }
  },
  data: () => ({
    tabs: 0,
    modal: false,
  }),
  watch: {
    modelValue: {
      handler(val) {
        this.modal = val
      },
      immediate: true,
    },
    modal(val) {
      this.$emit('update:modelValue', val)
    },
  },
}
</script>
