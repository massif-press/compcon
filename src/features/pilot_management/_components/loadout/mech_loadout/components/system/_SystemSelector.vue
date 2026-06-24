<template>
  <cc-compendium-browser :items="availableSystems"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="sel-mech-system"
    equippable
    selector
    @equip="handleEquip($event)">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('pm.loadout.mechSYSTEMS') }}</div>
    </template>
    <template #top>
      <v-row dense>
        <v-col>
          <div v-if="equipped || swapSystem">
            <div v-if="!mobile"
              class="text-cc-overline">
              {{ $t('pm.loadout.unionArmoryPrintid') }}: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success">{{ $t('pm.loadout.frameEQUIPMENTREGISTRATIONVERIFIED') }}</span>
            </div>
            <div class="heading h2 text-accent">
              {{ equipped?.Name || swapSystem?.Name || $t('ui.widget.noSelection') }}
            </div>
            <div class="flavor-text overline"
              style="display: block">
              {{ $t('pm.loadout.currentlyEQUIPPED') }}
            </div>
          </div>
          <div v-else-if="!mobile">
            <div class="text-cc-overline">
              {{ $t('pm.loadout.unionARMORYEQUIPMENTAUTHORIZATIONFRAMEEQUIPMENT') }}
            </div>
            <div class="heading h2 text-disabled">{{ $t('ui.widget.noSelection') }}</div>
            <div class="flavor-text overline text-error"
              style="display: block">
              {{ $t('pm.loadout.equipmentIDINVALIDORMISSING') }}
            </div>
          </div>
        </v-col>
        <v-col cols="12"
          md="auto">
          <div class="text-right">
            <selector-filter-switches v-model:unlicensed="showUnlicensed"
              v-model:over-sp="showOverSP"
              :mobile="mobile" />
          </div>
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { uniqBy, sortBy } from 'lodash'
import { computed, reactive, onMounted, toRef } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores'
import { MechSystem } from '@/classes/mech/components/equipment/MechSystem'
import { Mech } from '@/classes/mech/Mech'
import { useLcpFilter } from '../_composables/useLcpFilter'
import SelectorFilterSwitches from '../_SelectorFilterSwitches.vue'

const props = defineProps<{
  equipped?: MechSystem
  mech: Mech
  swapSystem?: MechSystem
}>()

const emit = defineEmits<{
  equip: [sys: MechSystem]
  done: []
  'swap-system': []
}>()

const { smAndDown: mobile } = useDisplay()
const { showUnlicensed, showOverSP, fID, filterByLcp, isLicensed, isAICapacityFull } =
  useLcpFilter(toRef(props, 'mech'))

const options = reactive({
  views: ['list', 'single', 'table', 'cards'],
  initialView: 'single',
  groups: ['source', 'lcp', 'license', 'none'],
  initialGroup: 'license',
  showExotics: true,
})

const headers = [
  { title: 'Manufacturer', align: 'left', key: 'Source' },
  { title: 'System', align: 'left', key: 'Name' },
  { title: 'License', align: 'left', key: 'License' },
  { title: 'Tags', align: 'center', key: 'Tags' },
  { title: 'License Level', align: 'left', key: 'LicenseLevel' },
  { title: 'SP Cost', align: 'left', key: 'SP' },
]

const manufacturers = computed(() => CompendiumStore().Manufacturers)

const freeSP = computed(() => {
  if (props.equipped) return props.mech.FreeSP + props.equipped.SP
  if (props.swapSystem) return props.mech.FreeSP + props.swapSystem.SP
  return props.mech.FreeSP
})

const availableSystems = computed((): MechSystem[] => {
  let i = filterByLcp(CompendiumStore().MechSystems).filter(
    x => x.Source && !x.IsHidden && !x.IsExotic
  )

  if (!showUnlicensed.value) i = i.filter(x => isLicensed(x))
  i = i
    .concat(props.mech.SpecialEquipment.filter(x => x.ItemType === 'MechSystem') as MechSystem[])
    .filter(
      x =>
        !props.mech.MechLoadoutController.ActiveLoadout.UniqueSystems.map(y => y.ID).includes(x.ID)
    )

  if (!showOverSP.value) i = i.filter(x => x.SP <= freeSP.value)
  if (isAICapacityFull()) i = i.filter(x => !x.IsAI)

  i = uniqBy(i, 'ID')

  return sortBy(i, ['Source', 'Name'])
})

function handleEquip(sys: MechSystem) {
  if (props.equipped) {
    props.mech.MechLoadoutController.ActiveLoadout.ChangeSystem(
      props.mech.MechLoadoutController.ActiveLoadout.Systems.findIndex(
        x => x.InstanceID === props.equipped!.InstanceID
      ),
      sys
    )
  } else if (props.swapSystem) {
    props.mech.MechLoadoutController.ActiveLoadout.ChangeSystem(
      props.mech.MechLoadoutController.ActiveLoadout.Systems.findIndex(
        x => x.InstanceID === props.swapSystem!.InstanceID
      ),
      sys
    )
  } else {
    props.mech.MechLoadoutController.ActiveLoadout.AddSystem(sys)
  }

  emit('equip', sys)
  if (!freeSP.value || !!props.swapSystem) emit('done')
}

onMounted(() => {
  options.initialView = mobile.value ? 'list' : 'single'
})
</script>
