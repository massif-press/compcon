<template>
  <v-col style="min-width: 40vw">
    <fieldset class="ma-0" style="height: 100%">
      <legend :style="`color: ${color}`" class="heading h3">
        {{ mount.Name }}
        <span v-if="impArm">(IMPROVED ARMAMENT)</span>
      </legend>
      <cb-mount-menu
        v-if="!intWeapon && !integrated && !readonly"
        :key="mech.AvailableBonuses.length"
        :mech="mech"
        :mount="mount"
      />
      <cb-card v-for="b in mount.Bonuses" :key="`${mount.ID}_bonus-${b.ID}`" :bonus="b" />
      <sh-lock-card v-if="mount.IsLocked" />
      <div v-else>
        <weapon-slot-card
          v-for="(s, i) in mount.Slots"
          :key="`slot_${mount.ID}-${i}`"
          :weapon-slot="s"
          :mech="mech"
          :mount="mount"
          :readonly="integrated || readonly"
          :int-weapon="intWeapon"
        />
      </div>
    </fieldset>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import WeaponSlotCard from './weapon/_WeaponSlotCard.vue'
import CbMountMenu from './_CbMountMenu.vue'
import CbCard from './_CbCard.vue'
import ShLockCard from './_ShLockCard.vue'

export default Vue.extend({
  name: 'mount-block',
  components: { WeaponSlotCard, CbMountMenu, CbCard, ShLockCard },
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    mount: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    integrated: {
      type: Boolean,
    },
    intWeapon: {
      type: Boolean,
    },
    impArm: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
  },
})
</script>

<style scoped>
fieldset {
  border-color: var(--v-grey-darken2);
  border-radius: 5px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  padding: 3px 12px;
}
</style>
