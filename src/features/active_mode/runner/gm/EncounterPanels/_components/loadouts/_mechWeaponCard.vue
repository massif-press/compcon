<template>
  <v-card flat
    tile>
    <equipment-destroyed-overlay :destroyed="item.Destroyed" />
    <v-row align="center"
      no-gutters
      justify="end"
      class="pr-1"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline ' : 'heading h3 text-uppercase'">
        <div class="pl-1">
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
          :range="getRange" />
        <cc-slashes v-if="item.Range && item.Damage"
          class="pr-1" />
        <cc-damage-element v-if="item.Damage"
          small
          :damage="getDamage"
          :type-override="item.DamageTypeOverride" />
      </v-col>
    </v-row>

    <div class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-card-text class="pa-0">
        <equipment-flavor-description :description="item.FlavorDescription" />

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
              <v-chip-group v-model="item.ProfileIndex"
                mandatory
                column>
                <v-chip v-for="(p, i) in item.Profiles"
                  :key="p.ID"
                  :value="i"
                  size="small"
                  filter>
                  {{ p.Name }}
                </v-chip>
              </v-chip-group>
              <div>
                <div v-if="item.Profiles[item.ProfileIndex].Effect"
                  class="panel clipped pa-2">
                  <v-row dense
                    align="end">
                    <v-col cols="auto">
                      <v-icon size="large"
                        icon="cc:weapon" />
                    </v-col>
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
                :key="a.ID"
                :action="a"
                :owner="owner"
                :encounter="encounter"
                @activate="handleActivation($event)"
                @reset="handleRefund($event)">
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
                    :key="'profie_' + i"
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
                :key="action"
                :profile="item.Profiles[item.ProfileIndex]"
                :action="action" />
            </div>
            <div v-else>
              <on-element v-for="action in ['hit', 'crit', 'attack']"
                :key="action"
                :profile="item.Profiles[0]"
                :action="action" />
            </div>
          </div>

          <div v-if="mod">
            <mech-mod-card :mod="mod"
              :owner="owner"
              :mech="mech"
              :encounter="encounter"
              @deploy="$emit('deploy', $event)" />
          </div>
        </div>

        <div v-if="item">
          <div v-if="item.Effect">
            <p v-html-safe="item.Effect"
              class="mb-1 px-2" />
          </div>

          <equipment-actions-deployables :item="item"
            :actor="mech"
            :owner="owner"
            :encounter="encounter"
            action-icon="cc:weapon"
            @deploy="$emit('deploy', $event)" />

          <v-row dense
            align="center">
            <v-col cols="auto">
              <cc-tags v-if="item.Tags"
                :tags="item.Tags"
                color="pilot"
                :bonus="mech.LimitedBonus" />
            </v-col>

            <v-col v-for="p in item.Profiles"
              :key="p.ID"
              v-show="item.Profiles.length > 1"
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
              <cc-bonus v-for="(b, index) in item.Bonuses"
                :key="`bonus-${index}`"
                :bonus="b"
                chip />
              <cc-bonus v-for="(b, index) in externalItemBonuses"
                :key="`ext-bonus-${index}`"
                :bonus="b" />
              <cc-synergy-display :item="item"
                :location="synergyLocation"
                :mech="mech"
                large />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </div>
    <equip-command-panel :owner="owner"
      :controller="mech.CombatController"
      :encounter="encounter"
      :item="item" />
  </v-card>
</template>

<script lang="ts">
import { Damage, ItemType, Mech, MechWeapon } from '@/class'
import EquipCommandPanel from './_equipCommandPanel.vue'
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue'
import EngWeaponSettings from '@/ui/components/panels/loadout/mech_loadout/components/mount/weapon/_EngWeaponSettings.vue'
import MechModCard from './_mechModCard.vue'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { useMobile } from '@/mixins/useMobile'
import { useEquipmentActions } from '@/mixins/useEquipmentActions'
import { externalItemBonuses } from '@/mixins/useExternalItemBonuses'
import { Range } from '@/classes/Range'

export default {
  name: 'MechWeaponCombatCard',
  components: {
    EquipCommandPanel,
    OnElement,
    EngWeaponSettings,
    MechModCard,
    EquipmentDestroyedOverlay: DestroyedOverlay,
    EquipmentFlavorDescription: FlavorDescription,
    EquipmentActionsDeployables: ActionsDeployables,
  },
  mixins: [useMobile, useEquipmentActions],
  props: {
    item: {
      type: Object,
      required: true,
    },
    mech: {
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
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['deploy'],
  computed: {
    synergyLocation() {
      if (!this.item) return 'none'
      if (this.item.IsIntegrated) return 'integrated'
      return this.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system'
    },
    isEngineerWeapon() {
      return this.item && this.item.ID.includes('mw_prototype_')
    },
    mod() {
      return this.item.Mod
    },
    externalItemBonuses,
    getRange() {
      return Range.CalculateRange(this.item as MechWeapon, this.mech as Mech)
    },
    getDamage() {
      return Damage.CalculateDamage(this.item as MechWeapon, this.mech as Mech)
    },
  },
}
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
