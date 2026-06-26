<template>
  <v-card>
    <v-card-title class="heading h2">{{ encounter.Name }}</v-card-title>
    <v-card-subtitle class="text-cc-overline">
      <span v-if="encounter.Environment.Name !== 'Default'"
        v-text="encounter.Environment.Name" />
      &mdash;
      <span v-text="encounter.Sitrep.Name" />
    </v-card-subtitle>
    <v-card-text v-if="encounter.Description"
      class="pb-0">
      <p v-html-safe="encounter.Description"
        class="text-text mb-0" />
      <div class="text-right mt-n2">
        <v-btn size="x-small"
          flat
          tile
          variant="text"
          color="accent"
          class="fade-select"
          icon
          @click="copy(encounter.Description)">
          <v-icon size="16"
            icon="mdi-content-copy" />
        </v-btn>
      </div>
    </v-card-text>

    <v-card-text v-if="encounter.NarrativeController.TextItems.length"
      class="py-0">
      <div class="text-cc-overline text-disabled">{{ $t('common.detail') }}</div>

      <div v-for="(item, index) in encounter.NarrativeController.TextItems"
        :key="`text-${index}`">
        <div class="heading h3 text-accent">{{ item.header }}</div>
        <p v-html-safe="item.body" />
        <div class="text-right mt-n2">
          <v-btn size="x-small"
            flat
            tile
            variant="text"
            color="accent"
            class="fade-select"
            icon
            @click="copy(encounter.Description)">
            <v-icon size="16"
              icon="mdi-content-copy" />
          </v-btn>
        </div>
      </div>
    </v-card-text>

    <v-card-text class="py-2">
      <div class="text-cc-overline text-disabled">{{ $t('common.sitrep') }}</div>
      <div class="heading h3 text-accent">{{ encounter.Sitrep.Name }}</div>
      <div v-for="block in sitrepBlocks"
        :key="block">
        <div v-if="encounter.Sitrep[block].length"
          class="mb-4">
          <div class="text-cc-overline">{{ block }}</div>
          <p v-html-safe="encounter.Sitrep[block]"
            class="text-text" />
          <div class="text-right mt-n2">
            <v-btn size="x-small"
              flat
              tile
              variant="text"
              color="accent"
              class="fade-select"
              icon
              @click="copy(`SITREP.${block.toLocaleUpperCase()} // ${encounter.Sitrep[block]}`)">
              <v-icon size="16"
                icon="mdi-content-copy" />
            </v-btn>
          </div>
        </div>
      </div>
    </v-card-text>

    <v-card-text class="py-2">
      <div class="text-cc-overline text-disabled">{{ $t('common.environment') }}</div>
      <div class="heading h3 text-accent">{{ encounter.Environment.Name }}</div>
      <p v-html-safe="encounter.Environment.Description"
        class="text-text" />
      <div class="text-right mt-n2">
        <v-btn size="x-small"
          flat
          tile
          variant="text"
          color="accent"
          class="fade-select"
          icon
          @click="copy(`ENVIRONMENT.DETAIL // ${encounter.Environment.Description}`)">
          <v-icon size="16"
            icon="mdi-content-copy" />
        </v-btn>
      </div>
    </v-card-text>

    <v-card-text>
      <div class="text-cc-overline text-disabled">{{ $t('active.encInfo.reinforcements') }}</div>
      <span v-if="!reinforcementsByTurn.length"
        class="text-disabled">
        {{ $t('active.encInfo.noReinforcements') }}
      </span>
      <cc-panel v-else
        variant="outlined"
        class="ml-2">
        <v-row v-for="reinforcement in reinforcementsByTurn"
          :key="reinforcement.turn"
          dense
          align="center">
          <v-col cols="auto"
            class="text-accent heading"><span v-if=reinforcement.turn>{{ $t('active.encInfo.turnN', { n: reinforcement.turn }) }}</span>
            <span v-else> {{ $t('active.encInfo.freeDeployment') }}</span></v-col>
          <v-col>
            <ul class="text-text">
              <li v-for="combatant in reinforcement.combatants"
                :key="combatant.id">
                {{ combatant.actor.Name }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </cc-panel>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { Encounter } from '@/classes/encounter/Encounter'
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import * as _ from 'lodash-es';

defineOptions({ name: 'EncounterInfo' })

const props = withDefaults(defineProps<{
  encounter: Encounter
  encounterInstance?: EncounterInstance
}>(), {
  encounterInstance: null
})

const sitrepBlocks = ref(['Description', 'Deployment', 'Objective', 'Extraction', 'Conditions'])

const reinforcementsByTurn = computed(() => {
      const source = props.encounterInstance || props.encounter;
      if (!source || !source.Combatants) return [];

      const reinforcements = {};
      source.Combatants.forEach((combatant) => {
        if (combatant.reinforcement) {
          const turn = combatant.reinforcementTurn || 0;
          if (!reinforcements[turn]) {
            reinforcements[turn] = [];
          }
          reinforcements[turn].push(combatant);
        }
      });
      const res = Object.entries(reinforcements).map(([turn, combatants]) => ({
        turn: Number(turn),
        combatants,
      }));
      return _.sortBy(res, 'turn');
    })

function copy(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          notify({
            text: t('active.common.copiedToClipboard'),
            color: 'success',
          });
        })
        .catch((err) => {
          notify({
            text: t('active.encounter.failedToCopyTitle'),
            color: 'error',
          });
        });
    }
</script>
