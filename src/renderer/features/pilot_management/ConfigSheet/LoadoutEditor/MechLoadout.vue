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
      <v-tab v-for="loadout in loadouts" :key="loadout.id">{{loadout.name}}</v-tab>
      <span>
        <v-tooltip top>
          <v-btn icon slot="activator" @click="addLoadout"><v-icon>add</v-icon></v-btn>
          <span>Add New Loadout</span>
        </v-tooltip>
      </span>
      <v-tabs-items mandatory dark>
        <v-tab-item v-for="(loadout, lIndex) in loadouts" :key="loadout.id + lIndex" lazy>
          <v-card>
            <v-card-text>
            <!-- Mounts -->
              <!-- CORE System Integrated -->
              <integrated-block v-if="getFrame(frame_id).core_system.integrated" 
                :item="getFrame(frame_id).core_system.integrated" 
                :source="`${getFrame(frame_id).source} ${getFrame(frame_id).name}`" />
              <!-- Talent Integrated -->
              <integrated-block v-for="m in stats.integrated_mounts" :key="m" 
                :item="getWeapon(m)" :source="'Talent Weapon'" />
              <!-- Regular Frame mounts -->
              <mount-block v-for="(mount, mIndex) in loadout.mounts" :key="mount.sh_lock ? mIndex + mount.sh_lock.toString() : mIndex"     
                :config_id="config_id" :mount="mount" :loadout="loadout" :free_sp="stats.sp - stats.used_sp" 
                :loadout-index="lIndex" :mount-index="mIndex" @refresh="refresh" />
              <!-- /Mounts -->
              <v-divider dark class="mb-3 mt-3"/>
              <!-- Systems -->
              <systems-block :max_sp="stats.sp" :free_sp="stats.sp - stats.used_sp" :systems="loadout.systems" :integrated="stats.integrated_systems" @clicked="openSystemSelector" :key="'sb'+reloadTrigger"/>
            
            <v-card-actions>
              <lazy-dialog :model="renameDialog" title="Rename Loadout" acceptString="Rename" 
                @accept="renameLoadout()" @cancel="renameDialog = false">
                <v-btn slot="activator" flat @click="renameDialog = true"><v-icon small left>edit</v-icon> Rename Loadout</v-btn>
                <v-card-text slot="modal-content">
                  <v-text-field v-model="newLoadoutName" label="Loadout Name" type="text"></v-text-field>
                </v-card-text>                
              </lazy-dialog>

              <v-btn flat @click="duplicateLoadout()"><v-icon small left>file_copy</v-icon> Duplicate Loadout</v-btn>

              <v-spacer/>
              
              <lazy-dialog :model="deleteDialog" title="Delete Loadout" acceptString="Delete" 
                acceptColor="warning" @accept="deleteLoadout()" @cancel="deleteDialog = false">
                <v-btn slot="activator" flat color="error" @click="deleteDialog = true"><v-icon small left>edit</v-icon> Delete Loadout</v-btn>
                <v-card-text slot="modal-content">
                  <p>Are you sure you want to delete this loadout? This action cannot be undone.</p>
                </v-card-text>                
              </lazy-dialog> 

            </v-card-actions>
            </v-card-text>
          </v-card>
            <!-- System Selector Modal -->
            <v-dialog v-model="systemSelectorModal" lazy fullscreen hide-overlay transition="dialog-bottom-transition">
              <v-toolbar fixed dense flat dark>
                <v-toolbar-title><span class="text-capitalize">Select System</span></v-toolbar-title>
                <v-spacer />
                <v-toolbar-items>
                  <v-btn icon large @click="systemSelectorModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <system-table :installed_systems="loadout.systems" :free_sp="stats.sp - stats.used_sp" 
                :current_equip="equippedSystem(loadout, itemIndex)" :loadout_index="lIndex" 
                @select-item="equipSystem" @remove-item="removeSystem"/>
            </v-dialog>             
        </v-tab-item>
      </v-tabs-items>        
    </v-tabs>

    <v-snackbar v-model="snackbar" :timeout="5000" >
      <span v-html="notification" />
      <v-btn color="pink" flat @click="snackbar = false" > Close </v-btn>
    </v-snackbar>
      
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import io from '@/features/_shared/data_io'
  import uid from '../../logic/uid'
  import MountBlock from './MountBlock.vue'
  import IntegratedBlock from './IntegratedBlock.vue'
  import SystemsBlock from './SystemsBlock.vue'
  import SystemTable from './SystemTable.vue'
  import {LazyDialog} from '../../components/UI'

  const ordArr = ['Primary', 'Secondary', 'Tertiary', 'Quaternary', 'Quinary', 'Senary', 'Septenary', 'Octonary', 'Nonary', 'Denary']

  function newLoadoutName (count: number): string {
    if (count < 10) {
      return `${ordArr[count]} Loadout`
    } else {
      return `Loadout ${count + 1}`
    }
  }

  export default Vue.extend({
  name: 'mech-loadout',
  components: { MountBlock, SystemsBlock, SystemTable, IntegratedBlock, LazyDialog },
  props: {
    config_id: String,
    frame_id: String,
    stats: Object,
    talents: Array,
    core_bonuses: Array
  },
  data: () => ({
    tabIndex: 0,
    itemIndex: 0,
    itemType: null,
    reloadTrigger: 0,
    newLoadoutName: '',
    systemSelectorModal: false,
    renameDialog: false,
    deleteDialog: false,
    notification: '',
    snackbar: false
  }),
  methods: {
    notify (alert: string) {
      var vm = this as any
      vm.notification = alert
      vm.snackbar = true
    },
    equippedSystem (loadout: MechLoadout, itemIndex: number): any {
      if (loadout.systems && loadout.systems[itemIndex]) {
        var sys = (this as any).getSystem(loadout.systems[itemIndex].id)
        return sys
      }
      return null
    },
    deleteLoadout () {
      var vm = this as any
      vm.$store.dispatch('spliceConfig', {
        id: vm.config_id,
        attr: 'loadouts',
        start_index: vm.tabIndex,
        delete_count: 1
      })
      vm.tabIndex = 0
      vm.deleteDialog = false
      vm.notify('Loadout Deleted')
      vm.refresh()
    },
    addLoadout () {
      var vm = this as any
      var mounts = vm.getFrame(vm.frame_id).mounts.map((x: any) => ({mount_type: x, weapons: [], bonuses: []}))
      if (mounts.length < 3) {
        mounts.push({mount_type: 'Flex', weapons: [], bonuses: [], imparm: true})
      }
      mounts.push()
      var newIdx = vm.loadouts.length

      vm.$store.dispatch('editConfig', {
        id: vm.config_id,
        attr: `loadouts[${newIdx}]`,
        val: {
          id: uid.generate(),
          name: newLoadoutName(newIdx),
          mounts: mounts,
          systems: []
        }
      })
      vm.refresh()
      setTimeout(() => {
        vm.tabIndex = newIdx
      }, 10)
    },
    openSystemSelector (index: number) {
      var vm = this as any
      vm.itemIndex = index
      vm.systemSelectorModal = true
    },
    refresh () {
      var vm = this as any
      vm.$forceUpdate()
      vm.reloadTrigger = Math.random()
      vm.$parent.$forceUpdate()
    },
    renameLoadout () {
      var vm = this as any
      if (vm.newLoadoutName === '') vm.notify('Loadout names cannot be blank')
      else {
        vm.$store.dispatch('editConfig', {
          id: vm.config_id,
          attr: `loadouts[${vm.tabIndex}].name`,
          val: vm.newLoadoutName
        })
        vm.newLoadoutName = ''
        vm.renameDialog = false
        vm.refresh()
      }
    },
    duplicateLoadout () {
      var vm = this as any
      var newIdx = vm.loadouts.length
      var current = vm.loadouts[vm.tabIndex]
      vm.$store.dispatch('editConfig', {
        id: vm.config_id,
        attr: `loadouts[${newIdx}]`,
        val: {
          id: uid.generate(),
          name: `${current.name} (Copy)`,
          mounts: current.mounts
        }
      })
      vm.refresh()
    },
    equipSystem (item: System, loadoutIndex: number) {
      var vm = this as any
      vm.$store.dispatch('editConfig', {
        id: vm.config_id,
        attr: `loadouts[${loadoutIndex}].systems[${vm.itemIndex}]`,
        val: {
          id: item.id,
          brew: item.brew || null
        }
      })
      vm.systemSelectorModal = false
      vm.refresh()
    },
    removeSystem (loadoutIndex: number) {
      var vm = this as any
      vm.$store.dispatch('spliceConfig', {
        id: vm.config_id,
        attr: `loadouts[${loadoutIndex}].systems`,
        start_index: vm.itemIndex,
        delete_count: 1
      })
      vm.systemSelectorModal = false
      vm.refresh()
    }
  },
  computed: {
    loadouts (): MechLoadout {
      var vm = this as any
      return vm.$store.getters['getConfigLoadouts'](this.config_id)
    },
    hasImparm (): boolean {
      var vm = this as any
      return vm.$store.getters['getPilot'].core_bonuses.includes('imparm')
    }
  },
  watch: {
    tabIndex (val: number) {
      var vm = this as any
      vm.$emit('set-index', vm.tabIndex)
      vm.refresh()
    },
    reloadTrigger (val: number) {
      var vm = this as any
      vm.$parent.loadoutForceReloadTrigger = vm.reloadTrigger
    }
  }
})
</script>
