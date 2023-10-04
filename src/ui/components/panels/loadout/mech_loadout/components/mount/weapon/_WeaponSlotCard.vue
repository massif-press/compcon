<template>
  <div>
    <slot-card-base ref="base" :item="item" :mech="mech" :color="color" :empty="!item">
      <template #header>
        <v-row v-if="item" dense align="center">
          <v-col cols="auto">
            <equipment-options
              :item="item"
              @swap="($refs as any).base.$refs.selectorDialog.show()"
              @remove="remove()"
            />
          </v-col>
          <v-col v-if="item.Mod" cols="auto">
            <cc-tooltip inline content="Weapon Modification Equipped">
              <v-icon color="accent" icon="cc:weaponmod" />
            </cc-tooltip>
          </v-col>
          <v-col cols="auto">
            <div>
              {{ item.Name }}
              <span v-if="item.FlavorName" class="text-overline ml-2" style="line-height: 12px"
                >//{{ item.TrueName }}</span
              >
              <div class="text-overline" style="line-height: 12px; opacity: 0.5">
                {{ item.Size }}
                {{ item.WeaponType }}
              </div>
            </div>
          </v-col>
        </v-row>
        <div v-else>{{ weaponSlot.Size }} Weapon</div>
      </template>
      <template #header-items>
        <v-row v-if="item" justify="center" no-gutters>
          <v-col cols="auto">
            <cc-range-element v-if="item.Range" small :range="getRange" />
            <cc-slashes v-if="item.Range && item.Damage" class="px-1" />
            <cc-damage-element
              v-if="item.Damage"
              small
              :damage="getDamage"
              :type-override="item.DamageTypeOverride"
            />
          </v-col>
          <v-col v-if="item && item.SP" cols="auto">
            <div class="pl-3" style="border-left: 1px solid #616161">
              <span>{{ item.SP }}SP</span>
            </div>
          </v-col>
          <v-col cols="auto">
            <div style="border-left: 1px solid #616161">
              <v-btn
                v-if="item"
                size="x-small"
                icon
                variant="plain"
                color="error"
                @click.stop="remove()"
              >
                <v-icon size="20" icon="mdi-delete" />
              </v-btn>
              <v-btn
                size="x-small"
                icon
                variant="plain"
                @click.stop="($refs as any).base.$refs.selectorDialog.show()"
              >
                <v-icon size="20" :icon="item ? 'mdi-swap-vertical-variant' : 'mdi-add'" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>
      <div v-if="item" class="pt-1">
        <equipment-header
          :item="item"
          :readonly="readonly"
          :color="color"
          :use-bonus="mech.LimitedBonus"
        >
          <template #left>
            <div v-if="!intWeapon">
              <v-btn
                v-if="!item.Mod && !item.NoMods"
                variant="plain"
                size="small"
                :color="color"
                prepend-icon="cc:weaponmod"
                @click.stop="($refs as any).modDialog.show()"
              >
                NO MOD INSTALLED
              </v-btn>
            </div>
          </template>
        </equipment-header>
        <!-- <div>
          <div v-if="item.ProfileEffect">
            <div class="mb-n2">
              <p v-html-safe="item.ProfileEffect" class="text-text body-text mb-1 mx-3 py-2" />
            </div>
          </div>
          <div v-if="item.ProfileOnAttack">
            <div class="mb-n2 mt-1">
              <v-icon class="mt-n1">cc:weapon</v-icon>
              <span class="text-overline text-stark">ON ATTACK</span>
              <p
                v-html-safe="item.ProfileOnAttack"
                class="text-text body-text mb-1 mr-2 ml-6 mt-n2"
              />
            </div>
          </div>
          <div v-if="item.ProfileOnHit">
            <div class="mb-n2 mt-1">
              <v-icon class="mt-n1">cc:weapon</v-icon>
              <span class="text-overline text-stark">ON HIT</span>
              <p v-html-safe="item.ProfileOnHit" class="text-text body-text mb-1 mr-2 ml-6 mt-n2" />
            </div>
          </div>
          <div v-if="item.ProfileOnCrit">
            <div class="mb-n2 mt-1">
              <v-icon class="mt-n1">cc:weapon</v-icon>
              <span class="text-overline text-stark">ON CRITICAL HIT</span>
              <p
                v-html-safe="item.ProfileOnCrit"
                class="text-text body-text mb-1 mr-2 ml-6 mt-n2"
              />
            </div>
          </div>
          <ammo-case-inset :level="armoryLevel" /> 
        </div> -->
        <mod-inset
          v-if="item.Mod"
          :mod="item.Mod"
          :mech="mech"
          :color="color"
          @remove-mod="item.Mod = null"
        />
      </div>
      <template #selector>
        <weapon-selector :weapon-slot="weaponSlot" :mech="mech" @equip="equip($event)" />
      </template>
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
      <mod-selector :weapon="item" :mech="mech" @equip="install($event)" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SlotCardBase from '../../_SlotCardBase.vue';
import WeaponSelector from './_WeaponSelector.vue';
import ModSelector from './_ModSelector.vue';
import ModInset from './_ModInset.vue';
// import AmmoCaseInset from './_AmmoCaseInset.vue'
import EquipmentOptions from '../../_EquipmentOptions.vue';
import EquipmentHeader from '../../_EquipmentHeader.vue';
import ShLockDialog from '../_ShLockDialog.vue';
import {
  MechWeapon,
  WeaponMod,
  WeaponSize,
  EquippableMount,
  PilotTalent,
  WeaponType,
  Range,
  Damage,
  Mech,
} from '@/class';

export default {
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
    stagedSH: null as MechWeapon | null,
  }),
  computed: {
    small() {
      return this.$vuetify.display.smAndDown;
    },
    item() {
      return this.weaponSlot.Weapon;
    },
    color() {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.current.dark);
    },
    // armoryLevel() {
    //   if (!this.item) return 0
    //   if (this.item.Size !== WeaponSize.Main || this.item.WeaponType === WeaponType.Melee) return 0
    //   const tal = this.mech.pilot.TalentsController.Talents.find(
    //     (x: PilotTalent) => x.Talent.ID === 't_walking_armory'
    //   )
    //   if (!tal) return 0
    //   return tal.Rank
    // },
    getRange() {
      if (!this.item) return [];
      const mod = this.weaponSlot.Mod;
      const ar = mod && mod.AddedRange ? mod.AddedRange : null;
      return Range.CalculateRange(this.item, this.mech as Mech, ar);
    },
    getDamage() {
      if (!this.item) return [];
      return Damage.CalculateDamage(this.item, this.mech as Mech);
    },
  },
  methods: {
    equip(item: MechWeapon) {
      ((this.$refs as any).base.$refs.selectorDialog as any).hide();
      if (item.Size === WeaponSize.Superheavy) {
        this.equipSuperheavy(item);
      } else {
        if (this.item && this.item.Size === WeaponSize.Superheavy)
          this.mech.MechLoadoutController.ActiveLoadout.UnequipSuperheavy();
        this.weaponSlot.EquipWeapon(item, this.mech.Pilot);
      }
    },
    equipSuperheavy(item: MechWeapon) {
      this.stagedSH = item;
      (this.$refs.lockDialog as any).show();
    },
    finalizeSuperheavy(lockTarget: EquippableMount) {
      if (this.item && this.item.Size === WeaponSize.Superheavy)
        this.mech.MechLoadoutController.ActiveLoadout.UnequipSuperheavy();
      lockTarget.Lock(this.mount as EquippableMount);
      this.weaponSlot.EquipWeapon(this.stagedSH, this.mech.Pilot);
      (this.$refs.lockDialog as any).hide();
      this.stagedSH = null;
    },
    install(mod: WeaponMod) {
      this.item.Mod = mod;
      (this.$refs.modDialog as any).hide();
    },
    uninstall() {
      this.item.Mod = null;
    },
    remove() {
      if (this.item.Size === WeaponSize.Superheavy) {
        this.mech.MechLoadoutController.ActiveLoadout.UnequipSuperheavy();
      }
      this.weaponSlot.UnequipWeapon();
    },
  },
};
</script>
