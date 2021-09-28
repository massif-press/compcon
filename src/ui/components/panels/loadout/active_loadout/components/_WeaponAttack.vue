<template>
  <div>
    <div v-if="mount">
      <cb-card
        v-for="b in mount.Bonuses"
        :key="`${mount.ID}_bonus-${b.ID}`"
        :bonus="b"
        class="my-1"
      />
    </div>
    <v-row dense>
      <v-col>
        <slot />
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <cc-tags v-if="item.ProfileTags" :tags="item.ProfileTags" />
      </v-col>
      <v-col cols="auto">
        <cc-tags
          v-if="item.Mod && item.Mod.AddedTags"
          :tags="item.Mod.AddedTags"
          color="mod darken-2"
        />
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col v-if="item.Profiles && item.Profiles.length > 1" cols="12">
        <div class="overline">WEAPON PROFILES</div>
        <v-tabs v-model="tab" grow height="30px">
          <v-tab v-for="p in item.Profiles" :key="p.ID">
            <span class="accent--text font-weight-bold">{{ p.Name }}</span>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row dense justify="center">
      <v-col md="12" lg="10">
        <v-alert v-if="item.ProfileEffect" dense outlined color="active" class="mt-2">
          <div class="mb-n2 mt-n2">
            <div class="overline stark--text my-n2">EFFECT</div>
            <p class="text--text body-text mb-1 mr-2 ml-3" v-html-safe="item.ProfileEffect" />
          </div>
        </v-alert>
        <v-alert
          v-if="item.ProfileOnAttack"
          dense
          outlined
          color="active"
          class="mt-2"
          :style="`opacity: ${!attackRoll ? '0.4' : '1'}`"
        >
          <div class="my-n2">
            <div class="overline stark--text my-n2">ON ATTACK</div>
            <p class="text--text body-text mb-1" v-html-safe="item.ProfileOnAttack" />
          </div>
        </v-alert>

        <v-row v-if="item.Mod" dense justify="center">
          <active-mod-inset :mod="item.Mod" :mech="mech" color="mod" action />
        </v-row>
        <ammo-case-inset
          :level="armoryLevel"
          :uses="state.AvailableAmmoUses"
          @set-cost="setAmmoCost($event)"
          @set-damage="setAmmoDamage($event)"
        />
      </v-col>
    </v-row>

    <cc-active-synergy
      v-if="!item.NoBonuses"
      v-show="!improv"
      :locations="improv ? 'improvised_attack' : 'weapon'"
      :mech="mech"
      :item="improv ? null : item"
    />

    <v-row dense justify="center">
      <v-col md="12" lg="10">
        <v-alert
          v-if="item.ProfileOnHit"
          dense
          outlined
          :color="hit ? 'accent' : 'subtle'"
          :style="`opacity: ${!hit ? '0.4' : '1'}`"
        >
          <div class="mb-n2">
            <div class="overline stark--text my-n2">ON HIT</div>
            <p class="text--text body-text mb-1" v-html-safe="item.ProfileOnHit" />
          </div>
        </v-alert>
        <v-alert
          v-if="item.ProfileOnCrit"
          dense
          outlined
          text
          :color="crit ? 'secondary' : 'subtle'"
          :style="`opacity: ${crit && hit ? '1' : '0.4'}`"
        >
          <v-icon slot="prepend" :color="crit ? 'secondary' : 'subtle'" large class="ml-n2 mr-2">
            cci-mech-weapon
          </v-icon>
          <div class="mb-n2">
            <div class="overline stark--text my-n2">ON CRITICAL HIT</div>
            <p class="text--text body-text mb-1" v-html-safe="item.ProfileOnCrit" />
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <v-slide-y-reverse-transition>
      <v-container v-if="!confirmed" fluid>
        <v-row align="center">
          <v-col lg="auto" cols="12" class="mt-n5">
            <v-row
              dense
              class="text-center mb-n3"
              :justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'space-between'"
              align="start"
            >
              <v-col
                v-if="item.Range"
                cols="auto"
                :class="$vuetify.breakpoint.mdAndUp ? 'mr-8' : ''"
              >
                <div class="overline">Range</div>
                <cc-range-element :range="getRange" class="d-inline" />
              </v-col>
              <v-col cols="auto" :class="$vuetify.breakpoint.mdAndUp ? 'mx-8' : ''">
                <div class="overline mb-n2">Attack Roll</div>
                <div class="heading text--text" style="font-size: 24pt">
                  <v-icon x-large class="mr-n1">mdi-dice-d20-outline</v-icon>
                  + {{ mech.AttackBonus }}
                </div>
              </v-col>
              <v-col cols="auto" :class="$vuetify.breakpoint.mdAndUp ? 'mx-8' : ''">
                <div class="overline mb-n3">vs. Target</div>
                <v-icon x-large v-html="isSmart ? 'cci-edef' : 'cci-evasion'" />
                <div
                  class="overline font-weight-bold mt-n2"
                  v-html="isSmart ? 'E-Defense' : 'Evasion'"
                />
              </v-col>
              <v-col
                v-if="!noDamageItem"
                cols="12"
                md="auto"
                :class="$vuetify.breakpoint.mdAndUp ? 'ml-8' : ''"
              >
                <div class="overline">Damage</div>
                <cc-damage-element
                  :damage="getDamage"
                  :type-override="ammoDamage"
                  class="d-inline"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col lg="auto" md="12" class="ml-auto">
            <v-row
              dense
              :justify="$vuetify.breakpoint.mdAndUp ? 'end' : 'space-around'"
              :class="$vuetify.breakpoint.mdAndUp ? '' : 'panel'"
            >
              <v-col
                cols="auto"
                :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 mr-n10 panel dual-sliced' : ''"
                style="height: 70px"
              >
                <div class="overline pl-1">Accuracy</div>
                <v-text-field
                  v-model="accuracy"
                  type="number"
                  append-outer-icon="mdi-plus-circle-outline"
                  append-icon="cci-accuracy"
                  prepend-icon="mdi-minus-circle-outline"
                  style="width: 115px"
                  class="hide-input-spinners"
                  color="accent"
                  dense
                  hide-details
                  @click:append-outer="accuracy < 99 ? (accuracy += 1) : ''"
                  @click:prepend="accuracy > minAccuracy ? (accuracy -= 1) : ''"
                  @change="accuracy = parseInt($event)"
                />
              </v-col>
              <v-col
                cols="auto"
                :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 mr-n10 panel dual-sliced' : ''"
                style="height: 70px"
              >
                <div class="overline pl-1">Difficulty</div>
                <v-text-field
                  v-model="difficulty"
                  type="number"
                  append-outer-icon="mdi-plus-circle-outline"
                  append-icon="cci-difficulty"
                  prepend-icon="mdi-minus-circle-outline"
                  style="width: 115px"
                  class="hide-input-spinners"
                  color="accent"
                  dense
                  hide-details
                  @click:append-outer="difficulty < 99 ? (difficulty += 1) : ''"
                  @click:prepend="difficulty > minDifficulty ? (difficulty -= 1) : ''"
                  @change="difficulty = parseInt($event)"
                />
              </v-col>
              <v-col
                cols="auto"
                :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 panel dual-sliced' : ''"
                style="height: 70px"
              >
                <div class="overline pl-1">Attack Roll</div>
                <v-row no-gutters>
                  <v-col class="mr-n2 ml-n2">
                    <cc-dice-menu
                      v-if="resetAttackRoll"
                      :preset="`1d20+${mech.AttackBonus}`"
                      :preset-accuracy="accuracy - difficulty"
                      autoroll=true
                      title="ATTACK ROLL"
                      @commit="attackRoll = $event.total"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="attackRoll"
                      type="number"
                      :class="`hide-input-spinners ml-n3 ${crit ? 'font-weight-bold' : ''}`"
                      style="max-width: 60px; margin-top: -0.5px"
                      :color="crit ? 'secondary' : 'accent'"
                      dense
                      hide-details
                    />
                  </v-col>
                </v-row>
                <div v-if="crit" class="caption secondary--text font-weight-bold ml-8 my-n1">
                  CRITICAL
                </div>
              </v-col>
              <v-col v-if="aux" cols="auto" align-self="center">
                <v-btn
                  large
                  tile
                  block
                  :disabled="!attackRoll"
                  :color="`${crit ? 'secondary' : 'action--free'} ${attackFree ? 'lighten-1' : ''}`"
                  @click="attackFree = !attackFree"
                >
                  <v-icon left>cci-free-action</v-icon>
                  Attack
                </v-btn>
              </v-col>
              <v-col v-else-if="overwatch" cols="auto" align-self="center">
                <v-btn
                  large
                  tile
                  block
                  :disabled="!attackRoll"
                  :color="`${crit ? 'secondary' : 'action--reaction'} ${
                    attackFree ? 'lighten-1' : ''
                  }`"
                  @click="attackFree = !attackFree"
                >
                  <v-icon left>cci-reaction</v-icon>
                  Attack
                </v-btn>
              </v-col>
              <v-col v-else cols="auto" class="ml-2 mt-n1">
                <v-btn
                  large
                  tile
                  block
                  class="white--text"
                  :disabled="attackFree || !attackRoll || (!improv && !state.IsSkirmishAvailable)"
                  :color="`${crit ? 'secondary' : improv ? 'action--full' : 'action--quick'} ${
                    attackQuick ? 'lighten-1' : ''
                  }`"
                  @click="attackQuick = !attackQuick"
                >
                  <v-icon v-if="improv" left>mdi-hexagon-slice-6</v-icon>
                  <v-icon v-else left>mdi-hexagon-slice-3</v-icon>
                  Attack
                </v-btn>
                <v-btn
                  small
                  tile
                  block
                  class="white--text"
                  :disabled="attackQuick || !attackRoll"
                  :color="`action--free ${attackFree ? 'lighten-1' : ''}`"
                  @click="attackFree = !attackFree"
                >
                  <v-icon left small>cci-free-action</v-icon>
                  Free Action
                  <cc-tooltip
                    inline
                    content="Special rules or equipment may allow you to Skirmish as a Free Action. Using this button will commit the attack without spending a Quick Action this turn"
                  >
                    <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
                  </cc-tooltip>
                </v-btn>
                <div v-if="item.ProfileHeatCost" class="overline error--text text-center">
                  ALERT: This action will incur {{ item.ProfileHeatCost }} heat
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-slide-x-reverse-transition>
          <v-row v-if="attacked" class="mt-n2">
            <v-col md="6" lg="3" xl="2" class="ml-auto">
              <v-btn
                tile
                block
                class="primary"
                :color="`${crit ? 'secondary' : 'primary'} ${hit ? 'lighten-1' : ''}`"
                :disabled="missed"
                @click="hit = !hit"
              >
                HIT
              </v-btn>
            </v-col>
            <v-col md="6" lg="3" xl="2">
              <v-btn
                tile
                block
                :disabled="hit"
                :color="missed ? 'error' : ''"
                @click="missed = !missed"
              >
                MISSED
              </v-btn>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
        <br />
        <v-slide-x-reverse-transition>
          <v-row
            v-if="hit || missed"
            align="center"
            :class="`mt-1 ${$vuetify.breakpoint.smAndDown ? 'panel' : ''}`"
          >
            <v-col cols="auto" class="ml-auto" />
            <v-col v-if="hit && crit" cols="auto" class="text-center">
              <cc-tooltip
                :content="`On a critical hit, all damage dice are rolled twice
(including bonus damage) and the highest result from
each source of damage is used.`"
              >
                <v-icon x-large color="secondary">mdi-progress-alert</v-icon>
                <div class="secondary--text">CRITICAL HIT</div>
              </cc-tooltip>
            </v-col>
            <v-col
              v-if="hit && !noDamageItem"
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 mr-n10 panel dual-sliced' : ''"
              style="height: 70px"
            >
              <div class="overline mt-n2 pl-1">
                {{ getDamage.length > 1 ? 'Damage Rolls' : 'Damage Roll' }}
              </div>
              <v-row no-gutters>
                <v-col v-for="(d, i) in getDamage" :key="`rolled_damage_${i}`" class="mr-n2 ml-n2">
                  <v-row no-gutters>
                    <v-col>
                      <cc-dice-menu
                        :preset="d.Value"
                        :title="`${d.Type} DAMAGE ROLL`"
                        :overkill="overkill"
                        :critical="crit"
                        autoroll=true
                        @commit="setDamage(i, $event)"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="damageRolls[i]"
                        type="number"
                        :class="`hide-input-spinners ml-n3 ${crit ? 'font-weight-bold' : ''}`"
                        style="max-width: 60px; margin-top: -0.5px"
                        :color="crit ? 'secondary' : 'accent'"
                        dense
                        :hint="d.Type"
                        persistent-hint
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              v-if="hit && !aux && !noDamageItem"
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 mr-n10 panel dual-sliced' : ''"
              style="height: 70px"
            >
              <div class="overline mt-n2 pl-1">Bonus Damage</div>
              <v-row no-gutters>
                <v-col cols="auto">
                  <cc-dice-menu
                    title="BONUS DAMAGE"
                    :overkill="overkill"
                    :critical="crit"
                    @commit="setBonusDamage($event)"
                  />
                </v-col>
                <v-col cols="auto" class="ml-n2">
                  <v-text-field
                    v-model="bonusDamage"
                    type="number"
                    style="width: 60px"
                    class="hide-input-spinners mt-2 mb-n2 ml-4"
                    color="accent"
                    dense
                    hide-details
                    @change="bonusDamage = parseInt(total)"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-slide-x-reverse-transition>
              <v-col
                v-if="hit && !noDamageItem"
                cols="auto"
                :class="$vuetify.breakpoint.mdAndUp ? 'px-12 panel dual-sliced' : ''"
                style="height: 70px"
              >
                <div class="overline mt-n2 pl-1">Total Damage</div>
                <v-row no-gutters justify="end">
                  <v-col v-for="(d, i) in getDamage" :key="`dm_result_${i}`" cols="auto">
                    <div class="heading h2 stark--text">
                      {{ damageRolls[i] ? damageRolls[i] : '--' }}
                      <cc-tooltip inline :content="d.Type">
                        <v-icon
                          large
                          :color="ammoDamage ? `damage--${ammoDamage}` : d.Color"
                          class="ml-n3"
                        >
                          {{ ammoDamage ? `cci-${ammoDamage}` : d.Icon }}
                        </v-icon>
                      </cc-tooltip>
                    </div>
                  </v-col>
                  <v-col v-if="bonusDamage" cols="auto" class="ml-n1">
                    <div class="heading h2 stark--text" style="margin-top: 4px">
                      +{{ bonusDamage }}
                    </div>
                  </v-col>
                </v-row>
                <div v-if="summedDamage" class="overline my-n3 pr-1 subtle--text text-right">
                  <b v-if="!!reliable && summedDamage < reliable" class="accent--text">
                    ({{ reliable }})
                  </b>
                  <span v-else>({{ summedDamage }})</span>
                </div>
              </v-col>
            </v-slide-x-reverse-transition>
            <v-slide-x-reverse-transition>
              <v-col
                v-if="
                  (missed && !!reliable) || (summedDamage && !!reliable && summedDamage < reliable)
                "
                cols="auto"
                class="text-center mt-1 ml-n5 mr-6"
              >
                <cc-tooltip :content="`This attack deals a minimum of ${reliable} damage`">
                  <v-icon x-large>mdi-progress-alert</v-icon>
                  <div>RELIABLE {{ reliable }}</div>
                </cc-tooltip>
              </v-col>
            </v-slide-x-reverse-transition>
            <v-slide-x-reverse-transition>
              <v-col v-if="overkill" cols="12">
                <div class="text-right overline stark--text mt-n2">
                  <b>OVERKILL</b>
                </div>
                <v-row no-gutters justify="end" align="center">
                  <v-col cols="auto">
                    <cc-tooltip
                      :content="`When rolling for damage with this weapon, any damage dice that land on a 1 cause the attacker to take 1 Heat, and are then rerolled. Additional 1s continue to trigger this effect. ${autoOverkillString}`"
                    >
                      <v-icon x-large>mdi-progress-alert</v-icon>
                    </cc-tooltip>
                  </v-col>
                  <v-col
                    v-for="n in overkillHeat"
                    :key="`ovkr_${n}`"
                    cols="auto"
                    class="px-12 mx-n2 panel dual-sliced text-center mt-n1"
                    style="height: 60px"
                  >
                    <v-icon large color="dangerzone">mdi-fire</v-icon>
                    <div class="overline my-n2">
                      +1 HEAT
                      <v-icon small class="fadeSelect" @click="overkillHeat--">mdi-close</v-icon>
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <cc-tooltip content="Add Overkill Heat">
                      <v-btn large icon @click="overkillHeat++">
                        <v-icon large>mdi-plus-circle-outline</v-icon>
                      </v-btn>
                    </cc-tooltip>
                  </v-col>
                </v-row>
                <div v-if="overkillHeat" class="overline error--text text-right">
                  ALERT: This action will incur an additional {{ overkillHeat }} heat
                </div>
              </v-col>
            </v-slide-x-reverse-transition>

            <v-col v-if="overkill" class="ml-auto" />
            <v-slide-x-reverse-transition>
              <v-col v-if="hit || missed" cols="auto" class="text-center mt-n2 mb-n5 ml-n4">
                <v-row no-gutters class="mt-2">
                  <v-col cols="auto" class="ml-auto">
                    <v-btn
                      large
                      tile
                      color="success darken-2"
                      :disabled="hit && !summedDamage && !noDamageItem"
                      @click="confirm()"
                    >
                      <v-icon left>mdi-check</v-icon>
                      Confirm
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="hit || (missed && !!reliable)" no-gutters class="mt-n4">
                  <v-col cols="auto" class="ml-auto">
                    <v-checkbox
                      v-if="!noDamageItem"
                      v-model="kill"
                      color="accent"
                      dense
                      :disabled="hit && !summedDamage"
                    >
                      <span slot="label" class="caption">TARGET DESTROYED</span>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-slide-x-reverse-transition>
          </v-row>
        </v-slide-x-reverse-transition>
      </v-container>
    </v-slide-y-reverse-transition>
    <v-slide-x-reverse-transition>
      <v-row v-if="(hit || missed) && !noDamageItem" no-gutters class="mt-2">
        <v-col cols="auto" class="ml-auto">
          <p class="flavor-text stark--text ma-0">
            >//[
            <span class="accent--text">COMP/CON</span>
            ] :
            <span v-if="missed">
              {{ improv ? 'Improvised attack' : 'Weapon activation' }} registered. {{ missText }}.
            </span>
            <span v-if="hit">
              {{ improv ? 'Improvised attack' : 'Weapon activation' }} registered.
              {{ crit ? 'Direct hit' : 'Hit' }} confirmed.
            </span>
            <span v-if="kill">Target destroyed.</span>
          </p>
          <p v-if="confirmed" class="flavor-text stark--text ma-0">
            >//[
            <span class="accent--text">COMP/CON::COMBAT TELEMETRY LOG</span>
            ] :
            <span>ATK {{ attackRoll }}</span>
            <cc-slashes />
            <span v-if="hit && !crit">HIT</span>
            <span v-else-if="crit">CRITICAL HIT</span>
            <span v-else>MISS</span>
            <cc-slashes />
            <span v-if="finalDamage">{{ finalDamage }} DMG</span>
            <span v-if="kill">KILL CONFIRM</span>
            <span v-if="item.ProfileHeatCost || overkillHeat">
              <br />
              ALERT: REACTOR HEAT LEVELS INCREASING
            </span>
            <cc-tooltip
              v-if="!improv"
              inline
              content="Undo this attack, refunding any actions it may have cost"
            >
              <v-btn x-small color="primary" class="fadeSelect" @click="reset">
                <v-icon small left>mdi-reload</v-icon>
                UNDO
              </v-btn>
            </cc-tooltip>
          </p>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/indent */
import Vue from 'vue'
import ActiveModInset from '../components/_ActiveModInset.vue'
import AmmoCaseInset from '../../mech_loadout/components/mount/weapon/_AmmoCaseInset.vue'
import PilotTalent from '@/classes/pilot/PilotTalent'
import { ActivationType, Damage, DiceRoller, Range, WeaponSize, WeaponType } from '@/class'
import CbCard from '../../mech_loadout/components/mount/_CbCard.vue'

export default Vue.extend({
  name: 'weapon-attack',
  components: { AmmoCaseInset, ActiveModInset, CbCard },
  props: {
    item: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: false,
      default: null,
    },
    aux: { type: Boolean },
    improv: { type: Boolean },
    barrage: { type: Boolean },
    overwatch: { type: Boolean },
  },
  data: () => ({
    tab: 0,
    ammoCost: 0,
    overkillHeat: 0,
    autoOverkillString: '',
    ammoDamage: '',
    accuracy: 0,
    difficulty: 0,
    attackRoll: null,
    rollResultString: null,
    rollAccuracyResults: [],
    attackQuick: false,
    attackFree: false,
    hit: false,
    missed: false,
    damageRolls: [],
    damageResultString: null,
    bonusDamage: null,
    kill: false,
    confirmed: false,
    resetAttackRoll: false,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    noDamageItem() {
      return !this.item.Damage.length
    },
    missText() {
      if (this.reliable) return 'Glancing hit'
      switch (this.item.WeaponType) {
        case 'Rifle':
        case 'Cannon':
          return 'Shot wide'
        default:
          return 'No effect'
      }
    },
    overkill() {
      if (this.item.ProfileTags.some(x => x.IsOverkill)) return true
      if (this.item.Mod && this.item.Mod.AddedTags.some(x => x.IsOverkill)) return true
      return false
    },
    crit() {
      return this.attackRoll && this.attackRoll >= 20
    },
    attacked() {
      return this.attackQuick || this.attackFree
    },
    hardpoints() {
      if (!this.mount) return false
      if (this.item.NoCoreBonus) return false
      return (
        this.mount.Bonuses &&
        this.mount.Bonuses.find(x => x.ID === 'cb_auto_stabilizing_hardpoints')
      )
    },
    overpower() {
      if (!this.mount) return false
      if (this.item.NoCoreBonus) return false
      return this.mount.Bonuses && this.mount.Bonuses.find(x => x.ID === 'cb_overpower_caliber')
    },
    armoryLevel() {
      if (
        this.improv ||
        this.item.Size !== WeaponSize.Main ||
        this.item.WeaponType === WeaponType.Melee
      )
        return 0
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
    isSmart() {
      if (this.item.ProfileTags.some(x => x.IsSmart)) return true
      if (this.item.Mod && this.item.Mod.AddedTags.some(x => x.IsSmart)) return true
      return false
    },
    reliable() {
      const r = this.item.ProfileTags.find(x => x.ID === 'tg_reliable')
      return Number(r ? r.Value : 0)
    },
    minAccuracy() {
      let bonus = 0
      if (this.item.ProfileTags.some(x => x.ID === 'tg_accurate')) bonus += 1
      if (this.item.Mod && this.item.Mod.AddedTags.some(x => x.ID === 'tg_accurate')) bonus += 1
      if (this.hardpoints) bonus += 1
      return bonus
    },
    minDifficulty() {
      if (this.item.ProfileTags.some(x => x.ID === 'tg_inaccurate')) return 1
      if (this.item.Mod && this.item.Mod.AddedTags.some(x => x.ID === 'tg_inaccurate')) return 1
      return 0
    },
    summedDamage() {
      let dmg = 0
      this.damageRolls.forEach(v => {
        dmg += parseInt(v)
      })
      if (this.bonusDamage) dmg += parseInt(this.bonusDamage)
      return dmg
    },
    finalDamage() {
      return this.reliable > this.summedDamage ? this.reliable : this.summedDamage
    },
  },
  watch: {
    tab(newval: number) {
      this.item.SetProfileSelection(newval, true)
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    setAmmoCost(cost) {
      this.ammoCost = cost
    },
    setAmmoDamage(damage) {
      this.ammoDamage = damage
    },
    setDamage(index, damage) {
      Vue.set(this.damageRolls, index, damage.total)
      this.overkillHeat += damage.overkill
    },
    setBonusDamage(damage) {
      this.bonusDamage = damage.total
      this.overkillHeat += damage.overkill
    },
    confirm(): void {
      this.confirmed = true
      const actionObj = {
        accuracy: this.accuracy - this.difficulty,
        hit: this.hit,
        damage: this.summedDamage,
        kill: this.kill,
        activation: this.improv
          ? ActivationType.Full
          : this.attackQuick
          ? ActivationType.Quick
          : ActivationType.Free,
      }
      let cost = 1
      cost = this.item.Cost
      this.item.Use(cost, actionObj.activation === ActivationType.Free)
      if (this.ammoCost) this.state.SpendAmmoCost(this.ammoCost)
      this.mech.CurrentHeat += this.item.ProfileHeatCost
      this.mech.CurrentHeat += this.overkillHeat
      this.mech.Pilot.State.LogAttackAction('ATTACK', this.item.Name, this.summedDamage, this.kill)
      this.$emit('confirm', actionObj.activation === ActivationType.Free)
    },
    reset() {
      this.mech.Pilot.State.UndoLogAttackAction(
        'ATTACK',
        this.item.Name,
        this.summedDamage,
        this.kill
      )
      if (this.ammoCost) this.state.RefundAmmoCost(this.ammoCost)
      this.init()
      this.$emit('reset')
    },
    init(): void {
      this.ammoCost = 0
      this.ammoDamage = ''
      this.accuracy = this.minAccuracy
      this.difficulty = this.minDifficulty
      this.attackRoll = null
      this.rollResultString = null
      this.rollAccuracyResults = []
      this.attackQuick = false
      this.attackFree = false
      this.hit = false
      this.missed = false
      this.damageRolls = []
      this.damageResultString = null
      this.bonusDamage = null
      this.kill = false
      this.confirmed = false
      this.overkillHeat = 0
      this.resetAttackRoll = false
      this.$nextTick(function () {
        this.resetAttackRoll = true
      })
    },
  },
})
</script>
