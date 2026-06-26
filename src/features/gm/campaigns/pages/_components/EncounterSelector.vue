<template>
  <v-card>
    <v-toolbar density="compact">
      <v-toolbar-title>{{ $t('gm.campaign.selectEncounter') }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-text-field
      v-model="search"
      clearable
      density="compact"
      prepend-inner-icon="mdi-magnify"
      hide-details />
    <v-card-text>
      <div v-for="(encounter, i) in encounters" :key="encounter.ID" @click="$emit('select', encounter)">
        <gm-encounter-list-item :odd="i % 2 === 0" :item="encounter" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { EncounterStore } from '@/stores';
import GmEncounterListItem from '@/features/gm/_views/_components/gmItemCards/GMEncounterListItem.vue';

defineOptions({ name: 'campaign-encounter-selector' })

const emit = defineEmits<{
  'select': [payload: any]
  'close': []
}>()

const search = ref('')

const encounters = computed(() => {
      return EncounterStore()
        .Encounters.filter((x) => !x.SaveController.IsDeleted)
        .filter((x) => x.Name.toLowerCase().includes(search.value.toLowerCase()));
    })
</script>
