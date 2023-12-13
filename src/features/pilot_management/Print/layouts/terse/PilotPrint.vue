<template>
  <div class="text-black pa-2">
    <v-row dense align="start">
      <v-col class="mr-4" cols="auto">
        <div class="text-caption text-primary mb-n1">CALLSIGN</div>
        <div v-if="blank" style="min-width: 250px">
          <blank-line :height="40" />
        </div>
        <div v-else class="heading h2">
          {{ pilot.Callsign }}
        </div>
        <div v-if="!blank" class="my-n2">
          <div class="text-caption">
            {{ pilot.Name }}, LL<b>{{ pilot.Level }}</b>
          </div>
        </div>
      </v-col>
      <v-col v-if="blank && landscape" cols="auto"
        ><div class="text-caption text-primary mb-n1">NAME</div>
        <blank-line :width="260" :height="40" />
      </v-col>
      <v-col cols="auto ml-auto">
        <v-row justify="space-between" class="text-center">
          <v-col cols="auto" v-if="blank">
            <div class="text-caption mb-n2">HP</div>
            <div>
              <v-icon size="50" color="primary" style="opacity: 0.5">mdi-hexagon-outline</v-icon>
              <b v-if="!blank" class="flavor-text pt-3 text-black" v-text="`/${pilot.MaxHP}`" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">ARMOR</div>
            <v-icon v-if="blank" size="50" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.Armor" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">E-DEF</div>
            <v-icon v-if="blank" size="50" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.EDefense" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">EVASION</div>
            <v-icon v-if="blank" size="50" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.Evasion" />
          </v-col>
          <v-col cols="auto">
            <div class="text-caption mb-n4">SPEED</div>
            <v-icon v-if="blank" size="50" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.Speed" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" class="text-right ml-4">
        <div class="text-caption mr-9">GRIT</div>
        <v-icon v-if="blank" size="50" color="primary" style="opacity: 0.5" class="mt-n2 mr-4"
          >mdi-hexagon-outline</v-icon
        >
        <div v-else class="heading mt-n5" style="font-size: 65px; line-height: 60px">
          +{{ pilot.Grit }}
        </div>
      </v-col>
    </v-row>

    <v-row dense justify="space-between" class="mt-n3">
      <v-col>
        <div class="text-caption text-primary">SKILL TRIGGERS</div>
        <div class="text-left">
          <v-row dense v-if="blank" class="mt-n2">
            <v-col v-for="n in 6" cols="6">
              <v-row dense align="center">
                <v-col cols="9"> <blank-line :height="24" inline /></v-col
                ><v-col cols="auto" class="heading h3 mr-n1 mt-n1">+</v-col
                ><v-col cols="2"><blank-line :height="24" inline /> </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-chip
            v-else
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
        <v-row class="mt-0 text-right mt-n2 pr-2">
          <v-col>
            <div class="font-weight-bold caption">HULL</div>
            <v-icon v-if="blank" size="30" color="primary" style="opacity: 0.5" class="mt-n1"
              >mdi-hexagon-outline</v-icon
            >
            <div
              v-else
              class="heading h2 mt-n2"
              v-html="pilot.MechSkillsController.MechSkills.Hull"
            />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">AGI</div>
            <v-icon v-if="blank" size="30" color="primary" style="opacity: 0.5" class="mr-n1 mt-n1"
              >mdi-hexagon-outline</v-icon
            >
            <div
              v-else
              class="heading h2 mt-n2"
              v-html="pilot.MechSkillsController.MechSkills.Agi"
            />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">SYS</div>
            <v-icon v-if="blank" size="30" color="primary" style="opacity: 0.5" class="mr-n1 mt-n1"
              >mdi-hexagon-outline</v-icon
            >
            <div
              v-else
              class="heading h2 mt-n2"
              v-html="pilot.MechSkillsController.MechSkills.Sys"
            />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption">ENG</div>
            <v-icon v-if="blank" size="30" color="primary" style="opacity: 0.5" class="mr-n1 mt-n1"
              >mdi-hexagon-outline</v-icon
            >
            <div
              v-else
              class="heading h2 mt-n2"
              v-html="pilot.MechSkillsController.MechSkills.Eng"
            />
          </v-col>
        </v-row>
        <v-row dense v-if="blank" class="mt-n2">
          <v-col v-for="n in 2" cols="12">
            <v-row dense align="center">
              <v-col cols="9"> <blank-line :height="24" inline /></v-col
              ><v-col cols="auto" class="heading h3 mr-n1 mt-n1">+</v-col
              ><v-col cols="2"><blank-line :height="24" inline /> </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row dense class="mt-n2">
      <v-col>
        <div class="text-caption mb-n2 mt-1 text-primary">TALENTS</div>
        <v-row dense v-if="blank">
          <v-col
            v-for="n in 12"
            :cols="landscape ? (options.pilotInclude.includes('pilot portrait') ? 6 : 3) : 6"
          >
            <blank-line :height="24" inline />
          </v-col>
        </v-row>
        <v-chip
          v-else-if="options.pilotInclude.includes('separate talent detail')"
          v-for="t in pilot.TalentsController.Talents"
          label
          variant="outlined"
          size="small"
          class="caption mx-1 mt-1"
        >
          <v-icon :icon="`cc:rank_${t.Rank}`" color="primary" class="ml-n2" /> {{ t.Talent.Name }}
          {{ 'I'.repeat(t.Rank) }}
        </v-chip>
        <v-row
          v-else
          v-for="t in pilot.TalentsController.Talents"
          dense
          justify="space-between"
          class="mt-n1 caption"
          style="position: relative"
        >
          <v-col>
            <fieldset>
              <legend class="heading ml-1 px-2">{{ t.Talent.Name }}</legend>
              <v-row v-for="n in t.Rank" align="center" dense class="my-n1">
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
      </v-col>
      <v-col v-if="options.pilotInclude.includes('pilot portrait')" cols="4" class="mt-5">
        <v-card height="100%" variant="outlined" color="grey">
          <v-row style="height: 100%" align="center">
            <v-col>
              <cc-img v-if="!blank" :src="pilot.Portrait" cover />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-caption mb-n2 text-primary">CORE BONUSES</div>
    <v-row dense v-if="blank">
      <v-col
        v-for="n in 4"
        :cols="landscape ? (options.pilotInclude.includes('pilot portrait') ? 6 : 3) : 6"
      >
        <blank-line :height="24" inline />
      </v-col>
    </v-row>

    <v-row
      v-else-if="pilot.CoreBonusController.CoreBonuses.length"
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

    <div class="text-caption mb-n2 mt-1 text-primary">PILOT LOADOUT</div>
    <v-row dense justify="space-between" class="mt-n1 caption">
      <v-col
        v-for="a in pilot.Loadout.Armor.filter((x) => x)"
        style="position: relative; break-inside: avoid"
      >
        <fieldset v-if="a">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ a.Name }}
              <span class="text-caption flavor-text">//ARMOR</span>
            </span>
            <span v-else class="text-grey">Pilot Armor</span>
          </legend>
          <div v-if="blank" style="height: 150px" />
          <div v-else>
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
                v-show="showTag(t.ID)"
                label
                variant="outlined"
                class="mx-1 bg-white"
              >
                {{ t.GetName() }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
      <v-col v-for="w in pilot.Loadout.Weapons.filter((x) => x)" style="position: relative">
        <fieldset v-if="w || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ w.Name }}
              <span class="text-caption flavor-text">//WEAPON</span>
            </span>
            <span v-else class="text-grey">Pilot Weapon</span>
          </legend>
          <div v-if="blank" style="height: 150px" />
          <div v-else>
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
                v-show="showTag(t.ID)"
                label
                variant="outlined"
                class="mx-1 bh-white"
              >
                {{ t.GetName() }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <v-row dense justify="space-between" class="mt-n1 caption pb-3">
      <v-col v-for="g in pilot.Loadout.Gear.filter((x) => x)" style="position: relative">
        <fieldset v-if="g || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ g.Name }}
              <span class="text-caption flavor-text">//GEAR</span>
            </span>
            <span v-else class="text-grey">Pilot Gear</span>
          </legend>
          <div v-if="blank" style="height: 150px" />
          <div v-else class="pb-1">
            <div v-if="g.Description" v-html-safe="g.Description" class="mb-5" />
            <!-- <v-card
              v-for="act in g.Actions"
              v-show="act.Detail"
              variant="outlined"
              class="pa-1 mt-1 mb-3"
              ><b>{{ act.Name }}</b
              >: {{ act.Detail }}</v-card
            > -->
            <div class="text-right" style="position: absolute; bottom: 10px; right: 5px">
              <v-chip
                v-for="t in g.Tags"
                v-show="showTag(t.ID)"
                size="x-small"
                label
                variant="outlined"
                class="mx-1 bg-white"
              >
                {{ t.GetName() }}
              </v-chip>
            </div>
          </div>
        </fieldset>
      </v-col>
    </v-row>

    <v-row dense justify="space-between" class="mt-n4 caption pb-3">
      <v-col
        v-if="options.pilotInclude.includes('extra equipment space')"
        v-for="n in 3"
        style="position: relative"
      >
        <fieldset>
          <legend class="heading ml-1 px-1">
            <blank-line :width="150" :height="20" />
          </legend>
          <div style="height: 150px" />
        </fieldset>
      </v-col>
    </v-row>

    <div v-if="!blank && pilot.ReservesController.Reserves.length">
      <div class="text-caption mb-n2 mt-1 text-primary">RESERVES</div>
      <v-row dense>
        <v-col
          v-for="r in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')"
          style="min-width: 18vw"
        >
          <fieldset>
            <legend class="heading caption mb-n1 text-primary px-1">{{ r.Name }}</legend>
            <div v-if="r.ResourceName || r.Note || r.ResourceCost">
              <b class="caption">{{ r.ResourceName }}</b>
              <div class="caption">{{ r.Note }}</div>
              <div class="caption text-grey text-right">{{ r.ResourceCost }}</div>
            </div>
            <blank-line v-else :height="50" class="my-1" style="min-height: 50px; height: 85%" />
          </fieldset>
        </v-col>
      </v-row>
    </div>

    <div v-if="blank" class="pa-2 mt-n5">
      <div class="text-caption mb-n2 mt-1 text-primary">RESERVES</div>
      <v-row dense>
        <v-col v-for="r in options.pilotInclude.includes('extra reserves space') ? 9 : 6" cols="4">
          <fieldset class="mt-2" style="position: relative">
            <legend class="px-1">
              <blank-line :height="26" :width="200" />
            </legend>

            <blank-line :height="10" class="my-1" style="min-height: 26px; height: 80%" />
          </fieldset>
        </v-col>
      </v-row>
    </div>

    <div v-if="options.pilotInclude.includes('appearance notes')">
      <div class="text-overline text-primary" style="line-height: 0">APPEARANCE</div>
      <div v-if="blank" class="mb-4"><notes :rows="5" lined /></div>
      <div v-else v-html-safe="pilot.Notes" class="mt-2 caption" />
    </div>
    <div v-if="options.pilotInclude.includes('pilot biography')">
      <div class="text-overline text-primary" style="line-height: 0">BIOGRAPHY</div>
      <div v-if="blank" class="mb-4"><notes :rows="5" lined /></div>
      <div v-else v-html-safe="pilot.Notes" class="mt-2 caption" />
    </div>
    <div v-if="options.pilotInclude.includes('pilot notes')">
      <div class="text-overline text-primary" style="line-height: 0">NOTES</div>
      <div v-if="blank" class="mb-4"><notes :rows="5" lined /></div>
      <div v-else v-html-safe="pilot.Notes" class="mt-2 caption" />
    </div>
  </div>

  <fieldset v-if="options.pilotInclude.includes('append lined section')" class="mx-1 my-3 px-3">
    <div class="mb-4"><notes :rows="16" lined /></div>
  </fieldset>

  <fieldset v-if="options.pilotInclude.includes('append unlined section')" class="mx-1 my-3 px-3">
    <div class="mb-4"><notes :rows="16" /></div>
  </fieldset>

  <div
    v-if="options.pilotInclude.includes('separate talent detail')"
    v-for="t in pilot.TalentsController.Talents"
    dense
    justify="space-between"
    class="mt-n1 caption px-2"
    style="position: relative"
  >
    <fieldset class="pb-2 my-2">
      <legend class="heading h3 ml-1 px-2">{{ t.Talent.Name }}</legend>
      <v-row v-for="n in t.Rank" align="center" dense class="my-n1">
        <v-col cols="auto" class="mr-2">
          <v-icon :icon="`cc:rank_${n}`" color="primary" size="large" class="mb-1" />
        </v-col>
        <v-col>
          <div v-html-safe="t.Talent.Ranks[n - 1].Description" />
        </v-col>
      </v-row>
    </fieldset>
  </div>
</template>

<script lang="ts">
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';

export default {
  name: 'pilot-print',
  components: {
    blankLine,
    notes,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  computed: {
    blank() {
      console.log(this.options);
      return this.options.content === 'blank';
    },
    landscape() {
      return this.options.orientation === 'landscape';
    },
  },
  methods: {
    showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
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
