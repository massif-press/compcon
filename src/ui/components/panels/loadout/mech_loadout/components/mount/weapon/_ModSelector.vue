<template>
  <div>
    <cc-selector-table
      :items="availableMods"
      :headers="headers"
      sp-disable
      :sp="freeSP"
      :sp-ignore="showOverSP"
      item-type-fallback="WeaponMod"
      @equip="$emit('install', $event)"
    >
      <div v-if="weapon.Mod">
        <span class="overline">
          UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
          <span class="success--text text--darken-1">
            [ EQUIPMENT MODIFICATION REGISTERED ]
          </span>
        </span>
        <br />
        <span class="heading h1 accent--text" style="line-height: 20px">
          {{ weapon.Mod.Name }}
        </span>
        <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY INSTALLED</span>
      </div>
      <div v-else>
        <span class="overline">
          UNION ARMORY EQUIPMENT AUGMENTATION AUTHORIZATION: FRAME ARMAMENT//MODIFICATION
        </span>
        <br />
        <span class="heading h1 subtle--text text--lighten-1" style="line-height: 20px">
          NO SELECTION
        </span>
        <span class="flavor-text overline mt-n1 error--text" style="display: block">
          [ MODIFICATION DATA INVALID OR MISSING ]
        </span>
      </div>
      <div slot="extra-item" class="mt-2 mb-n2">
        <div class="mb-n2">
          <v-switch
            v-model="showUnlicensed"
            dense
            inset
            hide-details
            color="warning"
            class="mr-3 d-inline"
          >
            <cc-tooltip
              slot="label"
              simple
              inline
              :content="
                showUnlicensed ? 'Unlicensed equipment: SHOWN' : 'Unlicensed equipment: HIDDEN'
              "
            >
              <v-icon
                class="ml-n2"
                :color="showUnlicensed ? 'warning' : 'success'"
                v-html="showUnlicensed ? 'mdi-lock-open' : 'mdi-lock'"
              />
            </cc-tooltip>
          </v-switch>
        </div>
        <div class="mt-n4">
          <v-switch
            v-model="showOverSP"
            dense
            inset
            hide-details
            color="warning"
            class="mr-3 d-inline"
          >
            <cc-tooltip
              slot="label"
              simple
              inline
              :content="
                showOverSP
                  ? 'Systems exceeding SP Capacity: SHOWN'
                  : 'Systems exceeding SP Capacity: HIDDEN'
              "
            >
              <v-icon
                class="ml-n2"
                :color="showOverSP ? 'warning' : 'success'"
                v-html="'cci-system-point'"
              />
            </cc-tooltip>
          </v-switch>
        </div>
      </div>
    </cc-selector-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { MechSystem } from '@/class'
import { flavorID } from '@/io/Generators'
import { Bonus } from '@/classes/Bonus'

export default Vue.extend({
  name: 'mod-selector',
  props: {
    weapon: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { align: 'left', sortable: false, width: '5vw' },
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Mod', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'Applied To', align: 'left', value: 'AppliedString' },
      { text: 'SP', align: 'left', value: 'SP' },
      { text: '', align: 'center', value: 'Detail' },
    ],
    mods: [],
    showUnlicensed: false,
    showOverSP: false,
  }),
  computed: {
    freeSP(): number {
      return this.weapon.Mod ? this.mech.FreeSP + this.weapon.Mod.SP : this.mech.FreeSP
    },
    availableMods(): MechSystem[] {
      // filter by applied_to
      let i = this.mods.filter(x => x.AllowedTypes.includes(this.weapon.WeaponType))
      i = this.mods.filter(x => x.AllowedSizes.includes(this.weapon.Size))

      // // filter out any mount restrictions
      i = i.filter(x => !x.RestrictedTypes || !x.RestrictedTypes.includes(this.weapon.WeaponType))
      i = i.filter(x => !x.RestrictedSizes || !x.RestrictedSizes.includes(this.weapon.Size))

      // filter already equipped
      if (this.weapon.Mod) i = i.filter(x => x.ID !== this.weapon.Mod.ID)

      // filter unique
      i = i.filter(x => !this.mech.ActiveLoadout.UniqueMods.map(y => y.ID).includes(x.ID))

      // filter ai
      if (this.mech.ActiveLoadout.AICount >= 1 + Bonus.get('ai_cap', this.mech)) {
        i = i.filter(x => !x.IsAI)
      }

      if (!this.showUnlicensed) {
        i = i.filter(
          x => !x.LicenseLevel || this.mech.Pilot.has('License', x.License, x.LicenseLevel)
        )
      }

      // if (!this.showOverSP) {
      //   i = i.filter(x => x.SP <= this.freeSP)
      // }

      return i
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.mods = compendium.WeaponMods.filter(x => x.Source)
  },
  methods: {
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
