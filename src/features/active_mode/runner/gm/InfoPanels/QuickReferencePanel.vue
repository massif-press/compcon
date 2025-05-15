<template>
  <v-card>
    <div class="heading h2 pa-2">COMBAT REFERENCE</div>
    <v-card-text class="pt-0">
      <fieldset class="px-2 py-1 mb-4">
        <legend class="text-cc-overline text-accent px-2 font-weight-bold">Per Turn</legend>

        <v-row dense>
          <v-col>
            <v-card color="action--protocol" class="text-center py-1">
              <v-icon size="large" icon="cc:protocol" />
              <div class="heading caption">protocols</div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card color="action--full" class="text-center py-1">
              <v-icon size="large" icon="mdi-hexagon-slice-6" />
              <v-icon size="large" class="text-disabled">mdi-swap-horizontal</v-icon>
              <v-icon size="large" icon="mdi-hexagon-slice-3" />
              <v-icon size="large" icon="mdi-hexagon-slice-3" />
              <div class="heading caption">full action or 2 quick actions</div>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--move" class="text-center py-1">
              <v-icon size="large" icon="mdi-arrow-right-bold-hexagon-outline" />
              <div class="heading caption">movement</div>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="overcharge" class="text-center py-1">
              <v-icon size="large" icon="cc:overcharge" />
              <div class="heading caption">overcharge</div>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--free" class="text-center py-1">
              <v-icon size="large" icon="cc:free_action" />
              <div class="heading caption">free actions</div>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--reaction" class="text-center py-1">
              <v-icon size="large" icon="cc:reaction" />
              <div class="heading caption">reactions</div>
            </v-card>
          </v-col>
        </v-row>
        <div class="caption font-italic text-center py-1">
          Characters cannot perform the same action more than once in a turn, except as a free
          action or reaction.
        </div>
      </fieldset>

      <v-row class="mb-2" dense>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2" style="height: 100%">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">Engagement</legend>
            <p class="mb-1">
              If a character moves adjacent to a hostile character, they both gain
              <b>ENGAGED</b>
              for as long as they remain adjacent. Ranged attacks made while
              <b>ENGAGED</b>
              receive
              <v-icon icon="cc:difficulty" class="mt-n1" size="small" />
              .
            </p>
            <p>
              Characters that become
              <b>ENGAGED</b>
              by targets of
              <b>greater or equal SIZE</b>
              during movement stop immediately and lose unused movement.
            </p>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2" style="height: 100%">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">Terrain</legend>
            <div class="mb-1">
              All movement through
              <b>difficult terrain</b>
              costs
              <b>double</b>
              .
            </div>
            <div>
              When characters end their turn in
              <b>dangerous terrain</b>
              or move into it for the first time in a round, they must make an
              <b>ENGINEERING</b>
              check. On a failure, they take 5 damage
            </div>
          </fieldset>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2" style="height: 100%">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              Roll Modifiers
            </legend>
            <p class="mb-1">
              Each point of
              <v-icon icon="cc:accuracy" class="mt-n1" size="small" />
              adds 1d6 to a roll.
            </p>
            <p class="mb-1">
              Each point of
              <v-icon icon="cc:difficulty" class="mt-n1" size="small" />
              subtracts 1d6 from a roll.
            </p>
            <p>
              <v-icon icon="cc:accuracy" class="mt-n1" size="small" />
              and
              <v-icon icon="cc:difficulty" class="mt-n1" size="small" />
              cancel each other out on a 1:1 basis. No roll can ever receive more than -6 or +6 from
              <v-icon icon="cc:accuracy" class="mt-n1" size="small" />
              or
              <v-icon icon="cc:difficulty" class="mt-n1" size="small" />
              .
            </p>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2" style="height: 100%">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">Cover</legend>
            <p class="mb-1">
              <b>Soft cover</b>
              adds +1
              <v-icon icon="cc:difficulty" class="mt-n1" size="small" />
              to any ranged attacks.
            </p>

            <p class="mb-1">
              <b>Hard cover</b>
              adds +2
              <v-icon icon="cc:difficulty" class="mt-n1" size="small" />
              to any ranged attacks. Characters only benefit from hard cover if they are adjacent to
              whatever they’re using for cover and are the same
              <b>SIZE</b>
              or smaller.
            </p>

            <p>Characters can only benefit from one type of cover at a time.</p>
          </fieldset>
        </v-col>
      </v-row>
      <cc-icon-divider icon="cc:weapon" class="mt-1" />
      <v-row dense>
        <v-col style="min-width: 300px">
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              SKIRMISH
              <v-icon icon="mdi-hexagon-slice-3" color="action--quick" />
            </legend>
            <div>
              Attack with a
              <b>single weapon mount</b>
            </div>
          </fieldset>
        </v-col>
        <v-col style="min-width: 500px">
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              BARRAGE
              <v-icon icon="mdi-hexagon-slice-6" color="action--full" />
            </legend>
            <div>
              Attack with
              <b>two weapon mounts</b>
              <b class="text-secondary pl-1">OR</b>
              a
              <b>superheavy weapon</b>
            </div>
          </fieldset>
        </v-col>
        <v-col style="min-width: 200px">
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              IMPROVISED ATTACK
              <v-icon icon="mdi-hexagon-slice-6" color="action--full" />
            </legend>
            <div>
              Deal 1d6
              <v-icon icon="cc:kinetic" color="damage--kinetic" class="mt-n1 mx-n1" />
            </div>
          </fieldset>
        </v-col>
        <v-col style="min-width: 400px">
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              RAM
              <v-icon icon="mdi-hexagon-slice-3" color="action--quick" />
            </legend>
            <div>
              Target takes
              <b>PRONE</b>
              and
              <b>KNOCKBACK 1</b>
              (optional)
            </div>
          </fieldset>
        </v-col>
        <v-col style="min-width: 200px">
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              GRAPPLE
              <v-icon icon="mdi-hexagon-slice-3" color="action--quick" />
            </legend>
            <div>
              Deal 1d6
              <v-icon icon="cc:kinetic" color="damage--kinetic" class="mt-n1 mx-n1" />
            </div>
          </fieldset>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              melee attacks
            </legend>
            <div class="text-center">
              <v-chip size="small" variant="elevated" class="mb-1" color="action--full">
                <v-icon icon="mdi-dice-d20" start size="x-large" />
                + GRIT vs EVASION
              </v-chip>
            </div>
            <div class="caption text-center">
              Target within
              <v-icon icon="cc:threat" class="mt-n1 ml-n1" />
              <b>THREAT</b>
              and
              <b>LOS</b>
            </div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              ranged attacks
            </legend>
            <div class="text-center">
              <v-chip size="small" variant="elevated" class="mb-1" color="action--full">
                <v-icon icon="mdi-dice-d20" start size="x-large" />
                + GRIT vs EVASION
              </v-chip>
            </div>
            <div class="caption text-center">
              Target within
              <v-icon icon="cc:range" class="mt-n1 ml-n1" />
              <b>RANGE</b>
              and
              <b>LOS</b>
            </div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">tech attacks</legend>
            <div class="text-center">
              <v-chip size="small" variant="elevated" class="mb-1" color="action--tech">
                <v-icon icon="mdi-dice-d20" start size="x-large" />
                + TECH ATK. vs E-DEF
              </v-chip>
            </div>
            <div class="caption text-center">
              Target within
              <v-icon icon="cc:sensor" class="mt-n1" />
              <b>SENSORS</b>
              and
              <b>LOS</b>
            </div>
          </fieldset>
        </v-col>
      </v-row>

      <fieldset class="px-3 pt-1 pb-2 mt-3">
        <legend class="text-cc-overline text-accent px-2 font-weight-bold">
          Area of Effect Patterns
        </legend>
        <v-row>
          <v-col>
            <div class="font-weight-bold text-accent">
              <v-icon icon="cc:line" size="small" class="mt-n1" />
              LINE X
            </div>
            <div>Affects a straight line, X spaces long.</div>
          </v-col>
          <v-col>
            <div class="font-weight-bold text-accent">
              <v-icon icon="cc:cone" size="small" class="mt-n1" />
              CONE X
            </div>
            <div>
              Affects a cone, X spaces long and X spaces wide at its furthest point. Starts at 1
              space wide.
            </div>
          </v-col>
          <v-col>
            <div class="font-weight-bold text-accent">
              <v-icon icon="cc:blast" size="small" class="mt-n1" />
              BLAST X
            </div>
            <div>
              Affects a radius of X spaces, drawn from a point within
              <v-icon icon="cc:range" class="mt-n1" />
              and LOS.
            </div>
          </v-col>
          <v-col>
            <div class="font-weight-bold text-accent">
              <v-icon icon="cc:burst" size="small" class="mt-n1" />
              BURST X
            </div>
            <div>Affects a radius of X spaces, centered on the user (or target).</div>
          </v-col>
        </v-row>
        <v-divider class="my-1" />
        <div class="caption font-italic text-center py-1">
          AoE Attack Rolls are made for each target. One damage roll is applied to all targets.
          Bonus damage is halved.
        </div>
      </fieldset>

      <v-row dense class="mt-3">
        <v-col>
          <fieldset class="px-3 pt-1 pb-2">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">damage types</legend>
            <div>
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
                      color="damage--explosive" />
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
                    <b>
                      BURN
                      <i>(AP)</i>
                    </b>
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
          <fieldset class="px-3 pt-1 pb-2" style="height: 100%">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">bonus damage</legend>
            <div>
              For AoE attacks, bonus damage is halved.
              <br />
              Secondary AUX attacks made from a single mount deal
              <b>no bonus damage</b>
            </div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset class="px-3 pt-1 pb-2" style="height: 100%">
            <legend class="text-cc-overline text-accent px-2 font-weight-bold">
              critical hits
            </legend>
            <div>
              <b>20+</b>
              (total) on a melee or ranged attack roll. All damage dice are rolled twice (inc'l
              bonus damage) and the highest result from each is used.
            </div>
          </fieldset>
        </v-col>
      </v-row>
      <fieldset class="px-3 pt-1 pb-2 mt-3">
        <legend class="text-cc-overline text-accent px-2 font-weight-bold">Statuses</legend>
        <v-row dense>
          <v-col
            v-for="s in statuses.filter((x) => x.StatusType === 'Status')"
            style="min-width: 14vw">
            <v-card class="bg-panel pa-2" flat height="100%">
              <div class="text-accent font-weight-bold">
                <v-icon :icon="s.Icon" class="mt-n1" />
                {{ s.Name.toUpperCase() }}
              </div>
              <v-divider class="my-1" />
              <div v-html-safe="s.Terse" />
            </v-card>
          </v-col>
        </v-row>
      </fieldset>

      <fieldset class="px-3 pt-1 pb-2 mt-3">
        <legend class="text-cc-overline text-accent px-2 font-weight-bold">CONDITIONS</legend>
        <v-row dense>
          <v-col
            v-for="s in statuses.filter((x) => x.StatusType === 'Condition')"
            style="min-width: 14vw">
            <v-card class="bg-panel pa-2" flat height="100%">
              <div class="text-accent font-weight-bold">
                <v-icon :icon="s.Icon" class="mt-n1" />
                {{ s.Name.toUpperCase() }}
              </div>
              <v-divider class="my-1" />
              <div v-html-safe="s.Terse" />
            </v-card>
          </v-col>
        </v-row>
      </fieldset>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

import { Status } from '@/classes/Status';

export default {
  name: 'combat-ref-encounter',
  computed: {
    statuses(): Status[] {
      return CompendiumStore().Statuses;
    },
  },
};
</script>
