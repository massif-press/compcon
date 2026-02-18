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
      <span v-for="(item, i) in loadoutWeapons">
        <span v-html-safe="item" />
        <span v-if="i + 1 < loadoutWeapons.length">&nbsp;&mdash;&nbsp;</span></span>
      <div class="mt-1" />
      <span v-for="(item, i) in loadoutSystems">
        {{ Number(i) > 0 ? ' - ' : '' }}
        <span class="text-text"
          v-html-safe="item" />
      </span>
    </div>
  </fieldset>

</template>

<script lang="ts">
export default {
  name: 'mech-card-loadout-field',
  props: {
    mech: { type: Object, required: true }
  },
  computed: {
    loadoutWeapons() {
      const output = [] as string[];
      for (const mount of this.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        this.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
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
    },
    loadoutSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.AllActiveSystems.map((x) => x.Name);
    },
  }
}
</script>