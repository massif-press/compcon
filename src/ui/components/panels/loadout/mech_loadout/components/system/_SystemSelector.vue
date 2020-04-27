<template>
  <div>
    <cc-selector-table
      :items="availableSystems"
      :headers="headers"
      item-type-fallback="MechSystem"
      @equip="$emit('equip', $event)"
    >
      <div v-if="equipped">
        <span class="overline">
          UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
          <span class="success--text text--darken-1">
            [ FRAME EQUIPMENT REGISTRATION VERIFIED ]
          </span>
        </span>
        <br />
        <span class="heading h1 accent--text" style="line-height: 20px">
          {{ equipped.Name }}
        </span>
        <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
      </div>
      <div v-else>
        <span class="overline">
          UNION ARMORY EQUIPMENT AUTHORIZATION: FRAME EQUIPMENT//COMBAT SYSTEM
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
import { MechSystem } from '@/class'
import { flavorID } from '@/io/Generators'

export default Vue.extend({
  name: 'system-selector',
  props: {
    equipped: {
      type: Object,
      required: false,
      default: null,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'System', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
      { text: '', align: 'center', value: 'Detail' },
    ],
    systems: [],
    showUnlicensed: false,
    showOverSP: false,
  }),
  computed: {
    freeSP(): number {
      return this.equipped ? this.mech.FreeSP + this.equipped.SP : this.mech.FreeSP
    },
    availableSystems(): MechSystem[] {
      // filter unique
      let i = this.systems.filter(
        x => !this.mech.ActiveLoadout.UniqueSystems.map(y => y.ID).includes(x.ID)
      )

      // filter ai
      if (this.mech.ActiveLoadout.AICount >= this.mech.Pilot.AICapacity) {
        i = i.filter(x => !x.IsAI)
      }

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
    this.systems = compendium.MechSystems.filter(x => x.Source)
  },
  methods: {
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
