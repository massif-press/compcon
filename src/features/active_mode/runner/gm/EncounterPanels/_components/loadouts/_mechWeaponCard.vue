<template>
  <v-card class="clipped-large" flat tile>
    <v-row align="center" no-gutters justify="end" class="pr-1">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div v-if="item" class="mt-n2 pl-1">
          {{ item.Name }}
          <span class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            {{ item.WeaponTypes.join('/') }} -
            {{ item.Size }}
          </span>
        </div>
        <div v-else class="px-2">{{ item.Size }} Weapon</div>
      </v-col>

      <v-col cols="auto">
        <cc-range-element v-if="item.Range" small :range="item.Range" />
        <cc-slashes v-if="item.Range && item.Damage" class="pr-1" />
        <cc-damage-element
          v-if="item.Damage"
          small
          :damage="item.Damage"
          :type-override="item.DamageTypeOverride" />
      </v-col>
      <v-col v-if="item && item.SP" cols="auto" class="pl-3">
        <cc-slashes />
        {{ item.SP }}
        <span style="font-size: 13px; margin-left: -4px">SP</span>
      </v-col>
    </v-row>

    <v-card-text class="pa-0">
      <v-card v-if="item?.FlavorDescription" tile color="panel" class="px-2 py-1 mb-2 clipped">
        <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
      </v-card>

      <div v-if="item" class="pt-1">
        <div>
          <div v-if="isEngineerWeapon" class="mb-1">
            <eng-weapon-settings :item="item" :mech="mech" :readonly="readonly" />
          </div>

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
                  <cc-action :action="a" class="ma-2" />
                </v-col>
              </v-row>
            </div>

            <div v-if="item.Profiles[item.ProfileIndex].Deployables.length">
              <div class="text-cc-overline text-disabled">//PROFILE DEPLOYABLES</div>
              <v-row no-gutters justify="center">
                <v-col v-for="(d, i) in item.Profiles[item.ProfileIndex].Deployables" cols="auto">
                  <cc-deployable-info :deployable="d" :name-override="item.Name" class="ma-2" />
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
        </div>
        <div v-if="mod">
          <mod-inset :mod="mod" :mech="mech" :color="color" @remove-mod="uninstall()" />
        </div>
      </div>

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
          <cc-action v-for="a in item.Actions" :action="a" :panel="!mobile" class="mb-1" />
        </div>

        <div v-if="item.Deployables?.length" class="mb-2">
          <div class="text-cc-overline text-disabled mb-1">
            <v-icon size="small" icon="cc:drone" class="mt-n1" />
            EQUIPMENT DEPLOYABLES
          </div>
          <cc-deployable-info
            v-for="d in item.Deployables"
            :deployable="d"
            :panel="!mobile"
            class="mb-1"
            :name-override="item.Name" />
        </div>

        <v-row dense align="center">
          <v-col cols="auto">
            <cc-tags v-if="item.Tags" :tags="item.Tags" :color="color" :bonus="mech.LimitedBonus" />
          </v-col>

          <v-col
            v-show="item.Profiles.length > 1"
            v-for="p in item.Profiles"
            class="mr-4"
            cols="auto">
            <div v-if="p.Tags.length">
              <div class="text-cc-overline" v-text="p.Name" />
              <cc-tags v-if="p.Tags" :tags="p.Tags" :color="color" :bonus="mech.LimitedBonus" />
            </div>
          </v-col>

          <v-col cols="auto">
            <cc-tags
              v-if="item.Mod"
              :tags="item.Mod.AddedTags"
              color="mod"
              :bonus="mech.LimitedBonus" />
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
