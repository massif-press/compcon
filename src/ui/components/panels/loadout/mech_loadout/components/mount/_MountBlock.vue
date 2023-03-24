<template>
  <v-col
    :style="$vuetify.display.lgAndUp ? 'min-width: 40vw' : ''"
    :cols="$vuetify.display.mdAndDown ? '12' : ''"
  >
    <fieldset class="ma-0 py-0" style="height: 100%">
      <legend :style="`color: ${color}`" class="heading h3">
        <cc-tooltip
          title="Available Mount Fittings"
          :content="`${mount.AvailableFittings}`"
        >
          {{ mount.Name }}
          <span v-if="impArm">(IMPROVED ARMAMENT)</span>
        </cc-tooltip>
      </legend>
      <cb-mount-menu
        v-if="!intWeapon && !integrated && !readonly"
        :key="mech.AvailableBonuses.length"
        :mech="mech"
        :mount="mount"
      />
      <cb-card
        v-for="b in mount.Bonuses"
        :key="`${mount.ID}_bonus-${b.ID}`"
        :bonus="b"
      />
      <sh-lock-card v-if="mount.IsLocked" />
      <v-row v-else no-gutters align="center">
        <v-col>
          <weapon-slot-card
            v-for="(s, i) in mount.Slots"
            :key="`slot_${mount.ID}-${i}`"
            :weapon-slot="s"
            :mech="mech"
            :mount="mount"
            :readonly="integrated || readonly"
            :int-weapon="intWeapon"
          />
        </v-col>
      </v-row>
    </fieldset>
  </v-col>
</template>

<script lang="ts">
import WeaponSlotCard from './weapon/_WeaponSlotCard.vue';
import CbMountMenu from './_CbMountMenu.vue';
import CbCard from './_CbCard.vue';
import ShLockCard from './_ShLockCard.vue';

export default {
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
};
</script>

<style scoped>
fieldset {
  border-color: rgb(var(--v-theme-subtle));
  border-radius: 5px;
  /* margin-bottom: 12px; */
  padding-left: 4px;
}

legend {
  padding: 0 8px;
}
</style>
