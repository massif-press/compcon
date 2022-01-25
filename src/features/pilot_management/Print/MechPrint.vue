<template>
  <v-container fluid>
    <v-row dense align="top">
      <v-col cols="auto">
        <div class="overline my-n2 grey--text">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>
        <div class="heading h2 mt-n4 font-weight-bolder">{{ mech.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-center caption">
        <div class="overline mt-n2">OVERCHARGE</div>
        <span class="mx-1 oc-border">
          &nbsp;+1
          <v-icon small class="ml-n1">mdi-fire</v-icon>
        </span>
        <span class="mx-1 oc-border">
          &nbsp;+1d3
          <v-icon small class="ml-n1">mdi-fire</v-icon>
        </span>
        <span class="mx-1 oc-border">
          &nbsp;+1d6
          <v-icon small class="ml-n1">mdi-fire</v-icon>
        </span>
        <span class="mx-1 oc-border">
          &nbsp;+1d6+4
          <v-icon small class="ml-n1">mdi-fire</v-icon>
        </span>
      </v-col>
    </v-row>

    <v-row dense align="center" justify="space-around" class="mt-n5 mb-1">
      <v-col cols="auto">
        <span class="font-weight-bold overline pr-3">HULL</span>
        <div class="ml-4 mt-n3" style="position: relative; width: max-content">
          <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
          <div class="heading h2 icon-overlap" v-html="mech.Hull" />
        </div>
      </v-col>
      <v-col cols="auto">
        <span class="font-weight-bold overline pr-3">AGI</span>
        <div class="ml-4 mt-n3" style="position: relative; width: max-content">
          <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
          <div class="heading h2 icon-overlap" v-html="mech.Agi" />
        </div>
      </v-col>
      <v-col cols="auto">
        <span class="font-weight-bold overline pr-3">SYS</span>
        <div class="ml-4 mt-n3" style="position: relative; width: max-content">
          <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
          <div class="heading h2 icon-overlap" v-html="mech.Sys" />
        </div>
      </v-col>
      <v-col cols="auto">
        <span class="font-weight-bold overline pr-3">ENG</span>
        <div class="ml-4 mt-n3" style="position: relative; width: max-content">
          <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
          <div class="heading h2 icon-overlap" v-html="mech.Eng" />
        </div>
      </v-col>
      <v-col cols="auto" class="mt-4 ml-4">
        <v-icon size="40">{{ mech.SizeIcon }}</v-icon>
      </v-col>
      <v-col>
        <v-divider vertical />
      </v-col>
      <v-col class="text-center">
        <div class="overline" style="line-height: 30px">CORE POWER</div>
        <v-icon size="30" color="grey lighten-2" class="mr-n1 mt-n3">mdi-battery-outline</v-icon>
        <div class="d-inline-block flavor-text font-weight-bold mb-n2">/1</div>
      </v-col>
      <v-col class="text-center">
        <div class="overline" style="line-height: 30px">REPAIR CAPACITY</div>
        <v-icon size="30" color="grey lighten-2" class="mr-n1 mt-n3">cci-repair</v-icon>
        <div
          class="d-inline-block flavor-text font-weight-bold mb-n2"
          v-html="`/${mech.RepairCapacity}`"
        />
      </v-col>
    </v-row>

    <v-row dense justify="space-between" align="start" class="mt-n4">
      <v-col class="text-center">
        <div style="line-height: 0" class="overline mb-4">STRUCTURE</div>
        <div>
          <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">cci-structure</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-html="`/${mech.MaxStructure}`"
          />
        </div>
      </v-col>
      <v-col cols="auto">
        <v-row dense no-gutters justify="center">
          <v-col cols="auto" class="text-center">
            <div style="line-height: 0" class="overline mb-4 mr-6">HP</div>
            <div>
              <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">
                mdi-hexagon-outline
              </v-icon>
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-html="`/${mech.MaxHP}`"
              />
            </div>
          </v-col>
          <v-col v-if="mech.Armor" cols="auto" class="text-center mb-1" align-self="end">
            <div style="line-height: 0" class="overline mb-4 ml-2">ARMOR</div>
            <div class="heading h2 mt-n4 mr-n2">
              <v-icon class="mt-n1 mr-n1">mdi-shield</v-icon>
              {{ mech.Armor }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer />
      <v-col class="text-center">
        <div style="line-height: 0" class="overline mb-4 mr-2">STRESS</div>
        <div>
          <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">cci-reactor</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-html="`/${mech.MaxStress}`"
          />
        </div>
      </v-col>
      <v-col class="text-center">
        <div style="line-height: 0" class="overline mb-4 mr-6">HEAT</div>
        <div>
          <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">mdi-fire</v-icon>
          <b
            class="d-inline-block flavor-text font-weight-bold mb-n2"
            v-html="`/${mech.HeatCapacity}`"
          />
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">ATK</legend>
          <div class="heading h2 text-center mt-n2">{{ signed(mech.AttackBonus) }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">TECH ATK</legend>
          <div class="heading h2 text-center mt-n2">{{ signed(mech.TechAttack) }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">SAVE</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.SaveTarget }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">SPEED</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.Speed }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">E-DEF</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.EDefense }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">EVASION</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.Evasion }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">SENSORS</legend>
          <div class="heading h2 text-center mt-n2">{{ mech.SensorRange }}</div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset>
          <legend class="caption font-weight-bold px-1">LTD SYS</legend>
          <div class="heading h2 text-center mt-n2">{{ signed(mech.LimitedBonus) }}</div>
        </fieldset>
      </v-col>
    </v-row>

    <div class="overline mb-n2">FRAME TRAITS</div>
    <v-row dense justify="space-between" class="caption mt-n1">
      <v-col v-for="(t, i) in mech.Frame.Traits" :key="`mt_${i}`" class="mt-n1">
        <fieldset>
          <legend class="heading ml-1 px-2">{{ t.Name }}</legend>
          <p v-html-safe="t.Description" class="ml-6 mb-0" />
        </fieldset>
      </v-col>
    </v-row>

    <div class="overline mb-n3">CORE SYSTEM</div>
    <fieldset class="mt-n2">
      <legend class="heading h3 ml-1 px-2">{{ mech.Frame.CoreSystem.Name }}</legend>
      <div v-if="mech.Frame.CoreSystem.PassiveEffect">
        <span class="heading ml-4">
          {{
            mech.Frame.CoreSystem.PassiveName
              ? `${mech.Frame.CoreSystem.PassiveName} (PASSIVE)`
              : 'CORE PASSIVE'
          }}
        </span>
        <br />
        <p v-html-safe="mech.Frame.CoreSystem.PassiveEffect" class="caption ml-6 mb-1" />
      </div>
      <div v-if="mech.Frame.CoreSystem.PassiveEffect" class="heading ml-4">
        {{
          mech.Frame.CoreSystem.ActiveName
            ? `${mech.Frame.CoreSystem.ActiveName} (ACTIVE)`
            : 'CORE ACTIVE'
        }}
      </div>
      <p v-html-safe="mech.Frame.CoreSystem.ActiveEffect" class="caption ml-6 mb-1" />
      <div v-if="mech.Frame.CoreSystem.Tag" class="text-right">
        <span v-for="(t, i) in mech.Frame.CoreSystem.Tags" :key="`mcst_${i}`" class="mx-1">
          {{ t.Name() }}
        </span>
      </div>
    </fieldset>

    <v-row dense class="mb-n3">
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

    <fieldset
      v-for="(m, i) in mounts"
      :key="`mmt_${i}`"
      style="position: relative; page-break-inside: avoid"
    >
      <legend class="heading ml-1 px-2 mb-n2">{{ m.Name }}</legend>
      <div v-if="m.IsLocked" class="text-center flavor-text">
        MOUNT LOCKED
        <br />
        <span class="overline">// SUPERHEAVY WEAPON BRACING //</span>
      </div>
      <div v-for="(w, j) in m.Weapons" v-else :key="`mmtw_${i}_${j}`" class="px-1">
        <v-row no-gutters class="stat-text">
          {{ w.Name }}
          <div class="d-inline-block overline ml-2 my-n1">
            {{ w.Source }} {{ w.Size }} {{ w.WeaponType }}
          </div>
          <v-spacer />
          <span v-if="w.Uses">
            <v-icon
              v-for="n in w.getTotalUses(mech.Pilot.LimitedBonus)"
              :key="`use_${w.ID}_${n}`"
              small
            >
              mdi-hexagon-outline
            </v-icon>
          </span>
        </v-row>
        <div v-for="p in w.Profiles" :key="`${w.ID}_${p.Name}`">
          <div class="caption">
            <b v-for="(r, k) in p.Range" :key="`mmwr_${i}_${j}_${k}`">{{ r.Text }}&nbsp;</b>
            <span v-if="p.Damage && p.Damage.length">|</span>
            <b v-for="(d, k) in p.Damage" :key="`mmwd_${i}_${j}_${k}`">{{ d.Text }}&nbsp;</b>
            <p v-if="p.Effect" :v-html-safe="p.Effect" print />
            <p v-if="p.OnAttack" :v-html-safe="`<b>ON ATTACK:</b> ${p.OnAttack}`" print />
            <p v-if="p.OnHit" :v-html-safe="`<b>ON HIT:</b> ${p.OnHit}`" print />
            <p v-if="p.OnCrit" :v-html-safe="`<b>ON CRIT:</b> ${p.OnCrit}`" print />
            <print-action :actions="p.Actions" />
            <print-deployable :deployables="p.Deployables" />
          </div>
          <div class="text-right" style="position: absolute; bottom: 0; left: 0; right: 0">
            <cc-tags :tags="p.Tags" :bonus="mech.Pilot.LimitedBonus" print />
          </div>
        </div>
        <div v-if="w.Mod" class="px-2">
          <span class="heading">
            {{ w.Mod.Name }}
          </span>
          <span class="overline">&nbsp;//APPLIED MOD</span>
          <br />
          <p v-if="w.Mod.Effect" :v-html="w.Mod.Effect" print />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend class="heading ml-1 px-2">Systems</legend>
      <div v-for="(s, i) in mech.ActiveLoadout.Systems" :key="`mms_${i}`" class="bordered-block">
        <v-row no-gutters class="stat-text mt-n1">
          {{ s.Name }}
          <div class="d-inline-block overline ml-2 my-n1">{{ s.Source }} {{ s.Type }}</div>
          <v-spacer />
          <span v-if="s.Uses">
            <v-icon
              v-for="n in s.getTotalUses(mech.Pilot.LimitedBonus)"
              :key="`use_${s.ID}_${n}`"
              small
            >
              mdi-hexagon-outline
            </v-icon>
          </span>
        </v-row>
        <p v-if="s.Effect" class="caption mb-n1" v-html="s.Effect" />
        <print-action :actions="s.Actions" />
        <print-deployable :deployables="s.Deployables" />
        <div class="text-right" style="position: absolute; bottom: 0; left: 0; right: 0">
          <cc-tags :tags="s.Tags" :bonus="mech.Pilot.LimitedBonus" print />
        </div>
      </div>
    </fieldset>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PrintAction from './components/PrintAction.vue'
import PrintDeployable from './components/PrintDeployable.vue'

export default Vue.extend({
  name: 'mech-print',
  components: { PrintAction, PrintDeployable },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mounts() {
      return this.mech.ActiveLoadout.AllMounts(
        this.mech.Pilot.has('corebonus', 'cb_improved_armament'),
        this.mech.Pilot.has('corebonus', 'cb_integrated_weapon')
      )
    },
  },
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`
    },
  },
})
</script>

<style scoped>
.caption {
  font-size: 14px;
}

.icon-overlap {
  position: absolute;
  top: 1.5px;
  left: 1px;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available;
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
  margin-top: 4px;
  margin-bottom: 4px;
  display: block;
  page-break-inside: avoid !important;
}
</style>
