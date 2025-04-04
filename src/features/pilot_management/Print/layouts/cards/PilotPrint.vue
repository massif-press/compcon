<template>
  <div class="text-black pa-3">
    <v-row justify="space-around">
      <card>
        <v-row dense align="center" class="mb-1">
          <v-col><v-divider /></v-col>
          <v-col cols="auto" class="text-center heading h3" style="line-height: 10px">
            {{ pilot.Callsign }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>
        <div
          :style="pilot.hasImage ? `background-image: url('${pilot.Portrait}')` : ''"
          style="
            height: 100px;
            width: 100%;
            background-position: top 0%;
            background-size: cover;
            position: relative;
            border-radius: 4px;
            border: 1px solid dimgrey;
          ">
          <v-avatar color="primary" size="small" style="position: absolute; bottom: 0; right: -4px">
            <b class="heading h3">+{{ pilot.Grit }}</b>
          </v-avatar>
        </div>
        <div class="heading caption text-center">{{ pilot.Name }} // LL {{ pilot.Level }}</div>

        <v-divider class="my-1" />

        <fieldset>
          <legend class="font-weight-bold caption text-primary px-2 text-center">PILOT HP</legend>
          <div style="min-width: 12vw">
            <blank-line :height="40" />
          </div>
          <v-row dense align="center" class="my-n2">
            <v-col><v-divider /></v-col>
            <v-col cols="auto">
              <span class="text-center heading caption" v-text="pilot.MaxHP" />
              <span class="text-primary caption">MAX HP</span>
            </v-col>
          </v-row>
        </fieldset>
        <v-row class="text-center mt-4" justify="space-between" dense>
          <v-col>
            <div class="font-weight-bold caption text-primary">ARMOR</div>

            <div class="heading" v-text="pilot.Armor" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary">E-DEF</div>
            <div class="heading" v-text="pilot.EDefense" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary">EVASION</div>

            <div class="heading" v-text="pilot.Evasion" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary">SPEED</div>

            <div class="heading" v-text="pilot.Speed" />
          </v-col>
        </v-row>

        <v-divider class="mb-2" />

        <v-row class="text-center" justify="space-between" dense>
          <v-col>
            <div class="font-weight-bold caption text-primary">HULL</div>

            <div class="heading" v-html="pilot.MechSkillsController.MechSkills.Hull" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary text-primary">AGI</div>

            <div class="heading" v-html="pilot.MechSkillsController.MechSkills.Agi" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary">SYS</div>

            <div class="heading" v-html="pilot.MechSkillsController.MechSkills.Sys" />
          </v-col>
          <v-col>
            <div class="font-weight-bold caption text-primary">ENG</div>

            <div class="heading" v-html="pilot.MechSkillsController.MechSkills.Eng" />
          </v-col>
        </v-row>
      </card>

      <card>
        <div>
          <div class="caption text-center mt-n1 mb-2" style="letter-spacing: 5px; font-size: 10px">
            PILOT&emsp;SKILL TRIGGERS
          </div>
          <v-card
            v-for="s in pilot.SkillsController.Skills"
            label
            variant="tonal"
            class="mx-2 mb-2">
            <v-row dense style="font-size: 12px" align="center">
              <v-col cols="auto">
                <v-avatar size="x-small" class="ma-1" color="teal-lighten-5">
                  <b class="px-1">+{{ s.Bonus }}</b>
                </v-avatar>
              </v-col>
              <v-col>
                <span>{{ s.Skill.Trigger }}</span>
              </v-col>
            </v-row>
          </v-card>
          <v-avatar style="position: absolute; bottom: 1px; right: 1px">
            <v-icon icon="cc:skill" color="primary" size="40" />
          </v-avatar>
        </div>
      </card>
      <card v-for="t in pilot.TalentsController.Talents">
        <div class="caption text-center mt-n1" style="letter-spacing: 10px; font-size: 10px">
          PILOT&emsp;TALENT
        </div>
        <v-row dense align="center">
          <v-col><v-divider /></v-col>
          <v-col cols="auto" class="text-center heading">
            {{ t.Talent.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>
        <div v-for="n in t.Rank" class="caption mb-2">
          <div class="heading">
            <v-icon :icon="`cc:rank_${n}`" color="primary" size="small" class="mb-1 mr-1" />
            <span v-text="t.Talent.Ranks[n - 1].Name" />
          </div>
          <div v-html-safe="t.Talent.Ranks[n - 1].Description" />
        </div>
        <v-avatar style="position: absolute; bottom: 1px; right: 1px">
          <talent-emblem :talent="t.Talent" dark />
        </v-avatar>
      </card>

      <card v-if="pilot.CoreBonusController.CoreBonuses.length">
        <div class="caption text-center mt-n1" style="letter-spacing: 10px; font-size: 10px">
          CORE&emsp;BONUSES
        </div>
        <v-divider />
        <div v-for="cb in pilot.CoreBonusController.CoreBonuses" class="my-2">
          <div cols="auto" class="heading" style="font-size: 13px">
            {{ cb.Name }}
          </div>
          <div class="caption mt-n1">
            {{ cb.Effect }}
          </div>
        </div>
        <v-avatar style="position: absolute; bottom: 1px; right: 1px">
          <v-icon icon="cc:corebonus" color="primary" size="40" />
        </v-avatar>
      </card>
      <card v-for="a in pilot.Loadout.Armor.filter((x) => x)">
        <div class="caption text-center mt-n1" style="letter-spacing: 10px; font-size: 10px">
          PILOT ARMOR
        </div>
        <v-row dense align="center">
          <v-col cols="auto" class="text-center heading">
            {{ a.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>
        <div>
          <v-row dense justify="space-around" class="text-center">
            <v-col cols="6">
              <v-card variant="tonal" class="py-2">
                <v-icon icon="mdi-shield-outline" />
                <span v-text="`+${a.Armor(pilot) || 0}`" class="heading h3" />
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card variant="tonal" class="py-2">
                <v-icon icon="mdi-heart-outline" />
                <span v-text="`+${a.HPBonus(pilot) || 0}`" class="heading h3" />
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card variant="tonal" class="py-2">
                <v-icon icon="cc:e_def" class="mt-n1" />
                <span v-text="`${a.EDefense(pilot) || 'N/A'} `" class="heading h3" />
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card variant="tonal" class="py-2">
                <v-icon icon="cc:evasion" class="mt-n1" />
                <span v-text="`${a.Evasion(pilot) || 'N/A'} `" class="heading h3" />
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card variant="tonal" class="py-2">
                <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
                <span v-text="`${a.Speed(pilot) || 'N/A'} `" class="heading h3" />
              </v-card>
            </v-col>
          </v-row>

          <tag-block :tags="a.Tags" :options="options" />
        </div>
      </card>
      <card v-for="w in pilot.Loadout.Weapons.filter((x) => x)">
        <div class="caption text-center mt-n1" style="letter-spacing: 10px; font-size: 10px">
          PILOT WEAPON
        </div>
        <v-row dense align="center">
          <v-col cols="auto" class="text-center heading">
            {{ w.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>
        <v-row dense align="center" class="text-center">
          <v-col>
            <v-card variant="tonal" class="py-2">
              <b v-for="r in w.Range" class="px-1">
                <v-icon class="mt-n1" :icon="r.Icon" />
                {{ r.Value }}
              </b>
            </v-card>
          </v-col>
          <v-col>
            <v-card variant="tonal" class="py-2">
              <b v-for="d in w.Damage">
                <v-icon class="mt-n1" :icon="d.Icon" :color="d.Color" />
                {{ d.Value }}
              </b>
            </v-card>
          </v-col>
        </v-row>
        <div v-if="w.Effect" v-html-safe="w.Effect" class="caption mt-1" />
        <tag-block :tags="w.Tags" :options="options" />
      </card>
      <card v-for="g in pilot.Loadout.Gear.filter((x) => x)">
        <div class="caption text-center mt-n1" style="letter-spacing: 10px; font-size: 10px">
          PILOT GEAR
        </div>
        <v-row dense align="center">
          <v-col cols="auto" class="text-center heading">
            {{ g.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
        </v-row>
        <v-row v-if="g.MaxUses" dense justify="end" class="mt-n5 mb-n1">
          <v-col v-for="n in g.MaxUses" cols="auto" class="mx-n1">
            <v-icon size="x-small" icon="mdi-hexagon-outline" color="primary" />
          </v-col>
        </v-row>
        <div v-if="g.Description" v-html-safe="g.Description" class="caption" />

        <tag-block :tags="g.Tags" :options="options" />
      </card>
      <card v-for="r in pilot.ReservesController.Reserves.filter((x) => x.Type !== 'Bonus')">
        <div class="caption text-center mt-n1" style="letter-spacing: 10px; font-size: 10px">
          RESERVE
        </div>
        <v-row dense align="center">
          <v-col cols="auto" class="text-center heading" style="font-size: 14px">
            {{ r.Name }}
          </v-col>
          <v-col><v-divider /></v-col>
          <v-col cols="auto">
            <v-icon :icon="r.Icon" color="primary" />
          </v-col>
        </v-row>
        <v-card v-if="r.Description" class="caption pa-1 my-1" variant="tonal">
          {{ r.Description }}
        </v-card>
        <div v-if="r.ResourceName || r.Note || r.ResourceCost">
          <div class="text-center">
            <b class="caption">{{ r.ResourceName }}</b>
          </div>
          <div class="caption">{{ r.Note }}</div>
          <div class="caption text-grey text-right">{{ r.ResourceCost }}</div>
        </div>
      </card>
      <action-card v-for="a in gearActions" :action="a" header="PILOT GEAR" />
      <action-card v-for="a in talentActions" :action="a" header="PILOT TALENT" />
      <deployable-card v-for="d in gearDeployables" :deployable="d" header="PILOT GEAR" />
      <deployable-card v-for="d in talentDeployables" :deployable="d" header="PILOT TALENT" />
    </v-row>
  </div>
</template>

<script lang="ts">
import card from './components/PrintCard.vue';
import blankLine from '../../components/blank/line.vue';
import ActionCard from './components/ActionCard.vue';
import DeployableCard from './components/DeployableCard.vue';
import TagBlock from './components/TagBlock.vue';
import TalentEmblem from '@/ui/components/Talent/components/_TalentEmblem.vue';

export default {
  name: 'pilot-print',
  components: {
    blankLine,
    ActionCard,
    DeployableCard,
    card,
    TagBlock,
    TalentEmblem,
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
      return this.options.content.title === 'Blank';
    },
    landscape() {
      return this.options.orientation === 'landscape';
    },
    talentActions() {
      return this.pilot.TalentsController.Talents.flatMap((t) => t.Talent.Ranks)
        .filter((r) => r.Actions.length > 0)
        .flatMap((r) => r.Actions);
    },
    talentDeployables() {
      return this.pilot.TalentsController.Talents.flatMap((t) => t.Talent.Ranks)
        .filter((r) => r.Deployables.length > 0)
        .flatMap((r) => r.Deployables);
    },
    gearActions() {
      return this.pilot.Loadout.Items.filter((i) => !!i && i.Actions.length > 0).flatMap(
        (i) => i.Actions
      );
    },
    gearDeployables() {
      return this.pilot.Loadout.Items.filter((i) => i.Deployables.length > 0).flatMap(
        (i) => i.Deployables
      );
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
  font-size: 11px;
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
