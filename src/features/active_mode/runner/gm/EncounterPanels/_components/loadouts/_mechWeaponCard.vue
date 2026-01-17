<template>
  <v-card flat
    tile>
    <v-row v-if="item.Destroyed"
      style="position: absolute; top: 0; left: 0; right: 0; bottom: -13px; z-index: 1; opacity: 0.9"
      class="bg-panel text-center">
      <v-col class="d-flex justify-center align-center heading h3"
        style="letter-spacing: 9px">
        EQUIPMENT DESTROYED
      </v-col>
    </v-row>
    <v-row align="center"
      no-gutters
      justify="end"
      class="pr-1"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div class="mt-n2 pl-1">
          {{ item.Name }}
          <span class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            {{ item.WeaponTypes.join('/') }} -
            {{ item.Size }}
          </span>
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-range-element v-if="item.Range"
          small
          :range="item.Range" />
        <cc-slashes v-if="item.Range && item.Damage"
          class="pr-1" />
        <cc-damage-element v-if="item.Damage"
          small
          :damage="item.Damage"
          :type-override="item.DamageTypeOverride" />
      </v-col>
    </v-row>
    <div class="pa-0"
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
            <div v-if="isEngineerWeapon"
              class="mb-1">
              <eng-weapon-settings :item="item"
                :mech="mech"
                :readonly="readonly" />
            </div>

            <div v-if="item.Profiles && item.Profiles.length > 1">
              <v-tabs v-if="!mobile"
                v-model="item.ProfileIndex"
                density="compact"
                height="20"
                align="center"
                center-active>
                <v-tab v-for="p in item.Profiles">{{ p.Name }}</v-tab>
              </v-tabs>

              <v-chip-group v-else
                column
                v-model="item.ProfileIndex"
                class="mb-2">
                <cc-chip v-for="(p, i) in item.Profiles"
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
                <div v-if="item.Profiles[item.ProfileIndex].Effect"
                  class="panel clipped pa-2">
                  <v-row dense
                    align="end">
                    <v-col cols="auto"><v-icon size="large"
                        icon="cc:weapon" /></v-col>
                    <v-col>
                      <div class="heading">
                        {{ item.Profiles[item.ProfileIndex].Name }}
                      </div>
                    </v-col>
                  </v-row>
                  <p v-html-safe="item.Profiles[item.ProfileIndex].Effect"
                    class="px-2" />
                </div>
              </div>

              <cc-combat-action-chip v-for="a in item.Profiles[item.ProfileIndex].Actions"
                :action="a"
                :owner="mech"
                @activate="handleActivation($event)"
                @reset="handleRefund($event)"
                :encounter="encounter">
                <template #icon>
                  <v-tooltip location="top"
                    text="Equipment Action">
                    <template #activator="{ props }">
                      <v-icon v-bind="props"
                        icon="cc:system" />
                    </template>
                  </v-tooltip>
                </template>
              </cc-combat-action-chip>

              <div v-if="item.Profiles[item.ProfileIndex].Deployables.length">
                <div class="text-cc-overline text-disabled">//PROFILE DEPLOYABLES</div>
                <v-row no-gutters
                  justify="center">
                  <v-col v-for="(d, i) in item.Profiles[item.ProfileIndex].Deployables"
                    cols="auto">
                    <cc-deployable-info :deployable="d"
                      :name-override="item.Name"
                      class="ma-2" />
                  </v-col>
                </v-row>
              </div>
              <div v-if="item.Profiles[item.ProfileIndex].Tags.length">
                <div class="text-cc-overline mb-n1 text-disabled">//PROFILE TAGS</div>
                <cc-tags :tags="item.Profiles[item.ProfileIndex].Tags"
                  extended
                  :bonus="mech.LimitedBonus" />
              </div>
              <on-element v-for="action in ['hit', 'crit', 'attack']"
                :profile="item.Profiles[item.ProfileIndex]"
                :action="action" />
            </div>
            <div v-else>
              <on-element v-for="action in ['hit', 'crit', 'attack']"
                :profile="item.Profiles[0]"
                :action="action" />
            </div>
          </div>
          <div v-if="mod">
            <mech-mod-card :mod="mod"
              :mech="mech"
              :encounter="encounter"
              @deploy="$emit('deploy', d)" />
          </div>
        </div>

        <div v-if="item">
          <div v-if="item.Effect">
            <p v-html-safe="item.Effect"
              class="mb-1 px-2" />
          </div>

          <div v-if="item.Actions?.length"
            class="mb-2 mt-1">
            <cc-combat-action-chip v-for="a in item.Actions"
              :action="a"
              :owner="mech"
              @activate="handleActivation($event)"
              @reset="handleRefund($event)"
              :encounter="encounter">
              <template #icon>
                <v-tooltip location="top"
                  text="Equipment Action">
                  <template #activator="{ props }">
                    <v-icon v-bind="props"
                      icon="cc:mechweapon" />
                  </template>
                </v-tooltip>
              </template>
            </cc-combat-action-chip>
          </div>

          <div v-if="item.Deployables?.length"
            class="mb-2">
            <deploy-button v-for="d in item.Deployables"
              :deployable="d"
              :actor="mech"
              @deploy="handleDeploy(d)" />
          </div>

          <v-row dense
            align="center">
            <v-col cols="auto">
              <cc-tags v-if="item.Tags"
                :tags="item.Tags"
                color="pilot"
                :bonus="mech.LimitedBonus" />
            </v-col>

            <v-col v-show="item.Profiles.length > 1"
              v-for="p in item.Profiles"
              class="mr-4"
              cols="auto">
              <div v-if="p.Tags.length">
                <div class="text-cc-overline"
                  v-text="p.Name" />
                <cc-tags v-if="p.Tags"
                  :tags="p.Tags"
                  color="pilot"
                  :bonus="mech.LimitedBonus"
                  combat />
              </div>
            </v-col>

            <v-col cols="auto">
              <cc-tags v-if="item.Mod"
                :tags="item.Mod.AddedTags"
                color="mod"
                :bonus="mech.LimitedBonus"
                combat />
            </v-col>
            <v-col cols="auto"
              class="ml-auto mr-4">
              <cc-bonus v-for="b in item.Bonuses"
                :bonus="b"
                chip />

              <cc-synergy-display :item="item"
                :location="synergyLocation"
                :mech="mech"
                large />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </div>
    <equip-command-panel :controller="mech.CombatController"
      :encounter="encounter"
      :item="item" />
  </v-card>
</template>

<script>
import { Damage, ItemType, Mech } from '@/class';
import DeployButton from './_deployButton.vue';
import EquipCommandPanel from './_equipCommandPanel.vue';
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue';
import EngWeaponSettings from '@/ui/components/panels/loadout/mech_loadout/components/mount/weapon/_EngWeaponSettings.vue';
import MechModCard from './_mechModCard.vue';

export default {
  name: 'mech-weapon-combat-card',
  components: {
    DeployButton,
    EquipCommandPanel,
    OnElement,
    EngWeaponSettings,
    MechModCard,
  },
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
