<template>
  <v-col
    :style="$vuetify.breakpoint.lgAndUp ? 'min-width: 40vw' : ''"
    :cols="$vuetify.breakpoint.mdAndDown ? '12' : ''"
  >
    <fieldset class="ma-0 py-0" style="height: 100%">
      <legend :style="`color: ${color}`" class="heading h3">
        {{ mount.Name }}
      </legend>
      <cb-card v-for="b in mount.Bonuses" :key="`${mount.ID}_bonus-${b.ID}`" :bonus="b" />
      <sh-lock-card v-if="mount.IsLocked" />
      <v-row v-else no-gutters align="center">
        <v-col>
          <active-weapon-card
            v-for="(s, i) in mount.Slots"
            :key="`slot_${mount.ID}-${i}`"
            :item="s.Weapon"
            :mech="mech"
            :mount="mount"
            :rest="rest"
          />
        </v-col>
      </v-row>
    </fieldset>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import ActiveWeaponCard from './_ActiveWeaponCard.vue'
import CbCard from '../mech_loadout/components/mount/_CbCard.vue'
import ShLockCard from '../mech_loadout/components/mount/_ShLockCard.vue'

export default Vue.extend({
  name: 'mount-block',
  components: { ActiveWeaponCard, CbCard, ShLockCard },
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
    rest: {
      type: Boolean,
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
