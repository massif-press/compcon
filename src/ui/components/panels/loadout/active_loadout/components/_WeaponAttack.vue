<template>
  <div>
    <v-row dense>
      <v-col>
        <slot />
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <cc-tags v-if="item.Tags" :tags="item.Tags" />
      </v-col>
      <v-col cols="auto">
        <cc-tags
          v-if="item.Mod && item.Mod.AddedTags"
          :tags="item.Mod.AddedTags"
          color="mod darken-2"
        />
      </v-col>
    </v-row>
    <div class="mt-n1">
      <div v-if="item.ProfileEffect">
        <div class="mb-n2 mt-1">
          <span class="overline stark--text">EFFECT</span>
          <p class="text--text body-text mb-1 mr-2 ml-3 mt-n2" v-html="item.ProfileEffect" />
        </div>
      </div>
      <div v-if="item.ProfileOnAttack">
        <div class="mb-n2 mt-1">
          <span class="overline stark--text">ON ATTACK</span>
          <p class="text--text body-text mb-1 mr-2 ml-3 mt-n2" v-html="item.ProfileOnAttack" />
        </div>
      </div>

      <v-row v-if="item.Mod" dense justify="center">
        <active-mod-inset :mod="item.Mod" :mech="mech" color="mod" action />
      </v-row>
      <ammo-case-inset :level="armoryLevel" />
    </div>

    <v-row dense justify="center" class="mt-n1 mb-n6">
      <v-col v-for="(s, i) in synergies" :key="`syn_${i}`" cols="auto" style="min-width: 30vw">
        <v-alert dense outlined class="py-1" color="primary">
          <div class="overline my-n2 subtle--text">ACTIVE SYNERGY</div>
          <div class="body-text text--text" v-html="s.Detail" />
        </v-alert>
      </v-col>
    </v-row>

    <v-row dense class="text-center my-n2" justify="space-around">
      <v-col v-if="item.Range">
        <div class="overline">Range</div>
        <cc-range-element :range="getRange" class="d-inline" />
      </v-col>
      <v-col>
        <div class="overline mb-n2">Attack Roll</div>
        <div class="heading text--text" style="font-size: 24pt;">
          <v-icon x-large class="mr-n1">mdi-dice-d20-outline</v-icon>
          + {{ mech.AttackBonus }}
        </div>
      </v-col>
      <v-col>
        <div class="overline mb-n3">vs. Target</div>
        <v-icon x-large v-html="isSmart ? 'cci-edef' : 'cci-evasion'" />
        <div class="overline font-weight-bold mt-n2" v-html="isSmart ? 'E-Defense' : 'Evasion'" />
      </v-col>
      <v-col>
        <div class="overline">Damage</div>
        <cc-damage-element :damage="getDamage" class="d-inline" />
      </v-col>
    </v-row>
    <div v-if="item.ProfileOnHit">
      <div class="mb-n2 mt-1">
        <span class="overline stark--text">ON HIT</span>
        <p class="text--text body-text mb-1 mr-2 ml-3 mt-n2" v-html="item.ProfileOnHit" />
      </div>
    </div>
    <div v-if="item.ProfileOnCrit">
      <div class="mb-n2 mt-1">
        <span class="overline stark--text">ON CRITICAL HIT</span>
        <p class="text--text body-text mb-1 mr-2 ml-6 mt-n2" v-html="item.ProfileOnCrit" />
      </div>
    </div>

    <v-row dense align="center" class="mt-1 mb-n6">
      <v-col cols="auto" class="ml-auto px-12 mr-n10 panel dual-sliced">
        <div class="overline mt-n2 mb-n2 pl-1">Accuracy</div>
        <v-text-field
          v-model="accuracy"
          type="number"
          append-outer-icon="mdi-plus-circle-outline"
          append-icon="cci-accuracy"
          prepend-icon="mdi-minus-circle-outline"
          style="width: 110px"
          class="hide-input-spinners"
          color="accent"
          dense
          hide-details
          @click:append-outer="accuracy < 99 ? (accuracy += 1) : ''"
          @click:prepend="accuracy > 0 ? (accuracy -= 1) : ''"
          @change="accuracy = parseInt($event)"
        />
      </v-col>
      <v-col cols="auto" class="px-12 mr-n10 panel dual-sliced">
        <div class="overline mt-n2 mb-n2 pl-1">Difficulty</div>
        <v-text-field
          v-model="difficulty"
          type="number"
          append-outer-icon="mdi-plus-circle-outline"
          append-icon="cci-difficulty"
          prepend-icon="mdi-minus-circle-outline"
          style="width: 110px"
          class="hide-input-spinners"
          color="accent"
          dense
          hide-details
          @click:append-outer="difficulty < 99 ? (difficulty += 1) : ''"
          @click:prepend="difficulty > 0 ? (difficulty -= 1) : ''"
          @change="difficulty = parseInt($event)"
        />
      </v-col>
      <v-col cols="auto" class="px-12 panel dual-sliced">
        <div class="overline mt-n2 mb-n2 pl-1">Attack Roll</div>
        <v-row no-gutters>
          <v-col class="mr-n2 ml-n2">
            <cc-tooltip title="Roll to Attack" :content="attackRollString">
              <v-btn icon small color="accent" class="mt-1 mr-n3" @click="roll">
                <v-icon large>mdi-dice-d20-outline</v-icon>
              </v-btn>
            </cc-tooltip>
          </v-col>
          <v-col>
            <v-text-field
              v-model="attackRoll"
              type="number"
              class="hide-input-spinners ml-n3"
              style="max-width: 60px; margin-top: -0.5px"
              color="accent"
              dense
              hide-details
            />
          </v-col>
        </v-row>
        <v-slide-x-transition>
          <div
            v-if="rollResultString"
            class="caption pr-6 subtle--text"
            v-html="rollResultString"
          />
        </v-slide-x-transition>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-btn large tile block :disabled="!attackRoll" color="action--quick">
          <v-icon left>mdi-hexagon-slice-3</v-icon>
          Attack
        </v-btn>
        <v-btn small tile block :disabled="!attackRoll" color="action--free">
          <v-icon left small>cci-free-action</v-icon>
          Free Action
          <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActiveModInset from '../components/_ActiveModInset.vue'
import AmmoCaseInset from '../../mech_loadout/components/mount/weapon/_AmmoCaseInset.vue'
import PilotTalent from '@/classes/pilot/PilotTalent'
import { Damage, DiceRoller, Range, Synergy, WeaponSize, WeaponType } from '@/class'

export default Vue.extend({
  name: 'weapon-attack',
  components: { AmmoCaseInset, ActiveModInset },
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
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    accuracy: 0,
    difficulty: 0,
    attackRoll: null,
    rollResultString: null,
  }),
  computed: {
    synergies() {
      return Synergy.Collect('weapon', this.mech, this.item)
    },
    extraAux() {
      if (this.mount.Weapons.length === 1) return null
      else {
        const extra = this.mount.Weapons.find(x => x !== this.item)
        return extra || null
      }
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
    isSmart() {
      if (this.item.Tags.some(x => x.IsSmart)) return true
      if (this.item.Mod && this.item.Mod.AddedTags.some(x => x.IsSmart)) return true
      return false
    },
    attackRollString() {
      let str = `<div class="text-center"><div class='overline my-n2 subtle--text'>1d20 + Attack Bonus + (Accuracy - Difficulty)</div>`
      str += `<div class='heading h3 text--text'>1d20 + ${this.mech.AttackBonus}`
      const totalAcc = this.accuracy - this.difficulty
      if (totalAcc) {
        str += ` ${totalAcc > 0 ? '+' : '-'} ${Math.abs(totalAcc)}d6`
        if (Math.abs(totalAcc) > 1)
          str += ' <span class="caption subtle--text">(take highest)</span>'
      }
      str += '</div></div>'
      return str
    },
  },
  methods: {
    roll(): void {
      const roll = DiceRoller.rollToHit(this.mech.AttackBonus, this.accuracy, this.difficulty)
      this.rollResultString = `${roll.rawDieRoll}+${roll.staticBonus}${
        roll.accuracyResult
      } [${roll.rawAccuracyRolls.join(', ')}]`
      this.attackRoll = roll.total
    },
    confirm(): void {
      this.dialog = false
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
    },
  },
})
</script>
