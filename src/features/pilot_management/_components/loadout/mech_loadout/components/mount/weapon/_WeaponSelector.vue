<template>
  <cc-compendium-browser :items="availableWeapons"
    item-type="MechWeapon"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="sel-mech-weapon"
    equippable
    @select="stageSelect($event)"
    @equip="handleEquip($event)">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.mechWeapons') }}</div>
    </template>
    <template #top>
      <v-row>
        <v-col>
          <div v-if="weaponSlot.Weapon">
            <div v-if="!mobile"
              class="text-cc-overline">
              {{ $t('pm.loadout.unionArmoryPrintid') }} {{ fID('ANN-NNN-NNN::AA//AA') }}
            </div>
            <div class="heading h2 text-accent">
              {{ weaponSlot.Weapon.Name }}
              <span v-if="selected"
                class="text-success">
                <v-icon icon="mdi-chevron-triple-right"
                  class="pb-1" />
                {{ selected.Name }}
              </span>
            </div>
            <div v-if="!selected"
              class="flavor-text text-cc-overline">
              {{ $t('pm.loadout.currentlyEQUIPPED') }}
            </div>
            <div v-else
              class="flavor-text text-cc-overline">
              <div v-if="!eq(weaponSlot.Weapon.Range, <Range[]>selected.Range)">
                <span v-html-safe="getRangeDisplay(weaponSlot.Weapon)"
                  class="text-accent" />
                <v-icon color="success"
                  size="small"
                  icon="mdi-chevron-triple-right"
                  class="mx-1" />
                <span v-html-safe="getRangeDisplay(<MechWeapon>selected)"
                  class="text-success" />
              </div>
              <div v-if="!eq(weaponSlot.Weapon.Damage, <Damage[]>selected.Damage)">
                <span v-html-safe="getDamageDisplay(weaponSlot.Weapon)"
                  class="text-accent" />
                <v-icon color="success"
                  size="small"
                  icon="mdi-chevron-triple-right"
                  class="mx-1" />
                <span v-html-safe="getDamageDisplay(<MechWeapon>selected)"
                  class="text-success" />
              </div>
              <div v-if="!eq(weaponSlot.Weapon.Tags, <Tag[]>selected.Tags)">
                <span v-for="t in weaponSlot.Weapon.Tags.filter(
                  x => !(<any>selected!.Tags.some(y => y.ID === x.ID))
                )"
                  :key="`ws-tag_${t.Name}`"
                  class="text-error">
                  <v-icon icon="mdi-minus"
                    size="x-small"
                    class="mr-n1" />
                  [{{ t.Name }}]
                </span>
                <span v-for="t in selected.Tags.filter(
                  x => !weaponSlot.Weapon!.Tags.some(y => y.ID === x.ID)
                )"
                  :key="`ws-tag-b_${t.Name}`"
                  class="text-success">
                  <v-icon icon="mdi-plus"
                    size="x-small"
                    class="mr-n1" />
                  [{{ t.Name }}]
                </span>
              </div>
            </div>
          </div>
          <div v-else-if="!mobile">
            <div class="text-cc-overline">
              {{ $t('pm.loadout.unionARMORYEQUIPMENTAUTHORIZATIONFRAMEEQUIPMENT') }}
            </div>
            <div class="heading h2 text-disabled">{{ $t('ui.widget.noSelection') }}</div>
            <div class="flavor-text overline text-error">{{ $t('pm.loadout.equipmentIDINVALIDORMISSING') }}</div>
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
import * as _ from 'lodash-es'
import { ref, computed, reactive, onMounted, toRef } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores'
import { Rules } from '@/classes/utility/Rules'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { Mech } from '@/classes/mech/Mech'
import { Range } from '@/classes/Range'
import { Damage } from '@/classes/Damage'
import Tag from '@/classes/Tag'
import WeaponSlot from '@/classes/mech/components/mount/WeaponSlot'
import { useLcpFilter } from '../../_composables/useLcpFilter'
import SelectorFilterSwitches from '../../_SelectorFilterSwitches.vue'

const props = defineProps<{
  weaponSlot: WeaponSlot
  mech: Mech
}>()

const emit = defineEmits<{
  equip: [event: any]
}>()

const { smAndDown: mobile } = useDisplay()
const { showUnlicensed, showOverSP, fID, filterByLcp, isLicensed, isAICapacityFull } =
  useLcpFilter(toRef(props, 'mech'))

const options = reactive({
  views: ['list', 'single', 'table', 'cards', 'scatter', 'bar', 'compare'],
  initialView: 'single',
  groups: ['source', 'lcp', 'license', 'none'],
  initialGroup: 'license',
  showExotics: true,
})

const headers = [
  { title: 'Manufacturer', align: 'left', key: 'Source' },
  { title: 'Weapon', align: 'left', key: 'Name' },
  { title: 'License', align: 'left', key: 'LicenseString' },
  { title: 'Size', align: 'left', key: 'Size' },
  { title: 'Type', align: 'left', key: 'WeaponTypes' },
  { title: 'Tags', align: 'center', key: 'Tags' },
  { title: 'Range', align: 'left', key: 'Range' },
  { title: 'Damage', align: 'left', key: 'Damage' },
]

const selected = ref<MechWeapon | null>(null)

const manufacturers = computed(() => CompendiumStore().Manufacturers)

const availableWeapons = computed((): MechWeapon[] => {
  const fittings = Rules.MountFittings[props.weaponSlot.Size]
  let i = filterByLcp(CompendiumStore().MechWeapons).filter(
    x => x.Source && fittings.includes(x.Size) && !x.IsHidden && !x.IsExotic
  )

  if (props.weaponSlot.Weapon) i = i.filter(x => x.ID !== props.weaponSlot.Weapon!.ID)
  if (!showUnlicensed.value) i = i.filter(x => isLicensed(x))

  i = i.concat(
    props.mech.Pilot.SpecialEquipment.filter(
      x => x.ItemType === 'MechWeapon' && fittings.includes(x.Size)
    ) as MechWeapon[]
  )

  i = i.filter(
    x =>
      !props.mech.MechLoadoutController.ActiveLoadout.UniqueWeapons.map(y => y.ID).includes(x.ID)
  )

  if (isAICapacityFull()) i = i.filter(x => !x.IsAI)

  return i
})

function handleEquip(event: any) {
  emit('equip', event)
}

function stageSelect(event: any) {
  selected.value = event || null
}

function getRangeDisplay(item: MechWeapon): string {
  if (!item.Range) return '---'
  const rangeStrs: string[] = []
  item.Range.forEach(r => rangeStrs.push(`${r.Type} ${r.Value}`))
  return rangeStrs.join('/')
}

function getDamageDisplay(item: MechWeapon): string {
  if (!item.Damage) return '---'
  const damageStrs: string[] = []
  item.Damage.forEach(d => damageStrs.push(`${d.Type} ${d.Value}`))
  return damageStrs.join('/')
}

function eq(a: Range[] | Damage[] | Tag[], b: Range[] | Damage[] | Tag[]): boolean {
  if (!a || !b) return false
  if (a.length !== b.length) return false
  const aIDs = a.map(x => (x as any).ID || x.Value || x.Type)
  const bIDs = b.map(x => (x as any).ID || x.Value || x.Type)
  return _.isEqual(_.sortBy(aIDs), _.sortBy(bIDs))
}

onMounted(() => {
  options.initialView = mobile.value ? 'list' : 'single'
})
</script>
