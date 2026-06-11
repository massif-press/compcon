<template>
  <v-container :class="!mobile && 'px-12'">
    <v-progress-linear :model-value="(cloudUseMb / cloudMaxMb) * 100"
      color="secondary"
      bg-color="primary"
      tile
      height="35">
      <v-chip size="small"
        tile
        variant="elevated"
        elevation="0">
        {{ ((cloudUseMb / cloudMaxMb) * 100).toFixed(3) }}%
      </v-chip>
    </v-progress-linear>
    <div class="text-center flavor-text">
      {{ $t("mainMenu.dataUsage.title") }}
      <cc-slashes />
      {{ (cloudUseMb >= 1 ? cloudUseMb : cloudUseKb).toFixed(2) }}
      {{ cloudUseMb >= 1 ? $t("mainMenu.unit.mb") : $t("mainMenu.unit.kb") }} {{ $t("mainMenu.dataUsage.ofMaxMb", { max: cloudMaxMb.toFixed(2) }) }}
      <cc-button size="small"
        variant="tonal"
        color="info"
        prepend-icon="mdi-star"
        class="my-1">
        {{ $t("mainMenu.ui.upgrade") }}
      </cc-button>
    </div>
    <br />
    <sync-settings />
    <br />
    <cloud-data-viewer />
    <br />
    <cloud-archive />

    <div class="my-8 text-right">
      <cc-button color="primary"
        :loading="resetting"
        @click="resetMigration()">{{ $t("mainMenu.dataUsage.resetMigrationTool") }}</cc-button>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { UserStore } from '@/stores';
import CloudArchive from './_components/cloudArchive.vue';
import CloudDataViewer from './_components/cloudDataViewer.vue';
import SyncSettings from './_components/syncSettings.vue';

const _display = useDisplay()

defineOptions({ name: 'CloudAccountData' })

const emit = defineEmits<{
  'reset': []
}>()

const resetting = ref(false)

const cloudUseKb = computed(() => {
      return UserStore().CloudStorageUsed / 1024;
    })
const cloudUseMb = computed(() => {
      return UserStore().CloudStorageUsed / 1024 / 1024;
    })
const cloudMaxMb = computed(() => {
      return UserStore().MaxCloudStorage / 1024 / 1024;
    })
const mobile = computed(() => {
      return _display.mdAndDown.value;
    })

async function resetMigration() {
      resetting.value = true;
      await UserStore().resetV2CloudMigration();
      await UserStore().checkV2CloudMigration()
      resetting.value = false;
      emit('reset')
    }
</script>
