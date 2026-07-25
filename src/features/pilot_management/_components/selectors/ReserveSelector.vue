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
        color="info"
        class="mb-1"
        block
        @click="CustomDialog = true">
        {{ $t('pm.titles.addCustomReserve') }}
      </cc-button>
      <cc-button size="x-small"
        color="info"
        class="mb-1"
        block
        @click="ProjectDialog = true">
        {{ $t('pm.selectors.addDowntimeProject') }}
      </cc-button>
      <cc-button size="x-small"
        color="info"
        class="mb-1"
        block
        @click="OrgDialog = true">
        {{ $t('pm.titles.addOrganization') }}
      </cc-button>
    </template>
  </cc-compendium-browser>

  <cc-dialog v-model="CustomDialog"
    max-width="60vw"
    :title="$t('pm.titles.addCustomReserve')"
    icon="cc:orbital" :close-on-click="false" major>
    <custom-reserve-panel @add="add($event)" />
  </cc-dialog>
  <cc-dialog v-model="ProjectDialog"
    max-width="60vw"
    :title="$t('pm.titles.addProject')"
    icon="cc:orbital" :close-on-click="false" major>
    <downtime-project-panel @add="add($event)" />
  </cc-dialog>
  <cc-dialog v-model="OrgDialog"
    max-width="60vw"
    :title="$t('pm.titles.addOrganization')"
    icon="cc:orbital" :close-on-click="false" major>
    <organization-panel @add="addOrg($event)" />
  </cc-dialog>
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
import { filterByLcpConfig } from './useLcpFilter'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps<{ pilot: Record<string, any> }>()

const emit = defineEmits<{ close: [] }>()

const CustomDialog = ref(false)
const ProjectDialog = ref(false)
const OrgDialog = ref(false)

const headers = [
  { title: t('pm.titles.contentPack'), key: 'LcpName' },
  { title: 'Name', key: 'Name' },
  { title: t('common.type'), key: 'Type' },
]

const options = {
  views: ['list', 'cards', 'table'],
  initialView: 'list',
  groups: ['lcp', 'type', 'none'],
  initialGroup: 'type',
  noSource: true,
}

const reserves = computed(() =>
  orderBy(
    filterByLcpConfig(
      CompendiumStore().Reserves.filter((x: any) => !x.IsHidden),
      props.pilot.LcpConfig
    ),
    'Name'
  )
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
