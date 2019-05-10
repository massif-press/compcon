<template>
  <div>
    <v-card v-if="!loadouts.length">
      <v-card-text>
        <p class="text-sm-center">
          <v-btn large @click="addLoadout" color="primary"><v-icon>add</v-icon>Add New Loadout</v-btn>
        </p>
      </v-card-text>
    </v-card>
    <v-tabs v-else v-model="tabIndex" dark color="primary" show-arrows slider-color="yellow" mandatory>
      <v-tab v-for="(loadout, i) in loadouts" :key="i">{{loadout.name}}</v-tab>
      <span>
        <v-tooltip top>
          <v-btn icon slot="activator" @click="addLoadout"><v-icon>add</v-icon></v-btn>
          <span>Add New Loadout</span>
        </v-tooltip>
      </span>
      <v-tabs-items mandatory>
        <v-tab-item v-for="(loadout, index) in loadouts" :key="loadout.id + index" lazy>
          <v-card>
            <v-card-text>
              <!-- Armor: -->
              <div v-for="n in max.armor" :key="`armor-iterator-${n-1}`">
                <gear-item v-if="loadout.items.armor[n-1]" itemType="Armor" :item="loadout.items.armor[n-1]" @clicked="openSelector(n - 1, 'armor')"/>
                <gear-item v-else itemType="Armor" empty @clicked="openSelector(n-1, 'armor')"/>
              </div>

              <!-- Weapons: -->
              <br>
              <div v-for="n in max.weapons" :key="`weapon-iterator-${n-1}`">
                <gear-item v-if="loadout.items.weapon[n-1]" itemType="Weapon" :item="loadout.items.weapon[n-1]" @clicked="openSelector(n - 1, 'weapon')"/>
                <gear-item v-else itemType="Weapon" empty @clicked="openSelector(n-1, 'weapon')"/>
              </div>

              <!-- Gear: -->
              <br>
              <div v-for="n in max.gear" :key="`gear-iterator-${n-1}`">
                <gear-item v-if="loadout.items.gear[n-1]" itemType="Gear" :item="loadout.items.gear[n-1]" @clicked="openSelector(n - 1, 'gear')"/>
                <gear-item v-else itemType="Gear" empty @clicked="openSelector(n-1, 'gear')"/>
              </div>
            </v-card-text>

            <v-card-actions>
              <lazy-dialog :model="renameDialog" title="Rename Loadout" acceptString="Rename" 
                @accept="renameLoadout(tabIndex)" @cancel="renameDialog = false">
                <v-btn slot="activator" flat @click="renameDialog = true"><v-icon small left>edit</v-icon> Rename Loadout</v-btn>
                <v-card-text slot="modal-content">
                  <v-text-field v-model="newLoadoutName" label="Loadout Name" type="text"></v-text-field>
                </v-card-text>                
              </lazy-dialog>

              <v-btn flat @click="duplicateLoadout(tabIndex)"><v-icon small left>file_copy</v-icon> Duplicate Loadout</v-btn>
              
              <v-spacer />

              <lazy-dialog :model="deleteDialog" title="Delete Loadout" acceptString="Delete" acceptColor="warning"
                @accept="deleteLoadout()" @cancel="deleteDialog = false">
                <v-btn slot="activator" flat color="error" @click="deleteDialog = true"><v-icon small left>edit</v-icon> Delete Loadout</v-btn>
                <v-card-text slot="modal-content">
                  <p>Are you sure you want to delete this loadout? This action cannot be undone.</p>
                </v-card-text>                
              </lazy-dialog>              
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>        
    </v-tabs>

    <v-snackbar v-model="snackbar" :timeout="5000" >
      <span v-html="notification" />
      <v-btn color="pink" flat @click="snackbar = false" > Close </v-btn>
    </v-snackbar>

    <pilot-edit-modal no-activator :modelRef="selectorModal" @close="selectorModal = false"
      :title="`Select Pilot ${itemType.charAt(0).toUpperCase() + itemType.substring(1)}`">
      <template v-slot:modal-content>
        <item-table slot="modal-content" :item-type="itemType" :equipped-item="equippedItem" @select-item="equipItem" @remove-item="removeItem" />
      </template>
    </pilot-edit-modal>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import io from '@/features/_shared/data_io'
  import uid from '../../logic/uid'
  import {rules} from 'lancer-data'

  import {LazyDialog} from '../../components/UI'
  import {PilotEditModal} from '../SheetComponents'
  import GearItem from './GearItem.vue'
  import ItemTable from './ItemTable.vue'

  const ordArr = ['Primary', 'Secondary', 'Tertiary', 'Quaternary', 'Quinary', 'Senary', 'Septenary', 'Octonary', 'Nonary', 'Denary']

  function newLoadoutName (count: number) {
    if (count < 10) {
      return `${ordArr[count]} Loadout`
    } else {
      return `Loadout ${count + 1}`
    }
  }

  export default Vue.extend({
    name: 'pilot-loadout',
    components: { GearItem, ItemTable, LazyDialog, PilotEditModal },
    data: () => ({
      tabIndex: 0,
      itemIndex: 0,
      itemType: '',
      equippedItem: null,
      reloadTrigger: 0,
      newLoadoutName: '',
      max: {},
      selectorModal: false,
      renameDialog: false,
      deleteDialog: false,
      notification: '',
      snackbar: false
    }),
    methods: {
      notify (alert: string) {
        this.notification = alert
        this.snackbar = true
      },
      deleteLoadout () {
        this.$store.dispatch('splicePilot', {
          attr: 'loadouts',
          start_index: this.tabIndex,
          delete_count: 1
        })
        this.tabIndex = 0
        this.deleteDialog = false
        this.notify('Loadout Deleted')
        this.refresh()
      },
      addLoadout () {
        var newIdx = this.$store.getters['getPilot'].loadouts.length
        this.$store.dispatch('editPilot', {
          attr: `loadouts[${newIdx}]`,
          val: {
            id: uid.generate(),
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
      openSelector (index: number, itemType: string) {
        var vm = this as any
        vm.itemIndex = index
        vm.itemType = itemType
        if (vm.loadouts[vm.tabIndex] && vm.loadouts[vm.tabIndex].items) {
          vm.equippedItem = vm.loadouts[vm.tabIndex].items[itemType][index]
        }
        vm.selectorModal = true
      },
      refresh () {
        this.$forceUpdate()
        this.reloadTrigger = Math.random()
        this.$parent.$forceUpdate()
      },
      renameLoadout (index: number) {
        if (this.newLoadoutName === '') {
          this.notify('Loadout names cannot be blank')
        }
        else {
          this.$store.dispatch('editPilot', {
            attr: `loadouts[${index}].name`,
            val: this.newLoadoutName
          })
          this.newLoadoutName = ''
          this.renameDialog = false
          this.refresh()
        }
      },
      duplicateLoadout (index: number) {
        var vm = this as any
        var newIdx = this.$store.getters['getPilot'].loadouts.length
        var newUid = uid.generate()
        vm.$store.dispatch('editPilot', {
          attr: `loadouts[${newIdx}]`,
          val: {
            id: newUid,
            name: `${vm.loadouts[index].name} (Copy)`,
            items: vm.loadouts[index].items
          }
        })
        vm.refresh()
      },
      equipItem (item: {id: string, brew: string, type: string}) {
        var attr = ['loadouts', this.tabIndex, 'items', item.type, this.itemIndex]
        this.$store.dispatch('editPilot', {
          attr: attr,
          val: {
            id: item.id,
            brew: item.brew || null
          }
        })
        this.selectorModal = false
        this.refresh()
      },
      removeItem (removalType: any) {
        var attr = ['loadouts', this.tabIndex, 'items', removalType, this.itemIndex]
        this.$store.dispatch('editPilot', {
          attr: attr,
          val: null
        })
        this.selectorModal = false
        this.refresh()
      }
    },
    computed: {
      loadouts (): PilotLoadout {
        return this.$store.getters['getPilot'].loadouts
      }
    },
    watch: {
      tabIndex (val) {
        (this as any).$parent.activeLoadoutIdx = this.tabIndex
      },
      reloadTrigger (val) {
        (this as any).$parent.loadoutForceReloadTrigger = this.reloadTrigger
      }
    },
    created () {
      this.max = {
        armor: rules.max_pilot_armor,
        weapons: rules.max_pilot_weapons,
        gear: rules.max_pilot_gear
      }
    }
  })
</script>
