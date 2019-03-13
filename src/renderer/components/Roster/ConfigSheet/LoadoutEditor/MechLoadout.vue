<template>
  <div>
    <v-card v-if="!loadouts.length" dark>
      <v-card-text>
        <p class="text-sm-center">
          <v-btn large @click="addLoadout" color="primary"><v-icon>add</v-icon>Add New Loadout</v-btn>
        </p>
      </v-card-text>
    </v-card >
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
                  <div v-if="item('Frames', frame_id).core_system.integrated">
                    <integrated-block :item="item('Frames', frame_id).core_system.integrated" :source="`${item('Frames', frame_id).source} ${item('Frames', frame_id).name}`" />
                  </div>
                  <div v-for="m in stats.integrated_mounts" :key="m">
                    <integrated-block :item="item('MechWeapons', m)" :source="'Talent Weapon'" />
                  </div>
                  <mount-block v-for="(mount, idx) in loadout.mounts" :key="idx" :config_id="config_id" :mount="mount" :loadout="loadout" :free_sp="stats.sp - stats.used_sp" :loadout-index="index" :mount-index="idx" @refresh="refresh" />
                  <v-divider dark class="mb-3 mt-3"/>
                  <systems-block :max_sp="stats.sp" :free_sp="stats.sp - stats.used_sp" :systems="loadout.systems" :integrated="stats.integrated_systems" @clicked="openSystemSelector" :key="'sb'+reloadTrigger"/>
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
                <!-- System Selector Modal -->
                <v-dialog v-model="systemSelectorModal" lazy fullscreen hide-overlay transition="dialog-bottom-transition">
                  <v-toolbar fixed dense flat dark>
                    <v-toolbar-title><span class="text-capitalize">Select System</span></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn icon large @click="systemSelectorModal = false"> <v-icon large>close</v-icon> </v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <system-table :installed_systems="loadout.systems" :free_sp="stats.sp - stats.used_sp" :current_equip="loadout.systems ? loadout.systems[itemIndex] : null" :loadout_index="index" @select-item="equipSystem" @remove-item="removeSystem"/>
                </v-dialog>             
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
      
  </div>
</template>

<script>
import MountBlock from './MountBlock'
import IntegratedBlock from './IntegratedBlock'
import SystemsBlock from './SystemsBlock'
import SystemTable from './SystemTable'
import io from '@/store/data_io'

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
  components: { MountBlock, SystemsBlock, SystemTable, IntegratedBlock },
  props: {
    config_id: String,
    frame_id: String,
    stats: Object,
    talents: Array,
    core_bonuses: Array
  },
  data: () => ({
    tabIndex: null,
    itemIndex: null,
    itemType: null,
    reloadTrigger: 0,
    newLoadoutName: '',
    systemSelectorModal: false,
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
      this.$store.dispatch('spliceConfig', {
        id: this.config_id,
        attr: 'loadouts',
        start_index: this.tabIndex,
        delete_count: 1
      })
      this.tabIndex--
      this.deleteDialog = false
      this.deleteNotification = true
    },
    addLoadout () {
      var mounts = this.item('Frames', this.frame_id).mounts.map(x => ({mount_type: x, weapons: []}))
      var newIdx = this.loadouts.length

      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${newIdx}]`,
        val: {
          id: io.newID(),
          name: newLoadoutName(newIdx),
          mounts: mounts,
          systems: []
        }
      })
      this.refresh()
      setTimeout(() => {
        this.tabIndex = newIdx
      }, 10)
    },
    openSystemSelector (index) {
      this.itemIndex = index
      this.systemSelectorModal = true
    },
    refresh () {
      this.$forceUpdate()
      this.reloadTrigger = Math.random()
      this.$parent.$forceUpdate()
    },
    renameLoadout (index) {
      if (this.newLoadoutName === '') this.invalidNameNotification = true
      else {
        this.$store.dispatch('editConfig', {
          id: this.config_id,
          attr: `loadouts[${index}].name`,
          val: this.newLoadoutName
        })
        this.newLoadoutName = ''
        this.renameDialog = false
        this.refresh()
      }
    },
    duplicateLoadout (index) {
      var newIdx = this.loadouts.length
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${newIdx}]`,
        val: {
          id: io.newID(),
          name: `${this.loadouts[index].name} (Copy)`,
          mounts: this.loadouts[index].mounts
        }
      })
      this.refresh()
    },
    equipSystem (item, loadoutIndex) {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${loadoutIndex}].systems[${this.itemIndex}]`,
        val: { id: item.id }
      })

      this.systemSelectorModal = false
      this.refresh()
    },
    removeSystem (loadoutIndex) {
      this.$store.dispatch('spliceConfig', {
        id: this.config_id,
        attr: `loadouts[${loadoutIndex}].systems`,
        start_index: this.itemIndex,
        delete_count: 1
      })
      this.systemSelectorModal = false
      this.refresh()
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
  }
}
</script>