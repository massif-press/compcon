<template>
  <pl-card-base ref="base"
    :title="$t('common.pilotWeapon')"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove', item)"
    @save="$emit('save')">
    <div v-if="item"
      class="text-left mt-n4"
      style="cursor: pointer !important"
      @click="($refs as any).base.openDetail()">

      <v-card-text v-if="item.Effect"
        class="mt-1">
        <div v-html-safe="item.Effect" />
      </v-card-text>


      <v-row align="center"
        justify="space-around"
        dense>
        <v-col cols="auto">
          <cc-range-element :range="item.Range" />
        </v-col>
        <v-col cols="auto">
          <cc-damage-element :damage="item.Damage"
            :type-override="item.DamageTypeOverride" />
        </v-col>
      </v-row>
      <v-row v-if="item.notes">
        <v-col v-for="(n, i) in item.notes"
          :key="`note_${i}`">
          <cc-tooltip simple
            inline
            :content="n">
            <v-icon size="small"
              color="active">
              mdi-note
            </v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>

    <template #selector>
      <cc-compendium-browser :items="weapons"
        item-type="PilotWeapon"
        :options="options"
        view-key="sel-pl-weapon"
        equippable
        :table-headers="headers"
        @equip="equip($event)">
        <template #header>
          <div class="heading h4 text-center text-accent">{{ $t('pm.loadout.selectPilotWeapon') }}</div>
        </template>

        <template #top>
          <div v-if="item">
            <span class="text-cc-overline">
              {{ $t('pm.loadout.gmsArmoryPrintid') }}: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success text--darken-1">
                {{ $t('pm.loadout.pilotMATERIELREGISTRATIONVERIFIED') }}
              </span>
            </span>
            <br />
            <div class="heading h2 text-accent mt-n2">
              <cc-slashes />
              {{ item.Name }}
            </div>
            <div class="flavor-text text-cc-overline mt-n1"
              style="display: block">
              {{ $t('pm.loadout.currentlyEQUIPPED') }}
            </div>
          </div>
          <div v-else>
            <span class="text-text-cc-overline">
              {{ $t('pm.loadout.gmsARMORYEQUIPMENTAUTHORIZATIONPILOTPERSONAL2') }}
            </span>
            <br />
            <span class="heading h1 text-disabled text--lighten-1"
              style="line-height: 20px">
              {{ $t('ui.widget.noSelection') }}
            </span>
            <span class="flavor-text text-cc-overline mt-n1 text-error"
              style="display: block">
              {{ $t('pm.loadout.materielIDINVALIDORMISSING') }}
            </span>
          </div>
        </template>
      </cc-compendium-browser>
    </template>
  </pl-card-base>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed, ref } from 'vue'
import PlCardBase from './_PLCardBase.vue'
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon'
import { CompendiumItem } from '@/classes/CompendiumItem'
import { ItemType } from '@/classes/enums'
import { PilotEquipment } from '@/classes/pilot/components/Loadout/equipment/PilotEquipment'
import { usePLCard } from './usePLCard'
import { notify } from '@kyvg/vue3-notification'

const props = withDefaults(defineProps<{
  item?: PilotWeapon | null
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
  { title: 'Range', key: 'Range' },
  { title: 'Damage', key: 'Damage' },
  { title: 'Tags', align: 'center', key: 'Tags' },
])

const options = ref({
  views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
  initialView: 'single',
  groups: ['lcp', 'type', 'none'],
  initialGroup: 'type',
  noSource: true,
  showExotics: true,
})

const exotics = computed((): PilotWeapon[] =>
  (props.pilot as any).SpecialEquipment.filter((x: any) => x.ItemType === 'PilotWeapon')
)

const weapons = computed((): PilotWeapon[] => {
  let result = allGear.value.filter(
    (x: PilotEquipment) => x.ItemType === ItemType.PilotWeapon && !x.IsHidden && !(x as any).IsExotic
  ) as PilotWeapon[]
  if (exotics.value.length) result = result.concat(exotics.value)
  return result
})

function equip(item: PilotWeapon) {
  emit('equip', CompendiumItem.Clone(item))
  emit('save')
  ;(base.value as any)?.closeSelector()
  notify({
    title: t('pm.loadout.weaponEquippedTitle'),
    text: t('pm.loadout.equippedText', { itemName: item.Name, pilotName: (props.pilot as any).Name }),
    data: { icon: 'cc:pilot' },
  })
}
</script>
