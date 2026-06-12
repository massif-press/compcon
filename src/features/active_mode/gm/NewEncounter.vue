<template>
  <v-container :fluid="$vuetify.display.mdAndDown">
    <div class="heading h2">{{ $t('active.newEnc.title') }}</div>
    <v-row dense class="mt-4" align="center">
      <v-col cols="1" class="text-center">
        <v-icon icon="cc:encounter"
          :color="encounter ? 'success' : 'panel'"
          size="50" />
      </v-col>
      <v-col cols="11">
        <div class="text-cc-overline mb-1">
          <cc-slashes class="pr-1" />
          <span class="text-disabled">{{ $t('active.newEnc.encounterData') }}</span>
        </div>
        <cc-panel>
          <v-slide-x-transition leave-absolute>
            <div v-if="!emptyEncounter">
              <cc-titled-divider v-if="!encounter" title="select encounter" color="accent" class="mb-1" />
              <v-row v-if="!encounter" dense align="center">
                <v-col cols="4">
                  <cc-text-field v-model="search" color="primary" density="compact"
                    hide-details icon="mdi-magnify" clearable />
                </v-col>
                <v-col cols="auto">
                  <v-icon icon="mdi-folder" class="d-inline" />
                </v-col>
                <v-col cols="4">
                  <cc-select v-model="folder" :items="folders" color="primary"
                    density="compact" chip-variant="text" hide-details />
                </v-col>
              </v-row>

              <div class="pa-1" style="max-height: 60vh; overflow-y: scroll; overflow-x: hidden">
                <v-row v-for="(enc, i) in encounters"
                  v-show="!selectedEncounter || selectedEncounter.ID === enc.ID"
                  :key="enc.ID"
                  no-gutters style="position: relative" class="mb-1 pa-1"
                  @click="selectedEncounter = enc">
                  <v-slide-x-transition leave-absolute>
                    <v-col v-if="selectedEncounter && selectedEncounter.ID === enc.ID" cols="auto">
                      <div class="mr-1 bg-success" style="width: 10px; height: 100%" />
                    </v-col>
                  </v-slide-x-transition>
                  <v-col class="py-1 mr-2">
                    <gm-encounter-list-item :odd="i % 2 === 0"
                      :item="enc"
                      :is-selected="selectedEncounter?.ID === enc.ID" />
                  </v-col>
                  <v-slide-x-reverse-transition leave-absolute>
                    <v-col v-if="selectedEncounter" cols="auto" class="ml-n1">
                      <v-btn color="primary" flat tile stacked height="100%"
                        icon="mdi-close" size="large"
                        @click.stop="selectedEncounter = null" />
                    </v-col>
                  </v-slide-x-reverse-transition>
                </v-row>
              </div>
            </div>
          </v-slide-x-transition>

          <v-slide-x-transition leave-absolute>
            <cc-panel v-if="emptyEncounter">
              <cc-titled-divider title="New Encounter" color="accent" />
              <sitrep-editor :item="emptyEncounter" />
              <environment-editor :item="emptyEncounter" />
            </cc-panel>
          </v-slide-x-transition>

          <div v-if="encounter">
            <cc-alert class="my-1">
              <v-icon icon="mdi-information-outline" class="mr-2" />
              {{ $t('active.newEnc.additionalNpcs') }}
            </cc-alert>
          </div>

          <v-row dense justify="space-between" class="mt-2">
            <v-col cols="auto">
              <v-slide-x-transition>
                <cc-button v-if="!!emptyEncounter" size="small" color="error"
                  prepend-icon="mdi-close"
                  @click="clearEmptyEncounter()">
                  {{ $t('common.cancel') }}
                </cc-button>
              </v-slide-x-transition>
            </v-col>
            <v-slide-x-reverse-transition>
              <v-col v-if="!selectedEncounter && !emptyEncounter" cols="auto">
                <cc-button size="small" color="primary" prepend-icon="mdi-card-plus-outline"
                  @click="useEmptyEncounter()">
                  {{ $t('classes.newEncounter') }}
                </cc-button>
              </v-col>
            </v-slide-x-reverse-transition>
          </v-row>
        </cc-panel>
      </v-col>
    </v-row>

    <v-slide-y-transition>
      <encounter-pilots-panel v-if="selectedEncounter || emptyEncounter"
        :encounter="encounter"
        :pilots="pilots"
        :placeholders="placeholders"
        @remove-pilot="removePilot"
        @remove-placeholder="placeholders.splice($event, 1)"
        @add-pilot="pilots.push($event)"
        @add-placeholder="addPlaceholder()" />
    </v-slide-y-transition>

    <v-slide-y-transition>
      <encounter-summary v-if="encounter"
        :encounter="encounter"
        :pilots="pilots"
        :placeholders="placeholders"
        @create="createEncounter"
        @cancel="reset()" />
    </v-slide-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CompendiumStore, EncounterStore } from '@/stores';
import GmEncounterListItem from '@/features/gm/_views/_components/gmItemCards/GMEncounterListItem.vue';
import { Encounter } from '@/classes/encounter/Encounter';
import SitrepEditor from '@/features/gm/encounters/_components/SitrepEditor.vue';
import EnvironmentEditor from '@/features/gm/encounters/_components/EnvironmentEditor.vue';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { Placeholder } from '@/classes/encounter/Placeholder';
import EncounterPilotsPanel from './_components/EncounterPilotsPanel.vue';
import EncounterSummary from './_components/EncounterSummary.vue';

const router = useRouter()

defineOptions({ name: 'ActiveNewEncounter' })

const emit = defineEmits<{
  'select': []
  'close': []
}>()

const search = ref('')
const folder = ref('All')
const emptyEncounter = ref(null as any)
const selectedEncounter = ref(null as any)
const pilots = ref([] as any[])
const placeholders = ref([] as any[])

const encounter = computed(() => selectedEncounter.value || emptyEncounter.value)
const folders = computed(() => EncounterStore().Folders)
const encounters = computed(() => {
  let enc = EncounterStore().Encounters;
  if (folder.value && folder.value !== 'All') enc = enc.filter((x) => x.FolderController.Folder === folder.value);
  if (!search.value) return enc.filter((x) => !x.SaveController.IsDeleted);
  return enc.filter((x) => !x.SaveController.IsDeleted)
    .filter((x) => x.Name.toLowerCase().includes(search.value.toLowerCase()));
})

function addPlaceholder() {
  placeholders.value.push(new Placeholder({
    id: `placeholder-${placeholders.value.length + 1}`,
    name: '', Mechname: '', type: 'pilot', side: 'ally',
  }));
}
function useEmptyEncounter() { emptyEncounter.value = new Encounter(); }
function clearEmptyEncounter() {
  EncounterStore().DeleteEncounterPermanent(emptyEncounter.value);
  emptyEncounter.value = null;
}
function removePilot(pilot: any) {
  pilots.value = pilots.value.filter((p) => p.ID !== pilot.ID);
  placeholders.value = placeholders.value.filter((p) => p.id !== pilot.id);
}
async function createEncounter(launch: boolean) {
  if (!encounter.value) return;
  const instance = new EncounterInstance(undefined, encounter.value, pilots.value, placeholders.value);
  instance.Combatants.forEach(c => {
    c.actor.CombatController.Reset()
    c.actor.CombatController.StartEncounter()
  });
  await EncounterStore().AddEncounterInstance(instance);
  await EncounterStore().SetActiveEncounter(instance.ID);
  if (launch) router.push('gm-encounter-runner');
  else router.push('manage-encounters');
}
function reset() {
  selectedEncounter.value = null;
  emptyEncounter.value = null;
  pilots.value = [];
  placeholders.value = [];
  router.push('manage-encounters');
}
</script>
