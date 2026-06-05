<template>
  <div>
    <CCLoadoutPanel :loadouts="mech.MechLoadoutController.Loadouts"
      :active-loadout="mech.MechLoadoutController.ActiveLoadout"
      :color="color"
      :readonly="readonly"
      :no-frame="noFrame"
      @set-active="$event ? mech.MechLoadoutController.ActiveLoadout = $event : null"
      @add-loadout="mech.MechLoadoutController.AddLoadout()"
      @clone-loadout="mech.MechLoadoutController.CloneLoadout()"
      @remove-loadout="mech.MechLoadoutController.RemoveLoadout()">
      <cc-masonry-grid :items="mounts"
        :gap="16"
        :key-mapper="mountKey">
        <template #default="{ item }">
          <mount-block :readonly="readonly"
            :integrated="item.isIntegrated"
            :int-weapon="item.isIntWeapon"
            :imp-arm="item.isImpArm"
            :superheavy="item.isSuperheavy"
            :mount="<any>item.mount"
            :mech="mech"
            :color="color" />
        </template>
      </cc-masonry-grid>

      <v-divider class="my-2" />

      <systems-block :mech="mech"
        :color="color"
        :readonly="readonly" />
    </CCLoadoutPanel>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CCLoadoutPanel from '@/features/pilot_management/_components/loadout/CCLoadoutPanel.vue'
import MountBlock from './components/mount/_MountBlock.vue'
import SystemsBlock from './components/system/_SystemsBlock.vue'
import { Mech } from '@/classes/mech/Mech'
import Mount from '@/classes/mech/components/mount/Mount'

defineOptions({ name: 'MechLoadoutBlock' })

type MountItem = {
  mount: Mount
  isIntegrated: boolean
  isIntWeapon: boolean
  isImpArm: boolean
  isSuperheavy: boolean
}

const props = withDefaults(defineProps<{
  mech: Mech
  readonly?: boolean
  active?: boolean
  noFrame?: boolean
}>(), {
  noFrame: false,
})

const color = computed(() => (props.mech as any).Frame.ManufacturerColor)

const mounts = computed((): MountItem[] => {
  const m = props.mech as any
  const items: MountItem[] = []

  m.MechLoadoutController.ActiveLoadout.IntegratedMounts.forEach((im: any) => {
    items.push({ mount: im, isIntegrated: true, isIntWeapon: false, isImpArm: false, isSuperheavy: false })
  })

  if (m.Pilot.has('CoreBonus', 'cb_integrated_weapon'))
    items.push({ mount: m.MechLoadoutController.ActiveLoadout.IntegratedWeaponMount, isIntegrated: false, isIntWeapon: true, isImpArm: false, isSuperheavy: false })

  if (m.MechLoadoutController.ActiveLoadout.EquippableMounts.length < 3) {
    if (m.Pilot.has('CoreBonus', 'cb_superheavy_mounting'))
      items.push({ mount: m.MechLoadoutController.ActiveLoadout.SuperheavyMount, isIntegrated: false, isIntWeapon: false, isImpArm: false, isSuperheavy: true })
    if (m.Pilot.has('CoreBonus', 'cb_improved_armament'))
      items.push({ mount: m.MechLoadoutController.ActiveLoadout.ImprovedArmamentMount, isIntegrated: false, isIntWeapon: false, isImpArm: true, isSuperheavy: false })
  }

  for (const mount of m.MechLoadoutController.ActiveLoadout.EquippableMounts) {
    items.push({ mount, isIntegrated: false, isIntWeapon: false, isImpArm: false, isSuperheavy: false })
  }

  return items
})

function mountKey(item: MountItem, index: number) {
  if (item.isIntegrated) return `integrated-${index}`
  if (item.isIntWeapon) return 'int-weapon'
  if (item.isImpArm) return 'imp-arm'
  if (item.isSuperheavy) return 'superheavy'
  return `equippable-${index}`
}
</script>
