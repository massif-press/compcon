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
          :owner="owner"
          :encounter="encounterInstance"
          @deploy="$emit('deploy', $event)" />
        <pilot-armor-card v-else-if="item.ItemType.toLowerCase() === 'pilotarmor'"
          :item="item"
          :pilot="pilot"
          :owner="owner"
          :encounter="encounterInstance"
          @deploy="$emit('deploy', $event)" />
        <pilot-gear-card v-else
          :owner="owner"
          :item="item"
          :pilot="pilot"
          :encounter="encounterInstance"
          @deploy="$emit('deploy', $event)" />
      </fieldset>
    </template>
  </cc-masonry-grid>
</template>

<script lang="ts">
import PilotGearCard from './_pilotGearCard.vue'
import PilotWeaponCard from './_pilotWeaponCard.vue'
import PilotArmorCard from './_pilotArmorCard.vue'
import { useMobile } from '@/mixins/useMobile';

export default {
  name: 'PilotCombatLoadout',
  components: {
    PilotWeaponCard,
    PilotGearCard,
    PilotArmorCard,
  },
  mixins: [useMobile],
  props: {
    owner: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
  computed: {
    xlColumns() {
      if (this.mobile) return 1
      else return this.encounterInstance.MaxMasonryColumns
    },
    pilot() {
      return this.owner.actor
    },
    armor() {
      return this.pilot.Loadout.Armor
    },
    weapons() {
      return this.pilot.Loadout.Weapons
    },
    gear() {
      return this.pilot.Loadout.Gear
    },
    equipment() {
      return this.armor.concat(this.weapons).concat(this.gear).filter(Boolean)
    },
  },
}
</script>
