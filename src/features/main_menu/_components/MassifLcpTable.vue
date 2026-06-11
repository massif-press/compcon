<template>
  <lcp-table :packs="packs"
    :loading="loading"
    :headers="lcpHeaders">
    <template #prepend-actions="{ item, canDownload, isLatest, downloading, installLatest }">
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <v-btn v-if="canDownload"
            icon
            variant="text"
            size="small"
            color="accent"
            :disabled="isLatest"
            :loading="downloading"
            v-bind="props"
            @click="installLatest()">
            <v-icon size="large"
              icon="mdi-download" />
          </v-btn>
          <v-icon v-else
            v-bind="props"
            class="fade-select mr-2"
            icon="mdi-cancel" />
        </template>
        <div v-if="canDownload"
          class="text-center">{{ $t('mainMenu.ui.downloadInstallLatest') }}</div>
        <div v-else-if="!loggedIn"
          class="text-center">
          {{ $t('mainMenu.ui.directDownloadRequiresAccount') }}
        </div>
        <div v-else
          class="text-center">{{ $t('mainMenu.ui.requiresItchPurchase') }}</div>
      </v-tooltip>
    </template>
  </lcp-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserStore } from '@/stores'
import LcpTable from '@/ui/components/LcpTable.vue'

defineProps<{
  packs: any[]
  loading?: boolean
}>()

const loggedIn = computed(() => UserStore().IsLoggedIn)

const lcpHeaders = [
  { title: '', key: 'data-table-expand', width: '0' },
  { title: 'LCP', key: 'title' },
  { title: 'Collection', key: 'collection' },
  { title: 'v3', value: 'v3' },
  { title: 'Latest Version', key: 'remote_version', align: 'center', sortable: false },
  { title: 'Installed Version', key: 'local_version', align: 'center', sortable: false },
  { title: 'Auto Update', key: 'auto', align: 'center', sortable: false },
  { title: '', key: 'actions', align: 'end', sortable: false, width: '120px' },
]
</script>
