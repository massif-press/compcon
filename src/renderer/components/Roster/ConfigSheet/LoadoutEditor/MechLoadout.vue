<template>
  <div>
    <v-card v-if="!loadouts.length" dark>
      <v-card-text>
        <p class="text-sm-center">
          <v-btn large @click="addLoadout" color="primary"><v-icon>add</v-icon>Add New Loadout</v-btn>
        </p>
      </v-card-text>
    </v-card>
      <v-tabs v-else v-model="tabIndex" dark color="grey darken-2" show-arrows slider-color="pink" mandatory>
        <!-- Render Tabs -->
        <v-tab v-for="loadout in loadouts" :key="loadout.id">
          {{loadout.name}}
        </v-tab>
          <span>
            <v-tooltip top>
              <v-btn icon slot="activator" @click="addLoadout"><v-icon>add</v-icon></v-btn>
              <span>Add New Loadout</span>
            </v-tooltip>
          </span>
          <v-tabs-items mandatory touchless dark>
            <v-tab-item v-for="(loadout, index) in loadouts" :key="loadout.id + index" lazy>
              <v-card>
                <v-card-text>
                  <div v-for="(mount, index) in loadout.mounts" :key="index">{{mount.mount_type}}</div>
                <!-- Armor:
                <div v-for="n in max.armor" :key="`armor-iterator-${n-1}`">
                  <gear-item v-if="loadout.items.armor[n-1]" itemType="Armor" :item="loadout.items.armor[n-1]" @clicked="openSelector(n - 1, 'armor')"/>
                  <gear-item v-else itemType="Armor" empty @clicked="openSelector(n-1, 'armor')"/>
                </div>

                <br>
                <div v-for="n in max.weapons" :key="`weapon-iterator-${n-1}`">
                  <gear-item v-if="loadout.items.weapon[n-1]" itemType="Weapon" :item="loadout.items.weapon[n-1]" @clicked="openSelector(n - 1, 'weapon')"/>
                  <gear-item v-else itemType="Weapon" empty @clicked="openSelector(n-1, 'weapon')"/>
                </div>

                <br>
                <div v-for="n in max.gear" :key="`gear-iterator-${n-1}`">
                  <gear-item v-if="loadout.items.gear[n-1]" itemType="Gear" :item="loadout.items.gear[n-1]" @clicked="openSelector(n - 1, 'gear')"/>
                  <gear-item v-else itemType="Gear" empty @clicked="openSelector(n-1, 'gear')"/>
                </div> -->

                <v-card-actions>
                  <v-dialog v-model="renameDialog" width="600">
                    <v-btn slot="activator" flat><v-icon small left>edit</v-icon> Rename Loadout</v-btn>
                      <v-card>
                        <v-card-title class="headline" primary-title>Rename Loadout: {{loadouts[index].name}}</v-card-title>
                        <v-card-text>
                          <v-text-field v-model="newLoadoutName" label="Loadout Name" type="text"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn flat @click="renameDialog = false"> Cancel </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" flat @click="renameLoadout(index)"> Rename </v-btn>
                        </v-card-actions>
                      </v-card>
                  </v-dialog>
                  <v-btn flat @click="duplicateLoadout(index)"><v-icon small left>file_copy</v-icon> Duplicate Loadout</v-btn>
                  <v-spacer/>
                  <v-dialog v-model="deleteDialog" width="600">
                    <v-btn slot="activator" flat variant="danger" color="error"><v-icon small left>delete</v-icon> Delete {{loadout.name}}</v-btn>
                      <v-card>
                        <v-card-title class="headline" primary-title>Delete Loadout: {{loadouts[index].name}}</v-card-title>
                        <v-card-text>
                          <p>Are you sure you want to delete this loadout? This action cannot be undone.</p>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn flat @click="deleteDialog = false"> Cancel </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn color="error" @click="deleteLoadout(index)"> Delete </v-btn>
                        </v-card-actions>
                      </v-card>
                  </v-dialog>                    
                </v-card-actions>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>        
      </v-tabs>

      <!-- Delete notification -->
      <v-snackbar v-model="deleteNotification" :timeout="5000" >
        <span> Loadout Deleted </span>
        <v-btn color="pink" flat @click="deleteNotification = false" > Close </v-btn>
      </v-snackbar>

      <!-- Invalid name notification -->
      <v-snackbar v-model="invalidNameNotification" color="error" :timeout="5000" >
        <b> Loadout names cannot be blank </b>
        <v-btn dark flat @click="invalidNameNotification = false" > Close </v-btn>
      </v-snackbar>

      <v-dialog v-model="selectorModal" lazy fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-toolbar fixed dense flat>
          <v-toolbar-title><span class="text-capitalize">Select {{itemType}}</span></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon large @click="selectorModal = false"> <v-icon large>close</v-icon> </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <item-table :itemType="itemType" @select-item="equipItem" @remove-item="removeItem"/>
      </v-dialog>
  </div>
</template>

<script>
import GearItem from './GearItem'
import ItemTable from './ItemTable'
import io from '@/store/data_io'

// var rules = io.loadData('rules')

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
  components: { GearItem, ItemTable },
  props: {
    config_id: String,
    frame_id: String
  },
  data: () => ({
    tabIndex: null,
    itemIndex: 0,
    itemType: null,
    reloadTrigger: 0,
    newLoadoutName: '',
    selectorModal: false,
    renameDialog: false,
    deleteDialog: false,
    deleteNotification: false,
    invalidNameNotification: false
  }),
  methods: {
    item: function (type, id) {
      return this.$store.getters.getItemById(type, id)
    },
    deleteLoadout () {
      // this.$store.dispatch('splicePilot', {
      //   attr: 'loadouts',
      //   start_index: this.tabIndex,
      //   delete_count: 1
      // })
      // this.tabIndex--
      this.deleteDialog = false
      this.deleteNotification = true
    },
    addLoadout () {
      var mounts = this.item('Frames', this.frame_id).mounts.map(x => ({mount_type: x}))
      console.log(mounts)
      var newIdx = this.loadouts.length

      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${newIdx}]`,
        val: {
          id: io.newID(),
          name: newLoadoutName(newIdx),
          mounts: mounts
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
      this.selectorModal = true
    },
    refresh () {
      this.$forceUpdate()
      this.reloadTrigger = Math.random()
      this.$parent.$forceUpdate()
    },
    renameLoadout (index) {
      // if (this.newLoadoutName === '') this.invalidNameNotification = true
      // else {
      //   this.$store.dispatch('editPilot', {
      //     attr: `loadouts[${index}].name`,
      //     val: this.newLoadoutName
      //   })
      //   this.newLoadoutName = ''
      //   this.renameDialog = false
      //   this.refresh()
      // }
    },
    duplicateLoadout (index) {
      // var newIdx = this.$store.getters.getPilot.loadouts.length
      // this.$store.dispatch('editPilot', {
      //   attr: `loadouts[${newIdx}]`,
      //   val: {
      //     id: io.newID(),
      //     name: `${this.loadouts[index].name} (Copy)`,
      //     items: this.loadouts[index].items
      //   }
      // })
      // this.refresh()
    },
    equipItem (item) {
      // var attr = ['loadouts', this.tabIndex, 'items', item.type, this.itemIndex]
      // this.$store.dispatch('editPilot', {
      //   attr: attr,
      //   val: {id: item.id}
      // })
      // this.selectorModal = false
      // this.refresh()
    },
    removeItem (removalType) {
    //   var attr = ['loadouts', this.tabIndex, 'items', removalType, this.itemIndex]

    //   this.$store.dispatch('editPilot', {
    //     attr: attr,
    //     val: null
    //   })
    //   this.selectorModal = false
    //   this.refresh()
    // }
    }
  },
  computed: {
    loadouts () {
      return this.$store.getters.getConfigLoadouts(this.config_id)
    }
  },
  watch: {
    tabIndex: function (val) {
      this.$parent.activeLoadoutIdx = this.tabIndex
    },
    reloadTrigger: function (val) {
      this.$parent.loadoutForceReloadTrigger = this.reloadTrigger
    }
  },
  mounted: function () {

  }
}
</script>