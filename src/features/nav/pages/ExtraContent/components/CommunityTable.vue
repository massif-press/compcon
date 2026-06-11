<template>
  <lcp-table :packs="packs"
    :loading="loading"
    :headers="lcpHeaders"
    :no-data-text="ct.noData"
    :strings="ct" />
</template>

<script setup lang="ts">
import LcpTable from '@/ui/components/LcpTable.vue'
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

defineProps<{
  packs: any[]
  loading?: boolean
}>()

const ct = section('communityTable')

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
