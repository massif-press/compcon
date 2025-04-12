<template>
  <slot-card-base
    ref="base"
    :item="item"
    :mech="mech"
    :color="color"
    :empty="!item"
    :weapon="true"
    :extended="mobile">
    <template #header>
      <div v-if="item" class="mt-n2 pl-1">
        <equipment-options v-if="!readonly" :item="item" />
        {{ item.Name }}
        <div
          v-if="!mobile"
          class="text-cc-overline text-disabled ml-10"
          style="line-height: 4px"
          :style="`margin-top: ${readonly ? '2px' : '-6px'}`">
          {{ item.WeaponType }}
          {{ item.Size }}
          {{ item.WeaponTypes.join('/') }}
        </div>
      </div>
      <div v-else class="px-2">{{ weaponSlot.Size }} Weapon</div>
    </template>

    <template v-if="!mobile && item" #header-items>
      <weapon-slot-toolbar-items
        :item="item"
        :range="getRange"
        :damage="getDamage"
        :readonly="readonly"
        @remove="remove()"
        @swap="($refs as any).base.selectorDialog = true" />
    </template>

    <template v-else-if="item" #extension>
      <weapon-slot-toolbar-items
        :item="item"
        :range="getRange"
        :damage="getDamage"
        :readonly="readonly"
        @remove="remove()"
        @swap="($refs as any).base.selectorDialog = true" />
    </template>

    <div v-if="item" class="pt-1">
      <equipment-header
        :item="item"
        :readonly="readonly"
        :color="color"
        :use-bonus="mech.LimitedBonus">
        <template #left>
          <div v-if="!readonly && !intWeapon && !mod && !item.NoMods">
            <cc-button
              variant="outlined"
              size="x-small"
              color="accent"
              prepend-icon="cc:weaponmod"
              @click.stop="modDialog = true">
              NO MOD INSTALLED
            </cc-button>
          </div>
        </template>
      </equipment-header>
      <div>
        <div v-if="item.Profiles && item.Profiles.length > 1">
          <v-tabs
            v-if="!mobile"
            v-model="item.ProfileIndex"
            density="compact"
            height="20"
            align="center"
            center-active>
            <v-tab v-for="p in item.Profiles">{{ p.Name }}</v-tab>
          </v-tabs>
          <v-chip-group v-else column v-model="item.ProfileIndex" class="mb-2">
            <cc-chip
              v-for="(p, i) in item.Profiles"
              :key="i"
              :value="i"
              :color="item.ProfileIndex === i ? 'accent' : undefined"
              size="small"
              tile
              class="text-cc-overline"
              @click.stop="item.ProfileIndex = i">
              {{ p.Name }}
            </cc-chip>
          </v-chip-group>
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
    v-model="lockDialog"
    :mount="mount"
    :mech="mech"
    @select="finalizeSuperheavy($event)" />

  <cc-solo-modal
    v-if="item"
    v-model="modDialog"
    :title="`${mod ? 'Modify' : 'Install'} ${item.Name} Modification`"
    icon="cc:weaponmod">
    <mod-selector :weapon="item" :mech="mech" @equip="install($event)" />
  </cc-solo-modal>
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
import WeaponSlotToolbarItems from './_WeaponSlotToolbarItems.vue';
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
    WeaponSlotToolbarItems,
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
    modDialog: false,
    lockDialog: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
      (this.$refs as any).base.selectorDialog = false;
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
      this.lockDialog = true;
    },
    finalizeSuperheavy(lockTarget: EquippableMount) {
      if (this.item && this.item.Size === WeaponSize.Superheavy)
        this.mech.MechLoadoutController.ActiveLoadout.UnequipSuperheavy();
      lockTarget.Lock(this.mount as EquippableMount);
      this.weaponSlot.EquipWeapon(this.stagedSH, this.mech.Pilot);
      this.lockDialog = false;
      this.stagedSH = null;
    },
    install(mod: WeaponMod) {
      this.item.Mod = mod;
      this.modDialog = false;
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
