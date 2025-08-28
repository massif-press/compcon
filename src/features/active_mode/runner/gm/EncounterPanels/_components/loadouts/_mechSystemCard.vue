<template>
  <v-card flat tile>
    <v-card-text class="pa-0" style="position: relative" :style="item.Used ? 'opacity: 0.4' : ''">
      <v-row
        v-if="item.Destroyed"
        style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1; opacity: 0.9"
        class="bg-panel text-center">
        <v-col class="d-flex justify-center align-center heading h3" style="letter-spacing: 9px">
          EQUIPMENT DESTROYED
        </v-col>
      </v-row>

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
          <v-row v-for="a in item.Actions" dense align="center">
            <v-col cols="auto">
              <v-tooltip location="top" text="Equipment Action">
                <template #activator="{ props }">
                  <v-icon v-bind="props" icon="cc:activate" />
                </template>
              </v-tooltip>
              <v-tooltip location="top" :text="a.Activation">
                <template #activator="{ props }">
                  <span v-bind="props" class="ml-1">
                    <v-icon
                      v-bind="props"
                      :icon="a.Icon"
                      :color="
                        mech.CombatController.CanActivate(a.Activation) ? 'success' : 'error'
                      " />
                    <v-tooltip
                      v-if="!mech.CombatController.CanActivate(a.Activation)"
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
                  <deploy-button :deployable="d" :actor="mech" @deploy="$emit('deploy', d)" />
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
              :bonus="mech.LimitedBonus"
              combat />
          </v-col>

          <v-col cols="auto" class="ml-auto mr-4">
            <cc-bonus-display :item="item" />
            <cc-synergy-display :item="item" :location="synergyLocation" :mech="mech" large />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <equip-command-panel :controller="mech.CombatController" :encounter="encounter" :item="item" />
  </v-card>
</template>

<script>
import { Damage, ItemType, Mech } from '@/class';
import DeployButton from './_deployButton.vue';
import EquipCommandPanel from './_equipCommandPanel.vue';

export default {
  name: 'slot-card-base',
  components: {
    DeployButton,
    EquipCommandPanel,
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
  },
};
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
