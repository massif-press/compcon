<template>
  <v-card flat tile>
    <v-card-text class="pa-0" style="position: relative" :style="item.Used ? 'opacity: 0.4' : ''">
      <v-row
        v-if="item.Destroyed"
        style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: -13px;
          z-index: 1;
          opacity: 0.9;
        "
        class="bg-panel text-center">
        <v-col class="d-flex justify-center align-center heading h3" style="letter-spacing: 9px">
          EQUIPMENT DESTROYED
        </v-col>
      </v-row>

      <v-card v-if="item?.FlavorDescription" tile color="panel" class="px-2 py-1 mb-2 clipped">
        <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
      </v-card>

      <div v-if="item">
        <div v-if="item.Effect">
          <p v-html-safe="item.Effect" class="mb-1 px-2" />
        </div>

        <p v-html-safe="item.Description" class="mb-1 px-2" />

        <div v-if="item.Actions?.length" class="mb-2 mt-1">
          <cc-combat-action-chip
            v-for="a in item.Actions"
            :action="a"
            :owner="pilot"
            :encounter="encounter">
            <template #icon>
              <v-tooltip location="top" text="Equipment Action">
                <template #activator="{ props }">
                  <v-icon v-bind="props" icon="cc:system" />
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
              :bonus="pilot.LimitedBonus"
              combat />
          </v-col>

          <v-col cols="auto" class="ml-auto mr-4">
            <!-- <cc-bonus v-for="b in item.Bonuses" :bonus="b" chip /> -->
            <!-- <cc-synergy-display :item="item" :location="synergyLocation" :mech="mech" large /> -->
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <!-- <equip-command-panel :controller="pilot.CombatController" :encounter="encounter" :item="item" /> -->
  </v-card>
</template>

<script>
import { Damage, ItemType, Mech } from '@/class';
import DeployButton from './_deployButton.vue';
import EquipCommandPanel from './_equipCommandPanel.vue';

export default {
  name: 'pilot-gear-combat-card',
  components: {
    DeployButton,
    EquipCommandPanel,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    integrated: {
      type: Boolean,
      required: false,
      default: false,
    },
    pilot: {
      type: Object,
      required: true,
      default: null,
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
      return this.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system';
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
