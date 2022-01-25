<template>
  <v-col :class="$vuetify.breakpoint.mdAndUp ? 'pa-2' : 'px-2'">
    <div v-if="item" style="height: 100%">
      <v-card
        flat
        tile
        :class="hide ? 'panel' : `${$vuetify.breakpoint.mdAndUp ? 'clipped-large' : ''} panel`"
        :style="!hide ? 'height: 100%' : ''"
      >
        <v-card-title
          class="white--text py-0 hover-item"
          style="cursor: pointer; word-break: break-word"
          @click="$refs.detailDialog.show()"
        >
          <v-row no-gutters>
            <v-col v-if="item" cols="auto">
              <equipment-options :item="item" readonly active />
              <span v-if="!item.Destroyed" class="ml-n2" :style="item.Used ? 'opacity: 0.6' : ''">
                <cc-tooltip v-if="item.Used" inline content="Equipment has been marked as 'Used'">
                  <v-icon color="success">mdi-check</v-icon>
                </cc-tooltip>
                <span
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? 'white--text heading h3'
                      : 'white--text body-text font-weight-bold'
                  "
                >
                  {{ item.Name }}
                </span>
                <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
                <span v-show="$vuetify.breakpoint.mdAndUp" class="caption subtle--text ml-1">
                  <b>{{ item.Size }}</b>
                  {{ item.WeaponType }}
                </span>
              </span>
              <span v-else class="py-1 error" style="letter-spacing: 3px">
                &nbsp;//
                <strike>{{ item.Name }}</strike>
                //&nbsp;
              </span>
            </v-col>
            <v-col v-else cols="auto">{{ weaponSlot.Size }} Weapon</v-col>
            <v-col cols="auto" class="ml-auto heading h3">
              <cc-range-element v-if="item.Range" small :range="getRange" class="d-inline" dark />
              <cc-slashes v-if="item.Range && item.Damage" class="px-2" />
              <cc-damage-element
                v-if="item.Damage"
                small
                :damage="getDamage"
                :type-override="item.DamageTypeOverride"
                class="d-inline"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn v-if="!rest" right icon class="fadeSelect" dark @click.stop="hide = !hide">
                <v-icon small v-html="hide ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-slide-y-transition>
          <v-card-text v-if="!rest && !hide" class="underline-parent px-2 py-0 mt-0">
            <div class="underline-slide">
              <v-row no-gutters>
                <v-col v-if="item.Profiles && item.Profiles.length > 1" cols="12">
                  <div class="overline">WEAPON PROFILES</div>
                  <v-tabs v-model="tab" grow height="30px">
                    <v-tab v-for="p in item.Profiles" :key="p.ID">
                      <span class="accent--text font-weight-bold">{{ p.Name }}</span>
                    </v-tab>
                  </v-tabs>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <weapon-activators
                    v-if="!item.Destroyed"
                    :item="item"
                    :mech="mech"
                    :mount="mount"
                  />
                </v-col>
              </v-row>
              <equipment-header
                :item="item"
                readonly
                :color="color"
                :use-bonus="mech.LimitedBonus"
              />
              <!-- <ammo-case-inset :level="armoryLevel" readonly /> -->
              <v-row v-if="item.ProfileActions.length" dense justify="center">
                <v-col
                  v-for="(a, i) in item.ProfileActions"
                  :key="`${item.Name}_action_${i}`"
                  style="min-width: 40%"
                  class="mb-n1"
                  cols="12"
                  md=""
                >
                  <cc-action
                    :action="a"
                    active
                    :activations="mech.Pilot.State.Actions"
                    :disabled="item.Destroyed || mech.IsStunned"
                    :unusable="a.Activation === 'Protocol' && !mech.Pilot.State.IsProtocolAvailable"
                    @use="item.Use(a.Cost, $event)"
                    @undo="item.Undo(a.Cost)"
                  />
                </v-col>
              </v-row>

              <div>
                <div v-if="item.ProfileEffect" class="py-1">
                  <div class="mb-n2">
                    <p v-html-safe="item.ProfileEffect" class="text--text body-text mb-1 mx-3" />
                  </div>
                </div>
                <div v-if="item.ProfileOnAttack">
                  <div class="mb-n2 mt-1">
                    <v-icon class="mt-n1">cci-weapon</v-icon>
                    <span class="overline stark--text">ON ATTACK</span>
                    <p
                      v-html-safe="item.ProfileOnAttack"
                      class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
                    />
                  </div>
                </div>
                <div v-if="item.ProfileOnHit">
                  <div class="mb-n2 mt-1">
                    <v-icon class="mt-n1">cci-weapon</v-icon>
                    <span class="overline stark--text">ON HIT</span>
                    <p
                      v-html-safe="item.ProfileOnHit"
                      class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
                    />
                  </div>
                </div>
                <div v-if="item.ProfileOnCrit">
                  <div class="mb-n2 mt-1">
                    <v-icon class="mt-n1">cci-weapon</v-icon>
                    <span class="overline stark--text">ON CRITICAL HIT</span>
                    <p
                      v-html-safe="item.ProfileOnCrit"
                      class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
                    />
                  </div>
                </div>
                <v-row v-if="item.Mod" dense justify="center">
                  <active-mod-inset :mod="item.Mod" :mech="mech" :color="color" />
                </v-row>
              </div>
            </div>
            <div v-if="item">
              <v-row class="text-left" dense align="end">
                <v-col>
                  <v-row justify="space-around" dense>
                    <v-col v-if="item.Deployables.length" cols="auto">
                      <v-row no-gutters justify="center">
                        <v-col
                          v-for="(d, i) in item.Deployables"
                          :key="`${item.Name}_deployable_${i}`"
                          cols="12"
                          md="auto"
                        >
                          <cc-deployable-info
                            :deployable="d"
                            :panel="false"
                            :name-override="item.Name"
                            class="ma-2"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters class="mr-3 mt-n2" align="start">
                <v-col cols="12" md="auto">
                  <cc-tags
                    small
                    :tags="item.ProfileTags"
                    :color="color"
                    :bonus="mech.Pilot.LimitedBonus"
                  />
                  <cc-tags
                    v-if="item.Tags && !item.ProfileTags"
                    small
                    :tags="item.Tags"
                    :color="color"
                    :bonus="mech.Pilot.LimitedBonus"
                  />
                  <cc-tags
                    v-if="item.Mod"
                    small
                    :tags="item.Mod.AddedTags"
                    color="mod darken-2"
                    :bonus="mech.Pilot.LimitedBonus"
                  />
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                  <cc-bonus-display :item="item" />
                </v-col>
                <v-col cols="auto">
                  <cc-synergy-display :item="item" location="weapon" :mech="mech" large />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </div>
    <cc-solo-dialog ref="detailDialog" no-confirm :title="item ? item.Name : ''" large>
      <cc-item-card :item="item" />
      <slot name="detail" />
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import ActiveModInset from './components/_ActiveModInset.vue'
import WeaponActivators from './components/_WeaponActivators.vue'
import EquipmentOptions from '../mech_loadout/components/_EquipmentOptions.vue'
import EquipmentHeader from '../mech_loadout/components/_EquipmentHeader.vue'
import { WeaponSize, PilotTalent, WeaponType, Range, Damage } from '@/class'

export default Vue.extend({
  name: 'active-weapon-card',
  components: {
    WeaponActivators,
    ActiveModInset,
    EquipmentOptions,
    EquipmentHeader,
  },
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    mech: {
      type: Object,
      required: true,
      default: null,
    },
    mount: {
      type: Object,
      required: true,
    },
    rest: {
      type: Boolean,
    },
  },
  data: () => ({
    tab: 0,
    hide: false,
  }),
  computed: {
    color() {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.dark)
    },
    armoryLevel() {
      if (this.item.Size !== WeaponSize.Main || this.item.WeaponType === WeaponType.Melee) return 0
      const tal = this.mech.Pilot.Talents.find(
        (x: PilotTalent) => x.Talent.ID === 't_walking_armory'
      )
      if (!tal) return 0
      return tal.Rank
    },
    getRange() {
      if (!this.item) return []
      return Range.CalculateRange(this.item, this.mech)
    },
    getDamage() {
      if (!this.item) return []
      return Damage.CalculateDamage(this.item, this.mech)
    },
  },
  watch: {
    tab(newval: number) {
      this.item.SetProfileSelection(newval, true)
    },
  },
})
</script>

<style scoped>
#underline-parent {
  background-color: var(--v-light-panel);
}

.hover-item {
  background-color: var(--v-pilot-base);
  transition: 0.4s all;
}

.hover-item:hover {
  background-color: var(--v-pilot-lighten1);
}
</style>
