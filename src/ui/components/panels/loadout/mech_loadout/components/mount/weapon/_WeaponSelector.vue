<template>
  <cc-compendium-browser
    :items="availableWeapons"
    item-type="MechWeapon"
    :table-headers="headers"
    :options="options"
    equippable
    @select="stageSelect($event)"
    @equip="handleEquip($event)">
    <template #header><div class="heading h3 text-center text-accent">Mech Weapons</div></template>
    <template #top>
      <v-row>
        <v-col>
          <div v-if="weaponSlot.Weapon">
            <div v-if="!mobile" class="text-cc-overline">
              UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }}
            </div>
            <div class="heading h2 text-accent">
              {{ weaponSlot.Weapon.Name }}
              <span v-if="selected" class="text-success">
                <v-icon icon="mdi-chevron-triple-right" class="pb-1" />
                {{ selected.Name }}
              </span>
            </div>
            <div v-if="!selected" class="flavor-text text-cc-overline">CURRENTLY EQUIPPED</div>
            <div v-else class="flavor-text text-cc-overline">
              <div v-if="!eq(weaponSlot.Weapon.Range, <Range[]>selected.Range)">
                <span class="text-accent" v-html="getRangeDisplay(weaponSlot.Weapon)" />
                <v-icon color="success" size="small" icon="mdi-chevron-triple-right" class="mx-1" />
                <span class="text-success" v-html="getRangeDisplay(<MechWeapon>selected)" />
              </div>
              <div v-if="!eq(weaponSlot.Weapon.Damage, <Damage[]>selected.Damage)">
                <span class="text-accent" v-html="getDamageDisplay(weaponSlot.Weapon)" />
                <v-icon color="success" size="small" icon="mdi-chevron-triple-right" class="mx-1" />
                <span class="text-success" v-html="getDamageDisplay(<MechWeapon>selected)" />
              </div>
              <div v-if="!eq(weaponSlot.Weapon.Tags, <Tag[]>selected.Tags)">
                <span
                  v-for="t in weaponSlot.Weapon.Tags.filter(
                    (x) => !(<any>selected!.Tags.some((y) => y.ID === x.ID))
                  )"
                  class="text-error">
                  <v-icon icon="mdi-minus" size="x-small" class="mr-n1" />
                  [{{ t.Name }}]
                </span>
                <span
                  v-for="t in selected.Tags.filter(
                    (x) => !weaponSlot.Weapon.Tags.some((y) => y.ID === x.ID)
                  )"
                  class="text-success">
                  <v-icon icon="mdi-plus" size="x-small" class="mr-n1" />
                  [{{ t.Name }}]
                </span>
              </div>
            </div>
          </div>
          <div v-else-if="!mobile">
            <div class="text-cc-overline">
              UNION ARMORY EQUIPMENT AUTHORIZATION: FRAME EQUIPMENT//COMBAT SYSTEM
            </div>
            <div class="heading h2 text-disabled">NO SELECTION</div>
            <div class="flavor-text overline text-error">[ EQUIPMENT ID INVALID OR MISSING ]</div>
          </div>
        </v-col>
        <v-col cols="12" md="auto">
          <div class="text-right">
            <cc-switch
              v-model="showUnlicensed"
              :label="mobile && 'Show Unlicensed'"
              color="error"
              :tooltip="
                !mobile && showUnlicensed
                  ? 'Unlicensed equipment: SHOWN'
                  : 'Unlicensed equipment: HIDDEN'
              "
              :prepend-icon="!mobile && 'cc:system'"
              on-icon="mdi-lock-open"
              off-icon="mdi-lock" />
            <br />
            <cc-switch
              v-model="showOverSP"
              :label="mobile && 'Show Exceeds SP'"
              color="error"
              :tooltip="
                !mobile && showOverSP
                  ? 'Systems exceeding SP Capacity: SHOWN'
                  : 'Systems exceeding SP Capacity: HIDDEN'
              "
              :prepend-icon="!mobile && 'cc:system_point'"
              on-icon="mdi-lock-open"
              off-icon="mdi-lock" />
          </div>
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Rules, MechWeapon, Mech, Range, Damage, Tag } from '@/class';
import { flavorID } from '@/io/Generators';
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

export default {
  name: 'weapon-selector',
  props: {
    weaponSlot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    options: {
      views: ['list', 'single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license'],
      initialGroup: 'license',
    },
    headers: [
      { title: 'Manufacturer', align: 'left', key: 'Source' },
      { title: 'Weapon', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: 'Size', align: 'left', key: 'Size' },
      { title: 'Type', align: 'left', key: 'WeaponTypes' },
      { title: 'Tags', align: 'center', key: 'Tags' },
      { title: 'Range', align: 'left', key: 'Range' },
      { title: 'Damage', align: 'left', key: 'Damage' },
    ],
    showUnlicensed: false,
    showOverSP: false,
    selected: null as unknown as MechWeapon | null,
  }),
  mounted() {
    this.options.initialView = this.mobile ? 'list' : 'single';
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    freeSP(): number {
      return this.weaponSlot.Weapon
        ? this.mech.FreeSP + this.weaponSlot.Weapon.SP
        : this.mech.FreeSP;
    },
    weapons(): MechWeapon[] {
      return CompendiumStore().MechWeapons;
    },
    availableWeapons(): MechWeapon[] {
      const fittings = Rules.MountFittings[this.weaponSlot.Size];
      // filter by fitting size
      let i = this.weapons.filter(
        (x) => x.Source && fittings.includes(x.Size) && !x.IsHidden && !x.IsExotic
      );

      // filter already equipped
      if (this.weaponSlot.Weapon) i = i.filter((x) => x.ID !== this.weaponSlot.Weapon.ID);

      // filter ai
      if (
        this.mech.MechLoadoutController.ActiveLoadout.AICount >=
        1 + Bonus.get('ai_cap', this.mech as Mech)
      ) {
        i = i.filter((x) => !x.IsAI);
      }

      if (!this.showUnlicensed) {
        i = i.filter(
          (x) => !x.LicenseLevel || this.mech.Pilot.has('License', x.License, x.LicenseLevel)
        );
      }

      i = i.concat(
        this.mech.SpecialEquipment.filter(
          (x) => x.ItemType === 'MechWeapon' && fittings.includes(x.Size)
        )
      );

      // filter unique
      i = i.filter(
        (x) =>
          !this.mech.MechLoadoutController.ActiveLoadout.UniqueWeapons.map((y) => y.ID).includes(
            x.ID
          )
      );

      return i;
    },
  },
  methods: {
    fID(template: string): string {
      return flavorID(template);
    },
    handleEquip(event) {
      this.$emit('equip', event);
    },
    stageSelect(event) {
      if (event) {
        this.selected = event;
      } else {
        this.selected = null;
      }
    },
    getRangeDisplay(item: MechWeapon): string {
      if (!item.Range) return '---';
      let rangeStrs = [] as string[];
      item.Range.forEach((r) => {
        rangeStrs.push(`${r.Type} ${r.Value}`);
      });
      return rangeStrs.join('/');
    },
    getDamageDisplay(item: MechWeapon): string {
      if (!item.Damage) return '---';
      let damageStrs = [] as string[];
      item.Damage.forEach((d) => {
        damageStrs.push(`${d.Type} ${d.Value}`);
      });
      return damageStrs.join('/');
    },
    eq(a: Range[] | Damage[] | Tag[], b: Range[] | Damage[] | Tag[]): boolean {
      if (!a || !b) return false;
      if (a.length !== b.length) return false;

      const aIDs = a.map((x) => (x as any).ID || x.Value || x.Type);
      const bIDs = b.map((x) => (x as any).ID || x.Value || x.Type);

      return _.isEqual(_.sortBy(aIDs), _.sortBy(bIDs));
    },
  },
};
</script>
