<template>
  <v-card min-height="90vh"
    flat
    tile>
    <v-toolbar flat
      tile
      density="compact"
      color="primary"
      height="46">
      <v-toolbar-title class="heading h3">{{ $t('active.tableIndex.title') }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon
        @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="selected">
      <div class="heading bg-primary px-5">
        <span class="text-disabled pr-2">{{ $t('active.common.currentlySelected') }}:</span>
        <strong v-if="selected">
          {{ actor.Name }}
        </strong>
        <span v-else
          class="text-disabled">{{ $t('common.none') }}</span>
      </div>
    </div>
    <v-card-text class="pb-0">
      <v-row>
        <v-col :cols="portrait ? '12' : 'auto'"
          style="min-width: 300px;">
          <v-list v-model="selectedTable"
            density="compact"
            slim>
            <div class="text-cc-overline">{{ $t('active.tableIndex.encounterTables') }}</div>
            <v-list-item v-for="t in tables"
              :key="t.ID"
              :class="selectedTable?.ID === t.ID && 'bg-primary border-sm'"
              :title="t.Title"
              :subtitle="t.LcpName"
              :append-icon="t.InLcp ? 'cc:compendium' : ''"
              @click="selectedTable = t" />
            <div v-if="otherTables.length">
              <v-divider class="my-2" />
              <div class="text-cc-overline">{{ $t('active.tableIndex.otherTables') }}</div>
              <v-list-item v-for="t in otherTables"
                :key="t.ID"
                :class="selectedTable?.ID === t.ID && 'bg-primary border-sm'"
                :title="t.Title"
                @click="selectedTable = t" />
            </div>
          </v-list>
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-card flat
            tile>
            <cc-alert v-if="!isCoreTable"
              color="background"
              class="mb-2 border-s-xl border-accent"
              icon="mdi-warning">
              <div class="text-caption">
                {{ $t('active.tableIndex.coreOnly') }}
              </div>
            </cc-alert>

            <div v-if="selectedTable">
              <cc-rollable-table :table="selectedTable"
                show-description
                readonly />
              <cc-button size="small"
                block
                color="primary"
                prepend-icon="mdi-dice-d20"
                class="my-2"
                @click="roll(selectedTable)">
                {{ $t('common.roll_verb') }} {{ `${selectedTable.Mult}d${selectedTable.Die}` }}
              </cc-button>
            </div>
            <div v-else
              class="text-disabled text-cc-overline text-center py-4">
              {{ $t('active.tableIndex.selectTable') }}
            </div>
            <v-scroll-y-reverse-transition>
              <cc-panel v-if="results[selectedTable.ID].roll"
                :title="$t('common.result')">
                <v-row align="center"
                  class="mb-1">
                  <v-col cols="auto"
                    class="text-center">
                    <div class="heading h1">{{ results[selectedTable.ID].roll }}</div>
                  </v-col>
                  <v-col>
                    <p v-html-safe="results[selectedTable.ID].result" />
                  </v-col>
                </v-row>
              </cc-panel>
            </v-scroll-y-reverse-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { RollableTable } from '@/classes/narrative/elements/RollableTable';
import { CompendiumStore } from '@/stores';

const _display = useDisplay()

const props = defineProps<{
  selected?: object
  instance: object
}>()

const selectedTable = ref(null)
const results = ref([])

const portrait = computed(() => {
      return !_display.mdAndUp.value
    })
const isCoreTable = computed(() => {
      const core = ['core-structure-damage', 'core-overheating'];
      return selectedTable.value && selectedTable.value.ID;
    })
const tables = computed(() => {
      return CompendiumStore().Tables;
    })
const otherTables = computed(() => {
      return props.instance.Encounter.NarrativeController.Tables;
    })
const allTables = computed(() => {
      return [...tables.value, ...otherTables.value];
    })

selectedTable.value = tables.value[0] || otherTables.value[0] || null;
results.value = allTables.value.reduce((acc, t) => {
  acc[t.ID] = { roll: null, result: null };
  return acc;
}, {});

const actor = computed(() => {
      return props.selected ? props.selected.actor : null;
    })

function roll(t) {
      results.value[t.ID] = t.Roll();
    }
</script>
