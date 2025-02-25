<template>
  <fieldset class="pb-2 px-3" style="border-color: rgba(155, 155, 155, 0.6)">
    <legend :style="`color: ${color}`" class="heading h4 mx-2">
      {{ mount.Name }}
      <span class="text-cc-overline" v-if="impArm">(IMPROVED ARMAMENT)</span>
      <span class="text-cc-overline" v-if="superheavy">(SUPERHEAVY MOUNTING)</span>
    </legend>

    <cb-mount-menu v-if="!intWeapon && !integrated && !readonly" :mech="mech" :mount="mount" />
    <cb-card v-for="b in mount.Bonuses" :bonus="b" />
    <sh-lock-card v-if="mount.IsLocked" />
    <weapon-slot-card
      v-if="!mount.IsLocked"
      v-for="s in mount.Slots"
      :weapon-slot="s"
      :mech="mech"
      :mount="mount"
      :readonly="integrated || readonly"
      :int-weapon="intWeapon || integrated" />
  </fieldset>
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
    superheavy: {
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
