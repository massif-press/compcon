<template>
  <v-card v-if="!item?.Data"
    variant="outlined"
    color="panel"
    class="pa-6 ma-2">
    <div class="text-center text-caption text-disabled"><i>{{
      $t('gm.narrativeLink.noEncounterSelected') }}</i></div>
  </v-card>

  <v-card v-else
    class="pa-2 ma-2"
    variant="outlined"
    color="panel">
    <encounter-content :data="item.Data" />
  </v-card>

  <v-footer height="35">
    <v-menu v-if="item && item.Data"
      width="40vw">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          size="x-small"
          icon
          class="mt-n1 ml-n3 elevation-0">
          <v-icon size="x-large"
            icon="mdi-link-variant"
            :color="isItemLinked ? 'success' : 'rgba(155,155,155,0.5)'" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text v-if="isItemLinked">
          <div>{{ $t('gm.narrativeLink.linkedHelp') }}</div>
          <div class="my-4">{{ $t('gm.narrativeLink.relinkHelp') }}</div>
          <v-btn block
            color="error"
            variant="tonal"
            prepend-icon="mdi-link-off"
            @click="item.Unlink()">
            {{ $t('gm.narrativeLink.unlinkElement') }}
          </v-btn>
        </v-card-text>
        <v-card-text v-else>
          <div>{{ $t('gm.narrativeLink.notLinkedHelp') }}</div>
          <div class="mt-4">{{ $t('gm.narrativeLink.linkHelp') }}</div>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-spacer />
    <v-btn color="accent"
      size="small"
      variant="tonal"
      prepend-icon="cc:encounter"
      class="ml-2"
      @click="encounterDialog = true">
      {{ $t('gm.narrativeLink.setEncounter') }}
    </v-btn>

    <v-dialog v-model="encounterDialog"
      width="80vw">
      <encounter-selector @select="
        addEncounter($event);
      encounterDialog = false;
      "
        @close="encounterDialog = false" />
    </v-dialog>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { EncounterStore } from '@/stores';
import EncounterSelector from './EncounterSelector.vue';
import EncounterContent from './EncounterContent.vue';

defineOptions({ name: 'EncounterContentContainer' })

const props = defineProps<{
  item: object
}>()

const encounterDialog = ref(false)

const isItemLinked = computed(() => {
  return (
    props.item.Data &&
    props.item.Data.ID &&
    EncounterStore()
      .Encounters.filter((x) => !x.SaveController.IsDeleted)
      .find((x) => x.ID === props.item.Data.ID)
  );
})

function addEncounter(encounter) {
  props.item.Data = encounter;
}
</script>
