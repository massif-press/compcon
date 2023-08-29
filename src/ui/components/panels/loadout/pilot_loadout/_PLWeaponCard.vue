<template>
  <pl-card-base
    ref="base"
    title="PILOT WEAPON"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove', item)"
    @save="$emit('save')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer !important"
      @click="($refs as any).base.openDetail()"
    >
      <v-row align="center" justify="space-between">
        <v-col cols="2">
          <cc-range-element :range="item.Range" />
        </v-col>
        <v-col cols="2">
          <cc-damage-element :damage="item.Damage" :type-override="item.DamageTypeOverride" />
        </v-col>
        <v-col cols="auto" v-if="item.Tags && item.Tags.length">
          <cc-tags size="small" :tags="item.Tags" color="secondary" class="mt-n2" />
        </v-col>
      </v-row>
      <v-row v-if="item.notes">
        <v-col v-for="n in item.notes">
          <cc-tooltip simple inline :content="n">
            <v-icon size="small" color="active">mdi-note</v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>

    <template #selector>
      <v-card-text>
        <cc-selector
          itemType="Pilot Gear"
          :items="weapons"
          :hidden-items="[]"
          :equipped="item"
          :table-headers="headers"
          @equip="equip($event)"
        >
          <template #header>
            <div v-if="item">
              <span class="text-overline">
                GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
                <span class="text-success text--darken-1">
                  [ PILOT ARMAMENT REGISTRATION VERIFIED ]
                </span>
              </span>
              <br />
              <span class="heading h1 text-accent" style="line-height: 20px">{{ item.Name }}</span>
              <span class="flavor-text overline mt-n1" style="display: block"
                >CURRENTLY EQUIPPED</span
              >
            </div>
            <div v-else>
              <span class="text-overline">
                GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMAMENT::S0 - S3(LTD)
              </span>
              <br />
              <span class="heading h1 text-subtle text--lighten-1" style="line-height: 20px">
                NO SELECTION
              </span>
              <span class="flavor-text overline mt-n1 text-error" style="display: block">
                [ MATERIEL ID INVALID OR MISSING ]
              </span>
            </div>
          </template>
        </cc-selector>
      </v-card-text>
    </template>
  </pl-card-base>
</template>

<script lang="ts">
import PlCardBase from './_PLCardBase.vue';

import { CompendiumStore } from '@/stores';
import { PilotWeapon, CompendiumItem, ItemType, PilotEquipment } from '@/class';
import { flavorID } from '@/io/Generators';

export default {
  name: 'pl-pilot-weapon-card',
  components: { PlCardBase },
  emits: ['equip', 'remove', 'save'],
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    extended: {
      type: Boolean,
      required: false,
    },
    readonly: {
      type: Boolean,
    },
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { title: 'Item', align: 'left', value: 'Name' },
      { title: 'Range', align: 'left', value: 'Range' },
      { title: 'Damage', align: 'left', value: 'Damage' },
    ],
  }),
  computed: {
    exotics(): PilotWeapon[] {
      return this.pilot.SpecialEquipment.filter((x) => x.ItemType === 'PilotWeapon');
    },
    weapons(): PilotWeapon[] {
      let weapon = (CompendiumStore().PilotGear as PilotEquipment[]).filter(
        (x: PilotEquipment) => x.ItemType === ItemType.PilotWeapon && !x.IsHidden && !x.IsExotic
      ) as PilotWeapon[];
      if (this.exotics.length) {
        weapon = weapon.concat(this.exotics);
      }

      return weapon;
    },
  },
  methods: {
    equip(item: PilotWeapon) {
      this.$emit('equip', CompendiumItem.Clone(item));
      (this.$refs.base as any).closeSelector();
      this.$notify({
        title: 'Pilot Weapon Equipped',
        text: `${item.Name} equipped to ${this.pilot.Name}.`,
        data: { icon: 'cc:pilot' },
      });
    },

    fID(template: string): string {
      return flavorID(template);
    },
  },
};
</script>
