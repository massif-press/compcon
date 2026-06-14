<template>
  <div v-if="item"
    class="text-text">
    <v-row>
      <v-col>
        <v-row dense>
          <v-col>
            <div class="heading h2 mt-n2 mb-n1">
              {{ item.Name }}
            </div>
          </v-col>
        </v-row>
        <CCSitrepDisplay :sitrep="item.Sitrep" />
        <CCEnvironmentDisplay :environment="item.Environment" />
      </v-col>
      <v-col cols="3"
        class="text-center ml-auto">
        <v-card>
          <v-tabs v-model="mapTab"
            grow
            color="secondary"
            bg-color="panel"
            density="compact">
            <v-tab>{{ $t('gm.encounterContent.map') }}</v-tab>
            <v-tab>{{ $t('gm.encounterContent.image') }}</v-tab>
          </v-tabs>
          <v-window v-model="mapTab">
            <v-window-item>
              <v-card style="height: 100%"
                variant="outlined">
                <v-row style="min-height: 22vw; max-width: 100%"
                  align="center"
                  justify="center">
                  <v-col>
                    <i class="text-disabled text-caption">{{ $t('gm.encounterContent.noMapData')
                    }}</i>
                  </v-col>
                </v-row>
              </v-card>
            </v-window-item>
            <v-window-item>
              <cc-img :src="item.PortraitController.Image" />
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-card variant="tonal"
      class="ma-2">
      <p class="pa-2"
        v-html-safe="item.Description" />
    </v-card>

    <combatant-editor :encounter="item"
      readonly />

    <v-divider v-if="
      item.NarrativeController.TextItems.length ||
      item.NarrativeController.Clocks.length ||
      item.NarrativeController.Tables.length
    "
      class="my-4" />

    <div class="text-text px-4">
      <v-card v-for="(t, index) in item.NarrativeController.TextItems"
        :key="`text-${index}`"
        variant="plain">
        <div class="heading mt-1">{{ t.header }}</div>
        <p class="pl-4"
          v-html-safe="t.body" />
      </v-card>
      <cc-clock v-for="(c, index) in item.NarrativeController.Clocks"
        :key="`clock-${index}`"
        :clock="c"
        density="compact"
        class="my-2"
        readonly />
      <cc-rollable-table v-for="(t, index) in item.NarrativeController.Tables"
        :key="`table-${index}`"
        :table="t"
        density="compact"
        class="my-2"
        readonly />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { EncounterStore } from '@/stores';
import CCEnvironmentDisplay from '@/ui/components/CCEnvironmentDisplay.vue'
import CCSitrepDisplay from '@/ui/components/CCSitrepDisplay.vue'
import CombatantEditor from '@/features/gm/encounters/_components/combatants/CombatantEditor.vue';

defineOptions({ name: 'narrative-content' })

const props = defineProps<{
  data: object
}>()

const mapTab = ref(0)

const item = computed(() => {
  const refElement = EncounterStore()
    .Encounters.filter((x) => !x.SaveController.IsDeleted)
    .find((x) => x.ID === props.data?.ID);
  if (refElement) return refElement;
  return props.data;
})
const combatants = computed(() => {
  return {
    Enemies: item.value.Combatants.filter((x) => x.side === 'enemy'),
    Allies: item.value.Combatants.filter((x) => x.side === 'ally'),
    Neutral: item.value.Combatants.filter((x) => x.side === 'neutral'),
  };
})
</script>
