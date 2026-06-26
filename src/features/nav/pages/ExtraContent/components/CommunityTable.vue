<template>
  <lcp-table :packs="packs"
    :loading="loading"
    :headers="lcpHeaders"
    :no-data-text="$t('nav.communityTable.noData')"
    :strings="strings" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { i18n } from '@/i18n'
import LcpTable from '@/ui/components/LcpTable.vue'

const t = i18n.global.t

defineProps<{
  packs: any[]
  loading?: boolean
}>()

const strings = computed(() =>
  Object.fromEntries(
    ['v3Compatible', 'v3Incompatible', 'notInstalled', 'openWebsite', 'subscribedTooltip',
      'subscribeTooltip', 'payWhatYouWant', 'free', 'currentVersion', 'itchStorePage', 'authorsWebsite']
      .map(k => [k, t(`nav.communityTable.${k}`)])
  )
)

const lcpHeaders = [
  { title: '', key: 'data-table-expand', width: '0' },
  { title: 'LCP', key: 'title' },
  { title: 'Author', key: 'author' },
  { title: 'v3', value: 'v3' },
  { title: 'Latest Version', key: 'remote_version', align: 'center', sortable: false },
  { title: 'Installed Version', key: 'local_version', align: 'center', sortable: false },
  { title: '', key: 'actions', align: 'end', sortable: false, width: '120px' },
]
</script>
