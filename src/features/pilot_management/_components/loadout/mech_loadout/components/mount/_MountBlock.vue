<template>
  <fieldset class="pb-2 px-3"
    style="border-color: rgba(155, 155, 155, 0.6)">
    <legend :style="`color: ${color}`"
      class="heading h4 mx-2">
      {{ mount.Name }}
      <span v-if="impArm"
        class="text-cc-overline">{{ $t('pm.loadout.improvedARMAMENT') }}</span>
      <span v-if="superheavy"
        class="text-cc-overline">{{ $t('pm.loadout.superheavyMOUNTING') }}</span>
    </legend>

    <cb-mount-menu v-if="!intWeapon && !integrated && !readonly"
      :mech="mech"
      :mount="mount" />
    <cb-card v-for="(b, index) in mount.Bonuses"
      :key="`bonus-${index}`"
      :bonus="b" />
    <sh-lock-card v-if="mount.IsLocked" />
    <weapon-slot-card v-for="(s, index) in mount.Slots"
      v-if="!mount.IsLocked"
      :key="`slot-${index}`"
      :weapon-slot="s"
      :mech="mech"
      :mount="mount"
      :readonly="readonly"
      :int-weapon="intWeapon || integrated" />
  </fieldset>
</template>

<script setup lang="ts">
import type { Mount } from '@/classes/mech/components/mount/Mount'
import type { Mech } from '@/classes/mech/Mech'
import WeaponSlotCard from './weapon/_WeaponSlotCard.vue';
import CbMountMenu from './_CbMountMenu.vue';
import CbCard from './_CbCard.vue';
import ShLockCard from './_ShLockCard.vue';

const props = withDefaults(defineProps<{
  color?: string
  mount: Mount
  mech: Mech
  integrated?: boolean
  intWeapon?: boolean
  impArm?: boolean
  readonly?: boolean
  superheavy?: boolean
}>(), {
  color: 'primary'
})
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
