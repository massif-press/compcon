<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 15px">COMBAT REFERENCE</div>
    <fieldset class="px-2">
      <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">Per Turn</legend>

      <v-row dense>
        <v-col>
          <v-card variant="outlined" color="action--protocol" class="text-center"
            ><v-icon size="large" icon="cc:protocol" />
            <div class="heading caption">protocols</div></v-card
          >
        </v-col>
        <v-col cols="4">
          <v-card variant="outlined" color="action--full" class="text-center">
            <v-icon size="large" icon="mdi-hexagon-slice-6" />
            <v-icon size="large" color="indigo lighten-3">mdi-swap-horizontal</v-icon>
            <v-icon size="large" icon="mdi-hexagon-slice-3" />
            <v-icon size="large" icon="mdi-hexagon-slice-3" />
            <div class="heading caption">full action or 2 quick actions</div>
          </v-card>
        </v-col>
        <v-col>
          <v-card variant="outlined" color="action--move" class="text-center"
            ><v-icon size="large" icon="mdi-arrow-right-bold-hexagon-outline" />
            <div class="heading caption">movement</div>
          </v-card>
        </v-col>
        <v-col>
          <v-card variant="outlined" color="overcharge" class="text-center"
            ><v-icon size="large" icon="cc:overcharge" />
            <div class="heading caption">overcharge</div>
          </v-card>
        </v-col>
        <v-col>
          <v-card variant="outlined" color="action--free" class="text-center"
            ><v-icon size="large" icon="cc:free_action" />
            <div class="heading caption">free actions</div>
          </v-card>
        </v-col>
        <v-col>
          <v-card variant="outlined" color="action--reaction" class="text-center"
            ><v-icon size="large" icon="cc:reaction" />
            <div class="heading caption">reactions</div>
          </v-card>
        </v-col>
      </v-row>
      <div class="caption font-italic text-center py-1">
        Characters cannot perform the same action more than once in a turn, except as a free action
        or reaction.
      </div>
    </fieldset>
    <v-row dense>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">Engagement</legend>
          <div class="caption">
            If a character moves adjacent to a hostile character, they both gain
            <b>ENGAGED</b> for as long as they remain adjacent. Ranged attacks made while
            <b>ENGAGED</b> receive <v-icon icon="cc:difficulty" class="mt-n1 ml-n1" />.
          </div>
          <div class="caption">
            Characters that become <b>ENGAGED</b> by targets of <b>>= SIZE</b> during movement stop
            immediately and lose unused movement.
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">Terrain</legend>
          <div class="caption">
            All movement through <b>difficult terrain</b> costs <b>double</b>.
          </div>
          <div class="caption">
            When characters end their turn in <b>dangerous terrain</b> or move into it for the first
            time in a round, they must make an <b>ENGINEERING</b> check. On a failure, they take 5
            damage
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <v-row dense class="mt-n3">
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            Roll Modifiers
          </legend>
          <div class="caption">
            Each point of <v-icon icon="cc:accuracy" class="mt-n1 mx-n1" /> adds 1d6 to a roll.
          </div>
          <div class="caption">
            Each point of <v-icon icon="cc:difficulty" class="mt-n1 mx-n1" /> subtracts 1d6 from a
            roll.
          </div>
          <div class="caption">
            <v-icon icon="cc:accuracy" class="mt-n1 mx-n1" /> and
            <v-icon icon="cc:difficulty" class="mt-n1 mx-n1" /> cancel each other out on a 1:1
            basis. No roll can ever receive more than -6 or +6 from
            <v-icon icon="cc:accuracy" class="mt-n1 mx-n1" /> or
            <v-icon icon="cc:difficulty" class="mt-n1 mx-n1" />.
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">Cover</legend>
          <div class="caption">
            <b>Soft cover</b>, adds +1 <v-icon icon="cc:difficulty" class="mt-n1 mx-n1" /> to any
            ranged attacks.
          </div>

          <div class="caption">
            <b>Hard cover</b> adds +2 <v-icon icon="cc:difficulty" class="mt-n1 mx-n1" /> to any
            ranged attacks. Characters only benefit from hard cover if they are adjacent to whatever
            they’re using for cover and are the same <b>SIZE</b> or smaller.
          </div>

          <div class="caption">Characters can only benefit from one type of cover at a time.</div>
        </fieldset>
      </v-col>
    </v-row>
    <cc-icon-divider icon="cc:weapon" dense class="mt-0 mb-n5" />
    <v-row dense>
      <v-col cols="auto">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            SKIRMISH <v-icon icon="mdi-hexagon-slice-3" color="action--quick" />
          </legend>
          <div class="caption">Attack with a <b>single weapon mount</b></div>
        </fieldset>
      </v-col>
      <v-col cols="auto">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            BARRAGE <v-icon icon="mdi-hexagon-slice-6" color="action--full" />
          </legend>
          <div class="caption">
            Attack with <b>two weapon mounts</b> <b class="text-primary">OR</b> a
            <b>superheavy weapon</b>
          </div>
        </fieldset>
      </v-col>
      <v-col cols="auto">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            IMPROVISED ATK. <v-icon icon="mdi-hexagon-slice-6" color="action--full" />
          </legend>
          <div class="caption">
            Deal 1d6 <v-icon icon="cc:kinetic" color="damage--kinetic" class="mt-n1 mx-n1" />
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <!-- <v-row dense class="mt-n3">
      <v-col cols="auto">
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            RAM <v-icon icon="mdi-hexagon-slice-3" color="action--quick" />
          </legend>
          <div class="caption">Target takes <b>PRONE</b> and <b>KNOCKBACK 1</b> (optional)</div>
        </fieldset>
      </v-col>

      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            GRAPPLE <v-icon icon="mdi-hexagon-slice-3" color="action--quick" />
          </legend>
          <div class="caption">
            Deal 1d6 <v-icon icon="cc:kinetic" color="damage--kinetic" class="mt-n1 mx-n1" />
          </div>
        </fieldset>
      </v-col>
    </v-row> -->
    <v-row dense class="mt-n3">
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            melee attacks
          </legend>
          <div class="text-center">
            <v-chip size="x-small" class="mt-n1" color="action--full"
              ><v-icon icon="mdi-dice-d20" start /> + GRIT vs EVASION</v-chip
            >
          </div>
          <div class="caption text-center">
            Target within <v-icon icon="cc:threat" class="mt-n1 ml-n1" /><b>THREAT</b> and
            <b>LOS</b>
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            ranged attacks
          </legend>
          <div class="text-center">
            <v-chip size="x-small" class="mt-n1" color="action--full"
              ><v-icon icon="mdi-dice-d20" start /> + GRIT vs EVASION</v-chip
            >
          </div>
          <div class="caption text-center">
            Target within <v-icon icon="cc:range" class="mt-n1 ml-n1" /><b>RANGE</b> and
            <b>LOS</b>
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            tech attacks
          </legend>
          <div class="text-center">
            <v-chip size="x-small" class="mt-n1" color="action--tech"
              ><v-icon icon="mdi-dice-d20" start /> + TECH ATK. vs E-DEF</v-chip
            >
          </div>
          <div class="caption text-center">
            Target within <v-icon icon="cc:sensor" class="mt-n1" /><b>SENSORS</b> and
            <b>LOS</b>
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <fieldset class="px-2">
      <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
        Area of Effect Patterns
      </legend>
      <v-row dense class="caption">
        <v-col
          ><div class="font-weight-bold text-primary">
            <v-icon icon="cc:line" size="small" class="mt-n1" /> LINE X
          </div>
          <div>Affects a straight line, X spaces long.</div>
        </v-col>
        <v-col
          ><div class="font-weight-bold text-primary">
            <v-icon icon="cc:cone" size="small" class="mt-n1" /> CONE X
          </div>
          <div>
            Affects a cone, X spaces long and X spaces wide at its furthest point. Starts at 1 space
            wide.
          </div>
        </v-col>
        <v-col
          ><div class="font-weight-bold text-primary">
            <v-icon icon="cc:blast" size="small" class="mt-n1" /> BLAST X
          </div>
          <div>
            Affects a radius of X spaces, drawn from a point within
            <v-icon icon="cc:range" class="mt-n1" /> and LOS.
          </div>
        </v-col>
        <v-col
          ><div class="font-weight-bold text-primary">
            <v-icon icon="cc:burst" size="small" class="mt-n1" /> BURST X
          </div>
          <div>Affects a radius of X spaces, centered on the user (or target).</div>
        </v-col>
      </v-row>
      <v-divider />
      <div class="caption font-italic text-center py-1">
        AoE Attack Rolls are made for each target. One damage roll is applied to all targets. Bonus
        damage is halved.
      </div>
    </fieldset>
    <v-row dense>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            damage types
          </legend>
          <div class="caption">
            <v-row dense>
              <v-col>
                <div>
                  <v-icon icon="cc:kinetic" size="small" class="mt-n1" color="damage--kinetic" />
                  <b>KINETIC</b>
                </div>
                <div>
                  <v-icon icon="cc:energy" size="small" class="mt-n1" color="damage--energy" />
                  <b>ENERGY</b>
                </div>
                <div>
                  <v-icon
                    icon="cc:explosive"
                    size="small"
                    class="mt-n1"
                    color="damage--explosive"
                  />
                  <b>EXPLOSIVE</b>
                </div>
                <div>
                  <v-icon icon="cc:heat" size="small" class="mt-n1" color="damage--heat" />
                  <b>HEAT</b>
                </div>
              </v-col>
              <v-col>
                <div>
                  <v-icon icon="cc:burn" size="small" class="mt-n1" color="damage--burn" />
                  <b>BURN <i>(AP)</i></b>
                  <div class="pl-5">
                    <i>Applied at end of turn, save to clear. Persists.</i>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            bonus damage
          </legend>
          <div class="caption">
            For AoE attacks, bonus damage is halved.<br />Secondary AUX attacks made from a single
            mount deal <b>no bonus damage</b>
          </div>
        </fieldset>
      </v-col>
      <v-col>
        <fieldset class="px-2">
          <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">
            critical hits
          </legend>
          <div class="caption">
            <b>20+</b> (total) on a melee or ranged attack roll. All damage dice are rolled twice
            (inc'l bonus damage) and the highest result from each is used.
          </div>
        </fieldset>
      </v-col>
    </v-row>
    <fieldset class="px-2">
      <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">Statuses</legend>
      <v-row dense class="caption">
        <v-col
          v-for="s in statuses.filter((x) => x.StatusType === 'Status')"
          style="min-width: 14vw"
        >
          <div class="text-primary font-weight-bold">
            <v-icon :icon="s.Icon" class="mt-n1" />{{ s.Name.toUpperCase() }}
          </div>
          <div v-html-safe="s.Terse" />
        </v-col>
      </v-row>
    </fieldset>
    <fieldset class="px-2">
      <legend class="text-overline text-primary px-2 mb-n2 font-weight-bold">CONDITIONS</legend>
      <v-row dense class="caption">
        <v-col
          v-for="s in statuses.filter((x) => x.StatusType === 'Condition')"
          style="min-width: 14vw"
        >
          <div class="text-primary font-weight-bold">
            <v-icon :icon="s.Icon" class="mt-n1" />{{ s.Name.toUpperCase() }}
          </div>
          <div v-html-safe="s.Terse" />
        </v-col>
      </v-row>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

import { Status } from '@/classes/Status';

export default {
  name: 'combat-ref-print',
  computed: {
    statuses(): Status[] {
      return CompendiumStore().Statuses;
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
