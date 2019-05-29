<template>
  <!-- <div v-if="!mount.imparm || (mount.imparm && hasImpArm)"> -->
    <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">{{mount.Type}} Mount <!--{{mountName()}}-->
        <v-tooltip top>
          <v-btn v-if="isCbVisible()" slot="activator" icon class="ma-0"
            @click="coreBonusSelectorModal = true; cbsLoader = true">
            <v-icon :color="freeMountBonuses ? 'yellow' : 'grey lighten-1'"
             v-html="freeMountBonuses ? 'mdi-progress-alert' : 'mdi-progress-download'" />
          </v-btn>
          <span>Apply CORE Bonus Effects</span>
        </v-tooltip>
      </span>
      <v-card-text v-if="mount.IsLocked" class="bordered ml-3 pt-4">
        <v-card color="grey darken-1">
          <v-card-text class="blockquote text-xs-center">
            LOCKED<br><span class="caption">SUPERHEAVY WEAPON BRACING</span><br>
          </v-card-text>
        </v-card>
        </v-card-text>
      <v-card-text v-else class="bordered ml-3 pt-4">

        <mech-weapon-item v-for="(ws, i) in mount.Slots" :key="`ws_${i}`" :weapon-slot="ws" :mount="mount" :loadout="loadout"/>

          <v-card v-for="(cb, j) in mount.BonusEffects" :key="`mb_${j}`" color="grey darken-1" class="ma-2">
            <v-card-text class="text-xs-center">
              <b>{{cb.Name}}</b><br>
              <i class="caption">{{cb.MountedEffect}}</i>
            </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- CB Benefit -->
    <v-dialog v-model="coreBonusSelectorModal" width="70vw" lazy hide-overlay>
      <v-card dark>
        <core-benefit-selector v-if="cbsLoader" :loadout="loadout" :mount="mount" 
          @cancel="cancelCBSM" @confirm="confirmCBSM" />
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
  import { Mount, MechWeapon, WeaponMod } from '@/class'

  export default Vue.extend({
  name: 'mount-block',
  props: {
    mount: Object,
    loadout: Object,
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
    modModal: false,
    modLoader: false,
    modWeapon: {},
    weaponReload: 0
  }),
  components: { MechWeaponItem, WeaponTable, CoreBenefitSelector, ModTable, LazyDialog },
  computed: {
    // hasImpArm (): boolean {
    //   return (this as any).$store.getters['getPilot'].core_bonuses.includes('imparm')
    // },
    allMountBonuses (): string[] {
      return _.intersection(['hardpoints', 'burnout', 'intweapon', 'retrofit'], this.$store.getters['getPilot'].core_bonuses)
    },
    freeMountBonuses (): number {
      var vm = this as any
      // var appliedBonuses = _.flatten(vm.loadout.mounts.map((x: Mount) => x.bonuses))
      // return vm.allMountBonuses.length - appliedBonuses.length
      return 1
    },
  },
  methods: {
    // openModSelector (index: number) {
    //   (this as any).current_equip_mod = null
    //   var modID = this.mount.weapons[index].mod || null
    //   if (modID) this.current_equip_mod = this.$store.getters.getItemById('WeaponMods', modID)
    //   this.modWeapon = this.$store.getters.getItemById('MechWeapons', this.mount.weapons[index].id)
    //   this.weaponIndex = index
    //   this.modLoader = true
    //   this.modModal = true
    // },
    // // mountName (): string {
    // //   if (this.mount.bonuses.includes('retrofit')) return 'Main/Aux Mount (Retrofitted)'
    // //   if (this.mount.imparm) return 'Flex Mount (Improved Armament)'
    // //   return `${this.mount.mount_type} Mount`
    // // },
    // equipWeapon (item: MechWeapon) {
    //   this.$store.dispatch('editConfig', {
    //     id: this.config_id,
    //     attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}]`,
    //     val: {
    //       id: item.ID,
    //       brew: item.Brew || null
    //     }
    //   })
    //   this.weaponSelectorModal = false
    //   this.refresh()
    // },
    // stageSuperheavy (item: MechWeapon) {
    //   this.pendingSuperheavy = item.ID
    //   this.shLockDialog = true
    // },
    // equipSuperheavy () {
    //   this.$store.dispatch('editConfig', {
    //     id: this.config_id,
    //     attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}]`,
    //     val: { id: this.pendingSuperheavy }
    //   })
    //   this.$store.dispatch('editConfig', {
    //     id: this.config_id,
    //     attr: `loadouts[${this.loadoutIndex}].mounts[${this.shLockModel}].sh_lock`,
    //     val: true
    //   })
    //   this.shLockDialog = false
    //   this.weaponSelectorModal = false
    //   this.refresh()
    // },
    // removeShLocks () {
    //   for (var i = 0; i < this.loadout.mounts.length; i++) {
    //     if (this.loadout.mounts[i].sh_lock) {
    //       this.$store.dispatch('editConfig', {
    //         id: this.config_id,
    //         attr: `loadouts[${this.loadoutIndex}].mounts[${i}].sh_lock`,
    //         val: false
    //       })
    //     }
    //   }
    // },
    // removeWeapon (loadoutIndex: number) {
    //   this.$store.dispatch('spliceConfig', {
    //     id: this.config_id,
    //     attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons`,
    //     start_index: this.weaponIndex,
    //     delete_count: 1
    //   })
    //   if (this.mount.mount_type === 'Heavy') {
    //     this.removeShLocks()
    //   }
    //   this.weaponSelectorModal = false
    //   this.refresh()
    // },
    // openWeaponSelector (mountType: string, index: number) {
    //   var vm = this as any
    //   vm.size = mountType
    //   vm.weaponIndex = index
    //   vm.current_equip = null
    //   if (vm.loadout.mounts[vm.mountIndex].weapons) {
    //     var w = vm.loadout.mounts[vm.mountIndex].weapons[vm.weaponIndex]
    //     if (w && !vm.getWeapon(w.id).err) this.current_equip = w
    //   }
    //   this.weaponSelectorModal = true
    // },
    isCbVisible (): boolean {
      var vm = this as any
      return vm.freeMountBonuses > 0 || vm.mount.bonuses.length
    },
    confirmCBSM (bonusArray: string[]) {
      //if removing retrofitting
    //   if (this.mount.bonuses.includes('retrofit') && !bonusArray.includes('retrofit')) {
    //     //remove all weapons and mods on this mount
    //     this.$store.dispatch('spliceConfig', {
    //       id: this.config_id,
    //       attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons`,
    //       start_index: 0,
    //       delete_count: this.mount.weapons.length
    //     })
    //   }
    //   //if removing intweapon
    //   if (this.mount.bonuses.includes('intweapon') && !bonusArray.includes('intweapon')) {
    //     //remove all weapons and mods from bonus aux mount
    //     this.$store.dispatch('spliceConfig', {
    //       id: this.config_id,
    //       attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons`,
    //       start_index: this.mount.weapons.length - 1,
    //       delete_count: 1
    //     })
    //   }

    //   this.$store.dispatch('editConfig', {
    //     id: this.config_id,
    //     attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].bonuses`,
    //     val: bonusArray
    //   })
    //   this.coreBonusSelectorModal = false
    //   this.cbsLoader = false
    //   this.refresh()
    // },
    // cancelCBSM () {
    //   this.coreBonusSelectorModal = false
    //   this.cbsLoader = false
    // },
    // applyMod (mod: WeaponMod) {
    //   this.$store.dispatch('editConfig', {
    //     id: this.config_id,
    //     attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}].mod`,
    //     val: mod.ID
    //   })
    //   this.modModal = false
    //   this.modLoader = false
    //   this.refresh()
    },
  //   removeMod () {
  //     this.$store.dispatch('editConfig', {
  //       id: this.config_id,
  //       attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}].mod`,
  //       val: null
  //     })
  //     this.modModal = false
  //     this.modLoader = false
  //     this.refresh()
  //   }
  }
})
</script>
