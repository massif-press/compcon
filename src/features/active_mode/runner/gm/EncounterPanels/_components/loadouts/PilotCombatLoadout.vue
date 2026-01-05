<template>
  <div class="text-cc-overline">// WEAPONS</div>
  <masonry-wall :items="equipment" :column-width="600" :gap="16" :min-columns="1" :max-columns="2">
    <template #default="{ item }">
      <fieldset class="pb-2 px-3" style="border-color: rgba(155, 155, 155, 0.6)">
        <legend class="heading h4 mx-2 px-2 text-accent">
          {{ item.Name }}
        </legend>
        <!-- <pilot-armor-card
      v-if="item.ItemType.toLowerCase() === 'armor'" />
      <pilot-weapon-card     v-else-if="item.ItemType.toLowerCase() === 'weapon'"/> -->
        <pilot-weapon-card
          v-if="item.ItemType.toLowerCase() === 'pilotweapon'"
          :item="item"
          :pilot="pilot"
          :encounter="encounterInstance" />
        <pilot-gear-card v-else :item="item" :pilot="pilot" :encounter="encounterInstance" />
        <!-- <pilot-gear-card
      v-else-if="item.ItemType.toLowerCase() === 'gear'" /> -->

        <!-- <mech-weapon-card
            v-if="s && s.Weapon"
            :key="s.ID"
            :item="s.Weapon"
            :mech="mech"
            :mount="item.mount"
            :encounter="encounterInstance"
            :int-weapon="item.isIntWeapon || item.isIntegrated"
            @deploy="$emit('deploy', $event)" /> -->
      </fieldset>
    </template>
  </masonry-wall>
</template>

<script>
import PilotGearCard from './_pilotGearCard.vue';
import PilotWeaponCard from './_pilotWeaponCard.vue';

export default {
  name: 'pilot-combat-loadout',
  components: {
    PilotWeaponCard,
    PilotGearCard,
  },
  props: {
    pilot: {
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
    armor() {
      return this.pilot.PilotLoadoutController.ActiveLoadout.Armor;
    },
    weapons() {
      return this.pilot.PilotLoadoutController.ActiveLoadout.Weapons;
    },
    gear() {
      return this.pilot.PilotLoadoutController.ActiveLoadout.Gear;
    },
    equipment() {
      return this.armor.concat(this.weapons).concat(this.gear);
    },
  },
};
</script>
