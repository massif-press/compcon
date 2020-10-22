<template>
  <v-col class="pa-2">
    <div style="height: 100%">
      <v-card
        flat
        tile
        :class="hide ? 'panel' : 'clipped-large panel'"
        :style="!hide ? 'height: 100%' : ''"
      >
        <v-card-title
          class="white--text py-0 heading h3 hover-item"
          style="cursor: pointer;"
          @click="empty ? '' : $refs.detailDialog.show()"
        >
          <span style="display: flex; width: 100%">
            <span v-if="item">
              <equipment-options :item="item" readonly active />
              <span v-if="!item.Destroyed" class="ml-n2">
                {{ item.Name }}
                <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
                <span class="caption subtle--text ml-1">
                  <b>{{ item.Size }}</b>
                  {{ item.Type }}
                </span>
              </span>
              <span v-else class="py-1 error" style="letter-spacing: 3px">
                &nbsp;//
                <strike>{{ item.Name }}</strike>
                //&nbsp;
              </span>
            </span>
            <span v-else>{{ weaponSlot.Size }} Weapon</span>
            <v-spacer />
            <span>
              <cc-range-element v-if="item.Range" small :range="getRange" class="d-inline" dark />
              <cc-slashes v-if="item.Range && item.Damage" class="px-2" />
              <cc-damage-element
                v-if="item.Damage"
                small
                :damage="getDamage"
                :type-override="item.DamageTypeOverride"
                class="d-inline"
              />
            </span>
            <v-btn right icon class="fadeSelect" @click.stop="hide = !hide">
              <v-icon small v-html="hide ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
            </v-btn>
          </span>
        </v-card-title>
        <v-slide-y-transition>
          <v-card-text v-if="!hide" class="underline-parent px-2 py-0 mt-0">
            <div class="underline-slide">
              <weapon-activators v-if="!item.Destroyed" :item="item" :mech="mech" :mount="mount" />
              <equipment-header
                :item="item"
                readonly
                :color="color"
                :use-bonus="mech.LimitedBonus"
              />
              <div class="mt-n1">
                <div v-if="item.ProfileEffect">
                  <div class="mb-n2">
                    <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileEffect" />
                  </div>
                </div>
                <div v-if="item.ProfileOnAttack">
                  <div class="mb-n2 mt-1">
                    <v-icon class="mt-n1">cci-weapon</v-icon>
                    <span class="overline stark--text">ON ATTACK</span>
                    <p
                      class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
                      v-html="item.ProfileOnAttack"
                    />
                  </div>
                </div>
                <div v-if="item.ProfileOnHit">
                  <div class="mb-n2 mt-1">
                    <v-icon class="mt-n1">cci-weapon</v-icon>
                    <span class="overline stark--text">ON HIT</span>
                    <p
                      class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
                      v-html="item.ProfileOnHit"
                    />
                  </div>
                </div>
                <div v-if="item.ProfileOnCrit">
                  <div class="mb-n2 mt-1">
                    <v-icon class="mt-n1">cci-weapon</v-icon>
                    <span class="overline stark--text">ON CRITICAL HIT</span>
                    <p
                      class="text--text body-text mb-1 mr-2 ml-6 mt-n2"
                      v-html="item.ProfileOnCrit"
                    />
                  </div>
                </div>
                <v-row v-if="item.Mod" dense justify="center">
                  <active-mod-inset :mod="item.Mod" :mech="mech" :color="color" />
                </v-row>
                <ammo-case-inset :level="armoryLevel" />
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
                          cols="auto"
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
                <v-col cols="auto">
                  <cc-tags small :tags="item.Tags" :color="color" />
                  <cc-tags v-if="item.Mod" small :tags="item.Mod.AddedTags" color="mod darken-2" />
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
import AmmoCaseInset from '../mech_loadout/components/mount/weapon/_AmmoCaseInset.vue'
import EquipmentOptions from '../mech_loadout/components/_EquipmentOptions.vue'
import EquipmentHeader from '../mech_loadout/components/_EquipmentHeader.vue'
import { WeaponSize, PilotTalent, WeaponType, Range, Damage } from '@/class'

export default Vue.extend({
  name: 'weapon-slot-card',
  components: {
    WeaponActivators,
    ActiveModInset,
    AmmoCaseInset,
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
  },
  data: () => ({
    hide: false,
  }),
  computed: {
    color() {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.dark)
    },
    armoryLevel() {
      if (this.item.Size !== WeaponSize.Main || this.item.Type === WeaponType.Melee) return 0
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
