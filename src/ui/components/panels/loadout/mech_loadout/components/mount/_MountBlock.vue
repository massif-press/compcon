<template>
  <v-col
    :style="$vuetify.breakpoint.lgAndUp ? 'min-width: 40vw' : ''"
    :cols="$vuetify.breakpoint.mdAndDown ? '12' : ''"
  >
    <fieldset class="ma-0 py-0" style="height: 100%">
      <legend :style="`color: ${color}`" class="heading h3">
        <cc-tooltip title="Available Mount Fittings" :content="`${mount.AvailableFittings}`">
          {{ mount.Name }}
          <span v-if="impArm">(IMPROVED ARMAMENT)</span>
          <span v-if="superheavy">(SUPERHEAVY MOUNTING)</span>
        </cc-tooltip>
      </legend>
      <cb-mount-menu
        v-if="!integrated && !readonly && modifiable"
        :key="mech.AvailableBonuses.length"
        :mech="mech"
        :mount="mount"
      />
      <cb-card v-for="b in mount.Bonuses" :key="`${mount.ID}_bonus-${b.ID}`" :bonus="b" />
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
            :modifiable="modifiable"
          />
        </v-col>
      </v-row>
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
    impArm: {
      type: Boolean,
    },
    superheavy: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
  },
  computed: {
    modifiable() {
      return this.mount.IsModifiable
    },
  },
})
</script>

<style scoped>
fieldset {
  border-color: var(--v-subtle-base);
  border-radius: 5px;
  /* margin-bottom: 12px; */
  padding-left: 4px;
}

legend {
  padding: 0 8px;
}
</style>
