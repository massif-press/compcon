<template>
  <v-container fluid  >
    <v-row dense align="start">
      <v-col cols="auto" class="mr-4">
        <div class="overline mt-n2 mb-n4">CALLSIGN</div>
        <div class="heading h2 my-n2">
          {{ pilot.Callsign }}
        </div>
        <div class="my-n2">
          <div>{{ pilot.Name }}, LL {{ pilot.Level }}</div>
          <div v-if="pilot.Background" class="caption my-n1 grey--text">{{ pilot.Background }}</div>
        </div>
      </v-col>
      <v-col class="ml-auto mr-auto">
        <v-row dense justify="space-between">
          <v-col cols="auto">
            <div class="overline mt-n2 mb-n3">HP</div>
            <div>
              <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
              <b class="flavor-text pt-3" v-html="`/${pilot.MaxHP}`" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="overline mt-n2 mb-n3 ml-n7">ARMOR</div>
            <div style="position: relative; width: max-content;">
              <v-icon size="50" color="grey lighten-3">mdi-shield-outline</v-icon>
              <div class="heading p-stat icon-overlap" v-html="pilot.Armor" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="overline mt-n2 mb-n3 ml-n6">E-DEF</div>
            <div style="position: relative; width: max-content;">
              <v-icon size="50" color="grey lighten-3">cci-marker</v-icon>
              <div class="heading p-stat icon-overlap" v-html="pilot.EDefense" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="overline mt-n2 mb-n3 ml-n8">EVASION</div>
            <div style="position: relative; width: max-content;">
              <v-icon size="50" color="grey lighten-3">cci-evasion</v-icon>
              <div class="heading p-stat icon-overlap" v-html="pilot.Evasion" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="overline mt-n2 mb-n3 ml-n6">SPEED</div>
            <div style="position: relative; width: max-content;">
              <v-icon size="50" color="grey lighten-3">$vuetify.icons.move</v-icon>
              <div class="heading p-stat icon-overlap" v-html="pilot.Speed" />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" class="text-right mt-n1 ml-4">
        <div class="overline  mr-9">GRIT</div>
        <div class="heading mt-n5" style="font-size: 65px; line-height: 60px">
          +{{ pilot.Grit }}
        </div>
      </v-col>
    </v-row>

    <v-row dense align="start" justify="space-between">
      <v-col>
        <div class="overline">SKILL TRIGGERS</div>
        <div class="text-left">
          <v-chip
            v-for="(s, i) in pilot.Skills"
            :key="`psk_${i}`"
            label
            outlined
            small
            class="mx-1 mb-1"
          >
            <span style="background-color: var(--v-gray-lighten2)" class="stat-text ml-n2 mr-2">
              +{{ s.Bonus }}
            </span>
            <span>{{ s.Skill.Trigger }}</span>
          </v-chip>
        </div>
      </v-col>
      <v-col cols="4">
        <v-row dense justify="space-between" class="mt-n5 pl-3">
          <v-col>
            <span class="font-weight-bold overline  pr-4">HULL</span>
            <div class="ml-3 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" style="margin-right: -3px!important">
                mdi-hexagon-outline
              </v-icon>
              <div class="heading h2 icon-overlap mt-1" v-html="pilot.MechSkills.Hull" />
            </div>
          </v-col>
          <v-col>
            <span class="font-weight-bold overline  pr-3">AGI</span>
            <div class="ml-3 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" style="margin-right: -3px!important">
                mdi-hexagon-outline
              </v-icon>
              <div class="heading h2 icon-overlap mt-1" v-html="pilot.MechSkills.Agi" />
            </div>
          </v-col>
          <v-col>
            <span class="font-weight-bold overline  pr-3">SYS</span>
            <div class="ml-3 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" style="margin-right: -3px!important">
                mdi-hexagon-outline
              </v-icon>
              <div class="heading h2 icon-overlap mt-1" v-html="pilot.MechSkills.Sys" />
            </div>
          </v-col>
          <v-col>
            <span class="font-weight-bold overline  pr-3">ENG</span>
            <div class="ml-3 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" style="margin-right: -3px!important">
                mdi-hexagon-outline
              </v-icon>
              <div class="heading h2 icon-overlap mt-1" v-html="pilot.MechSkills.Eng" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="pilot.Licenses.length" dense align="start" justify="space-between" class="mt-n2">
      <v-col>
        <div class="overline mb-n2 mt-n1">LICENSES</div>
        <div class="text-left">
          <v-chip v-for="(l, i) in pilot.Licenses" :key="`plr_${i}`" small outlined>
            <v-icon left>cci-rank-{{ l.Rank }}</v-icon>
            <span
              class="flavor-text black--text"
              v-html="
                `${l.License.Source} ${l.License.Name}
            ${'I'.repeat(l.rank)}`
              "
            />
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <div class="overline mb-n3 mt-n1">TALENTS</div>
    <v-row
      v-for="(t, i) in pilot.Talents"
      :key="`pt_${i}`"
      dense
      justify="space-between"
      class="mt-n1 caption"
      style="position: relative; page-break-inside: avoid;"
    >
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ t.Talent.Name }}</legend>
          <v-row v-for="n in t.Rank" :key="`ptr_${i}_${n}`" align="center" dense no-gutters>
            <v-col cols="auto" class="mr-1">
              <v-icon>cci-rank-{{ n }}</v-icon>
            </v-col>
            <v-col>
              <span v-html-safe="t.Talent.Ranks[n - 1].Description" />
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <div v-if="pilot.CoreBonuses.length" class="overline mb-n3 mt-n1">CORE BONUSES</div>
    <v-row
      v-for="(b, i) in pilot.CoreBonuses"
      :key="`pb_${i}`"
      dense
      justify="space-between"
      class="mt-n1 caption"
    >
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ b.Name }}</legend>
          <span v-html-safe="b.Effect" />
        </fieldset>
      </v-col>
    </v-row>

    <div class="overline mb-n3 mt-n1">PILOT LOADOUT</div>
    <v-row dense justify="space-between" class="mt-n1 caption">
      <v-col
        v-for="(a, i) in pilot.Loadout.Armor.filter(x => x)"
        :key="`pla_${i}`"
        style="position: relative; page-break-inside: avoid;"
      >
        <fieldset v-if="a">
          <legend class="heading ml-1 px-2">
            {{ a.Name }}
            <span class="overline flavor-text">//ARMOR</span>
          </legend>
          <div
            class="pa-1 mt-n2"
            v-html="
              `+${a.Armor || 0} Armor / E-Def: ${a.EDefense || 'N/A'} / Evasion: ${a.Evasion ||
                'N/A'}<br>${a.HPBonus ? `HP Bonus: +${a.HPBonus}` : ''}${
                a.Speed ? ` / Speed: ${a.Speed}` : ''
              }`
            "
          />
        </fieldset>
      </v-col>
      <v-col v-for="(w, i) in pilot.Loadout.Weapons.filter(x => x)" :key="`plw_${i}`">
        <fieldset v-if="w">
          <legend class="heading ml-1 px-2">
            {{ w.Name }}
            <span class="overline flavor-text">//WEAPON</span>
          </legend>
          <div class="pa-1 mt-n2">
            <b v-for="(r, j) in w.Range" :key="`plwr_${i}_${j}`">{{ r.Text }}</b>
            |
            <b v-for="(d, j) in w.Damage" :key="`plwd_${i}_${j}`">{{ d.Text }}</b>
            <div v-if="w.Effect" v-html-safe="w.Effect" />
            <div class="text-right">
              <span v-for="(t, j) in i.Tags" :key="`plwt_${i}_${j}`" class="mx-1">
                {{ t.Name() }}
              </span>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <v-row dense justify="space-between" class="mt-n1 caption">
      <v-col v-for="(g, i) in pilot.Loadout.Gear.filter(x => x)" :key="`plg_${i}`">
        <fieldset v-if="g">
          <legend class="heading ml-1 px-2">
            {{ g.Name }}
            <span class="overline flavor-text">//GEAR</span>
          </legend>
          <div class="pa-1 my-n2">
            <div v-if="g.Description" v-html-safe="g.Description" />
            <div class="text-right">
              <span v-for="(t, j) in i.Tags" :key="`plgt_${i}_${j}`" class="mx-1">
                {{ t.Name() }}
              </span>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'pilot-print',
  props: {
    pilot: {
      type: Object,
      required: true,
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
  top: -2px;
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
</style>
