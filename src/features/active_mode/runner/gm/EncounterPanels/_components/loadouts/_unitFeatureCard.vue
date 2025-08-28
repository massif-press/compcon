<template>
  <v-card flat tile>
    <v-row
      align="center"
      no-gutters
      justify="end"
      class="pr-1"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div class="pl-1">
          {{ item.Name }}
          <span v-if="item.WeaponType" class="text-cc-overline px-1">
            <cc-slashes class="mx-1" />
            {{ item.WeaponType }}
          </span>
          <span v-else class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            {{ item.FeatureType }}
          </span>
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-range-element v-if="item.Range" small :range="item.Range" />
        <cc-slashes v-if="item.Range && item.Damage" class="pr-1" />
        <cc-damage-element
          v-if="item.Damage"
          small
          :damage="item.Damage(item.NpcClassController?.Tier || 1)" />
      </v-col>
    </v-row>
    <div class="pa-0" style="position: relative" :style="item.Used ? 'opacity: 0.4' : ''">
      <v-card-text class="pa-0">
        <v-card v-if="item?.FlavorDescription" tile color="panel" class="px-2 py-1 mb-2 clipped">
          <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
        </v-card>

        <div v-if="item" class="pt-1">
          <div>
            <div>
              <on-element
                v-for="action in ['hit', 'crit', 'attack']"
                :profile="item"
                :action="action" />
            </div>
          </div>
          <div v-if="mod">
            <npc-mod-inset v-for="mod in mods" :key="mod.ID" :mod="mod" />
          </div>
        </div>

        <div v-if="item">
          <div v-if="item.Effect">
            <div class="text-cc-overline text-disabled mt-1">
              <v-icon :icon="item.Icon" size="small" class="mt-n1" />
              EQUIPMENT EFFECT
            </div>
            <p v-html-safe="item.EffectByTier(tier)" class="mb-1 px-2" />
          </div>

          <div v-if="item.Actions?.length" class="mb-2 mt-1">
            <v-row v-for="a in item.Actions" dense align="center">
              <v-col cols="auto">
                <v-tooltip location="top" text="Equipment Action">
                  <template #activator="{ props }">
                    <span v-bind="props" class="ml-1">
                      <v-icon
                        v-bind="props"
                        :icon="a.Icon"
                        :color="
                          unit.CombatController.CanActivate(a.Activation) ? 'success' : 'error'
                        " />
                      <v-tooltip
                        v-if="!unit.CombatController.CanActivate(a.Activation)"
                        location="top">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" icon="mdi-exclamation-thick" color="error" />
                        </template>
                        <div class="text-center text-cc-overline">Cannot activate</div>
                        <v-divider class="my-1" />
                        Insufficient
                        <v-chip
                          :color="a.Color"
                          size="small"
                          variant="elevated"
                          :prepend-icon="a.Icon">
                          {{ a.Activation }}
                        </v-chip>
                        actions remaining
                      </v-tooltip>
                    </span>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col>
                <cc-action :action="a" hide-icon class="mb-1" />
              </v-col>
            </v-row>
          </div>

          <div v-if="item.Deployables?.length" class="mb-2">
            <v-row v-for="d in item.Deployables" dense align="center">
              <v-col cols="auto">
                <v-tooltip location="top" text="Equipment Deployable (Instance)">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="small" icon="cc:drone" />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col>
                <v-row no-gutters align="center">
                  <v-col cols="auto">
                    <cc-deployable-info :deployable="d" class="mb-1" :name-override="item.Name" />
                  </v-col>
                  <v-col>
                    <deploy-button :deployable="d" :actor="unit" @deploy="$emit('deploy', d)" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>

          <v-row dense align="center">
            <v-col cols="auto">
              <cc-tags
                v-if="item.Tags"
                :tags="item.Tags"
                color="pilot"
                :bonus="limitedBonus"
                combat />
            </v-col>

            <v-col cols="auto">
              <cc-tags
                v-if="item.Mod"
                :tags="item.Mod.AddedTags"
                color="mod"
                :bonus="limitedBonus"
                combat />
            </v-col>
            <v-col cols="auto" class="ml-auto mr-4">
              TODO: unit bonus/synergy TODO: mod
              <!-- <cc-bonus-display :item="item" /> -->
              <!-- <cc-synergy-display :item="item" :location="synergyLocation" :unit="unit" large /> -->
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </div>
    <equip-command-panel
      v-if="showCommandPanel"
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

export default {
  name: 'slot-card-base',
  components: {
    DeployButton,
    NpcModInset,
    EquipCommandPanel,
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
  },
  emits: ['deploy'],
  data: () => ({
    detailDialog: false,
    selectorDialog: false,
    limitedBonus: 0,
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
      return this.item.ItemType;
    },

    mods() {
      return this.unit.NpcFeatureController.GetModifiers(item);
    },
    tier() {
      return this.unit.NpcClassController?.Tier || 1;
    },
    showCommandPanel() {
      return (
        this.item.Actions.length > 0 ||
        this.item.Deployables.length > 0 ||
        this.item.Recharge > 0 ||
        this.item.Tags.some((x) => x.UsageCost > 0) ||
        !!this.item.Damage
      );
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
