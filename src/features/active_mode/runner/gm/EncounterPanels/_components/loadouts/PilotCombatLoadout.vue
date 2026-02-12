<template>
  <masonry-wall :items="equipment"
    :column-width="600"
    :gap="16"
    :min-columns="1"
    :max-columns="2">
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
  </masonry-wall>
</template>

<script>
import PilotGearCard from './_pilotGearCard.vue';
import PilotWeaponCard from './_pilotWeaponCard.vue';
import PilotArmorCard from './_pilotArmorCard.vue';

export default {
  name: 'pilot-combat-loadout',
  components: {
    PilotWeaponCard,
    PilotGearCard,
    PilotArmorCard,
  },
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
    pilot() {
      return this.owner.actor;
    },
    armor() {
      return this.pilot.Loadout.Armor;
    },
    weapons() {
      return this.pilot.Loadout.Weapons;
    },
    gear() {
      return this.pilot.Loadout.Gear;
    },
    equipment() {
      return this.armor.concat(this.weapons).concat(this.gear);
    },
  },
};
</script>
