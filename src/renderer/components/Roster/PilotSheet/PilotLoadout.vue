<template>
  <div>
    <b-card no-body>
      <b-tabs v-model="tabIndex">
        <!-- Render Tabs -->
        <b-tab :title="loadout.name" v-for="(loadout, index) in loadouts" :key="loadout.id">
          <b-container fluid>
            <div v-for="(item, index) in loadout.gear" :key="item.id + index">
                <gear-item :item="item" />
            </div>
              <b-card no-body v-if="loadout.gear.length < 6">
                <b-row>
                  <b-col cols=2><b-btn block @click="openAddItemMenu(index, loadout.gear.length)">ADD ITEM</b-btn></b-col>
                  <b-col>
                    <span>/////</span>
                  </b-col>
                </b-row>
              </b-card>
            <hr>
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

  </div>
</template>

<script>
import GearItem from './GearItem'
import io from '@/store/data_io'
import { mapGetters } from 'vuex'

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
  components: { GearItem },
  props: [
    'pilot_id'
  ],
  data: () => ({
    tabIndex: 0,
    add: 0
  }),
  methods: {
    deleteLoadout (index) {
      this.$store.dispatch('splicePilot', {
        id: this.pilot_id,
        attr: 'loadouts',
        start_index: index,
        delete_count: 1
      })
      this.add--
    },
    addLoadout () {
      var newIdx = this.loadoutCount + this.add
      this.$store.dispatch('editPilot', {
        id: this.pilot_id,
        attr: `loadouts[${newIdx}]`,
        val: {
          id: io.newID(),
          name: newLoadoutName(newIdx),
          gear: []
        }
      })
      this.add++
      this.$forceUpdate()
    },
    openAddItemMenu (index, gearLength) {
      console.log('this should happen from modal, pass in loadout and pilot id')
      this.$store.dispatch('editPilot', {
        id: this.pilot_id,
        attr: `loadouts[${index}].gear[${gearLength}]`,
        val: {
          id: Math.random().toString()
        }
      })
      this.$forceUpdate()
    }
  },
  computed: {
    ...mapGetters([
      'getLoadouts',
      'getLoadoutById'
    ]),
    loadoutCount () {
      return this.getLoadouts().length
    },
    loadouts () {
      return this.getLoadouts()
    },
    loadout (id) {
      return this.getLoadoutsById(id)
    }
  },
  watch: {
    tabIndex: function (val) {
      this.$parent.activeLoadoutIdx = this.tabIndex
    }
  }
}
</script>