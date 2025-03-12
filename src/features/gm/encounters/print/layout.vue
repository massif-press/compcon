<template>
  <div class="text-black pa-2">
    <div class="heading h2 mt-n2">
      {{ encounter.Name }}
    </div>

    <div v-html-safe="encounter.Description" class="pl-2 mt-n1" />
  </div>

  <fieldset
    class="pb-2 px-2 mx-2 mt-n3 text-caption"
    style="border-radius: 4px; border: 1px solid grey">
    <legend class="text-overline ml-3">
      <v-chip variant="outlined" size="x-small" style="border-color: grey">
        <span>SITREP</span>
        <cc-slashes class="mx-1" />
        <b>{{ encounter.Sitrep.Name }}</b>
      </v-chip>
    </legend>
    <div v-if="encounter.Sitrep.Description">
      <div class="text-caption"><b>Description</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Description }}
    </div>
    <div v-if="encounter.Sitrep.Deployment" class="mt-1">
      <div class="text-caption"><b>Deployment</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Deployment }}
    </div>
    <div v-if="encounter.Sitrep.ControlZone" class="mt-1">
      <div class="text-caption"><b>Control Zone</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.ControlZone }}
    </div>
    <div v-if="encounter.Sitrep.Extraction" class="mt-1">
      <div class="text-caption"><b>Extraction</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Extraction }}
    </div>
    <div v-if="encounter.Sitrep.Objective" class="mt-1">
      <div class="text-caption"><b>Objective</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Objective }}
    </div>
    <div v-for="c in encounter.Sitrep.Conditions" class="mt-1">
      <div class="text-caption">
        <b>{{ c.title }}</b>
      </div>
      <v-divider style="width: 150px" />

      {{ c.condition }}
    </div>
  </fieldset>

  <fieldset class="pb-2 px-2 mx-2 text-caption" style="border-radius: 4px; border: 1px solid grey">
    <legend class="text-overline ml-3">
      <v-chip variant="outlined" size="x-small" style="border-color: grey">
        <span>ENVIRONMENT</span>
        <cc-slashes class="mx-1" />
        <b>{{ encounter.Environment.Name }}</b>
      </v-chip>
    </legend>
    <div v-if="encounter.Environment.Description">
      <div class="text-caption"><b>Description</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Environment.Description }}
    </div>
  </fieldset>

  <fieldset
    class="pb-2 px-2 mx-2 mt-1 text-caption"
    style="border-radius: 4px; border: 1px solid grey">
    <legend>
      <v-icon icon="cc:mech" class="mt-n1" color="error" />
      {{ encounter.Combatants.filter((x) => x.side === 'enemy').length }}
      ENEMIES
      <cc-slashes class="mx-2" />
      <v-icon icon="cc:mech" class="mt-n1" color="success" />
      {{ encounter.Combatants.filter((x) => x.side === 'ally').length }}
      ALLIES
      <cc-slashes class="mx-2" />
      <v-icon icon="cc:mech" class="mt-n1" />
      {{ encounter.Combatants.filter((x) => x.side === 'neutral').length }}
      NEUTRAL
    </legend>
    <div v-for="(n, i) in SortedCombatants">
      <v-card class="pa-2" color="transparent">
        <v-row dense class="bg-grey-lighten-3" style="border-radius: 4px">
          <v-col v-if="n.playerCount > 1" cols="auto">
            <v-icon icon="mdi-account-group" color="accent" class="mr-1" />
            At
            <b>{{ n.playerCount }}</b>
            or more PCs
          </v-col>
          <v-col v-if="n.reinforcement" cols="auto">
            <v-icon icon="mdi-refresh" color="accent" class="mr-1" />
            <b>REINFORCEMENT</b>
          </v-col>
          <v-col v-if="n.reinforcement && n.reinforcementTurn > 0" cols="auto">
            <cc-slashes />
            Reinforces on Turn {{ n.reinforcementTurn }}
          </v-col>
        </v-row>

        <component :is="getComponentByType(n.type)" :npc="<Npc>n.npc" :options="UnitOptions" />
      </v-card>
      <page-break v-if="i + 1 < encounter.Combatants.length" />
    </div>
  </fieldset>

  <div class="mt-n3">
    <fieldset v-if="encounter.NarrativeController.TextItems.length" class="mx-1 my-2 px-3">
      <div v-for="t in encounter.NarrativeController.TextItems">
        <div class="font-weight-bold mb-n2" v-text="t.header" />
        <div v-html-safe="t.body" class="pl-2" />
      </div>
    </fieldset>

    <div v-if="encounter.NarrativeController.Clocks.length" class="mx-1 my-2">
      <v-card
        v-for="c in encounter.NarrativeController.Clocks"
        variant="outlined"
        class="text-caption px-2 pb-1">
        <div class="font-weight-bold text-caption" v-text="c.Title" />
        <v-row no-gutters>
          <v-col v-for="n in c.Segments" class="px-1">
            <blank-line :height="20" />
          </v-col>
        </v-row>
        <div v-if="c.Description" class="font-weight-bold text-caption" v-text="'Description'" />
        <div v-html-safe="c.Description" class="pl-2" />
        <div v-if="c.Resolution" class="font-weight-bold text-caption" v-text="'Resolution'" />
        <div v-html-safe="c.Resolution" class="pl-2" />
      </v-card>
    </div>

    <div v-if="encounter.NarrativeController.Tables.length" class="mx-1 my-2">
      <v-card
        v-for="t in encounter.NarrativeController.Tables"
        variant="outlined"
        class="text-caption px-2">
        <div class="font-weight-bold text-caption" v-text="t.Title" />
        <div v-html-safe="t.Description" class="pl-2" />
        <v-row dense v-for="r in t.Results">
          <v-col cols="auto">
            <b>{{ r.min }}-{{ r.max }}</b>
          </v-col>
          <v-col>{{ r.result }}</v-col>
        </v-row>
      </v-card>
    </div>

    <fieldset v-if="options.include.includes('append lined section')" class="mx-1 my-2 px-3">
      <div class="mb-4"><notes :rows="16" lined /></div>
    </fieldset>

    <fieldset v-if="options.include.includes('append unlined section')" class="mx-1 my-2 px-3">
      <div class="mb-4"><notes :rows="16" /></div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import UnitPrint from '@/features/gm/npc_roster/print/layouts/UnitPrint.vue';
import EidolonPrint from '@/features/gm/npc_roster/print/layouts/EidolonPrint.vue';
import DoodadPrint from '@/features/gm/npc_roster/print/layouts/DoodadPrint.vue';

import Notes from './components/blank/notes.vue';
import BlankLine from './components/blank/line.vue';
import PageBreak from './components/PageBreak.vue';
import { Npc } from '@/classes/npc/Npc';
import _ from 'lodash';

export default {
  name: 'combined-print',
  components: {
    Notes,
    BlankLine,
    PageBreak,
  },

  props: {
    encounter: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  computed: {
    SortedCombatants() {
      return _.sortBy(this.encounter.Combatants, (x) => x.playerCount);
    },
    UnitOptions() {
      const options = { ...this.options };
      options.include = [];
      return options;
    },
  },
  methods: {
    getComponentByType(npc) {
      switch (npc) {
        case 'unit':
          return UnitPrint;
        case 'eidolon':
          return EidolonPrint;
        default:
          return DoodadPrint;
      }
    },
  },
};
</script>
