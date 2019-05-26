<template>
  <div>
    <v-card v-if="!pilot.Loadouts.length">
      <v-card-text>
        <p class="text-sm-center">
          <v-btn large @click="pilot.AddLoadout()" color="primary">
            <v-icon>add</v-icon>Add New Loadout
          </v-btn>
        </p>
      </v-card-text>
    </v-card>
    <v-tabs v-else v-model="tabIndex" dark color="primary" slider-color="yellow" 
      show-arrows mandatory>
      <v-tab v-for="(loadout, i) in pilot.Loadouts" :key="i">{{loadout.Name}}</v-tab>
      <span>
        <v-tooltip top>
          <v-btn icon slot="activator" @click="pilot.AddLoadout()">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Add New Loadout</span>
        </v-tooltip>
      </span>
      <v-tabs-items mandatory>
        <v-tab-item v-for="(loadout, index) in pilot.Loadouts" :key="loadout.id + index" lazy>
          <v-card>
            <v-card-text>
              <div v-for="(a, index) in loadout.Armor" :key="`p-armor-${index}`">
                <gear-item itemtype="Armor" :item="a" @clicked="openSelector(a, 'armor')"/>
              </div>

              <br>
              <div v-for="(w, index) in loadout.Weapons" :key="`p-weapon-${index}`">
                <gear-item itemtype="Weapon" :item="w" @clicked="openSelector(w, 'weapon')"/>
              </div>

              <br>
              <div v-for="(g, index) in loadout.Gear" :key="`p-gear-${index}`">
                <gear-item itemtype="Gear" :item="g" @clicked="openSelector(g, 'gear')"/>
              </div>
            </v-card-text>

            <v-card-actions>
              <lazy-dialog :model="renameDialog" title="Rename Loadout" acceptString="Rename" @accept="renameLoadout(loadout)" @cancel="renameDialog = false">
                <v-btn slot="activator" flat @click="renameDialog = true">
                  <v-icon small left>edit</v-icon>Rename Loadout
                </v-btn>
                <v-card-text slot="modal-content">
                  <v-text-field v-model="newLoadoutName" label="Loadout Name" type="text"></v-text-field>
                </v-card-text>
              </lazy-dialog>

              <v-btn flat @click="pilot.CloneLoadout(loadout)">
                <v-icon small left>file_copy</v-icon>Duplicate Loadout
              </v-btn>

              <v-spacer/>

              <lazy-dialog :model="deleteDialog" title="Delete Loadout" acceptString="Delete" acceptColor="warning" @accept="deleteLoadout(loadout)" @cancel="deleteDialog = false">
                <v-btn slot="activator" flat color="error" @click="deleteDialog = true">
                  <v-icon small left>edit</v-icon>Delete Loadout
                </v-btn>
                <v-card-text slot="modal-content">
                  <p>Are you sure you want to delete this loadout? This action cannot be undone.</p>
                </v-card-text>
              </lazy-dialog>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <v-snackbar v-model="snackbar" :timeout="5000">
      <span v-html="notification"/>
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <pilot-edit-modal no-activator :modelRef="selectorModal" @close="selectorModal = false" :title="`Select Pilot ${itemType.charAt(0).toUpperCase() + itemType.substring(1)}`">
      <template v-slot:modal-content>
        <item-table slot="modal-content" :item-type="itemType" :equipped-item="equippedItem" @select-item="equipItem" @remove-item="removeItem"/>
      </template>
    </pilot-edit-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import io from "@/features/_shared/data_io";
// import uid from '../../logic/uid'
import { rules } from "lancer-data";
import { PilotLoadout, Pilot } from "@/class";

import { LazyDialog } from "../../components/UI";
import { PilotEditModal } from "../SheetComponents";
import GearItem from "./GearItem.vue";
import ItemTable from "./ItemTable.vue";

const ordArr = [
  "Primary",
  "Secondary",
  "Tertiary",
  "Quaternary",
  "Quinary",
  "Senary",
  "Septenary",
  "Octonary",
  "Nonary",
  "Denary"
];

function newLoadoutName(count: number) {
  if (count < 10) {
    return `${ordArr[count]} Loadout`;
  } else {
    return `Loadout ${count + 1}`;
  }
}

export default Vue.extend({
  name: "pilot-loadout",
  components: { GearItem, ItemTable, LazyDialog, PilotEditModal },
  props: {
    pilot: Pilot
  },
  data: () => ({
    tabIndex: 0,
    itemIndex: 0,
    itemType: "",
    equippedItem: null,
    reloadTrigger: 0,
    newLoadoutName: "",
    selectorModal: false,
    renameDialog: false,
    deleteDialog: false,
    notification: "",
    snackbar: false
  }),
  methods: {
    notify(alert: string) {
      this.notification = alert;
      this.snackbar = true;
    },
    deleteLoadout(loadout: PilotLoadout) {
      this.pilot.RemoveLoadout(loadout);
      this.deleteDialog = false;
      this.notify("Loadout Deleted");
    },
    openSelector(index: number, itemType: string) {
      var vm = this as any;
      vm.itemIndex = index;
      vm.itemType = itemType;
      if (vm.loadouts[vm.tabIndex] && vm.loadouts[vm.tabIndex].items) {
        vm.equippedItem = vm.loadouts[vm.tabIndex].items[itemType][index];
      }
      vm.selectorModal = true;
    },
    renameLoadout(loadout: PilotLoadout) {
      if (this.newLoadoutName === "") {
        this.notify("Loadout names cannot be blank");
      } else {
        loadout.Name = this.newLoadoutName
        this.newLoadoutName = "";
        this.renameDialog = false;
      }
    },
    equipItem(item: { id: string; brew: string; type: string }) {
      var attr = [
        "loadouts",
        this.tabIndex,
        "items",
        item.type,
        this.itemIndex
      ];
      this.$store.dispatch("editPilot", {
        attr: attr,
        val: {
          id: item.id,
          brew: item.brew || null
        }
      });
      this.selectorModal = false;
    },
    removeItem(removalType: any) {
      var attr = [
        "loadouts",
        this.tabIndex,
        "items",
        removalType,
        this.itemIndex
      ];
      this.$store.dispatch("editPilot", {
        attr: attr,
        val: null
      });
      this.selectorModal = false;
    }
  },
  watch: {
    tabIndex(val) {
      this.pilot.ActiveLoadout = this.pilot.Loadouts[val];
    }
  }
});
</script>
