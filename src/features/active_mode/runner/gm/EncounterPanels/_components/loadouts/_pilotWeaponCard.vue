<template>
  <v-card flat tile>
    <v-row
      v-if="item.Destroyed"
      style="position: absolute; top: 0; left: 0; right: 0; bottom: -13px; z-index: 1; opacity: 0.9"
      class="bg-panel text-center">
      <v-col class="d-flex justify-center align-center heading h3" style="letter-spacing: 9px">
        EQUIPMENT DESTROYED
      </v-col>
    </v-row>
    <v-row
      align="center"
      no-gutters
      justify="end"
      class="pr-1"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div class="mt-n2 pl-1">
          {{ item.Name }}
          <span class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            Pilot Weapon
          </span>
        </div>
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
    </v-row>
    <div class="pa-0" style="position: relative" :style="item.Used ? 'opacity: 0.4' : ''">
      <v-card-text class="pa-0">
        <v-card v-if="item?.FlavorDescription" tile color="panel" class="px-2 py-1 mb-2 clipped">
          <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
        </v-card>

        <div v-if="item" class="pt-1">
          <div>
            <on-element
              v-for="action in ['hit', 'crit', 'attack']"
              :profile="item"
              :action="action" />
          </div>
        </div>

        <div v-if="item">
          <div v-if="item.Effect">
            <p v-html-safe="item.Effect" class="mb-1 px-2" />
          </div>

          <div v-if="item.Actions?.length" class="mb-2 mt-1">
            <cc-combat-action-chip
              v-for="a in item.Actions"
              :action="a"
              :owner="pilot"
              :encounter="encounter">
              <template #icon>
                <v-tooltip location="top" text="Equipment Action">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" icon="cc:mechweapon" />
                  </template>
                </v-tooltip>
              </template>
            </cc-combat-action-chip>
          </div>

          <div v-if="item.Deployables?.length" class="mb-2">
            <deploy-button
              v-for="d in item.Deployables"
              :deployable="d"
              :actor="pilot"
              @deploy="$emit('deploy', d)" />
          </div>

          <v-row dense align="center">
            <v-col cols="auto">
              <cc-tags
                v-if="item.Tags"
                :tags="item.Tags"
                color="pilot"
                :bonus="pilot.LimitedBonus" />
            </v-col>

            <v-col cols="auto" class="ml-auto mr-4">
              <cc-bonus v-for="b in item.Bonuses" :bonus="b" chip />

              <!-- <cc-synergy-display :item="item" :location="synergyLocation" :mech="mech" large /> -->
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </div>
    <equip-command-panel :controller="pilot.CombatController" :encounter="encounter" :item="item" />
  </v-card>
</template>

<script>
import { Damage, ItemType, Mech } from '@/class';
import DeployButton from './_deployButton.vue';
import EquipCommandPanel from './_equipCommandPanel.vue';
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue';
import ModInset from '@/ui/components/panels/loadout/mech_loadout/components/mount/weapon/_ModInset.vue';
import EngWeaponSettings from '@/ui/components/panels/loadout/mech_loadout/components/mount/weapon/_EngWeaponSettings.vue';

export default {
  name: 'pilot-weapon-combat-card',
  components: {
    DeployButton,
    EquipCommandPanel,
    OnElement,
    ModInset,
    EngWeaponSettings,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    pilot: {
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
    encounter: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
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
      return this.item.ItemType === ItemType.PilotWeapon ? 'weapon' : 'gear';
    },
    getHeight() {
      let h = this.mobile ? 18 : 24;
      if (this.weapon) h += 12;
      return h;
    },

    getRange() {
      if (!this.item) return [];
      const mod = this.weaponSlot.Mod;
      const ar = mod && mod.AddedRange ? mod.AddedRange : null;
      return Range.CalculateRange(this.item, this.pilot, ar);
    },
    getDamage() {
      if (!this.item) return [];
      return Damage.CalculateDamage(this.item, this.pilot);
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
