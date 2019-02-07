<template>
  <div>
    <b-card no-body>
      <b-tabs v-model="tabIndex">
        <!-- Render Tabs -->
        <b-tab :title="loadout.name" v-for="(loadout, index) in loadouts" :key="loadout.id">
          <b-container fluid>
            <!-- <p>Armor:</p> -->
            <br>
            <div v-for="n in max.armor" :key="`armor-iterator-${n-1}`">
              <gear-item v-if="loadout.items.armor[n-1]" itemType="Armor" :item="loadout.items.armor[n-1]" @clicked="openSelector(n - 1, 'armor')"/>
              <gear-item v-else itemType="Armor" empty @clicked="openSelector(n-1, 'armor')"/>
            </div>
            <!-- <p>Weapons:</p> -->
            <hr>
            <div v-for="n in max.weapons" :key="`weapon-iterator-${n-1}`">
              <gear-item v-if="loadout.items.weapon[n-1]" itemType="Weapon" :item="loadout.items.weapon[n-1]" @clicked="openSelector(n - 1, 'weapon')"/>
              <gear-item v-else itemType="Weapon" empty @clicked="openSelector(n-1, 'weapon')"/>
            </div>
            <!-- <p>Gear:</p> -->
            <hr>
            <div v-for="n in max.gear" :key="`gear-iterator-${n-1}`">
              <gear-item v-if="loadout.items.gear[n-1]" itemType="Gear" :item="loadout.items.gear[n-1]" @clicked="openSelector(n - 1, 'gear')"/>
              <gear-item v-else itemType="Gear" empty @clicked="openSelector(n-1, 'gear')"/>
            </div>
            <br>
            <b-row>
              <b-col>
                <div class="float-left" style="padding:10px">
                  <b-btn size="sm">
                    Rename Loadout
                  </b-btn>
                  <b-btn size="sm">
                    Duplicate Loadout
                  </b-btn>
                </div>
                <div class="float-right" style="padding:10px">
                  <b-btn size="sm" variant="danger" @click="()=>deleteLoadout(index)">
                    Delete {{loadout.name}}
                  </b-btn>
                </div>
              </b-col>
            </b-row>
          </b-container>
        </b-tab>

        <!-- New Tab Button (Using tabs slot) -->
        <b-nav-item slot="tabs" @click="()=>addLoadout()" v-b-tooltip.hover title="Add New Loadout">
          <v-icon name="plus-circle" scale="1.25"/>
        </b-nav-item>

        <!-- Render this if no tabs -->
        <div slot="empty" class="text-center text-muted">
          There are no saved gear loadouts for this pilot.
          <br> Create a new loadout by clicking the + button.
        </div>
      </b-tabs>
    </b-card>
    <selector-modal ref="gearSelectorModal" :loadoutIndex="tabIndex" :itemIndex="itemIndex" :itemType="itemType" />
  </div>
</template>

<script>
import GearItem from './GearItem'
import GearSelector from './PilotGearSelector'
import io from '@/store/data_io'

var rules = io.loadData('rules')

const ordArr = ['Primary', 'Secondary', 'Tertiary', 'Quaternary', 'Quinary', 'Senary', 'Septenary', 'Octonary', 'Nonary', 'Denary']

function newLoadoutName (count) {
  if (count < 10) {
    return `${ordArr[count]} Loadout`
  } else {
    return `Loadout ${count + 1}`
  }
}

export default {
  name: 'pilot-loadout',
  components: { GearItem, 'selector-modal': GearSelector },
  data: () => ({
    tabIndex: 0,
    itemIndex: 0,
    itemType: null
  }),
  methods: {
    deleteLoadout (index) {
      this.$store.dispatch('splicePilot', {
        attr: 'loadouts',
        start_index: index,
        delete_count: 1
      })
      this.tabIndex = index - 1
    },
    addLoadout () {
      var newIdx = this.$store.getters.getPilot.loadouts.length
      this.$store.dispatch('editPilot', {
        attr: `loadouts[${newIdx}]`,
        val: {
          id: io.newID(),
          name: newLoadoutName(newIdx),
          items: {
            'armor': new Array(rules.max_pilot_armor),
            'weapon': new Array(rules.max_pilot_weapons),
            'gear': new Array(rules.max_pilot_gear)
          }
        }
      })
      this.refresh()
    },
    openSelector (index, itemType) {
      this.itemIndex = index
      this.itemType = itemType
      this.$refs.gearSelectorModal.show()
    },
    refresh () {
      this.$forceUpdate()
      this.$parent.$forceUpdate()
    }
  },
  computed: {
    loadouts () {
      return this.$store.getters.getPilot.loadouts
    },
    max () {
      return {
        armor: rules.max_pilot_armor,
        weapons: rules.max_pilot_weapons,
        gear: rules.max_pilot_gear
      }
    }
  },
  watch: {
    tabIndex: function (val) {
      this.$parent.activeLoadoutIdx = this.tabIndex
    }
  }
}
</script>