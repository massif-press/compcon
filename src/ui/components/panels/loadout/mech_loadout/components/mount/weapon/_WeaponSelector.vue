<template>
  <div>
    <cc-selector-table
      :items="availableWeapons"
      :headers="headers"
      item-type-fallback="MechWeapon"
      @equip="$emit('equip', $event)"
    >
      <div v-if="weaponSlot.Weapon">
        <span class="overline">
          UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
          <span class="success--text text--darken-1">
            [ FRAME EQUIPMENT REGISTRATION VERIFIED ]
          </span>
        </span>
        <br />
        <span class="heading h1 accent--text" style="line-height: 20px">
          {{ weaponSlot.Weapon.Name }}
        </span>
        <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
      </div>
      <div v-else>
        <span class="overline">
          UNION ARMORY EQUIPMENT AUTHORIZATION: FRAME EQUIPMENT//ARMAMENT::{{ weaponSlot.Size }}
          MOUNT
        </span>
        <br />
        <span class="heading h1 subtle--text text--lighten-1" style="line-height: 20px">
          NO SELECTION
        </span>
        <span class="flavor-text overline mt-n1 error--text" style="display: block">
          [ EQUIPMENT ID INVALID OR MISSING ]
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
                v-html="showOverSP ? 'mdi-flash-off' : 'mdi-flash'"
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
import { Rules, MechWeapon } from '@/class'
import { flavorID } from '@/io/Generators'

export default Vue.extend({
  name: 'weapon-selector',
  props: {
    weaponSlot: {
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
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Weapon', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'Size', align: 'left', value: 'Size' },
      { text: 'Type', align: 'left', value: 'Type' },
      { text: 'Range', align: 'left', value: 'Range[0].Max' },
      { text: 'Damage', align: 'left', value: 'Damage[0].Max' },
      { text: 'SP', align: 'left', value: 'SP' },
      { text: '', align: 'center', value: 'Detail' },
    ],
    weapons: [],
    showUnlicensed: false,
    showOverSP: false,
  }),
  computed: {
    freeSP(): number {
      return this.weaponSlot.Weapon
        ? this.mech.FreeSP + this.weaponSlot.Weapon.SP
        : this.mech.FreeSP
    },
    availableWeapons(): MechWeapon[] {
      const fittings = Rules.MountFittings[this.weaponSlot.Size]
      // filter by fitting size
      let i = this.weapons.filter(x => fittings.includes(x.Size))

      // filter already equipped
      if (this.weaponSlot.Weapon) i = i.filter(x => x.ID !== this.weaponSlot.Weapon.ID)

      // filter unique
      i = i.filter(x => !this.mech.ActiveLoadout.UniqueWeapons.map(y => y.ID).includes(x.ID))

      if (!this.showUnlicensed) {
        i = i.filter(
          x => x.Source === 'GMS' || this.mech.Pilot.has('License', x.License, x.LicenseLevel)
        )
      }
      if (!this.showOverSP) {
        i = i.filter(x => x.SP <= this.freeSP)
      }

      return i
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.weapons = compendium.MechWeapons.filter(x => x.Source)
  },
  methods: {
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
