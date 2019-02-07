<template>
  <div>
    <b-card no-body>
      <b-tabs v-model="tabIndex">
        <!-- Render Tabs -->
        <b-tab :title="loadout.name" v-for="(loadout, index) in loadouts" :key="loadout.id">
          <b-container fluid>
            <div v-for="(item, index) in loadout.weapons" :key="item.id + '_' + index">
              <mech-weapon-item :mount="item" />
            </div>
            <hr>
            <div v-for="(item, index) in loadout.systems" :key="item.id + '_' + index">
              <mech-system-item :mount="item" />
            </div>
            <div v-if="freeSp">
              <b-row>
                <b-col cols=2 offset=10 >
                  <b-btn block variant="info">Add System (x/ySP)</b-btn>
                </b-col>
              </b-row>
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

  </div>
</template>

<script>
import MechWeapon from './MechWeapon'
import MechSystem from './MechSystem'
// import io from '@/store/data_io'
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
  name: 'mech-loadout',
  components: { 'mech-weapon-item': MechWeapon, 'mech-system-item': MechSystem },
  props: [
    'config_id',
    'max_sp'
  ],
  data: () => ({
    tabIndex: 0,
    add: 0
  }),
  methods: {
    deleteLoadout (index) {
    },
    addLoadout () {
      console.log(newLoadoutName(1))
    },
    openAddItemMenu (index, gearLength) {

    }
  },
  computed: {
    ...mapGetters([
      'getConfigLoadouts',
      'getConfigLoadoutById'
    ]),
    loadoutCount () {
      return this.getLoadouts().length
    },
    loadouts () {
      console.log(this.getConfigLoadouts(this.config_id))
      return this.getConfigLoadouts(this.config_id)
    },
    loadout (id) {
      return this.getConfigLoadoutsById(id)
    },
    freeSp () {
      var currentSpCost = 1 // TODO: calc this per loadout
      return this.max_sp > currentSpCost
    }
  },
  watch: {
    tabIndex: function (val) {
      this.$parent.activeLoadoutIdx = this.tabIndex
    }
  }
}
</script>