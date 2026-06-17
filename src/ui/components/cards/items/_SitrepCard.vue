<template>
  <v-card-text class="text-text pt-1 mb-2">
    <p v-html-safe="item.Description"
      class="flavor-text pb-2 mb-4" />
    <v-row>
      <v-col v-for="(c, index) in item.Conditions"
        :key="`condition-${index}`">
        <div class="heading h2 text-primary mb-2">{{ c.title }}</div>
        <p v-html-safe="c.condition" />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-if="item.Deployment">
        <div class="heading h2 text-primary mb-2">{{ $t('common.deployment') }}</div>
        <p v-html-safe="item.Deployment" />
      </v-col>
      <v-col v-if="item.Extraction">
        <div class="heading h2 text-primary mb-2">{{ $t('ui.card.extraction') }}</div>
        <p v-html-safe="item.Extraction" />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-if="item.ControlZone">
        <div class="heading h2 text-primary mb-2">{{ $t('ui.card.controlZone') }}</div>
        <p v-html-safe="item.ControlZone" />
      </v-col>
      <v-col v-if="item.Objective">
        <div class="heading h2 text-primary mb-2">{{ $t('common.objective') }}</div>
        <p v-html-safe="item.Objective" />
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import type { Sitrep } from '@/classes/encounter/Sitrep'
defineProps<{
  item: Sitrep
}>()
</script>
