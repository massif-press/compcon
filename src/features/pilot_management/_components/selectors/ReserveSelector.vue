<template>
  <cc-compendium-browser :items="reserves"
    item-type="Reserve"
    :table-headers="headers"
    :options="options"
    view-key="sel-reserve"
    equippable
    @equip="add($event)">
    <template #header>
      <cc-button size="x-small"
        color="secondary"
        class="mb-1"
        block
        @click="CustomDialog = true">
        {{ $t('pm.selectors.addCustomReserve') }}
      </cc-button>
      <cc-button size="x-small"
        color="secondary"
        class="mb-1"
        block
        @click="ProjectDialog = true">
        {{ $t('pm.selectors.addDowntimeProject') }}
      </cc-button>
      <cc-button size="x-small"
        color="secondary"
        class="mb-1"
        block
        @click="OrgDialog = true">
        {{ $t('pm.selectors.addOrganization') }}
      </cc-button>
    </template>
  </cc-compendium-browser>

  <cc-modal v-model="CustomDialog"
    max-width="60vw"
    shrink
    :title="$t('pm.titles.addCustomReserve')"
    icon="cc:orbital">
    <custom-reserve-panel @add="add($event)" />
  </cc-modal>
  <cc-modal v-model="ProjectDialog"
    max-width="60vw"
    shrink
    :title="$t('pm.titles.addProject')"
    icon="cc:orbital">
    <downtime-project-panel @add="add($event)" />
  </cc-modal>
  <cc-modal v-model="OrgDialog"
    max-width="60vw"
    shrink
    :title="$t('pm.titles.addOrganization')"
    icon="cc:orbital">
    <organization-panel @add="addOrg($event)" />
  </cc-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { orderBy } from 'lodash-es'
import { CompendiumStore } from '@/stores'
import { Reserve } from '@/classes/pilot/components/reserves/Reserve'
import { CompendiumItem } from '@/classes/CompendiumItem'
import { Organization } from '@/classes/pilot/components'
import CustomReservePanel from './components/_CustomReservePanel.vue'
import DowntimeProjectPanel from './components/_DowntimeProjectPanel.vue'
import OrganizationPanel from './components/_OrganizationPanel.vue'

const props = defineProps<{ pilot: Record<string, any> }>()

const emit = defineEmits<{ close: [] }>()

const CustomDialog = ref(false)
const ProjectDialog = ref(false)
const OrgDialog = ref(false)

const headers = [
  { title: 'Content Pack', key: 'LcpName' },
  { title: 'Name', key: 'Name' },
  { title: 'Type', key: 'Type' },
]

const options = {
  views: ['list', 'cards', 'table'],
  initialView: 'cards',
  groups: ['lcp', 'type', 'none'],
  initialGroup: 'type',
  noSource: true,
}

const allReserves = computed(() => {
  if (!props.pilot.LcpConfig) return CompendiumStore().Reserves
  const packIDs = new Set(props.pilot.LcpConfig.packList.map((y: any) => y.packID))
  const packNames = new Set(props.pilot.LcpConfig.packList.map((y: any) => y.packName))
  return CompendiumStore().Reserves.filter(
    (x: any) => !x.InLcp || packIDs.has(x.Brew?.LcpId) || packNames.has(x.Brew.LcpName)
  )
})

const reserves = computed(() =>
  orderBy(allReserves.value.filter((x: any) => !x.IsHidden), 'Name')
)

function add(reserve: Reserve): void {
  props.pilot.ReservesController.AddReserve(CompendiumItem.Clone(reserve))
  emit('close')
}

function addOrg(org: Organization): void {
  props.pilot.ReservesController.AddOrganization(Organization.Clone(org))
  emit('close')
}
</script>
