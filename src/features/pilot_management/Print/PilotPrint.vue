<template>
  <div class="text-black pa-2">
    <v-row dense align="start">
      <v-col cols="auto" class="mr-4">
        <div class="text-caption text-grey mb-n3">CALLSIGN</div>
        <div class="heading h2 my-n2">
          {{ pilot.Callsign }}
        </div>
        <div class="my-n2">
          <div class="text-caption">
            {{ pilot.Name }}, LL<b>{{ pilot.Level }}</b>
          </div>
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-row justify="space-between" class="text-center">
          <v-col cols="auto">
            <div class="text-caption mb-n2">HP</div>
            <div>
              <v-icon size="50" color="grey lighten-3">mdi-hexagon-outline</v-icon>
              <b class="flavor-text pt-3 text-black" v-text="`/${pilot.MaxHP}`" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">ARMOR</div>
            <div class="heading p-stat" v-text="pilot.Armor" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">E-DEF</div>
            <div class="heading p-stat" v-text="pilot.EDefense" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">EVASION</div>
            <div class="heading p-stat" v-text="pilot.Evasion" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">SPEED</div>
            <div class="heading p-stat" v-text="pilot.Speed" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" class="text-right ml-4">
        <div class="text-caption mr-9">GRIT</div>
        <div class="heading mt-n5" style="font-size: 65px; line-height: 60px">
          +{{ pilot.Grit }}
        </div>
      </v-col>
    </v-row>

    <v-row dense justify="space-between" class="mt-n4">
      <v-col>
        <div class="text-caption text-grey">SKILL TRIGGERS</div>
        <div class="text-left">
          <v-chip
            v-for="s in pilot.SkillsController.Skills"
            label
            variant="outlined"
            size="small"
            class="mx-1"
          >
            <span class="stat-text ml-n1 mr-1"> +{{ s.Bonus }} </span>
            <span>{{ s.Skill.Trigger }}</span>
          </v-chip>
        </div>
      </v-col>
      <v-col cols="4">
        <v-row class="mt-0 text-right">
          <v-col>
            <div class="font-weight-bold caption">HULL</div>
            <div class="heading h2 mt-n2" v-html="pilot.MechSkillsController.MechSkills.Hull" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">AGI</div>
            <div class="heading h2 mt-n2" v-html="pilot.MechSkillsController.MechSkills.Agi" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">SYS</div>
            <div class="heading h2 mt-n2" v-html="pilot.MechSkillsController.MechSkills.Sys" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">ENG</div>
            <div class="heading h2 mt-n2" v-html="pilot.MechSkillsController.MechSkills.Eng" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div class="text-caption mb-n2 mt-n2 text-grey">TALENTS</div>
    <v-row
      v-for="t in pilot.TalentsController.Talents"
      dense
      justify="space-between"
      class="mt-n1 caption"
      style="position: relative; page-break-inside: avoid"
    >
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ t.Talent.Name }}</legend>
          <v-row v-for="n in t.Rank" align="center" dense>
            <v-col cols="auto" class="mr-2">
              <v-icon :icon="`cc:rank_${n}`" color="grey-darken-2" class="mb-1" />
            </v-col>
            <v-col>
              <div v-html-safe="t.Talent.Ranks[n - 1].Description" />
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <div v-if="pilot.CoreBonusController.CoreBonuses.length" class="text-caption mb-n2 text-grey">
      CORE BONUSES
    </div>
    <v-row
      v-for="b in pilot.CoreBonusController.CoreBonuses"
      dense
      justify="space-between"
      class="mt-n1 caption"
    >
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ b.Name }}</legend>
          <div v-html-safe="b.Effect" />
        </fieldset>
      </v-col>
    </v-row>

    <div class="text-caption mb-n2 mt-n1 text-grey">PILOT LOADOUT</div>
    <v-row dense justify="space-between" class="mt-n1 caption">
      <v-col
        v-for="a in pilot.Loadout.Armor.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset v-if="a">
          <legend class="heading ml-1 px-1">
            {{ a.Name }}
            <span class="text-caption flavor-text">//ARMOR</span>
          </legend>
          <v-row dense justify="space-around">
            <v-col cols="auto">
              <span v-text="`+${a.Armor(pilot) || 0} Armor`" />
            </v-col>
            <v-col cols="auto">
              <span v-text="`E-Def: ${a.EDefense(pilot) || 'N/A'} `" />
            </v-col>
            <v-col cols="auto">
              <span v-text="`Evasion: ${a.Evasion(pilot) || 'N/A'}`" />
            </v-col>
            <v-col cols="auto">
              <span v-text="`${a.HPBonus(pilot) ? `HP Bonus: +${a.HPBonus(pilot)}` : ''}`" />
            </v-col>
            <v-col cols="auto">
              <span v-text="`${a.Speed(pilot) ? `Speed: ${a.Speed(pilot)}` : ''}`" />
            </v-col>
          </v-row>
          <v-card v-for="act in a.Actions" variant="outlined" class="pa-1 mt-1 mb-3"
            ><b>{{ act.Name }}</b
            >: {{ act.Detail }}</v-card
          >
          <div class="text-right" style="position: absolute; bottom: 10px; right: 5px">
            <v-chip
              v-for="t in a.Tags"
              size="x-small"
              label
              variant="outlined"
              class="mx-1 bg-white"
            >
              {{ t.Name }}
            </v-chip>
          </div>
        </fieldset>
      </v-col>
      <v-col
        v-for="w in pilot.Loadout.Weapons.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset v-if="w">
          <legend class="heading ml-1 px-1">
            {{ w.Name }}
            <span class="text-caption flavor-text">//WEAPON</span>
          </legend>
          <div>
            <b v-for="r in w.Range">{{ r.Text }}</b>
            |
            <b v-for="d in w.Damage">{{ d.Text }}</b>
            <div v-if="w.Effect" v-html-safe="w.Effect" class="mb-5" />
            <v-card v-for="act in w.Actions" variant="outlined" class="pa-1 mt-1 mb-3"
              ><b>{{ act.Name }}</b
              >: {{ act.Detail }}</v-card
            >
            <div class="text-right" style="position: absolute; bottom: 10px; right: 5px">
              <v-chip
                v-for="t in w.Tags"
                size="x-small"
                label
                variant="outlined"
                class="mx-1 bh-white"
              >
                {{ t.Name }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <v-row dense justify="space-between" class="mt-n1 caption">
      <v-col
        v-for="g in pilot.Loadout.Gear.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset v-if="g">
          <legend class="heading ml-1 px-1">
            {{ g.Name }}
            <span class="text-caption flavor-text">//GEAR</span>
          </legend>
          <div class="pb-1">
            <div v-if="g.Description" v-html-safe="g.Description" class="mb-5" />
            <v-card
              v-for="act in g.Actions"
              v-show="act.Detail"
              variant="outlined"
              class="pa-1 mt-1 mb-3"
              ><b>{{ act.Name }}</b
              >: {{ act.Detail }}</v-card
            >
            <div class="text-right" style="position: absolute; bottom: 10px; right: 5px">
              <v-chip
                v-for="t in g.Tags"
                size="x-small"
                label
                variant="outlined"
                class="mx-1 bg-white"
              >
                {{ t.Name }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'pilot-print',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}

.icon-overlap {
  position: absolute;
  top: -2px;
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
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
