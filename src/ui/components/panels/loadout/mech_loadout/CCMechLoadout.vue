<template>
  <div>
    <cc-loadout-panel :loadouts="mech.MechLoadoutController.Loadouts"
      :active-loadout="mech.MechLoadoutController.ActiveLoadout"
      :color="color"
      :readonly="readonly"
      :no-frame="noFrame"
      @set-active="mech.MechLoadoutController.ActiveLoadout = $event"
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
    </cc-loadout-panel>
  </div>
</template>

<script lang="ts">
import MountBlock from './components/mount/_MountBlock.vue'
import SystemsBlock from './components/system/_SystemsBlock.vue'
import { manufacturerColor } from './components/_utils'

export default {
  name: 'MechLoadoutBlock',
  components: { SystemsBlock, MountBlock },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
    noFrame: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    color() {
      return manufacturerColor(this.mech, this.$vuetify.theme.current.dark)
    },
    mounts(): {
      mount: any
      isIntegrated: boolean
      isIntWeapon: boolean
      isImpArm: boolean
      isSuperheavy: boolean
    }[] {
      const items = [] as {
        mount: any
        isIntegrated: boolean
        isIntWeapon: boolean
        isImpArm: boolean
        isSuperheavy: boolean
      }[]

      this.mech.MechLoadoutController.ActiveLoadout.IntegratedMounts.forEach(im => {
        items.push({
          mount: im,
          isIntegrated: true,
          isIntWeapon: false,
          isImpArm: false,
          isSuperheavy: false,
        })
      })

      if (this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'))
        items.push({
          mount: this.mech.MechLoadoutController.ActiveLoadout.IntegratedWeaponMount,
          isIntegrated: false,
          isIntWeapon: true,
          isImpArm: false,
          isSuperheavy: false,
        })

      if (this.mech.MechLoadoutController.ActiveLoadout.EquippableMounts.length < 3) {
        if (this.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting'))
          items.push({
            mount: this.mech.MechLoadoutController.ActiveLoadout.SuperheavyMount,
            isIntegrated: false,
            isIntWeapon: false,
            isImpArm: false,
            isSuperheavy: true,
          })
        else if (this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'))
          items.push({
            mount: this.mech.MechLoadoutController.ActiveLoadout.ImprovedArmamentMount,
            isIntegrated: false,
            isIntWeapon: false,
            isImpArm: true,
            isSuperheavy: false,
          })
      }

      for (const m of this.mech.MechLoadoutController.ActiveLoadout.EquippableMounts) {
        items.push({
          mount: m,
          isIntegrated: false,
          isIntWeapon: false,
          isImpArm: false,
          isSuperheavy: false,
        })
      }

      return items
    },
  },
  methods: {
    mountKey(item: any, index: number) {
      if (item.isIntegrated) return `integrated-${item.mount.ID || index}`
      if (item.isIntWeapon) return 'int-weapon'
      if (item.isImpArm) return 'imp-arm'
      if (item.isSuperheavy) return 'superheavy'
      return `equippable-${index}`
    },
  },
}
</script>
