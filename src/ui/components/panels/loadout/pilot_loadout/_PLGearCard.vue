<template>
  <pl-card-base
    ref="base"
    title="PILOT GEAR"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove')"
    @save="$emit('save')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer !important; height: 100%"
      @click="($refs as any).base.openDetail()"
    >
      <v-row density="compact">
        <v-col>
          <span class="h2 heading text-text" style="line-height: 35px">
            {{ item.Name }}
            <cc-tooltip v-if="item.Note" simple inline :content="item.Note">
              <v-icon small color="active">mdi-note</v-icon>
            </cc-tooltip>
          </span>
        </v-col>
        <v-col cols="auto" class="ml-auto text-right mt-n2 mb-n2">
          <div class="text-overline">ITEM USES</div>
          <v-icon v-if="!item.MaxUses" color="secondary" class="mt-n3 mr-2">mdi-infinity</v-icon>
          <cc-item-uses v-else :item="item" color="secondary" class="mt-n3" />
        </v-col>
      </v-row>
      <v-row
        v-if="!readonly"
        density="compact"
        class="mt-2"
        :style="`max-height: ${$vuetify.display.smAndDown ? '125' : '200'}px; overflow-y: scroll`"
      >
        <p v-html-safe="item.Description" class="text-text" />
      </v-row>
      <v-row no-gutters>
        <v-col cols="auto" class="ml-auto mr-4 mt-n2">
          <cc-tags small :tags="item.Tags" color="secondary" />
        </v-col>
      </v-row>
    </div>
    <v-card-text slot="selector">
      <cc-selector-table
        no-filter
        no-extra
        :items="getGear()"
        :headers="headers"
        @equip="equip($event)"
      >
        <div v-if="item">
          <span class="text-overline">
            GMS EQUIPMENT CATALOG PRINTID:
            {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="text-success text--darken-1">
              [ PILOT EQUIPMENT REGISTRATION VERIFIED ]
            </span>
          </span>
          <br />
          <span class="heading h1 text-accent" style="line-height: 20px">{{ item.Name }}</span>
          <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
        </div>
        <div v-else>
          <span class="text-overline"
            >GMS EQUIPMENT AUTHORIZATION: PILOT/ADDITIONAL GEAR (ANY)</span
          >
          <br />
          <span class="heading h1 text-subtle text--lighten-1" style="line-height: 20px">
            NO SELECTION
          </span>
          <span class="flavor-text overline mt-n1 text-error" style="display: block">
            [ EQUIPMENT ID INVALID OR MISSING ]
          </span>
        </div>
      </cc-selector-table>
    </v-card-text>
  </pl-card-base>
</template>

<script lang="ts">
import PlCardBase from './_PLCardBase.vue';

import { CompendiumStore } from '@/stores';
import { PilotGear, CompendiumItem, ItemType } from '@/class';
import { flavorID } from '@/io/Generators';

export default {
  name: 'pl-pilot-gear-card',
  components: { PlCardBase },
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
    exotics: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { title: 'Item', align: 'left', value: 'Name' },
      { title: 'Uses', align: 'center', value: 'MaxUses' },
      { title: 'Detail', align: 'center', value: 'Detail' },
      { title: '', align: 'center', value: 'Equip' },
    ],
  }),
  methods: {
    equip(item: PilotGear) {
      this.$emit('equip', { ...item });
      (this.$refs.base as any).closeSelector();
    },
    getGear() {
      const compendium = CompendiumStore();
      let gear = compendium.PilotGear.filter(
        (x: CompendiumItem) => !x.IsHidden && !x.IsExotic && x.ItemType === ItemType.PilotGear
      );
      if (this.exotics.length) {
        gear = gear.concat(this.exotics);
      }
      return gear;
    },
    fID(template: string): string {
      return flavorID(template);
    },
  },
};
</script>
