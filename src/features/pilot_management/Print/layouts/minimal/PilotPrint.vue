<template>
  <div class="text-black px-2">
    <v-row dense justify="space-around" align="center">
      <v-col cols="auto">
        <blank-line v-if="blank" :width="170" :height="24" />
        <div v-else class="heading h3">
          {{ pilot.Callsign }}
        </div>
        <div v-if="!blank" class="text-caption mt-n2">
          {{ pilot.Name }}
        </div>
      </v-col>

      <v-col cols="auto">
        <div>
          HP:
          <div class="d-inline-block mb-n1"><blank-line :height="24" :width="30" /></div>
          <span>/</span>
          <blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MaxHP }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          ARMOR:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.Armor }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          E-DEF:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.EDefense }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          EVASION:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.Evasion }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          SPEED:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.Speed }}</b>
        </div>
      </v-col>
      <v-col cols="auto">
        <div>
          GRIT:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>+{{ pilot.Grit }}</b>
        </div>
      </v-col>
    </v-row>

    <v-divider />

    <div class="text-caption text-primary">SKILL TRIGGERS</div>

    <v-row dense justify="space-between" class="mt-n2">
      <v-col>
        <v-row v-if="blank" dense>
          <v-col v-for="n in 6" cols="4">
            <blank-line :height="24" />
          </v-col>
        </v-row>
        <div v-else class="text-left">
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

      <v-col cols="auto" class="px-1">
        <div>
          HULL:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Hull }}</b>
        </div>
      </v-col>
      <v-col cols="auto" class="px-1">
        <div>
          AGI:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Agi }}</b>
        </div>
      </v-col>
      <v-col cols="auto" class="px-1">
        <div>
          SYS:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Sys }}</b>
        </div>
      </v-col>
      <v-col cols="auto" class="px-1">
        <div>
          ENG:<blank-line v-if="blank" :width="30" :height="24" class="d-inline-block mb-n1" />
          <b v-else>{{ pilot.MechSkillsController.MechSkills.Eng }}</b>
        </div>
      </v-col>
    </v-row>

    <v-row dense class="mt-n1">
      <v-col :cols="blank ? 8 : 'auto'">
        <div class="text-caption mb-n1 text-primary">TALENTS</div>
        <v-row v-if="blank" dense>
          <v-col v-for="n in 9" cols="4">
            <blank-line :height="24" />
          </v-col>
        </v-row>
        <v-chip
          v-else
          v-for="t in pilot.TalentsController.Talents"
          label
          variant="outlined"
          size="small"
          class="caption mx-1"
        >
          <v-icon :icon="`cc:rank_${t.Rank}`" color="primary" class="ml-n2" /> {{ t.Talent.Name }}
          {{ 'I'.repeat(t.Rank) }}
        </v-chip>
      </v-col>
      <v-col :cols="blank ? '' : 'auto'">
        <div
          v-if="pilot.CoreBonusController.CoreBonuses.length"
          class="text-caption mb-n1 text-primary"
        >
          CORE BONUSES
        </div>

        <v-row v-if="blank" dense>
          <v-col v-for="n in 3" cols="12">
            <blank-line :height="24" />
          </v-col>
        </v-row>

        <v-chip
          v-else
          v-for="b in pilot.CoreBonusController.CoreBonuses"
          label
          variant="outlined"
          size="small"
          class="caption mx-1"
        >
          {{ b.Name }}
        </v-chip>
      </v-col>
    </v-row>

    <div class="text-caption mb-n2 mt-1 text-primary">PILOT LOADOUT</div>
    <v-row dense justify="space-between" class="mt-n1 caption">
      <v-col
        v-for="a in pilot.Loadout.Armor.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset v-if="a">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ a.Name }}
              <span class="text-caption flavor-text">//ARMOR</span>
            </span>
            <span v-else class="text-grey">Pilot Armor</span>
          </legend>
          <div v-if="blank" style="height: 75px" />
          <div v-else class="pb-2">
            <v-row dense justify="space-around">
              <v-col cols="auto">
                <v-icon icon="mdi-shield-outline" /> <span v-text="`+${a.Armor(pilot)}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="cc:e_def" /> <span v-text="`${a.EDefense(pilot)}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="cc:evasion" /><span v-text="`${a.Evasion(pilot)}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="mdi-heart-outline" />
                <span v-text="`${a.HPBonus(pilot) ? `+${a.HPBonus(pilot)}` : ''}`" />
              </v-col>
              <v-col cols="auto">
                <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
                <span v-text="`${a.Speed(pilot) ? `${a.Speed(pilot)}` : ''}`" />
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
      <v-col
        v-for="w in pilot.Loadout.Weapons.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset v-if="w || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ w.Name }}
              <span class="text-caption flavor-text">//WEAPON</span>
            </span>
            <span v-else class="text-grey">Pilot Weapon</span>
          </legend>
          <div v-if="blank" style="height: 75px" />
          <div v-else>
            <span v-for="r in w.Range"><v-icon size="15" :icon="r.Icon" /> {{ r.Value }}</span>
            <span v-for="d in w.Damage"
              ><v-icon size="20" :icon="d.Icon" :color="d.Color" /> {{ d.Value }}</span
            >
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

    <v-row dense justify="space-between" class="mt-n1 caption pb-1">
      <v-col
        v-for="g in pilot.Loadout.Gear.filter((x) => x)"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset v-if="g || blank">
          <legend class="heading ml-1 px-1">
            <span v-if="!blank">
              {{ g.Name }}
              <span class="text-caption flavor-text">//GEAR</span>
            </span>
            <span v-else class="text-grey">Pilot Gear</span>
          </legend>
          <div v-if="blank" style="height: 75px" />
          <div v-else class="pb-1">
            <div v-if="g.Description" v-html-safe="g.Description" />
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

    <div v-if="!blank && pilot.ReservesController.Reserves.length">
      <div class="text-caption my-n1 text-primary">RESERVES</div>
      <div class="pb-1">
        <v-chip
          v-for="r in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')"
          label
          variant="outlined"
          size="small"
          class="caption mx-1"
        >
          <v-icon :icon="r.Icon" start />
          <div class="text-caption mb-n1 text-primary">{{ r.Name }}</div>
        </v-chip>
      </div>
    </div>

    <div v-if="blank" class="pa-2 mt-n5">
      <div class="text-caption mb-n1 mt-1 text-primary">RESERVES</div>
      <v-row dense>
        <v-col v-for="r in options.pilotInclude.includes('extra reserves space') ? 8 : 4" cols="3">
          <blank-line :height="26" />
        </v-col>
      </v-row>
    </div>
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
