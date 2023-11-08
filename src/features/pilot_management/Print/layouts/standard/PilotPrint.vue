<template>
  <div class="text-black px-2">
    <v-row dense>
      <v-col>
        <v-row dense align="center" class="mt-2">
          <v-col :cols="blank ? '' : 'auto'">
            <div class="text-caption text-primary h0">CALLSIGN</div>
            <blank-line v-if="blank" :height="32" class="my-2" />
            <div v-else class="heading h2">
              {{ pilot.Callsign }}
            </div>
          </v-col>
          <v-col cols="auto"><cc-slashes /></v-col>
          <v-col :cols="blank ? '' : 'auto'">
            <div class="text-caption text-primary h0">PILOT</div>
            <blank-line v-if="blank" :height="32" class="my-2" />
            <div v-else class="heading h2">
              {{ pilot.Name }}
            </div>
          </v-col>
          <v-col v-if="pilot.Background" :cols="blank ? '' : 'auto'" class="ml-auto mr-auto">
            <div class="text-caption text-primary h0">BACKGROUND</div>
            <blank-line v-if="blank" :height="32" class="my-2" />
            <div v-else class="heading h2">
              {{ pilot.Background }}
            </div>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <div class="text-caption text-primary h0">LICENSE LEVEL</div>
            <blank-line v-if="blank" :height="32" class="my-2" />
            <div v-else class="heading h2 text-right">
              {{ pilot.Level }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" class="text-right ml-4">
        <div class="text-caption mr-9 text-primary">GRIT</div>
        <v-icon v-if="blank" size="50" color="primary" style="opacity: 0.5" class="mt-n2 mr-4"
          >mdi-hexagon-outline</v-icon
        >
        <div v-else class="heading mt-n5" style="font-size: 65px; line-height: 60px">
          +{{ pilot.Grit }}
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-n3">
      <v-col>
        <v-row class="text-center" justify="space-between">
          <v-col cols="auto">
            <div class="font-weight-bold caption text-primary mb-n3">PILOT HP</div>
            <v-row v-if="blank" dense align="center" justify="center" class="mt-2">
              <v-col cols="auto">
                <blank-line :width="80" :height="35" class="d-inline-block" />
              </v-col>
              <v-col cols="auto" class="px-1"
                ><span class="heading h3 text-grey" style="line-height: 0">/</span></v-col
              >
              <v-col cols="auto">
                <blank-line :width="80" :height="35" class="d-inline-block" />
              </v-col>
            </v-row>
            <div v-else class="mt-3">
              <blank-line :height="26" :width="50" class="d-inline-block ml-5" />
              <b v-if="!blank" class="flavor-text text-black" v-text="`/${pilot.MaxHP}`" />
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="font-weight-bold caption text-primary mb-n3">ARMOR</div>
            <v-icon v-if="blank" size="45" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.Armor" />
          </v-col>
          <v-col cols="auto">
            <div class="font-weight-bold caption text-primary mb-n3">E-DEFENSE</div>
            <v-icon v-if="blank" size="45" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.EDefense" />
          </v-col>
          <v-col cols="auto">
            <div class="font-weight-bold caption text-primary mb-n3">EVASION</div>
            <v-icon v-if="blank" size="45" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.Evasion" />
          </v-col>
          <v-col cols="auto">
            <div class="font-weight-bold caption text-primary mb-n3">SPEED</div>
            <v-icon v-if="blank" size="45" color="primary" style="opacity: 0.5" class="mt-2"
              >mdi-hexagon-outline</v-icon
            >
            <div v-else class="heading p-stat" v-text="pilot.Speed" />
          </v-col>
        </v-row>

        <v-row dense class="mt-n4">
          <v-col>
            <v-row class="text-center">
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2">HULL</div>
                <blank-line v-if="blank" :width="80" :height="35" class="d-inline-block mt-2" />

                <div
                  v-else
                  class="heading h2"
                  v-html="pilot.MechSkillsController.MechSkills.Hull"
                />
              </v-col>
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2 text-primary">AGILITY</div>
                <blank-line v-if="blank" :width="80" :height="35" class="d-inline-block mt-2" />

                <div v-else class="heading h2" v-html="pilot.MechSkillsController.MechSkills.Agi" />
              </v-col>
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2">SYSTEMS</div>
                <blank-line v-if="blank" :width="80" :height="35" class="d-inline-block mt-2" />

                <div v-else class="heading h2" v-html="pilot.MechSkillsController.MechSkills.Sys" />
              </v-col>
              <v-col>
                <div class="font-weight-bold caption text-primary mb-n2">ENGINEERING</div>
                <blank-line v-if="blank" :width="80" :height="35" class="d-inline-block mt-2" />

                <div v-else class="heading h2" v-html="pilot.MechSkillsController.MechSkills.Eng" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row dense justify="space-between" class="mt-n3">
          <v-col>
            <div class="text-caption text-primary">SKILL TRIGGERS</div>
            <div class="text-left">
              <v-row dense v-if="blank" class="mt-n2">
                <v-col v-for="n in 8" cols="6">
                  <v-row dense align="center">
                    <v-col cols="9"> <blank-line :height="32" inline /></v-col
                    ><v-col cols="auto" class="heading h3 mr-n1 mt-n1">+</v-col
                    ><v-col cols="2"><blank-line :height="32" inline /> </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-chip
                v-else
                v-for="s in pilot.SkillsController.Skills"
                label
                variant="outlined"
                size="small"
                class="mx-2 mb-2"
              >
                <span class="stat-text ml-n1 mr-1"> +{{ s.Bonus }} </span>
                <span>{{ s.Skill.Trigger }}</span>
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <div class="mt-2">
          <div v-if="options.pilotInclude.includes('appearance notes')">
            <div class="text-overline text-primary" style="line-height: 0">APPEARANCE</div>
            <div v-if="blank" class="mb-4"><notes :rows="5" lined /></div>
            <div v-else v-html-safe="pilot.Notes" class="mt-2 caption" />
          </div>
          <div v-if="blank || pilot.History.length > 0">
            <div class="text-overline text-primary" style="line-height: 0">BIOGRAPHY</div>
            <div v-if="blank" class="mb-4"><notes :rows="5" lined /></div>
            <div v-else v-html-safe="pilot.History" class="mt-2 caption" />
          </div>
          <div>
            <div class="text-overline text-primary" style="line-height: 0">NOTES</div>
            <div v-if="blank || !pilot.Notes.length" class="mb-4"><notes :rows="5" lined /></div>
            <div v-else v-html-safe="pilot.Notes" class="mt-2 caption" />
          </div>
        </div>
      </v-col>

      <v-col cols="4">
        <v-card height="100%" variant="outlined" color="grey">
          <v-row style="height: 100%" align="center">
            <v-col>
              <v-img v-if="!blank" :src="pilot.Portrait" cover />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-n6">
      <v-col>
        <div class="text-caption mb-n2 mt-1 text-primary">TALENTS</div>
        <v-row dense v-if="blank">
          <v-col v-for="n in 12" :cols="6">
            <blank-line :height="48" inline />
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
          style="position: relative; page-break-inside: avoid"
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
    </v-row>

    <div class="text-caption mb-n2 mt-2 text-primary">CORE BONUSES</div>
    <v-row dense v-if="blank">
      <v-col
        v-for="n in 4"
        :cols="landscape ? (options.pilotInclude.includes('pilot portrait') ? 6 : 3) : 6"
      >
        <blank-line :height="48" inline />
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
        style="position: relative; page-break-inside: avoid"
        cols="12"
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
            <tag-block :tags="a.Tags" :options="options" />
          </div>
        </fieldset>
      </v-col>
      <v-col
        v-for="w in pilot.Loadout.Weapons.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
        cols="12"
      >
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
            <div v-if="w.Effect" v-html-safe="w.Effect" />
            <v-card v-for="act in w.Actions" variant="outlined" class="pa-1 mt-1 mb-3"
              ><b>{{ act.Name }}</b
              >: {{ act.Detail }}</v-card
            >
            <tag-block :tags="w.Tags" :options="options" />
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <v-row dense justify="space-between" class="mt-n1 caption pb-3">
      <v-col
        v-for="g in pilot.Loadout.Gear.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
        cols="12"
      >
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
            <div v-if="g.Description" v-html-safe="g.Description" />
            <tag-block :tags="g.Tags" :options="options" />
          </div>
        </fieldset>
      </v-col>
    </v-row>

    <v-row dense justify="space-between" class="mt-n2 caption">
      <v-col
        v-if="options.pilotInclude.includes('extra equipment space')"
        v-for="n in 3"
        style="position: relative; page-break-inside: avoid"
        cols="12"
      >
        <fieldset>
          <legend class="heading ml-1 px-1">
            <blank-line :width="150" :height="20" />
          </legend>
          <div style="height: 150px" />
        </fieldset>
      </v-col>
    </v-row>
  </div>

  <div v-if="!blank && pilot.ReservesController.Reserves.length" class="pa-2">
    <div class="text-caption mb-n2 mt-1 text-primary">RESERVES</div>
    <v-row dense>
      <v-col
        v-for="r in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')"
        style="min-width: 20vw"
        class="my-n1"
      >
        <fieldset>
          <legend class="px-1 mb-n2">
            <span class="heading caption text-primary"> {{ r.Name }}</span>
            <i class="caption text-grey">&nbsp;({{ r.Type }})</i>
          </legend>
          <div v-if="r.ResourceName || r.Note || r.ResourceCost">
            <b class="caption">{{ r.ResourceName }}</b>
            <div class="caption">{{ r.Note }}</div>
            <div class="caption text-grey text-right">{{ r.ResourceCost }}</div>
          </div>
          <blank-line v-else :height="50" class="my-1" style="min-height: 64px; height: 85%" />
        </fieldset>
      </v-col>
    </v-row>
  </div>

  <div v-if="blank" class="pa-2">
    <div class="text-caption mb-n2 mt-1 text-primary">RESERVES</div>
    <v-row>
      <v-col v-for="r in options.pilotInclude.includes('extra reserves space') ? 9 : 6" cols="6">
        <fieldset class="mt-2" style="position: relative; page-break-inside: avoid">
          <legend class="px-1">
            <blank-line :height="26" :width="200" />
          </legend>
          <div v-if="landscape" style="position: absolute; top: -26px; right: 10px">
            <v-chip label size="x-small" variant="outlined" color="grey" class="bg-white px-1 mx-1"
              >BONUS</v-chip
            ><v-chip label size="x-small" variant="outlined" color="grey" class="bg-white px-1 mx-1"
              >RESOURCE</v-chip
            >
            <v-chip label size="x-small" variant="outlined" color="grey" class="bg-white px-1 mx-1"
              >TACTICAL</v-chip
            >
            <v-chip label size="x-small" variant="outlined" color="grey" class="bg-white px-1 mx-1"
              >MECH</v-chip
            >
            <v-chip label size="x-small" variant="outlined" color="grey" class="bg-white px-1 mx-1"
              >OTHER</v-chip
            >
          </div>

          <blank-line :height="80" class="my-1" style="min-height: 70px; height: 90%" />
        </fieldset>
      </v-col>
    </v-row>
  </div>

  <fieldset v-if="options.pilotInclude.includes('append lined section')" class="mx-1 my-3 px-3">
    <div class="mb-4"><notes :rows="24" lined /></div>
  </fieldset>

  <fieldset v-if="options.pilotInclude.includes('append unlined section')" class="mx-1 my-3 px-3">
    <div class="mb-4"><notes :rows="24" /></div>
  </fieldset>

  <div
    v-if="options.pilotInclude.includes('separate talent detail')"
    v-for="t in pilot.TalentsController.Talents"
    dense
    justify="space-between"
    class="mt-n1 caption px-2"
    style="position: relative; page-break-inside: avoid"
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
import tagBlock from './components/TagBlock.vue';

export default {
  name: 'pilot-print',
  components: {
    blankLine,
    notes,
    tagBlock,
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

.h0 {
  line-height: 0;
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
