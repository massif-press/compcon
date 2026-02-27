<template>
  <v-row align="end">
    <v-col>
      <div class="heading">LCP Configurations:</div>
    </v-col>
    <v-col cols="auto">
      <cc-button
        color="primary"
        size="small"
        @click="managerDialog = true"
      >
        <v-icon left>mdi-pencil-box-outline</v-icon>
        Open Config Manager
      </cc-button>
    </v-col>
  </v-row>
  <v-card
    v-for="c in configs"
    :key="c.id"
    class="my-2 py-1 px-3"
    flat
    tile
    :color="isSelected(c) ? 'success' : 'background'"
    @click="setConfig(c)"
  >
    <v-row align="center">
      <v-col cols="auto">
        <v-icon
          :class="isSelected(c) ? '' : 'text-disabled'"
          :icon="isSelected(c) ? 'mdi-check-bold' : ''"
        />
      </v-col>
      <v-col>
        <strong>{{ c.name }}</strong>
        <div class="text-caption">{{ c.packList.map(x => x.packName).join(' // ') }}</div>
      </v-col>
    </v-row>
  </v-card>
  <div>
    <v-divider class="my-4" />
    <div class="text-text text-cc-overline mb-2">
      Current Configuration:
      <strong class="text-accent">
        {{ actor.LcpConfig ? actor.LcpConfig.name : 'Unrestricted Access' }}
      </strong>
    </div>
    <v-card
      v-if="actor.LcpConfig"
      class="my-2 py-1 px-3"
      color="background"
      flat
      tile
      @click="clearConfig()"
    >
      <v-row align="center">
        <v-col cols="auto">
          <v-icon
            icon="mdi-delete"
            color="error"
          />
        </v-col>
        <v-col>
          <strong class="text-error">Clear Configuration</strong>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <cc-solo-modal
    v-model="managerDialog"
    icon="mdi-list-status"
    title="LCP Configuration Manager"
    fullscreen
  >
    <pack-config />
  </cc-solo-modal>
</template>

<script lang="ts">
  import PackConfig from '@/features/nav/pages/ExtraContent/PackConfig.vue'
  import { UserStore } from '@/stores'
  import { LcpConfig } from '@/user'

  export default {
    name: 'LcpConfigSelector',
    components: {
      PackConfig,
    },
    props: {
      actor: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      managerDialog: false,
    }),
    computed: {
      configs(): LcpConfig[] {
        return UserStore().User.LcpConfigs
      },
    },
    methods: {
      isSelected(config: LcpConfig): boolean {
        return this.actor.LcpConfig?.id === config.id
      },
      setConfig(config: LcpConfig) {
        this.actor.LcpConfig = config
      },
      clearConfig() {
        this.actor.LcpConfig = {} as LcpConfig
      },
    },
  }
</script>
