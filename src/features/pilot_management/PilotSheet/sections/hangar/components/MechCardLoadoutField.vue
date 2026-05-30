<template>
  <fieldset class="flavor-text">
    <legend class="px-2">
      Loadout <cc-slashes /> {{
        mech.MechLoadoutController.ActiveLoadout
          ? mech.MechLoadoutController.ActiveLoadout.Name
          : 'ERR'
      }}
    </legend>
    <div v-if="mech.MechLoadoutController.ActiveLoadout"
      class="px-2 pb-2">
      <span v-for="(item, i) in loadoutWeapons" :key="`weapon-${i}`">
        <span v-html-safe="item" />
        <span v-if="i + 1 < loadoutWeapons.length">&nbsp;&mdash;&nbsp;</span></span>
      <div class="mt-1" />
      <span v-for="(item, i) in loadoutSystems" :key="`system-${i}`">
        {{ Number(i) > 0 ? ' - ' : '' }}
        <span class="text-text"
          v-html-safe="item" />
      </span>
    </div>
  </fieldset>

</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'mech-card-loadout-field' })

const props = defineProps<{
  mech: object
}>()

const loadoutWeapons = computed(() => {
      const output = [] as string[];
      for (const mount of props.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        props.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        props.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        props.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
      )) {
        if (!mount.IsLocked) {
          let str = `<i style="opacity:0.8">${mount.Name}</i>:`;
          if (!mount.Weapons.length) str += ' EMPTY';
          else {
            mount.Weapons.forEach((w, i) => {
              str += `<span class='text-text'> ${w.Name}`;
              if (w.Mod) str += ` (${w.Mod.Name})`;
              if (i + 1 < mount.Weapons.length) str += ' /';
              str += '</span>';
            });
          }
          output.push(str);
        }
      }

      return output;
    })
const loadoutSystems = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.AllActiveSystems.map((x) => x.Name);
    })
</script>