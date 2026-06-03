<template>
  <cc-masonry-grid :items="equipment"
    :xl-columns="xlColumns">
    <template #default="{ item }">
      <fieldset class="pb-2 px-3"
        style="border-color: rgba(155, 155, 155, 0.6)">
        <legend class="heading h4 mx-2 px-2 text-accent">
          {{ item.Name }}
        </legend>
        <pilot-weapon-card v-if="item.ItemType.toLowerCase() === 'pilotweapon'"
          :item="item"
          :pilot="pilot"
          @deploy="$emit('deploy', $event)" />
        <pilot-armor-card v-else-if="item.ItemType.toLowerCase() === 'pilotarmor'"
          :item="item"
          :pilot="pilot"
          @deploy="$emit('deploy', $event)" />
        <pilot-gear-card v-else
          :item="item"
          :pilot="pilot"
          @deploy="$emit('deploy', $event)" />
      </fieldset>
    </template>
  </cc-masonry-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEncounterContext } from '../../encounterContext'
import { useDisplay } from 'vuetify'
import PilotGearCard from './_pilotGearCard.vue'
import PilotWeaponCard from './_pilotWeaponCard.vue'
import PilotArmorCard from './_pilotArmorCard.vue'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance.js'

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps({
})

const emit = defineEmits(['deploy'])

const { smAndDown: mobile, xs: portrait } = useDisplay()

const xlColumns = computed(() => mobile.value ? 1 : encounterInstance.value.MaxMasonryColumns)
const pilot = computed(() => (owner.value as any).actor)
const armor = computed(() => pilot.value.Loadout.Armor)
const weapons = computed(() => pilot.value.Loadout.Weapons)
const gear = computed(() => pilot.value.Loadout.Gear)
const equipment = computed(() => armor.value.concat(weapons.value).concat(gear.value).filter(Boolean))
</script>
