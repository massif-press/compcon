<template>
  <div>
    <v-card v-if="!pilot.Loadouts.length">
      <v-card-text>
        <p class="text-sm-center">
          <v-btn large @click="pilot.AddLoadout()" color="primary">
            <v-icon>add</v-icon>
            Add New Loadout
          </v-btn>
        </p>
      </v-card-text>
    </v-card>
    <v-tabs
      v-else
      v-model="tabIndex"
      dark
      color="primary"
      slider-color="yellow"
      show-arrows
      mandatory
      @change="changeTab()"
      :key="pilot.Loadouts.length"
    >
      <v-tab v-for="(pilotLoadout, i) in pilot.Loadouts" :key="i">
        {{ pilotLoadout.Name }}
      </v-tab>
      <span>
        <v-tooltip top>
          <v-btn icon slot="activator" @click="pilot.AddLoadout()">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Add New Loadout</span>
        </v-tooltip>
      </span>
      <v-tabs-items mandatory>
        <v-tab-item
          v-for="(pilotLoadout, index) in pilot.Loadouts"
          :key="pilotLoadout.id + index"
        >
          <v-card>
            <v-card-text>
              <div
                v-for="(a, index) in pilotLoadout.Armor"
                :key="`p-armor-${index}`"
              >
                <gear-item
                  item-type="Armor"
                  :item="a"
                  @clicked="openSelector(a, index, 'PilotArmor')"
                />
              </div>

              <br />
              <div
                v-for="(w, index) in pilotLoadout.Weapons"
                :key="`p-weapon-${index}`"
              >
                <gear-item
                  item-type="Weapon"
                  :item="w"
                  @clicked="openSelector(w, index, 'PilotWeapon')"
                />
              </div>

              <br />
              <div
                v-for="(g, index) in pilotLoadout.Gear"
                :key="`p-gear-${index}`"
              >
                <gear-item
                  item-type="Gear"
                  :item="g"
                  @clicked="openSelector(g, index, 'PilotGear')"
                />
              </div>
            </v-card-text>

            <pilot-edit-modal
              no-activator
              :modelRef="selectorModal"
              @close="selectorModal = false"
              title="Select Pilot Equipment"
            >
              <template v-slot:modal-content>
                <item-table
                  slot="modal-content"
                  :item-type="itemType"
                  :equipped-item="equippedItem"
                  @select-item="equipItem"
                  @remove-item="removeItem"
                />
              </template>
            </pilot-edit-modal>

            <v-card-actions>
              <lazy-dialog
                :model="renameDialog"
                title="Rename Loadout"
                acceptString="Rename"
                @accept="renameLoadout(pilotLoadout)"
                @cancel="renameDialog = false"
              >
                <v-btn slot="activator" flat @click="renameDialog = true">
                  <v-icon small left>edit</v-icon>
                  Rename Loadout
                </v-btn>
                <v-card-text slot="modal-content">
                  <v-text-field
                    v-model="newLoadoutName"
                    label="Loadout Name"
                    type="text"
                  ></v-text-field>
                </v-card-text>
              </lazy-dialog>

              <v-btn flat @click="pilot.CloneLoadout(pilotLoadout)">
                <v-icon small left>file_copy</v-icon>
                Duplicate Loadout
              </v-btn>

              <v-spacer />

              <lazy-dialog
                :model="deleteDialog"
                title="Delete Loadout"
                acceptString="Delete"
                acceptColor="warning"
                @accept="deleteLoadout(pilotLoadout)"
                @cancel="deleteDialog = false"
              >
                <v-btn
                  slot="activator"
                  flat
                  color="error"
                  @click="deleteDialog = true"
                >
                  <v-icon small left>edit</v-icon>
                  Delete Loadout
                </v-btn>
                <v-card-text slot="modal-content">
                  <p>
                    Are you sure you want to delete this loadout? This action
                    cannot be undone.
                  </p>
                </v-card-text>
              </lazy-dialog>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <v-snackbar v-model="snackbar" :timeout="5000">
      <span v-html="notification" />
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import io from '@/features/_shared/data_io'
import { rules } from 'lancer-data'
import {
  PilotLoadout,
  Pilot,
  PilotEquipment,
  PilotArmor,
  PilotGear,
  PilotWeapon,
  ItemType,
} from '@/class'
import { LazyDialog } from '../../components/UI'
import { PilotEditModal } from '../SheetComponents'
import GearItem from './GearItem.vue'
import ItemTable from './ItemTable.vue'

export default Vue.extend({
  name: 'pilot-loadout-view',
  components: { GearItem, ItemTable, LazyDialog, PilotEditModal },
  props: {
    pilot: Pilot,
  },
  data: () => ({
    tabIndex: 0,
    itemIndex: 0,
    itemType: '',
    equippedItem: null,
    newLoadoutName: '',
    selectorModal: false,
    renameDialog: false,
    deleteDialog: false,
    notification: '',
    snackbar: false,
  }),
  methods: {
    notify(alert: string) {
      this.notification = alert
      this.snackbar = true
    },
    deleteLoadout(loadout: PilotLoadout) {
      this.deleteDialog = false
      this.pilot.RemoveLoadout(loadout)
      this.notify('Loadout Deleted')
    },
    openSelector(item: PilotEquipment, index: number, itemType: ItemType) {
      var vm = this as any
      vm.itemIndex = index
      vm.itemType = itemType
      vm.equippedItem = item
      vm.selectorModal = true
    },
    renameLoadout(loadout: PilotLoadout) {
      if (this.newLoadoutName === '') {
        this.notify('Loadout names cannot be blank')
      } else {
        loadout.Name = this.newLoadoutName
        this.newLoadoutName = ''
        this.renameDialog = false
      }
    },
    equipItem(item: PilotEquipment) {
      if (this.pilot.ActiveLoadout)
        this.pilot.ActiveLoadout.Add(item, this.itemIndex)
      this.selectorModal = false
    },
    removeItem(item: PilotEquipment) {
      if (this.pilot.ActiveLoadout)
        this.pilot.ActiveLoadout.Remove(item, this.itemIndex)
      this.selectorModal = false
    },
    changeTab() {
      this.pilot.ActiveLoadout = this.pilot.Loadouts[this.tabIndex]
    },
  },
  created() {
    if (this.pilot.Loadouts && this.pilot.ActiveLoadout) {
      const activeIndex = this.pilot.Loadouts.findIndex(
        x => x.ID === this.pilot.ActiveLoadout!.ID
      )
      if (activeIndex > -1) {
        this.tabIndex = activeIndex
      } else {
        this.tabIndex = 0
        this.pilot.ActiveLoadout = this.pilot.Loadouts[0]
      }
    } else if (this.pilot && this.pilot.Loadouts) {
      this.tabIndex = 0
      this.pilot.ActiveLoadout = this.pilot.Loadouts[0]
    }
  },
})
</script>
