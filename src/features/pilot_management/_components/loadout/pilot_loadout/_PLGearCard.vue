<template>
  <pl-card-base ref="base"
    title="PILOT GEAR"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove', item)"
    @save="$emit('save')">
    <template v-if="item"
      #title-items>
      <div class="text-cc-overline pt-1">ITEM USES</div>
      <div class="text-right">
        <v-icon color="secondary"
          :icon="!item.MaxUses ? 'mdi-infinity' : 'mdi-hexagon-slice-6'" />
      </div>
    </template>

    <div v-if="item"
      class="text-left"
      style="cursor: pointer !important"
      @click="($refs as any).base.openDetail()">
      <v-card-text v-if="item.Effect"
        class="py-0 mb-2">
        <div v-html-safe="item.Effect" />
      </v-card-text>
      <!-- <v-card-text v-if="item.Description"
        class="py-0 mb-2">
        <div v-html-safe="item.Description" />
      </v-card-text> -->
    </div>

    <template #selector>
      <cc-compendium-browser :items="gear"
        item-type="PilotGear"
        :options="options"
        view-key="sel-pl-gear"
        equippable
        :table-headers="headers"
        @equip="equip($event)">
        <template #header>
          <div class="heading h4 text-center text-accent">Select Pilot Equipment</div>
        </template>

        <template #top>
          <div v-if="item">
            <span class="text-cc-overline">
              GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success text--darken-1">
                [ PILOT MATERIEL REGISTRATION VERIFIED ]
              </span>
            </span>
            <br />
            <div class="heading h2 text-accent mt-n2">
              <cc-slashes />
              {{ item.Name }}
            </div>
            <div class="flavor-text text-cc-overline mt-n1"
              style="display: block">
              CURRENTLY EQUIPPED
            </div>
          </div>
          <div v-else>
            <span class="text-overline">
              GMS EQUIPMENT AUTHORIZATION: PILOT/ADDITIONAL GEAR (ANY)
            </span>
            <br />
            <span class="heading h1 text-disabled text--lighten-1"
              style="line-height: 20px">
              NO SELECTION
            </span>
            <span class="flavor-text text-cc-overline mt-n1 text-error"
              style="display: block">
              [ EQUIPMENT ID INVALID OR MISSING ]
            </span>
          </div>
        </template>
      </cc-compendium-browser>
    </template>
  </pl-card-base>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed, ref } from 'vue'
import PlCardBase from './_PLCardBase.vue'
import { PilotGear } from '@/classes/pilot/components/Loadout/equipment/PilotGear'
import { CompendiumItem } from '@/classes/CompendiumItem'
import { ItemType } from '@/classes/enums'
import { PilotEquipment } from '@/classes/pilot/components/Loadout/equipment/PilotEquipment'
import { usePLCard } from './usePLCard'
import { notify } from '@kyvg/vue3-notification'

const props = withDefaults(defineProps<{
  item?: object | null
  extended?: boolean
  readonly?: boolean
  pilot: Pilot
}>(), {
  item: null,
})

const emit = defineEmits<{ equip: [item: any]; remove: [item: any]; save: [] }>()

const { allGear, fID } = usePLCard(props)
const base = ref<InstanceType<typeof PlCardBase> | null>(null)

const headers = ref([
  { title: 'Content Pack', key: 'LcpName' },
  { title: 'Type', key: 'Type' },
  { title: 'Item', key: 'Name' },
  { title: 'Uses', key: 'MaxUses' },
  { title: 'Tags', align: 'center', key: 'Tags' },
])

const options = ref({
  views: ['single', 'table', 'cards'],
  initialView: 'single',
  groups: ['lcp', 'type', 'none'],
  initialGroup: 'type',
  noSource: true,
  showExotics: true,
})

const exotics = computed((): PilotGear[] =>
  (props.pilot as any).SpecialEquipment.filter((x: any) => x.ItemType === 'PilotGear')
)

const gear = computed((): PilotGear[] => {
  let result = allGear.value.filter(
    (x: PilotEquipment) => x.ItemType === ItemType.PilotGear && !x.IsHidden && !(x as any).IsExotic
  ) as PilotGear[]
  if (exotics.value.length) result = result.concat(exotics.value)
  return result
})

function equip(item: PilotGear) {
  emit('equip', CompendiumItem.Clone(item))
  emit('save')
  ;(base.value as any)?.closeSelector()
  notify({
    title: 'Pilot Gear Equipped',
    text: `${item.Name} equipped to ${(props.pilot as any).Name}.`,
    data: { icon: 'cc:pilot' },
  })
}
</script>
