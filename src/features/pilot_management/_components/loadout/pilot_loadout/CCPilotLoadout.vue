<template>
  <div :key="controller.ActiveLoadoutIndex"
    :class="noFrame ? '' : mobile ? 'px-2 mt-3' : 'px-6 mt-3'">
    <cc-loadout-panel :loadouts="controller.Loadouts"
      :active-loadout="controller.ActiveLoadout"
      color="primary"
      :readonly="readonly"
      :no-frame="noFrame"
      @set-active="controller.ActiveLoadout = $event"
      @add-loadout="controller.AddLoadout()"
      @clone-loadout="controller.CloneLoadout()"
      @remove-loadout="controller.RemoveLoadout()">
      <v-row :dense="mobile">
        <pilot-armor-card v-for="i in controller.MaxArmorSlots"
          :key="`pa_${i}`"
          :item="controller.ActiveLoadout.Armor[i - 1]"
          :readonly="readonly"
          :pilot="pilot"
          @equip="controller.ActiveLoadout.Add($event, i - 1)"
          @remove="controller.ActiveLoadout.Remove($event)"
          @save="pilot.SaveController.save()" />
        <pilot-weapon-card v-for="i in controller.MaxWeaponSlots"
          :key="`pw_${i}`"
          :item="controller.ActiveLoadout.Weapons[i - 1]"
          :readonly="readonly"
          :pilot="pilot"
          @equip="controller.ActiveLoadout.Add($event, i - 1)"
          @remove="controller.ActiveLoadout.Remove($event)"
          @save="pilot.SaveController.save()" />
        <pilot-gear-card v-for="i in controller.MaxGearSlots"
          :key="`pg_${i}`"
          :item="controller.ActiveLoadout.Gear[i - 1]"
          :readonly="readonly"
          :pilot="pilot"
          @equip="controller.ActiveLoadout.Add($event, i - 1)"
          @remove="controller.ActiveLoadout.Remove($event)"
          @save="pilot.SaveController.save()" />
      </v-row>
    </cc-loadout-panel>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMobile } from '@/composables/useMobile'
import CCLoadoutPanel from '@/features/pilot_management/_components/loadout/CCLoadoutPanel.vue'
import PilotArmorCard from './_PLArmorCard.vue'
import PilotWeaponCard from './_PLWeaponCard.vue'
import PilotGearCard from './_PLGearCard.vue'

const props = defineProps({
    pilot: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
    noFrame: {
      type: Boolean,
      default: false,
    },
  })

const { mobile, portrait } = useMobile()

const controller = computed(() => {return props.pilot.PilotLoadoutController})

function exotics(type: string) {return props.pilot.SpecialEquipment.filter(x => x.ItemType === type)}
</script>
