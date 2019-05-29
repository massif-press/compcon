<template>
  <div>
    <v-card v-if="!config.Loadouts.length" dark>
      <v-card-text>
        <p class="text-sm-center">
          <v-btn large @click="config.AddLoadout()" color="primary">
            <v-icon>add</v-icon>Add New Loadout
          </v-btn>
        </p>
      </v-card-text>
    </v-card>
    <v-tabs v-else v-model="tabIndex" dark color="grey darken-2" show-arrows slider-color="pink" mandatory>
      <v-tab v-for="loadout in config.Loadouts" :key="loadout.id">{{loadout.name}}</v-tab>
      <span>
        <v-tooltip top>
          <v-btn icon slot="activator" @click="config.AddLoadout()">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Add New Loadout</span>
        </v-tooltip>
      </span>
      <v-tabs-items mandatory dark>
        <v-tab-item v-for="(loadout, i) in config.Loadouts" :key="loadout.id + i" lazy>
          <v-card>
            <v-card-text>
              <integrated-block v-for="(im, j) in loadout.IntegratedMounts" :key="`int_${i}_${j}`" :mount="im" />

              {{loadout.EquippableMounts}}
              <mount-block v-for="(m, k) in loadout.EquippableMounts" :key="`m_${i}_${k}`" :mount="m"  :loadout="loadout" />

              <v-divider dark class="mb-3 mt-3"/>

              <!-- <systems-block :loadout="loadout"/> -->

              <v-card-actions>
                <lazy-dialog :model="renameDialog" title="Rename Loadout" acceptString="Rename" @accept="renameLoadout()" @cancel="renameDialog = false" >
                  <v-btn slot="activator" flat @click="renameDialog = true">
                    <v-icon small left>edit</v-icon>Rename Loadout
                  </v-btn>
                  <v-card-text slot="modal-content">
                    <v-text-field v-model="newLoadoutName" label="Loadout Name" type="text"></v-text-field>
                  </v-card-text>
                </lazy-dialog>

                <v-btn flat @click="config.CloneLoadout(loadout)">
                  <v-icon small left>file_copy</v-icon>Duplicate Loadout
                </v-btn>

                <v-spacer/>

                <lazy-dialog :model="deleteDialog" title="Delete Loadout" acceptString="Delete" acceptColor="warning" @accept="config.RemoveLoadout(loadout)"     @cancel="deleteDialog = false" >
                  <v-btn slot="activator" flat color="error" @click="deleteDialog = true">
                    <v-icon small left>edit</v-icon>Delete Loadout
                  </v-btn>
                  <v-card-text slot="modal-content">
                    <p>Are you sure you want to delete this loadout? This action cannot be undone.</p>
                  </v-card-text>
                </lazy-dialog>

              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <v-snackbar v-model="snackbar" :timeout="5000">
      <span v-html="notification"/>
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import io from "@/features/_shared/data_io";
  import MountBlock from "./MountBlock.vue";
  import IntegratedBlock from "./IntegratedBlock.vue";
  import SystemsBlock from "./SystemsBlock.vue";
  import { LazyDialog } from "../../components/UI";
  import { MechLoadout, MechSystem, Mech } from "@/class";

  export default Vue.extend({
    name: "mech-loadout",
    components: {
      MountBlock,
      SystemsBlock,
      IntegratedBlock,
      LazyDialog
    },
    props: {
      config: Mech
    },
    data: () => ({
      tabIndex: 0,
      newLoadoutName: "",
      renameDialog: false,
      deleteDialog: false,
      notification: "",
      snackbar: false,
    }),
    methods: {
      renameLoadout(loadout: MechLoadout) {
        if (this.newLoadoutName === "") {
          this.notification = "Loadout names cannot be blank";
          this.snackbar = true;
        }
        else {
          loadout.Name = this.newLoadoutName;
          this.newLoadoutName = "";
          this.renameDialog = false;
        }
      },
    },
    watch: {
      tabIndex(val: number) {
        this.config.ActiveLoadout = this.config.Loadouts[val];
      }
    }
  });
</script>
