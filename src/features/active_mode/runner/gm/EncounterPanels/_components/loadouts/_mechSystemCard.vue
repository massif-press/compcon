<template>
  <v-card class="clipped-large" flat tile>
    <v-card-text class="pa-0">
      <v-card v-if="item?.FlavorDescription" tile color="panel" class="px-2 py-1 mb-2 clipped">
        <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
      </v-card>

      <cc-alert v-if="integrated" class="mt-2" icon="mdi-link">
        <div class="text-cc-overline">
          Integrated Equipment
          <cc-slashes />
          <v-icon :icon="item.IntegratedOrigin.Icon" class="pb-1" />
          {{ item.IntegratedOrigin.Name }}
        </div>
      </cc-alert>

      <v-table v-if="item && item.Ammo && item.Ammo.length" class="mt-2" hover density="compact">
        <tbody>
          <tr v-for="a in item.Ammo">
            <td v-if="!portrait" style="min-width: 120px" class="text-accent">
              <v-icon icon="cc:ammo" size="small" class="mt-n1 mr-1" />
              <b>{{ a.name }}</b>
            </td>

            <td>
              <div v-if="portrait" class="text-accent">
                <v-icon icon="cc:ammo" size="small" start />
                <b>{{ a.name }}</b>
              </div>
              <span v-html-safe="a.detail" />
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="item">
        <div v-if="item.Effect">
          <div class="text-cc-overline text-disabled mt-1">
            <v-icon :icon="item.Icon" size="small" class="mt-n1" />
            EQUIPMENT EFFECT
          </div>
          <p v-html-safe="item.Effect" class="mb-1 px-2" />
        </div>

        <div v-if="item.Actions?.length" class="mb-2 mt-1">
          <div class="text-cc-overline text-disabled mb-1">
            <v-icon size="small" icon="cc:activate" class="mt-n1" />
            EQUIPMENT ACTIONS
          </div>
          <cc-action v-for="a in item.Actions" :action="a" class="mb-1" />
        </div>

        <div v-if="item.Deployables?.length" class="mb-2">
          <div class="text-cc-overline text-disabled mb-1">
            <v-icon size="small" icon="cc:drone" class="mt-n1" />
            EQUIPMENT DEPLOYABLES
          </div>
          <cc-deployable-info
            v-for="d in item.Deployables"
            :deployable="d"
            class="mb-1"
            :name-override="item.Name" />
        </div>

        <v-row dense align="center">
          <v-col cols="auto">
            <cc-tags v-if="item.Tags" :tags="item.Tags" :color="color" :bonus="mech.LimitedBonus" />
          </v-col>

          <v-col cols="auto" class="ml-auto mr-4">
            <cc-bonus-display :item="item" />
            <cc-synergy-display :item="item" :location="synergyLocation" :mech="mech" large />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>

  <v-row dense class="bg-panel mt-1 rounded-sm border-sm" align="center" justify="space-between">
    <v-col class="py-0">
      <v-btn flat tile block size="small" color="primary">Mark Used</v-btn>
    </v-col>
    <v-col class="py-0">
      <v-icon
        v-for="n in item.MaxUses"
        :key="n"
        :icon="n >= item.Uses ? 'mdi-hexagon' : 'mdi-hexagon-outline'"
        size="x-small" />
    </v-col>
    <v-col v-if="item.MaxUses" cols="auto" class="py-0">
      <v-tooltip location="top" text="Reset Uses">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="x-small" tile variant="text">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
    <v-col cols="auto" class="py-0">
      <v-tooltip location="top" text="Mark Destroyed">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="x-small" tile variant="text" class="bg-primary">
            <v-icon icon="mdi-cube-off" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import { Damage, ItemType, Mech } from '@/class';

export default {
  name: 'slot-card-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
      default: null,
    },
    empty: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    titleColor: {
      type: String,
      required: false,
    },
    extended: {
      type: Boolean,
      default: false,
    },
    weapon: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    detailDialog: false,
    selectorDialog: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    portrait() {
      return this.$vuetify.display.xs;
    },
    synergyLocation() {
      if (!this.item) return 'none';
      return this.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system';
    },
    getHeight() {
      let h = this.mobile ? 18 : 24;
      if (this.weapon) h += 12;
      return h;
    },
    isEngineerWeapon() {
      // TODO: generalize this
      return this.item && this.item.ID.includes('mw_prototype_');
    },

    mod() {
      return this.item.Mod;
    },

    getRange() {
      if (!this.item) return [];
      const mod = this.weaponSlot.Mod;
      const ar = mod && mod.AddedRange ? mod.AddedRange : null;
      return Range.CalculateRange(this.item, this.mech, ar);
    },
    getDamage() {
      if (!this.item) return [];
      return Damage.CalculateDamage(this.item, this.mech);
    },
  },
  methods: {
    openSelector() {
      if (this.$slots.selector) {
        this.selectorDialog = true;
        return;
      }
      this.$emit('selector-open');
    },
  },
};
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
