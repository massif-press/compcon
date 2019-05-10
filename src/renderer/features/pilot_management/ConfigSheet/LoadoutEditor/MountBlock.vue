<template>
  <div v-if="!mount.imparm || (mount.imparm && hasImpArm)">
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">{{mountName()}}
        <v-tooltip top>
          <v-btn v-if="isCbVisible()" slot="activator" icon class="ma-0"
            @click="coreBonusSelectorModal = true; cbsLoader = true">
            <v-icon :color="freeMountBonuses ? 'yellow' : 'grey lighten-1'"
             v-html="freeMountBonuses ? 'mdi-progress-alert' : 'mdi-progress-download'" />
          </v-btn>
          <span>Apply CORE Bonus Effects</span>
        </v-tooltip>
      </span>
      <v-card-text v-if="mount.sh_lock" class="bordered ml-3 pt-4">
        <v-card color="grey darken-1">
          <v-card-text class="blockquote text-xs-center">
            LOCKED<br>
            <span class="caption">SUPERHEAVY WEAPON BRACING</span><br>
          </v-card-text>
        </v-card>
        </v-card-text>
      <v-card-text v-else class="bordered ml-3 pt-4">
        <div v-if="mount.mount_type === 'Main/Aux' || mount.bonuses.includes('retrofit')">
          <mech-weapon-item :key="'ma0_' + weaponReload" :item="mount.weapons[0] || null" 
            fitting-type="Main" @clicked="openWeaponSelector('main', 0)"  @open-mod="openModSelector(0)" />
          <mech-weapon-item :key="'ma1_' + weaponReload" :item="mount.weapons[1] || null"  
            fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 1)"  @open-mod="openModSelector(1)" />
        </div>
        <div v-else-if="mount.mount_type === 'Aux/Aux'">
          <mech-weapon-item :key="'a0_' + weaponReload" :item="mount.weapons[0] || null" 
            fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 0)"  @open-mod="openModSelector(0)" />
          <mech-weapon-item :key="'a1_' + weaponReload" :item="mount.weapons[1] || null" 
            fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 1)"  @open-mod="openModSelector(1)" />
        </div>
        <div v-else-if="mount.mount_type === 'Flex'">
          <div v-if="!mount.weapons[0] || getWeapon(mount.weapons[0].id).err">
            <mech-weapon-item :key="'fl0_' + weaponReload" :item="null" 
              fitting-type="Main or Aux" @clicked="openWeaponSelector('flex', 0)" />  
          </div>
          <div v-else-if="mount.weapons[0] && getWeapon(mount.weapons[0].id).mount === 'Main'">
            <mech-weapon-item :key="'fl1_' + weaponReload" :item="mount.weapons[0]" 
              fitting-type="Main" @clicked="openWeaponSelector('flex', 0)" @open-mod="openModSelector(0)" />  
          </div>
          <div v-else-if="mount.weapons[0] && getWeapon(mount.weapons[0].id).mount === 'Auxiliary'">
            <mech-weapon-item :key="'fl2_' + weaponReload" :item="mount.weapons[0]" 
              fitting-type="Auxiliary" @clicked="openWeaponSelector('flex', 0)"  @open-mod="openModSelector(0)" />  
            <mech-weapon-item :key="'fl3_' + weaponReload" :item="mount.weapons[1] || null" 
              fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 1)"  @open-mod="openModSelector(1)" /> 
          </div>
        </div>
        <div v-else>
          <mech-weapon-item :key="'h0_' + weaponReload" :item="mount.weapons[0] || null" 
            :fitting-type="mount.mount_type" @clicked="openWeaponSelector(mount.mount_type.toLowerCase(), 0)"  
            @open-mod="openModSelector(0)" />
        </div>
        <div v-if="mount.bonuses.includes('intweapon')">
          <mech-weapon-item :key="'int0_' + weaponReload" :item="mount.weapons[intweaponLength] || null" 
          fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', intweaponLength)" />
        </div>
          <v-card v-for="(m, mbIdx) in mountBonuses()" :key="`mb_${m}_${mbIdx}`" color="grey darken-1" class="ma-2">
            <v-card-text class="text-xs-center">
              <b>{{getCoreBonus(m).name}}</b><br>
              <i class="caption">{{getCoreBonus(m).mounted_effect}}</i>
            </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    
    <!-- Weapon Selector Modal -->
    <v-dialog v-model="weaponSelectorModal" lazy fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title><span class="text-capitalize">Select Weapon</span></v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="weaponSelectorModal = false"> <v-icon large>close</v-icon> </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <weapon-table :loadout_index="loadoutIndex" :config_id="config_id" :free_sp="free_sp" :current_equip="current_equip" :size="size"
        @select-item="equipWeapon" @select-superheavy="stageSuperheavy" @remove-item="removeWeapon" @unlock-sh="removeShLocks"/>
    </v-dialog>

    <!-- Superheavy Lock Modal -->
    <lazy-dialog :model="shLockDialog" title="Select Bracing Mount" @accept="equipSuperheavy" @cancel="shLockDialog = false">
      <v-card-text slot="modal-content" class="text-xs-center">
        Superheavy-class weaponry requires an additional mount. Select the bracing mount below.<br>
        <i>The selected mount will be locked until the superheavy weapon is removed.</i>
        <br>
          <v-btn-toggle v-model="shLockModel" mandatory class="ma-3">
          <div v-for="(m, idx) in loadout.mounts" :key="'sh_' + m.mount_type + idx" >
            <v-btn :disabled="m.mount_type === 'Heavy'" v-html="`&emsp;${m.mount_type}&emsp;`" large/>
          </div>
        </v-btn-toggle>
      </v-card-text>                
    </lazy-dialog> 

    <!-- CB Benefit -->
    <v-dialog v-model="coreBonusSelectorModal" width="70vw" lazy hide-overlay>
      <v-card dark>
        <core-benefit-selector v-if="cbsLoader" :loadout="loadout" :mount="mount" 
          @cancel="cancelCBSM" @confirm="confirmCBSM" />
      </v-card>
    </v-dialog>

    <!-- Mod selector dialog -->
    <v-dialog v-model="modModal" width="70vw" lazy fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title><span class="text-capitalize">Select Weapon Modification</span></v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="modModal = false; modLoader = false"> <v-icon large>close</v-icon> </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card dark>
        <mod-table v-if="modLoader" :free_sp="free_sp" :current_equip="current_equip_mod" :weapon="modWeapon" 
          @remove="removeMod" @select="applyMod" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import _ from 'lodash'
  import MechWeaponItem from './MechWeaponItem.vue'
  import WeaponTable from './WeaponTable.vue'
  import CoreBenefitSelector from './CoreBenefitSelector.vue'
  import ModTable from './ModTable.vue'
  import {LazyDialog} from '../../components/UI'

  export default Vue.extend({
  name: 'mount-block',
  props: {
    config_id: String,
    mount: Object,
    loadout: Object,
    free_sp: Number,
    loadoutIndex: Number,
    mountIndex: Number
  },
  data: () => ({
    weaponSelectorModal: false,
    shLockDialog: false,
    coreBonusSelectorModal: false,
    cbsLoader: false,
    weaponIndex: 0,
    size: '',
    current_equip: {} || null,
    current_equip_mod: {},
    pendingSuperheavy: {},
    shLockModel: 0,
    modModal: false,
    modLoader: false,
    modWeapon: {},
    weaponReload: 0
  }),
  components: { MechWeaponItem, WeaponTable, CoreBenefitSelector, ModTable, LazyDialog },
  computed: {
    hasImpArm (): boolean {
      return (this as any).$store.getters['getPilot'].core_bonuses.includes('imparm')
    },
    allMountBonuses (): string[] {
      return _.intersection(['hardpoints', 'burnout', 'intweapon', 'retrofit'], this.$store.getters['getPilot'].core_bonuses)
    },
    freeMountBonuses (): number {
      var vm = this as any
      var appliedBonuses = _.flatten(vm.loadout.mounts.map((x: MechMount) => x.bonuses))
      return vm.allMountBonuses.length - appliedBonuses.length
    },
    intweaponLength (): number {
      return (this.mount.mount_type.includes('/') || this.mount.mount_type === 'Flex') ? 2 : 1
    }
  },
  methods: {
    refresh () {
      this.weaponReload = Math.random()
      this.$forceUpdate()
      this.$parent.$forceUpdate()
      this.$emit('refresh')
    },
    mountBonuses (): string[] {
      return _.intersection(['hardpoints', 'burnout', 'intweapon', 'retrofit'], this.mount.bonuses)
    },
    openModSelector (index: number) {
      (this as any).current_equip_mod = null
      var modID = this.mount.weapons[index].mod || null
      if (modID) this.current_equip_mod = this.$store.getters['getItemById']('WeaponMods', modID)
      this.modWeapon = this.$store.getters['getItemById']('MechWeapons', this.mount.weapons[index].id)
      this.weaponIndex = index
      this.modLoader = true
      this.modModal = true
    },
    mountName (): string {
      if (this.mount.bonuses.includes('retrofit')) return 'Main/Aux Mount (Retrofitted)'
      if (this.mount.imparm) return 'Flex Mount (Improved Armament)'
      return `${this.mount.mount_type} Mount`
    },
    equipWeapon (item: Weapon) {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}]`,
        val: {
          id: item.id,
          brew: item.brew || null
        }
      })
      this.weaponSelectorModal = false
      this.refresh()
    },
    stageSuperheavy (item: Weapon) {
      this.pendingSuperheavy = item.id
      this.shLockDialog = true
    },
    equipSuperheavy () {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}]`,
        val: { id: this.pendingSuperheavy }
      })
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.shLockModel}].sh_lock`,
        val: true
      })
      this.shLockDialog = false
      this.weaponSelectorModal = false
      this.refresh()
    },
    removeShLocks () {
      for (var i = 0; i < this.loadout.mounts.length; i++) {
        if (this.loadout.mounts[i].sh_lock) {
          this.$store.dispatch('editConfig', {
            id: this.config_id,
            attr: `loadouts[${this.loadoutIndex}].mounts[${i}].sh_lock`,
            val: false
          })
        }
      }
    },
    removeWeapon (loadoutIndex: number) {
      this.$store.dispatch('spliceConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons`,
        start_index: this.weaponIndex,
        delete_count: 1
      })
      if (this.mount.mount_type === 'Heavy') {
        this.removeShLocks()
      }
      this.weaponSelectorModal = false
      this.refresh()
    },
    openWeaponSelector (mountType: string, index: number) {
      var vm = this as any
      vm.size = mountType
      vm.weaponIndex = index
      vm.current_equip = null
      if (vm.loadout.mounts[vm.mountIndex].weapons) {
        var w = vm.loadout.mounts[vm.mountIndex].weapons[vm.weaponIndex]
        if (w && !vm.getWeapon(w.id).err) this.current_equip = w
      }
      this.weaponSelectorModal = true
    },
    isCbVisible (): boolean {
      var vm = this as any
      return vm.freeMountBonuses > 0 || vm.mount.bonuses.length
    },
    confirmCBSM (bonusArray: string[]) {
      //if removing retrofitting
      if (this.mount.bonuses.includes('retrofit') && !bonusArray.includes('retrofit')) {
        //remove all weapons and mods on this mount
        this.$store.dispatch('spliceConfig', {
          id: this.config_id,
          attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons`,
          start_index: 0,
          delete_count: this.mount.weapons.length
        })
      }
      //if removing intweapon
      if (this.mount.bonuses.includes('intweapon') && !bonusArray.includes('intweapon')) {
        //remove all weapons and mods from bonus aux mount
        this.$store.dispatch('spliceConfig', {
          id: this.config_id,
          attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons`,
          start_index: this.mount.weapons.length - 1,
          delete_count: 1
        })
      }

      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].bonuses`,
        val: bonusArray
      })
      this.coreBonusSelectorModal = false
      this.cbsLoader = false
      this.refresh()
    },
    cancelCBSM () {
      this.coreBonusSelectorModal = false
      this.cbsLoader = false
    },
    applyMod (mod: WeaponMod) {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}].mod`,
        val: mod.id
      })
      this.modModal = false
      this.modLoader = false
      this.refresh()
    },
    removeMod () {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}].mod`,
        val: null
      })
      this.modModal = false
      this.modLoader = false
      this.refresh()
    }
  }
})
</script>
