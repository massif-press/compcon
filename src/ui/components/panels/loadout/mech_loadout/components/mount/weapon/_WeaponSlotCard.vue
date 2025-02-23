<template>
  <div>
    <slot-card-base ref="base" :item="item" :mech="mech" :color="color" :empty="!item">
      <template #header>
        <v-row v-if="item" dense align="center">
          <v-col cols="auto">
            <equipment-options
              v-if="!readonly"
              :item="item"
              @swap="($refs as any).base.$refs.selectorDialog.show()"
              @remove="remove()" />
          </v-col>
          <v-col v-if="mod" cols="auto">
            <cc-tooltip inline content="Weapon Modification Equipped">
              <v-icon color="accent" icon="cc:weaponmod" />
            </cc-tooltip>
          </v-col>
          <v-col cols="auto">
            <div>
              {{ item.Name }}
              <span v-if="item.FlavorName" class="text-caption text-disabled text-uppercase">
                //{{ item.TrueName }}
              </span>
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
        <v-row v-if="item" align="center" class="mb-n1" no-gutters>
          <v-col cols="auto">
            <cc-range-element v-if="item.Range" small :range="getRange" />
            <cc-slashes v-if="item.Range && item.Damage" class="px-1" />
            <cc-damage-element
              v-if="item.Damage"
              small
              :damage="getDamage"
              :type-override="item.DamageTypeOverride" />
          </v-col>
          <v-col v-if="item && item.SP" cols="auto">
            <div class="pl-3" style="border-left: 1px solid #616161">
              <span>{{ item.SP }}SP</span>
            </div>
          </v-col>
          <v-col cols="auto" v-if="!readonly">
            <div class="ml-2" style="border-left: 1px solid rgba(155, 155, 155, 0.3)">
              <v-btn
                v-if="item"
                size="x-small"
                icon
                variant="plain"
                color="error"
                @click.stop="remove()">
                <v-icon size="20" icon="mdi-delete" />
              </v-btn>
              <v-btn
                size="x-small"
                icon
                variant="plain"
                @click.stop="($refs as any).base.$refs.selectorDialog.show()">
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
          :use-bonus="mech.LimitedBonus">
          <template #left>
            <div v-if="!readonly && !intWeapon && !mod && !item.NoMods">
              <v-btn
                variant="plain"
                size="small"
                :color="color"
                prepend-icon="cc:weaponmod"
                @click.stop="($refs as any).modDialog.show()">
                NO MOD INSTALLED
              </v-btn>
            </div>
          </template>
        </equipment-header>
        <div>
          <div v-if="item.Profiles && item.Profiles.length > 1">
            <v-tabs
              v-if="item.Profiles && item.Profiles.length > 1"
              v-model="item.ProfileIndex"
              density="compact"
              align="center"
              center-active>
              <v-tab v-for="p in item.Profiles">{{ p.Name }}</v-tab>
            </v-tabs>
            <div>
              <div v-if="item.Profiles[item.ProfileIndex].Effect" class="panel clipped pa-2">
                <v-row dense align="end">
                  <v-col cols="auto"><v-icon size="large" icon="cc:weapon" /></v-col>
                  <v-col>
                    <div class="heading">{{ item.Profiles[item.ProfileIndex].Name }}</div>
                  </v-col>
                </v-row>
                <p v-html-safe="item.Profiles[item.ProfileIndex].Effect" class="px-2" />
              </div>
            </div>

            <div v-if="item.Profiles[item.ProfileIndex].Actions.length">
              <div class="text-cc-overline text-disabled">//PROFILE ACTIONS</div>
              <v-row no-gutters justify="center">
                <v-col v-for="a in item.Profiles[item.ProfileIndex].Actions" cols="auto">
                  <cc-action :action="a" :panel="$vuetify.display.lgAndUp" class="ma-2" />
                </v-col>
              </v-row>
            </div>

            <div v-if="item.Profiles[item.ProfileIndex].Deployables.length">
              <div class="text-cc-overline text-disabled">//PROFILE DEPLOYABLES</div>
              <v-row no-gutters justify="center">
                <v-col v-for="(d, i) in item.Profiles[item.ProfileIndex].Deployables" cols="auto">
                  <cc-deployable-info
                    :deployable="d"
                    :panel="$vuetify.display.lgAndUp"
                    :name-override="item.Name"
                    class="ma-2" />
                </v-col>
              </v-row>
            </div>
            <div v-if="item.Profiles[item.ProfileIndex].Tags.length">
              <div class="text-cc-overline mb-n1 text-disabled">//PROFILE TAGS</div>
              <cc-tags :tags="item.Profiles[item.ProfileIndex].Tags" extended />
            </div>
            <on-element
              v-for="action in ['hit', 'crit', 'attack']"
              :profile="item.Profiles[item.ProfileIndex]"
              :action="action" />
          </div>
          <div v-else>
            <on-element
              v-for="action in ['hit', 'crit', 'attack']"
              :profile="item.Profiles[0]"
              :action="action" />
          </div>
          <!-- <ammo-case-inset :level="armoryLevel" />  -->
        </div>
        <div v-if="mod">
          <mod-inset :mod="mod" :mech="mech" :color="color" @remove-mod="uninstall()" />
        </div>
      </div>
      <template #selector>
        <weapon-selector :weapon-slot="weaponSlot" :mech="mech" @equip="equip($event)" />
      </template>
    </slot-card-base>
    <sh-lock-dialog
      ref="lockDialog"
      :mount="mount"
      :mech="mech"
      @select="finalizeSuperheavy($event)" />
    <cc-solo-dialog
      v-if="item"
      ref="modDialog"
      no-confirm
      :title="`${mod ? 'Modify' : 'Install'} ${item.Name} Modification`"
      fullscreen
      no-pad>
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
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue';
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
    OnElement,
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
      return this.$vuetify.display.mdAndDown;
    },
    item() {
      return this.weaponSlot.Weapon;
    },
    mod() {
      return this.item.Mod;
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
      this.mech.Pilot.SaveController.save();
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
