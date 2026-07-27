<template>
  <fieldset class="pb-2 px-3"
    style="border-color: rgba(155, 155, 155, 0.6)">
    <legend :style="`color: ${color}`"
      class="heading h4 mx-2">
      {{ mountName }}
      <span v-if="impArm"
        class="text-cc-overline">{{ $t('pm.loadout.improvedARMAMENT') }}</span>
      <span v-if="superheavy"
        class="text-cc-overline">{{ $t('pm.loadout.superheavyMOUNTING') }}</span>
    </legend>

    <cb-mount-menu v-if="!intWeapon && !integrated && !readonly"
      :mech="mech"
      :mount="asEquippable" />
    <cb-card v-for="(b, index) in mountBonuses"
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type Mount from '@/classes/mech/components/mount/Mount'
import type EquippableMount from '@/classes/mech/components/mount/EquippableMount'
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

const asEquippable = computed(() => props.mount as EquippableMount)
const mountBonuses = computed(() => asEquippable.value.Bonuses ?? [])

const { t } = useI18n()

const mountTypeKey: Record<string, string> = {
  Main: 'main',
  Heavy: 'heavy',
  'Aux/Aux': 'aux_aux',
  Aux: 'aux',
  'Main/Aux': 'main_aux',
  Flex: 'flex',
  Integrated: 'integrated',
  Superheavy: 'superheavy',
}

const mountName = computed(() => {
  if (props.mount.Name !== `${props.mount.Type} Mount`) return props.mount.Name
  const key = mountTypeKey[props.mount.Type] ?? props.mount.Type.toLowerCase()
  return `${t(`enums.mountType.${key}`)} ${t('common.mount')}`
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
