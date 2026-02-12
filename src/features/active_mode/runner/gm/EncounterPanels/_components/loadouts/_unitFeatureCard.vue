<template>
  <v-card flat
    tile>
    <v-row align="center"
      no-gutters
      justify="end"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div>
          <v-tooltip v-if="item.ActiveEffects.length > 0"
            location="top"
            text="Active Effect">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="cc:trait"
                color="accent"
                size="x-small"
                class="mt-n1" />
            </template>
          </v-tooltip>
          <v-tooltip v-if="item.Bonuses.length > 0"
            location="top"
            text="Passive Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="cc:accuracy"
                color="accent"
                size="x-small"
                class="mt-n1" />
            </template>
          </v-tooltip>
          {{ item.Name }}
          <span v-if="item.WeaponType"
            class="text-cc-overline px-1">
            <cc-slashes class="mx-1" />
            {{ item.WeaponType }}
          </span>
          <span v-else
            class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            {{ item.FeatureType }}
          </span>
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-range-element v-if="item.Range"
          small
          :range="item.Range(tier, mods)" />
        <cc-slashes v-if="item.Range && item.Damage"
          class="pr-1" />
        <cc-damage-element v-if="item.Damage"
          small
          :damage="item.Damage(tier, mods)" />
      </v-col>

      <v-col v-if="!showCommandPanel"
        cols="auto">
        <v-btn icon
          flat
          tile
          size="x-small"
          variant="text"
          @click="collapsed = !collapsed">
          <v-icon size="30"
            :icon="collapsed ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </v-btn>
      </v-col>
    </v-row>
    <v-slide-y-transition>
      <div v-if="!collapsed"
        class="pb-1"
        style="position: relative"
        :style="item.Used ? 'opacity: 0.4' : ''">
        <v-card-text class="pa-0">
          <v-card v-if="item?.FlavorDescription"
            tile
            color="panel"
            class="px-2 py-1 mb-2 clipped">
            <p v-html-safe="item.FlavorDescription"
              style="white-space: pre-wrap" />
          </v-card>

          <div v-if="item"
            class="pt-1">
            <div>
              <div>
                <on-element v-for="action in ['hit', 'crit', 'attack']"
                  :profile="item"
                  :action="action" />
              </div>
            </div>

            <div v-if="mods">
              <npc-mod-inset v-for="mod in mods"
                :key="mod.ID"
                :mod="mod"
                :tier="tier" />
            </div>
          </div>

          <div v-if="item">
            <div v-if="item.Effect">
              <p v-html-safe="item.EffectByTier(tier)"
                class="mb-1 px-2" />
            </div>

            <div v-if="item.Actions?.length"
              class="mb-2 mt-1">
              <cc-combat-action-chip v-for="a in item.Actions"
                :action="a"
                :owner="owner"
                @activate="handleActivation($event)"
                @reset="handleRefund($event)"
                :encounter="encounter">
                <template #icon>
                  <v-tooltip location="top"
                    text="Equipment Action">
                    <template #activator="{ props }">
                      <v-icon v-bind="props"
                        :icon="item.Icon" />
                    </template>
                  </v-tooltip>
                </template>
              </cc-combat-action-chip>
            </div>

            <div v-if="item.Deployables?.length"
              class="mb-2">
              <deploy-button v-for="d in item.Deployables"
                :deployable="d"
                :actor="unit"
                @deploy="handleDeploy(d)" />
            </div>

            <v-row dense
              align="center">
              <v-col cols="auto">
                <cc-tags v-if="item.Tags"
                  :tags="item.Tags"
                  color="pilot"
                  :bonus="limitedBonus"
                  combat />
              </v-col>

              <v-col cols="auto">
                <cc-tags v-if="item.Mod"
                  :tags="item.Mod.AddedTags"
                  color="mod"
                  :bonus="limitedBonus"
                  combat />
              </v-col>
              <v-col cols="auto"
                class="ml-auto mr-4">
                <cc-bonus v-for="b in item.Bonuses"
                  :bonus="b"
                  chip
                  :tier="tier" />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </div>
    </v-slide-y-transition>
    <equip-command-panel v-if="showCommandPanel"
      :owner="owner"
      class="mb-2"
      :controller="unit.CombatController"
      :encounter="encounter"
      :item="item" />
  </v-card>
</template>

<script>
import { Damage, ItemType } from '@/class';
import DeployButton from './_deployButton.vue';
import NpcModInset from '@/features/gm/npc_roster/npcs/_components/NpcModInset.vue';
import EquipCommandPanel from './_equipCommandPanel.vue';
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue';

export default {
  name: 'unit-feature-combat-card',
  components: {
    DeployButton,
    NpcModInset,
    EquipCommandPanel,
    OnElement,
  },
  props: {
    item: {
      type: Object,
      required: true,
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
    unit: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
  data: () => ({
    detailDialog: false,
    selectorDialog: false,
    limitedBonus: 0,
    collapsed: false,
  }),
  mounted() {
    this.collapsed = !this.showCommandPanel;
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    portrait() {
      return this.$vuetify.display.xs;
    },
    synergyLocation() {
      if (!this.item) return 'none';
      return this.item.ItemType;
    },
    mods() {
      return this.unit.NpcFeatureController.GetModifiers(this.item);
    },
    tier() {
      return this.unit.NpcClassController?.Tier || 1;
    },
    showCommandPanel() {
      return !this.IsCombatPassive;
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
    handleActivation(cost) {
      if (cost && this.item.MaxUses) {
        this.item.Uses = (this.item.Uses || 0) + cost;
      }
    },
    handleRefund(cost) {
      if (cost && this.item.MaxUses) {
        this.item.Uses = (this.item.Uses || 0) - cost;
      }
      if (this.item.Uses < 0) this.item.Uses = 0;
    },
    handleDeploy(deployable) {
      if (this.item.MaxUses) {
        this.item.Uses = (this.item.Uses || 0) + deployable.Cost || 1;
      }
      const inst = deployable.Instances || 1;
      for (let index = 0; index < inst; index++) {
        this.$emit('deploy', deployable);
      }

    },
  },
};
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
