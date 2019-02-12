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
            <!-- if player has combat webbing equipped -->
            <div v-if="hasWebbing(loadout.items)">
              <hr>
              <gear-item v-if="loadout.items.webbing" itemType="Combat Webbing" :item="loadout.items.webbing" @clicked="openSelector(null, 'webbing')"/>
              <gear-item v-else itemType="Combat Webbing" empty @clicked="openSelector(null, 'webbing')"/>
            </div>
            <br>
            <b-row>
              <b-col>
                <div class="float-left" style="padding:10px">
                  <b-btn size="sm" v-b-modal.renameDialog>
                    Rename Loadout
                  </b-btn>
                  <b-btn size="sm" @click="duplicateLoadout(index)">
                    Duplicate Loadout
                  </b-btn>
                </div>
                <div class="float-right" style="padding:10px">
                  <b-btn size="sm" variant="danger" v-b-modal.deleteDialog>
                    Delete {{loadout.name}}
                  </b-btn>
                </div>
              </b-col>
            </b-row>
          </b-container>

          <b-modal centered id="renameDialog" :title="`Rename Loadout: ${loadout.name}`" @ok="renameLoadout(index)" no-close-on-backdrop>
            <b-form-input v-model="newLoadoutName" type="text" placeholder="New Loadout Name"></b-form-input>
          </b-modal>

        </b-tab>

        <!-- New Tab Button (Using tabs slot) -->
        <b-nav-item slot="tabs" @click="()=>addLoadout()" v-b-tooltip.hover title="Add New Loadout">
          <v-icon name="plus-circle" scale="1.25"/>
        </b-nav-item>

        <!-- Render this if no tabs -->
        <div slot="empty" class="text-center text-muted">
          There are no saved gear loadouts for this pilot.
          <br> Create a new loadout by clicking the <v-icon name="plus-circle" scale="0.75"/> button.
        </div>
        
      </b-tabs>
    </b-card>

    <b-modal centered id="deleteDialog" hide-header body-text-variant="danger" @ok="deleteLoadout()" ok-variant="danger">
      <p>Are you sure you want to delete this loadout? This action cannot be undone.</p>
    </b-modal>

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
    itemType: null,
    reloadTrigger: 0,
    newLoadoutName: ''
  }),
  methods: {
    deleteLoadout () {
      this.$store.dispatch('splicePilot', {
        attr: 'loadouts',
        start_index: this.tabIndex,
        delete_count: 1
      })
      this.tabIndex--
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
      setTimeout(() => {
        this.tabIndex = newIdx
      }, 10)
    },
    openSelector (index, itemType) {
      this.itemIndex = index
      this.itemType = itemType
      this.$refs.gearSelectorModal.show()
    },
    refresh () {
      this.$forceUpdate()
      this.reloadTrigger = Math.random()
      this.$parent.$forceUpdate()
    },
    renameLoadout (index) {
      if (this.newLoadoutName === '') alert('Loadout names cannot be blank') // TODO: replace w/ snackbar
      else {
        this.$store.dispatch('editPilot', {
          attr: `loadouts[${index}].name`,
          val: this.newLoadoutName
        })
        this.newLoadoutName = ''
      }
    },
    duplicateLoadout (index) {
      var newIdx = this.$store.getters.getPilot.loadouts.length
      this.$store.dispatch('editPilot', {
        attr: `loadouts[${newIdx}]`,
        val: {
          id: io.newID(),
          name: `${this.loadouts[index].name} (Copy)`,
          items: this.loadouts[index].items
        }
      })
      this.refresh()
    },
    hasWebbing (items) {
      return items.armor.find(x => x && x.id === 'webbing')
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
    },
    reloadTrigger: function (val) {
      this.$parent.loadoutForceReloadTrigger = this.reloadTrigger
    }
  }
}
</script>