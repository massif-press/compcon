<template>
  <div v-if="!mount.imparm || (mount.imparm && hasImparm)">
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">{{mountName()}}
        <v-icon v-if="allMountBonuses.length" small class="mt-0 pt-0 pb-1" @click="coreBonusSelectorModal = true; cbsLoader = true">build</v-icon></span>
      <v-card-text v-if="mount.sh_lock" class="bordered ml-3 pt-4">
        <v-card color="grey darken-1">
          <v-card-text class="blockquote text-xs-center">
            LOCKED<br>
            <span class="caption">SUPERHEAVY WEAPON BRACING</span><br>
            <!-- <v-btn color="grey lighten-1" flat outline small @click="shLockModal = true">Change Bracing Mount</v-btn> -->
          </v-card-text>
        </v-card>
        </v-card-text>
      <v-card-text v-else class="bordered ml-3 pt-4">
        <div v-if="mount.mount_type === 'Main/Aux' || mount.bonuses.includes('retrofit')">
          <mech-weapon-item :key="mount.mount_type + '0' + weaponReload" :item="mount.weapons[0] || null" fitting-type="Main" @clicked="openWeaponSelector('main', 0)"  @open-mod="openModSelector(0)" />
          <mech-weapon-item :key="mount.mount_type + '1' + weaponReload" :item="mount.weapons[1] || null" empty fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 1)"  @open-mod="openModSelector(1)" />
        </div>
        <div v-else-if="mount.mount_type === 'Aux/Aux'">
          <mech-weapon-item :key="mount.mount_type + '0' + weaponReload" :item="mount.weapons[0] || null" fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 0)"  @open-mod="openModSelector(0)" />
          <mech-weapon-item :key="mount.mount_type + '1' + weaponReload" :item="mount.weapons[1] || null" fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 1)"  @open-mod="openModSelector(1)" />
        </div>
        <div v-else-if="mount.mount_type === 'Flex'">
          <div v-if="!mount.weapons[0]">
            <mech-weapon-item :key="mount.mount_type + '0' + weaponReload" :item="null" fitting-type="Main or Aux" @clicked="openWeaponSelector('flex', 0)" />  
          </div>
          <div v-else-if="mount.weapons[0] && item('MechWeapons', mount.weapons[0].id).mount === 'Main'">
            <mech-weapon-item :key="mount.mount_type + '1' + weaponReload" :item="mount.weapons[0]" fitting-type="Main" @clicked="openWeaponSelector('flex', 0)" @open-mod="openModSelector(0)" />  
          </div>
          <div v-else-if="mount.weapons[0] && item('MechWeapons', mount.weapons[0].id).mount === 'Auxiliary'">
            <mech-weapon-item :key="mount.mount_type + '0' + weaponReload" :item="mount.weapons[0]" fitting-type="Aux" @clicked="openWeaponSelector('flex', 0)"  @open-mod="openModSelector(0)" />  
            <mech-weapon-item :key="mount.mount_type + '1' + weaponReload" :item="mount.weapons[1] || null" fitting-type="Aux" @clicked="openWeaponSelector('auxiliary', 1)"  @open-mod="openModSelector(1)" />  
          </div>
        </div>
        <div v-else>
          <mech-weapon-item :key="mount.mount_type + '0' + weaponReload" :item="mount.weapons[0] || null" :fitting-type="mount.mount_type" @clicked="openWeaponSelector(mount.mount_type.toUpperCase(), 0)"  @open-mod="openModSelector(0)" />
        </div>
        <div v-if="mount.bonuses.includes('intweapon')">
          <mech-weapon-item :key="weaponReload" :item="mount.weapons[intweaponLength] || null" fitting-type="Aux" @clicked="openWeaponSelector('auxiliary', intweaponLength)" />
        </div>
          <v-card v-for="m in mountBonuses" :key="`mb_${m}`" color="grey darken-1" class="ma-2">
          <v-card-text class="text-xs-center">
            <b>{{item('CoreBonuses', m).name}}</b><br>
            <i class="caption">{{item('CoreBonuses', m).mounted_effect}}</i>
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
      <weapon-table :loadout_index="loadoutIndex" :config_id="config_id" :free_sp="free_sp" :current_equip="current_equip" :size="size" @select-item="equipWeapon" @select-superheavy="stageSuperheavy" @remove-item="removeWeapon" @unlock-sh="removeShLocks"/>
    </v-dialog>

    <!-- Superheavy Lock Modal -->
    <v-dialog v-model="shLockModal" width="800" >
        <v-card>
          <v-card-text class="text-xs-center">
            Superheavy-class weaponry requires an additional mount. Select the bracing mount below.<br>
            <i>The selected mount will be locked until the superheavy weapon is removed.</i>
            <br>
             <v-btn-toggle v-model="shLockModel" mandatory class="ma-3">
              <div v-for="(m, idx) in loadout.mounts" :key="'sh_' + m.mount_type + idx" >
                <v-btn :disabled="m.mount_type === 'Heavy'" v-html="`&emsp;${m.mount_type}&emsp;`" large/>
              </div>
            </v-btn-toggle>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn flat @click="shLockModal = false" > Cancel </v-btn>
            <v-spacer />
            <v-btn color="primary" @click="equipSuperheavy" > Confirm </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- CB Benefit -->
      <v-dialog v-model="coreBonusSelectorModal" width="70vw" lazy hide-overlay>
        <v-card dark>
          <core-benefit-selector v-if="cbsLoader" :loadout="loadout" :mount="mount" @cancel="cancelCBSM" @confirm="confirmCBSM" />
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
          <mod-table v-if="modLoader" :free_sp="free_sp" :current_equip="current_equip_mod" :weapon_type="modWeaponType" @remove="removeMod" @select="applyMod" />
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import MechWeaponItem from './MechWeaponItem'
import WeaponTable from './WeaponTable'
import CoreBenefitSelector from './CoreBenefitSelector'
import ModTable from './ModTable'
import _ from 'lodash'

export default {
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
    shLockModal: false,
    coreBonusSelectorModal: false,
    cbsLoader: false,
    weaponIndex: 0,
    size: '',
    current_equip: {},
    current_equip_mod: {},
    pendingSuperheavy: {},
    shLockModel: 0,
    modModal: false,
    modLoader: false,
    modWeaponType: '',
    weaponReload: 0
  }),
  components: { MechWeaponItem, WeaponTable, CoreBenefitSelector, ModTable },
  computed: {
    hasImparm: function () {
      return this.$store.getters.getPilot.core_bonuses.includes('imparm')
    },
    allMountBonuses: function () {
      return _.intersection(['hardpoints', 'burnout', 'intweapon', 'retrofit'], this.$store.getters.getPilot.core_bonuses)
    },
    mountBonuses: function () {
      return _.intersection(['hardpoints', 'burnout', 'intweapon', 'retrofit'], this.mount.bonuses)
    },
    intweaponLength: function () {
      return this.mount.mount_type.includes('/') ? 2 : 1
    }
  },
  methods: {
    refresh: function () {
      this.$forceUpdate()
      this.weaponReload = Math.random()
      this.$emit('refresh')
    },
    openModSelector: function (index) {
      this.current_equip_mod = null
      var modID = this.mount.weapons[index].mod || null
      if (modID) this.current_equip_mod = this.$store.getters.getItemById('WeaponMods', modID)
      this.modWeaponType = this.$store.getters.getItemById('MechWeapons', this.mount.weapons[index].id).type.toUpperCase()
      this.weaponIndex = index
      this.modLoader = true
      this.modModal = true
    },
    mountName: function () {
      if (this.mount.bonuses.includes('retrofit')) return 'Main/Aux Mount (Retrofitted)'
      if (this.mount.imparm) return 'Flex Mount (Improved Armament)'
      return `${this.mount.mount_type} Mount`
    },
    equipWeapon (item) {
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
    stageSuperheavy (item) {
      this.pendingSuperheavy = item.id
      this.shLockModal = true
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
      this.shLockModal = false
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
    removeWeapon (loadoutIndex) {
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
    openWeaponSelector (mountType, index) {
      this.size = mountType
      this.weaponIndex = index
      this.current_equip = null
      if (this.loadout.mounts[this.mountIndex].weapons) this.current_equip = this.loadout.mounts[this.mountIndex].weapons[this.weaponIndex] || null
      this.weaponSelectorModal = true
    },
    item: function (itemType, id) {
      return this.$store.getters.getItemById(itemType, id)
    },
    confirmCBSM: function (bonusArray) {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].bonuses`,
        val: bonusArray
      })
      this.coreBonusSelectorModal = false
      this.cbsLoader = false
      this.$emit('refresh')
    },
    cancelCBSM: function () {
      this.coreBonusSelectorModal = false
      this.cbsLoader = false
    },
    applyMod: function (mod) {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}].mod`,
        val: mod.id
      })
      this.modModal = false
      this.modLoader = false
      this.refresh()
    },
    removeMod: function () {
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
}
</script>

<style>
  .mount-title {
    position: relative;
    top: 15px;
    left: 30px;
    background-color: #616161;
    font-size: 20px;
    letter-spacing: 3px;
    padding: 0;
  }
  .bordered {
    border: solid 2px #424242; 
  }
</style>
