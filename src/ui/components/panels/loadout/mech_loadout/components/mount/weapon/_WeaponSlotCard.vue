<template>
  <div>
    <slot-card-base
      ref="base"
      :item="item"
      :mech="mech"
      :readonly="readonly"
      :color="color"
      :empty="!item"
    >
      <div slot="header">
        <v-row v-if="item" no-gutters>
          <v-col cols="auto">
            <equipment-options
              :item="item"
              :readonly="readonly"
              @swap="$refs.base.$refs.selectorDialog.show()"
              @remove="remove()"
            />
          </v-col>
          <v-col cols="auto">
            <div v-if="!item.Destroyed" :class="`ml-n2 ${small ? 'white--text effect-text' : ''}`">
              <cc-tooltip v-if="item.Mod" inline :content="`Weapon Modification Equipped`">
                <v-icon style="margin-top: -2px" dark>cci-weaponmod</v-icon>
              </cc-tooltip>
              {{ item.Name }}
              <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
              <component :is="small ? 'div' : 'span'" class="caption subtle--text ml-1 my-n1">
                <b>{{ item.Size }}</b>
                {{ item.WeaponType }}
              </component>
            </div>
            <div v-else class="py-1 error" style="letter-spacing: 3px">
              &nbsp;//
              <strike>{{ item.Name }}</strike>
              //&nbsp;
            </div>
          </v-col>
        </v-row>
        <div v-else>{{ weaponSlot.Size }} Weapon</div>
      </div>
      <v-row v-if="item" slot="header-items" justify="end" no-gutters>
        <v-col cols="auto">
          <cc-range-element v-if="item.Range" small :range="getRange" class="d-inline" dark />
          <cc-slashes v-if="item.Range && item.Damage" class="px-2" />
          <cc-damage-element
            v-if="item.Damage"
            small
            :damage="getDamage"
            :type-override="item.DamageTypeOverride"
            class="d-inline"
          />
        </v-col>
        <v-col v-if="item && item.SP" cols="auto">
          <div class="pl-3 ml-3" style=" border-left: 1px solid #616161;">
            <span>{{ item.SP }}SP</span>
          </div>
        </v-col>
        <v-col v-if="!readonly" cols="auto">
          <div class="pl-3 ml-3" style=" border-left: 1px solid #616161;">
            <v-icon v-if="item" :small="small" dark class="fadeSelect mt-n1" @click.stop="remove()">
              delete
            </v-icon>
            <v-icon
              class="fadeSelect mt-n1"
              :small="small"
              dark
              @click.stop="$refs.base.$refs.selectorDialog.show()"
              v-html="item ? 'mdi-swap-vertical-variant' : 'mdi-add'"
            />
          </div>
        </v-col>
      </v-row>
      <div v-if="item" class="mt-1">
        <equipment-header
          :item="item"
          :readonly="readonly"
          :color="color"
          :use-bonus="mech.LimitedBonus"
        >
          <div v-if="!intWeapon && !readonly" slot="left">
            <v-btn
              v-if="!item.Mod && !item.NoMods"
              outlined
              small
              :color="color"
              class="mb-1"
              @click.stop="$refs.modDialog.show()"
            >
              <v-icon :color="color" left>cci-weaponmod</v-icon>
              <span>NO MOD INSTALLED</span>
            </v-btn>
          </div>
        </equipment-header>
        <div class="mt-n1">
          <div v-if="item.ProfileEffect">
            <div class="mb-n2">
              <p v-html-safe="item.ProfileEffect" class="text--text body-text mb-1 mx-3" />
            </div>
          </div>
          <div v-if="item.ProfileOnAttack">
            <div class="mb-n2 mt-1">
              <v-icon class="mt-n1">cci-weapon</v-icon>
              <span class="overline stark--text">ON ATTACK</span>
              <p
                v-html-safe="item.ProfileOnAttack"
                class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
              />
            </div>
          </div>
          <div v-if="item.ProfileOnHit">
            <div class="mb-n2 mt-1">
              <v-icon class="mt-n1">cci-weapon</v-icon>
              <span class="overline stark--text">ON HIT</span>
              <p
                v-html-safe="item.ProfileOnHit"
                class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
              />
            </div>
          </div>
          <div v-if="item.ProfileOnCrit">
            <div class="mb-n2 mt-1">
              <v-icon class="mt-n1">cci-weapon</v-icon>
              <span class="overline stark--text">ON CRITICAL HIT</span>
              <p
                v-html-safe="item.ProfileOnCrit"
                class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
              />
            </div>
          </div>
          <v-row v-if="item.Mod" dense justify="center">
            <mod-inset :mod="item.Mod" :mech="mech" :color="color" @remove-mod="item.Mod = null" />
          </v-row>
          <!-- <ammo-case-inset :level="armoryLevel" /> -->
        </div>
      </div>
      <weapon-selector
        slot="selector"
        :weapon-slot="weaponSlot"
        :mech="mech"
        @equip="equip($event)"
      />
    </slot-card-base>
    <sh-lock-dialog
      ref="lockDialog"
      :mount="mount"
      :mech="mech"
      @select="finalizeSuperheavy($event)"
    />
    <cc-solo-dialog
      v-if="item"
      ref="modDialog"
      no-confirm
      :title="`${item.Mod ? 'Modify' : 'Install'} ${item.Name} Modification`"
      fullscreen
      no-pad
    >
      <mod-selector :weapon="item" :mech="mech" @install="install($event)" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SlotCardBase from '../../_SlotCardBase.vue'
import WeaponSelector from './_WeaponSelector.vue'
import ModSelector from './_ModSelector.vue'
import ModInset from './_ModInset.vue'
// import AmmoCaseInset from './_AmmoCaseInset.vue'
import EquipmentOptions from '../../_EquipmentOptions.vue'
import EquipmentHeader from '../../_EquipmentHeader.vue'
import ShLockDialog from '../_ShLockDialog.vue'
import {
  MechWeapon,
  WeaponMod,
  WeaponSize,
  EquippableMount,
  PilotTalent,
  WeaponType,
  Range,
  Damage,
} from '@/class'

export default Vue.extend({
  name: 'weapon-slot-card',
  components: {
    SlotCardBase,
    WeaponSelector,
    ModSelector,
    ModInset,
    // AmmoCaseInset,
    EquipmentOptions,
    EquipmentHeader,
    ShLockDialog,
  },
  props: {
    weaponSlot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
    intWeapon: {
      type: Boolean,
    },
  },
  data: () => ({
    stagedSH: null,
  }),
  computed: {
    small() {
      return this.$vuetify.breakpoint.smAndDown
    },
    item() {
      return this.weaponSlot.Weapon
    },
    color() {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.dark)
    },
    armoryLevel() {
      if (!this.item) return 0
      if (this.item.Size !== WeaponSize.Main || this.item.WeaponType === WeaponType.Melee) return 0
      const tal = this.mech.Pilot.Talents.find(
        (x: PilotTalent) => x.Talent.ID === 't_walking_armory'
      )
      if (!tal) return 0
      return tal.Rank
    },
    getRange() {
      if (!this.item) return []
      const mod = this.weaponSlot.Mod
      const ar = mod && mod.AddedRange ? mod.AddedRange : null
      return Range.CalculateRange(this.item, this.mech, ar)
    },
    getDamage() {
      if (!this.item) return []
      return Damage.CalculateDamage(this.item, this.mech)
    },
  },
  methods: {
    equip(item: MechWeapon) {
      this.$refs.base.$refs.selectorDialog.hide()
      if (item.Size === WeaponSize.Superheavy) {
        this.equipSuperheavy(item)
      } else {
        if (this.item && this.item.Size === WeaponSize.Superheavy)
          this.mech.ActiveLoadout.UnequipSuperheavy()
        this.weaponSlot.EquipWeapon(item, this.mech.Pilot)
      }
    },
    equipSuperheavy(item: MechWeapon) {
      this.stagedSH = item
      this.$refs.lockDialog.show()
    },
    finalizeSuperheavy(lockTarget: EquippableMount) {
      if (this.item && this.item.Size === WeaponSize.Superheavy)
        this.mech.ActiveLoadout.UnequipSuperheavy()
      lockTarget.Lock(this.mount)
      this.weaponSlot.EquipWeapon(this.stagedSH, this.mech.Pilot)
      this.$refs.lockDialog.hide()
      this.stagedSH = null
    },
    install(mod: WeaponMod) {
      this.item.Mod = mod
      this.$refs.modDialog.hide()
    },
    uninstall() {
      this.item.Mod = null
    },
    remove() {
      if (this.item.Size === WeaponSize.Superheavy) {
        this.mech.ActiveLoadout.UnequipSuperheavy()
      }
      this.weaponSlot.UnequipWeapon()
    },
  },
})
</script>
