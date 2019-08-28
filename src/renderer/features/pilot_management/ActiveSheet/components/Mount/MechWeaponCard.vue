<template>
  <v-col :style="`width: ${width}%`">
    <v-card
      color="#595959"
      dark
      class="ma-1"
      height="100%"
      :class="weapon.IsDestroyed ? 'destroyed-bg' : ''"
    >
      <v-tooltip left v-if="weapon.IsDestroyed">
        <v-btn
          slot="activator"
          fab
          small
          absolute
          bottom
          right
          style="bottom: 0; right:0"
          @click="weapon.Repair()"
        >
          <v-icon size="25" color="success">mdi-checkbox-blank</v-icon>
        </v-btn>
        <span>Repair Equipment</span>
      </v-tooltip>
      <v-tooltip left v-else>
        <v-btn
          slot="activator"
          fab
          small
          absolute
          bottom
          right
          icon
          style="bottom: 0; right:0"
          @click="weapon.Destroy()"
        >
          <v-icon size="25" color="warning" class="hover-opacity">mdi-image-broken-variant</v-icon>
        </v-btn>
        <span>Mark equipment as Destroyed</span>
      </v-tooltip>
      <v-card-title
        class="pa-0 minor-title"
        :style="`background-color: ${weapon.IsDestroyed ? '#1e1e1e' : color.mechweapon.dark}`"
      >
        <span v-if="weapon.IsDestroyed" class="ml-2 red--text">
          <i style="text-decoration: line-through">{{ weapon.Name }}</i>
          (DESTROYED)
        </span>
        <span v-else class="ml-2">{{ weapon.Name }}</span>
        <span v-if="weapon.Mod">
          <span class="pink--text text--lighten-2">&nbsp;//</span>
          <span v-if="weapon.Mod.IsDestroyed" class="red--text">
            <i style="text-decoration: line-through">{{ weapon.Mod.Name }}</i>
            (DESTROYED)
          </span>
          <span v-else class="pink--text text--lighten-4">{{ weapon.Mod.Name }}</span>
        </span>
        <v-spacer />
        <span class="caption">{{ weapon.Source }} {{ weapon.Size }} {{ weapon.Type }}&nbsp;</span>
      </v-card-title>
      <v-card-text class="pa-1">
        <v-row justify-start>
          <v-col shrink class="ml-1">
            <damage-element dark :dmg="getDamage()" />
          </v-col>
          <v-col shrink class="ml-3 pt-1">
            <range-element dark :range="getRange()" />
          </v-col>
        </v-row>
        <weapon-mod-card v-if="weapon.Mod" :mod="weapon.Mod" :limited-bonus="pilot.LimitedBonus" />
        <p class="pa-0 ml-3 mr-3 mb-0" v-html="weapon.Effect" />

        <v-row>
          <item-tag
            v-for="(t, index) in weapon.Tags"
            :key="t.id + index"
            :tagObj="t"
            :pilot="pilot"
          />
          <div v-if="weapon.Mod && weapon.Mod.AddedTags" style="display: inline-flex;">
            <item-tag v-for="t in weapon.Mod.AddedTags" :key="t.id" :tagObj="t" :pilot="pilot" />
          </div>
        </v-row>
        <v-row>
          <v-col v-if="weapon.IsLimited">
            <v-row>
              <v-col xs1>
                <v-divider class="mt-2 mr-3" />
              </v-col>
              <v-col shrink>
                <span class="caption grey--text">USES&nbsp;</span>
                <b class="warning--text">
                  {{ weapon.Uses }} / {{ weapon.MaxUses + pilot.LimitedBonus }}
                </b>
              </v-col>
              <v-col grow>
                <v-divider class="mt-2 ml-3" />
              </v-col>
            </v-row>
            <v-row justify-start>
              <limited-bar
                :key="weapon.Name + '_tb_' + weapon.Uses"
                :current="weapon.Uses"
                :max="weapon.MaxUses + pilot.LimitedBonus"
                large
                color="warning"
                bg-color="grey darken-1"
                empty-icon="mdi-hexagon-outline"
                full-icon="mdi-hexagon"
                @update="weapon.Uses = $event"
              />
            </v-row>
          </v-col>
          <v-col v-if="weapon.IsLoading">
            <v-row>
              <v-col xs1>
                <v-divider class="mt-2 mr-3" />
              </v-col>
              <v-col shrink>
                <span class="caption grey--text">LOADED&nbsp;</span>
              </v-col>
              <v-col grow>
                <v-divider class="mt-2 ml-3" />
              </v-col>
            </v-row>
            <v-row justify-start>
              <v-switch
                v-model="weapon.Loaded"
                class="ma-0 pa-0 ml-2"
                color="warning"
                :label="`${weapon.Loaded ? 'Loaded' : 'Not Loaded'}`"
              ></v-switch>
            </v-row>
          </v-col>
        </v-row>
        <div v-if="weapon.Notes.length">
          <v-row>
            <v-col xs1>
              <v-divider class="mt-2 mr-3" />
            </v-col>
            <v-col shrink>
              <span class="caption grey--text">NOTES</span>
            </v-col>
            <v-col grow>
              <v-divider class="mt-2 ml-3" />
            </v-col>
            <v-col xs1></v-col>
          </v-row>
          <ul>
            <li v-for="(n, idx) in weapon.Notes" :key="`${weapon.Name}_note_${idx}`">{{ n }}</li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import colors from '@/features/_shared/UI/CCColors'
import WeaponModCard from './WeaponModCard.vue'
import { Pilot, RangeType, DamageType, Range, Mech, MechLoadout, WeaponType } from '@/class'
import {
  DamageElement,
  RangeElement,
  LimitedBar,
  ItemTag,
} from '@/features/pilot_management/components/UI'

export default Vue.extend({
  name: 'mech-weapon-card',
  components: {
    DamageElement,
    RangeElement,
    LimitedBar,
    ItemTag,
    WeaponModCard,
  },
  props: {
    weapon: Object,
    width: Number,
  },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
    mech(): Mech {
      return this.pilot.ActiveMech
    },
    loadout(): MechLoadout {
      return this.mech.ActiveLoadout || this.mech.Loadouts[0]
    },
    color(): any {
      return colors
    },
  },
  methods: {
    getRange(): Range[] {
      const w = this.weapon
      let bonuses = [] as { type: RangeType; val: number }[]
      if (w.Mod && w.Mod.AddedRange)
        bonuses.push({
          type: RangeType.Range,
          val: w.Mod.AddedRange,
        })
      if (this.pilot.has('CoreBonus', 'neurolinked'))
        bonuses.push({
          type: RangeType.Range,
          val: 3,
        })
      if (this.pilot.has('CoreBonus', 'gyges') && w.Type === WeaponType.Melee)
        bonuses.push({
          type: RangeType.Threat,
          val: 1,
        })
      if (this.loadout.HasSystem('externalbatteries') && w.Damage[0].Type === DamageType.Energy)
        if (w.Type === WeaponType.Melee) {
          bonuses.push({
            type: RangeType.Threat,
            val: 1,
          })
        } else {
          bonuses.push({
            type: RangeType.Range,
            val: 5,
          })
        }
      return Range.AddBonuses(w.Range, bonuses)
    },
    getDamage() {
      if (this.weapon.Damage && this.mod && this.mod.AddedDamage)
        return this.weapon.Damage.concat(this.mod.AddedDamage)
      return this.weapon.Damage || null
    },
  },
})
</script>
