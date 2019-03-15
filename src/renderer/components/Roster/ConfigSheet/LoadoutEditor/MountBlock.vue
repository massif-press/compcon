<template>
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">{{mount.mount_type}} Mount</span>
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
        <div v-if="mount.mount_type === 'Main/Aux'">
          <mech-weapon-item :item="mount.weapons[0] || null" fitting-type="Main" @clicked="openWeaponSelector('main', 0)" />
          <mech-weapon-item :item="mount.weapons[1] || null" empty fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 1)" />
        </div>
        <div v-else-if="mount.mount_type === 'Aux/Aux'">
          <mech-weapon-item :item="mount.weapons[0] || null" fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 0)" />
          <mech-weapon-item :item="mount.weapons[1] || null" fitting-type="Auxiliary" @clicked="openWeaponSelector('auxiliary', 1)" />
        </div>
        <div v-else-if="mount.mount_type === 'Flex'">
          <div v-if="!mount.weapons[0]">
            <mech-weapon-item :item="null" fitting-type="Main / Aux" @clicked="openWeaponSelector('flex', 0)" />  
          </div>
          <div v-else-if="mount.weapons[0] && item(mount.weapons[0].id).mount === 'Main'">
            <mech-weapon-item :item="mount.weapons[0]" fitting-type="Main" @clicked="openWeaponSelector('flex', 0)" />  
          </div>
          <div v-else-if="mount.weapons[0] && item(mount.weapons[0].id).mount === 'Auxiliary'">
            <mech-weapon-item :item="mount.weapons[0]" fitting-type="Aux" @clicked="openWeaponSelector('flex', 0)" />  
            <mech-weapon-item :item="mount.weapons[1] || null" fitting-type="Aux" @clicked="openWeaponSelector('auxiliary', 1)" />  
          </div>
        </div>
        <div v-else>
          <mech-weapon-item :item="mount.weapons[0] || null" :fitting-type="mount.mount_type" @clicked="openWeaponSelector(mount.mount_type.toLowerCase(), 0)" />
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Weapon Selector Modal -->
    <v-dialog v-model="weaponSelectorModal" lazy fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title><span class="text-capitalize">Select Weapon</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon large @click="weaponSelectorModal = false"> <v-icon large>close</v-icon> </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <weapon-table :free_sp="free_sp" :current_equip="current_equip" :size="size" @select-item="equipWeapon" @select-superheavy="stageSuperheavy" @remove-item="removeWeapon" @unlock-sh="removeShLocks"/>
    </v-dialog>

    <!-- Superheavy Lock Modal -->
    <v-dialog v-model="shLockModal" width="800" >
        <v-card>
          <v-card-text class="text-xs-center">
            Superheavy-class weaponry requires an additional mount. Select the bracing mount below.<br>
            <i>The selected mount will be locked until the superheavy weapon is removed.</i>
            <br>
             <v-btn-toggle v-model="shLockModel" mandatory class="ma-3">
              <div v-for="m in loadout.mounts" :key="'sh_' + m.mount_type" >
                <v-btn :disabled="m.mount_type === 'Heavy'" v-html="`&emsp;${m.mount_type}&emsp;`" large/>
              </div>
            </v-btn-toggle>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn flat @click="shLockModal = false" > Cancel </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="equipSuperheavy" > Confirm </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> 


  </div>
</template>

<script>
import MechWeaponItem from './MechWeaponItem'
import WeaponTable from './WeaponTable'

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
    weaponIndex: 0,
    size: '',
    current_equip: Object,
    pendingSuperheavy: Object,
    shLockModel: 0
  }),
  components: { MechWeaponItem, WeaponTable },
  methods: {
    equipWeapon (item) {
      this.$store.dispatch('editConfig', {
        id: this.config_id,
        attr: `loadouts[${this.loadoutIndex}].mounts[${this.mountIndex}].weapons[${this.weaponIndex}]`,
        val: { id: item.id }
      })
      this.weaponSelectorModal = false
      this.$emit('refresh')
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
      this.$emit('refresh')
    },
    removeShLocks () {
      for (var i = 0; i < this.loadout.mounts.length; i++) {
        console.log(this.loadout.mounts[i].sh_lock)
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
      this.weaponSelectorModal = false
      this.weaponSelectorModal = false
    },
    openWeaponSelector (mountType, index) {
      this.size = mountType
      this.weaponIndex = index
      this.current_equip = null
      if (this.loadout.mounts[this.mountIndex].weapons) this.current_equip = this.loadout.mounts[this.mountIndex].weapons[this.weaponIndex] || null
      this.weaponSelectorModal = true
    },
    item: function (id) {
      return this.$store.getters.getItemById('MechWeapons', id)
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
