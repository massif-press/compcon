<template>
  <v-layout fill-height>
    <v-flex xs2>
      <v-tooltip top>
        <v-btn
          slot="activator"
          color="blue-grey darken-2"
          block
          @click="weaponSelectorModal = true"
          class="ma-0 pa-0"
          style="height:100%"
          v-html="
            weaponSlot.Size +
              (!weaponSlot.Weapon || weaponSlot.Weapon.err ? ' Weapon' : '')
          "
        ></v-btn>
        <span v-if="!weaponSlot.Weapon">
          Equip {{ weaponSlot.Size }} Weapon
        </span>
        <span v-else>Change Equipped {{ weaponSlot.Size }} Weapon</span>
      </v-tooltip>
    </v-flex>
    <v-flex xs10>
      <div v-if="!weaponSlot.Weapon">
        <v-expansion-panel class="ma-0">
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading">EMPTY</span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else-if="weaponSlot.Weapon.err">
        <v-expansion-panel class="ma-0">
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading grey--text">
              // MISSING WEAPON DATA //
            </span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else>
        <v-expansion-panel class="m-0">
          <v-expansion-panel-content>
            <v-layout slot="header">
              <span class="subheading font-weight-bold">
                {{ weaponSlot.Weapon.name }}
                <span
                  class="subheading font-weight-bold"
                  v-if="weaponSlot.Weapon.Mod && weaponSlot.Weapon.Mod.err"
                >
                  <span class="subheading grey--text">
                    // MISSING MOD DATA //
                  </span>
                </span>
                <span
                  class="subheading font-weight-bold"
                  v-if="weaponSlot.Weapon.Mod && !weaponSlot.Weapon.Mod.err"
                >
                  <span class="grey--text font-weight-regular">//</span>
                  <span class="blue-grey--text text--lighten-3">
                    {{ weaponSlot.Weapon.Mod.Name }}
                  </span>
                  <span class="caption">
                    ({{ weaponSlot.Weapon.Mod.SP }} SP)
                  </span>
                </span>
              </span>
              <v-spacer />
              <span class="mr-5" style="display: inline-flex;">
                <range-element dark small :range="getRange()" />
                &emsp;&mdash;&emsp;
                <damage-element dark small size="16" :dmg="getDamage()" />
                <v-spacer class="mr-3" />
                <v-tooltip top v-if="!noMod">
                  <div slot="activator">
                    <v-btn
                      @click.stop="toggleModModal(true)"
                      flat
                      icon
                      small
                      absolute
                      class="ma-0 pa-0"
                      style="top: 10px"
                    >
                      <v-icon small>build</v-icon>
                    </v-btn>
                  </div>
                  <span>Add/Change Weapon Mods</span>
                </v-tooltip>
              </span>
            </v-layout>
            <mod-card
              v-if="weaponSlot.Weapon.Mod && !weaponSlot.Weapon.Mod.err"
              :modData="weaponSlot.Weapon.Mod"
            />
            <core-bonus-card
              v-for="cb in mount.CoreBonuses"
              :key="cb.ID"
              :cb="cb"
            />
            <weapon-card
              :item="weaponSlot.Weapon"
              :mod="weaponSlot.Weapon.Mod"
              :loadout="loadout"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-flex>

    <!-- Weapon Selector Modal -->
    <v-dialog
      v-model="weaponSelectorModal"
      lazy
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title>
          <span class="text-capitalize">Select Weapon</span>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="weaponSelectorModal = false">
            <v-icon large>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <weapon-table
        :weapon-slot="weaponSlot"
        :mount="mount"
        :loadout="loadout"
        :maxSP="maxSP"
        @select-item="selectItem"
        @remove-item="removeItem"
      />
    </v-dialog>

    <!-- Superheavy Lock Modal -->
    <v-dialog v-model="lockDialog">
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title>
          <span class="text-capitalize">Select Bracing Mount</span>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="lockDialog = false">
            <v-icon large>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card>
        <v-card-text class="text-xs-center">
          Superheavy-class weaponry requires an additional mount. Select the
          bracing mount below.
          <br />
          <i>
            The selected mount will be locked until the superheavy weapon is
            removed.
          </i>
          <br />
          <v-layout row justify-center>
            <div
              v-for="(m, i) in loadout.AllEquippableMounts(hasImproved)"
              :key="`sh_${i}`"
            >
              <v-flex v-if="m.Type !== 'Heavy'">
                <v-btn
                  v-html="`&emsp;${m.Type}&emsp;`"
                  large
                  block
                  @click="equipSuperheavy(m)"
                />
              </v-flex>
            </div>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Mod selector dialog -->
    <v-dialog
      v-if="modLoader"
      v-model="modModal"
      width="70vw"
      lazy
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title>
          <span class="text-capitalize">Select Weapon Modification</span>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="modModal = false">
            <v-icon large>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card dark>
        <mod-table
          :weapon-slot="weaponSlot"
          :mount="mount"
          :loadout="loadout"
          :maxSP="maxSP"
          @close="toggleModModal(false)"
        />
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  RangeElement,
  DamageElement,
  WeaponCard,
  ModCard,
  CoreBonusCard,
  LazyDialog,
} from '../../components/UI'
import WeaponTable from './WeaponTable.vue'
import ModTable from './ModTable.vue'
import {
  MechWeapon,
  WeaponMod,
  WeaponSlot,
  EquippableMount,
  MechLoadout,
  WeaponSize,
  Range,
  Damage,
  RangeType,
  DamageType,
} from '@/class'

export default Vue.extend({
  name: 'mech-weapon-item',
  components: {
    WeaponCard,
    ModCard,
    RangeElement,
    DamageElement,
    WeaponTable,
    LazyDialog,
    ModTable,
    CoreBonusCard,
  },
  props: {
    weaponSlot: WeaponSlot,
    mount: EquippableMount,
    loadout: MechLoadout,
    maxSP: Number,
    noMod: Boolean,
  },
  data: () => ({
    weaponSelectorModal: false,
    lockDialog: false,
    stagedSuperheavy: {} as MechWeapon,
    modLoader: false,
    modModal: false,
  }),
  computed: {
    hasImproved(): boolean {
      return this.$store.getters.getPilot.has('CoreBonus', 'imparm')
    },
  },
  methods: {
    //TODO: should not be hardcoded
    getRange(): Range[] {
      const w = this.weaponSlot.Weapon
      if (!w) return []
      let bonuses = [] as { type: RangeType; val: number }[]
      if (w.Mod && w.Mod.AddedRange)
        bonuses.push({
          type: RangeType.Range,
          val: w.Mod.AddedRange,
        })
      const pilot = this.$store.getters.getPilot
      if (pilot.has('CoreBonus', 'neurolinked'))
        bonuses.push({
          type: RangeType.Range,
          val: 3,
        })
      if (pilot.has('CoreBonus', 'gyges'))
        bonuses.push({
          type: RangeType.Threat,
          val: 1,
        })
      if (
        this.loadout.HasSystem('externalbatteries') &&
        w.Damage[0].Type === DamageType.Energy
      )
        bonuses.push({
          type: RangeType.Range,
          val: 5,
        })
      return Range.AddBonuses(w.Range, bonuses)
    },
    getDamage(): Damage[] {
      const w = this.weaponSlot.Weapon
      if (!w) return []
      if (!w.Mod || !w.Mod.AddedDamage) return w.Damage
      return w.Damage.concat(w.Mod.AddedDamage)
    },
    toggleModModal(toggle: boolean) {
      this.modLoader = toggle
      this.modModal = toggle
    },
    selectItem(item: MechWeapon) {
      const currentWeapon = this.weaponSlot.Weapon
      if (currentWeapon && currentWeapon.Size === WeaponSize.Superheavy) {
        if (item.Size === WeaponSize.Superheavy) {
          this.equipWeapon(item)
        } else {
          this.unequipSuperheavy()
          this.equipWeapon(item)
        }
      } else if (item.Size === WeaponSize.Superheavy) {
        this.stagedSuperheavy = item
        this.lockDialog = true
      } else {
        this.equipWeapon(item)
      }
    },
    equipWeapon(item: MechWeapon) {
      this.weaponSlot.EquipWeapon(item)
      this.weaponSelectorModal = false
    },
    equipSuperheavy(lockMount: EquippableMount) {
      lockMount.Lock()
      this.equipWeapon(this.stagedSuperheavy)
      this.lockDialog = false
    },
    removeItem(item: MechWeapon) {
      if (item.Size === WeaponSize.Superheavy) {
        this.unequipSuperheavy()
      }
      this.weaponSlot.UnequipWeapon()
      this.weaponSelectorModal = false
    },
    unequipSuperheavy() {
      this.loadout.AllEquippableMounts(this.hasImproved).forEach(mount => {
        mount.Unlock()
      })
    },
  },
})
</script>
