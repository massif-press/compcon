<template>
  <v-container fluid>
    <v-row dense align="center">
      <v-col cols="auto">
        <div class="overline no-height">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>
        <div class="heading h1 mt-n5">{{ mech.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-center">
        <div class="caption">OVERCHARGE</div>
        <span class="grey lighten-3 mx-2 oc-border">
          +1
          <v-icon small>mdi-fire</v-icon>
        </span>
        <span class="grey lighten-3 mx-2 oc-border">
          +1d3
          <v-icon small>mdi-fire</v-icon>
        </span>
        <span class="grey lighten-3 mx-2 oc-border">
          +1d6
          <v-icon small>mdi-fire</v-icon>
        </span>
        <span class="grey lighten-3 mx-2 oc-border">
          +1d6+4
          <v-icon small>mdi-fire</v-icon>
        </span>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-col cols="1" class="mr-n2">
        <v-row dense justify="space-around" class="mt-n1 pl-3">
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">HULL</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Hull" />
            </div>
          </v-col>
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">AGI</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Agi" />
            </div>
          </v-col>
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">SYS</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Sys" />
            </div>
          </v-col>
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">ENG</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Eng" />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="mt-n5 ml-n8">
        <v-row dense justify="space-between" align="start">
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2">STRUCTURE</div>
            <div>
              <v-icon size="60" color="grey lighten-4" class="mr-n1">cci-structure</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.MaxStructure}`" />
            </div>
          </v-col>
          <v-col cols="2">
            <v-row dense no-gutters justify="center">
              <v-col cols="auto">
                <div class="overline no-height mb-n2 ml-2">ARMOR</div>
                <div style="position: relative; width: max-content;">
                  <v-icon size="60" color="grey lighten-4" class="mr-n1">mdi-shield-outline</v-icon>
                  <div class="heading p-stat icon-overlap" v-html="mech.Armor" />
                </div>
              </v-col>
              <v-col cols="auto" class="text-center">
                <div class="overline no-height mb-n2 mr-6">HP</div>
                <div>
                  <v-icon size="60" color="grey lighten-4" class="mr-n1">
                    mdi-hexagon-outline
                  </v-icon>
                  <b class="flavor-text pt-3" v-html="`/${mech.MaxHP}`" />
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2 mr-2">REACTOR</div>
            <div>
              <v-icon size="60" color="grey lighten-4" class="mr-n1">cci-reactor</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.MaxStress}`" />
            </div>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2 mr-6">HEAT</div>
            <div>
              <v-icon size="50" color="grey lighten-4" class="mr-n1 mt-1">mdi-fire</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.HeatCapacity}`" />
            </div>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2">REPAIR CAPACITY</div>
            <div>
              <v-icon size="60" color="grey lighten-4" class="mr-n1">cci-repair</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.RepairCapacity}`" />
            </div>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2">CORE POWER</div>
            <v-icon size="50" color="grey lighten-4" class="mr-n1 mt-1">mdi-battery-outline</v-icon>
          </v-col>
        </v-row>
        <v-row dense class="mx-6">
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">ATK BONUS</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ signed(mech.AttackBonus) }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">TECH ATK</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ signed(mech.TechAttack) }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">SAVE</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.SaveTarget }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">SPEED</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.Speed }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">E-DEFENSE</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.EDefense }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">EVASION</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.Evasion }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">LTD SYS</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ signed(mech.LimitedBonus) }}</div>
            </fieldset>
          </v-col>
          <v-col cols="auto">
            <v-icon size="60">cci-size-{{ mech.size === 0.5 ? 'half' : mech.Size }}</v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <span class="overline">FRAME TRAITS</span>
    <v-row dense justify="space-between" class="caption mt-n1">
      <v-col v-for="(t, i) in mech.Frame.Traits" :key="`mt_${i}`" class="mt-n1">
        <fieldset>
          <legend class="heading ml-1 px-2">{{ t.name }}</legend>
          <p class="ml-6" v-html="t.description" />
        </fieldset>
      </v-col>
    </v-row>

    <span class="overline">CORE SYSTEM</span>
    <fieldset class="mt-n2">
      <legend class="heading h3 ml-1 px-2">{{ mech.Frame.CoreSystem.Name }}</legend>
      <div v-if="mech.Frame.CoreSystem.Passive">
        <span class="heading ml-4">CORE PASSIVE</span>
        <br />
        <span class="caption ml-6" v-html="mech.Frame.CoreSystem.Passive" />
      </div>
      <span class="caption ml-6" v-html="mech.Frame.CoreSystem.Effect" />
      <div v-if="mech.Frame.CoreSystem.Tag" class="text-right">
        <span v-for="(t, i) in mech.Frame.CoreSystem.Tags" :key="`mcst_${i}`" class="mx-1">
          {{ t.Name() }}
        </span>
      </div>
    </fieldset>

    <v-row dense>
      <v-col cols="1">
        <v-divider class="mt-3" />
      </v-col>
      <v-col cols="auto">
        <span class="heading h3">
          {{ mech.ActiveLoadout.Name }}
          <span class="overline">//LOADOUT</span>
        </span>
      </v-col>
      <v-col>
        <v-divider class="mt-3" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="(m, i) in mounts" :key="`mmt_${i}`" :cols="getMountCols(i)">
        <fieldset class="mt-n2 pb-1" style="position: relative">
          <legend class="heading ml-1 px-2">{{ m.Name }}</legend>
          <div v-if="m.isLocked" class="text-center flavor-text">
            MOUNT LOCKED
            <br />
            <span class="overline">// SUPERHEAVY WEAPON BRACING //</span>
          </div>
          <div v-for="(w, j) in m.Weapons" v-else :key="`mmtw_${i}_${j}`" class="px-1">
            <span class="stat-text">
              {{ w.Name }}
              <span class="overline">{{ w.Source }} {{ w.Size }} {{ w.Type }}</span>
            </span>
            <div class="caption">
              <b v-for="(r, k) in w.Range" :key="`mmwr_${i}_${j}_${k}`">{{ r.Text }}&nbsp;</b>
              |
              <b v-for="(d, k) in w.Damage" :key="`mmwd_${i}_${j}_${k}`">{{ d.Text }}&nbsp;</b>
              <p v-if="w.Effect" v-html="w.Effect" />
              <p v-if="w.Mod" class="px-2">
                <span class="heading">
                  {{ w.Mod.Name }}
                </span>
                <span class="overline">&nbsp;//APPLIED MOD</span>
                <br />
                <span v-html="w.Mod.Effect" />
              </p>
              <div class="text-right" style="position: absolute; bottom: 3px; left: 0; right: 0;">
                <v-chip
                  v-for="(t, k) in w.Tags"
                  :key="`mmwt_${i}_${j}_${k}`"
                  outlined
                  x-small
                  label
                  class="mx-1"
                >
                  {{ t.GetName(mech.LimitedBonus) }}
                </v-chip>
              </div>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>

    <fieldset class="mt-n2 pb-1">
      <legend class="heading ml-1 px-2">Systems</legend>
      <v-row dense>
        <v-col v-for="(s, i) in mech.ActiveLoadout.Systems" :key="`mms_${i}`" :cols="getSysCols(i)">
          <div class="bordered-block">
            <span class="stat-text">
              {{ s.Name }}
              <span class="overline">{{ s.Source }} {{ s.Type }}</span>
            </span>
            <div v-if="s.Effect" class="caption" v-html="s.Effect" />
            <div class="text-right" style="position: absolute; bottom: 0; left: 0; right: 0;">
              <v-chip
                v-for="(t, j) in s.Tags"
                :key="`mmst_${i}_${j}`"
                outlined
                x-small
                label
                class="mx-1"
              >
                {{ t.GetName(mech.LimitedBonus) }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>
    </fieldset>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mech-print',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mounts() {
      return this.mech.ActiveLoadout.AllMounts(
        this.mech.Pilot.has('corebonus', 'imparm'),
        this.mech.Pilot.has('corebonus', 'intweapon')
      )
    },
  },
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`
    },
    getMountCols(col: number) {
      if (this.mounts.length <= 3) return 12 / this.mounts.length
      if (this.mounts.length < 3 && this.mounts.length % 2 === 0) return 6
      if (col <= 3) return 4
      return 6
    },
    getSysCols(idx: number) {
      const systems = this.mech.ActiveLoadout.Systems
      if (systems.length % 3 === 0) return 4
      if (systems.length % 2 === 0) {
        if (systems.length - idx > 2) return 4
        return 6
      }
      if (idx < 3) return 4
      return 6
    },
  },
})
</script>

<style scoped>
.caption {
  font-size: 14px;
}

.no-height {
  line-height: 0;
}

.icon-overlap {
  position: absolute;
  top: -1px;
  left: 1px;
  width: -webkit-fill-available;
  text-align: center;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: var(--v-grey-lighten2);
}

.oc-border {
  border: 1px solid;
  border-color: darkgrey;
  border-radius: 2px;
}

.bordered-block {
  border: 1px solid grey;
  border-radius: 2px;
  padding: 4px;
  height: 100%;
  position: relative;
  padding-bottom: 12px;
}
</style>
