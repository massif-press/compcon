<template>
  <cc-compendium-browser :items="availableMods"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="sel-mech-mod"
    equippable>
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('pm.loadout.weaponMods') }}</div>
    </template>
    <template #top>
      <v-row dense
        align="center">
        <v-col>
          <div v-if="weapon.Mod">
            <div v-if="!mobile"
              class="text-cc-overline">
              {{ $t('pm.loadout.unionArmoryPrintid') }}: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success">{{ $t('pm.loadout.frameEQUIPMENTREGISTRATIONVERIFIED') }}</span>
            </div>
            <div class="heading h2 text-accent">
              {{ weapon.Mod.Name }}
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
              :mobile="mobile">
              <br />
              <cc-switch v-model="showIncompatible"
                :label="mobile && 'Show Exceeds SP'"
                color="error"
                :tooltip="!mobile && showIncompatible
                  ? 'Incompatible Mods: SHOWN'
                  : 'Incompatible Mods: HIDDEN'
                  "
                :prepend-icon="!mobile && 'cc:status_downandout'"
                on-icon="mdi-lock-open"
                off-icon="mdi-lock" />
            </selector-filter-switches>
          </div>
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, toRef } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores'
import { WeaponMod } from '@/classes/mech/components/equipment/WeaponMod'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { Mech } from '@/classes/mech/Mech'
import { useLcpFilter } from '../../_composables/useLcpFilter'
import SelectorFilterSwitches from '../../_SelectorFilterSwitches.vue'

const props = defineProps<{
  weapon: MechWeapon
  mech: Mech
}>()

const { smAndDown: mobile } = useDisplay()
const { showUnlicensed, showOverSP, fID, filterByLcp, isLicensed, isAICapacityFull } =
  useLcpFilter(toRef(props, 'mech'))

const options = reactive({
  views: ['list', 'single', 'table', 'cards'],
  initialView: 'single',
  groups: ['source', 'lcp', 'license'],
  initialGroup: 'none',
  showExotics: true,
})

const headers = [
  { title: 'Manufacturer', align: 'left', key: 'Source' },
  { title: 'System', align: 'left', key: 'Name' },
  { title: 'License', align: 'left', key: 'License' },
  { title: 'License Level', align: 'left', key: 'LicenseLevel' },
  { title: 'SP Cost', align: 'left', key: 'SP' },
]

const showIncompatible = ref(false)

const manufacturers = computed(() => CompendiumStore().Manufacturers)

const freeSP = computed(() =>
  props.weapon.Mod ? props.mech.FreeSP + props.weapon.Mod.SP : props.mech.FreeSP
)

const availableMods = computed((): WeaponMod[] => {
  let i = filterByLcp(CompendiumStore().WeaponMods).filter(x => !x.IsHidden && !x.IsExotic)

  if (!showIncompatible.value) {
    i = i.filter(x => x.AllowedTypes && x.AllowedTypes.includes(props.weapon.ModType))
    i = i.filter(x => x.AllowedSizes && x.AllowedSizes.includes(props.weapon.ModSize))
  }

  if (props.weapon.Mod) i = i.filter(x => x.ID !== props.weapon.Mod!.ID)

  i = i.filter(
    x =>
      !props.mech.MechLoadoutController.ActiveLoadout.UniqueMods.map(y => y.ID).includes(x.ID)
  )

  if (!showUnlicensed.value) i = i.filter(x => isLicensed(x))
  if (!showOverSP.value) i = i.filter(x => x.SP <= freeSP.value)

  i = i.concat(props.mech.SpecialEquipment.filter(x => x.ItemType === 'WeaponMod') as WeaponMod[])

  if (isAICapacityFull()) i = i.filter(x => !x.IsAI)

  return i
})

onMounted(() => {
  options.initialView = mobile.value ? 'list' : 'single'
})
</script>
