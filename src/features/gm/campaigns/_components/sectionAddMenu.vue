<template>
  <v-menu width="600px" :location="main ? 'right' : 'top'" y-offset>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :size="main ? 'x-small' : 'small'"
        variant="tonal"
        :block="main"
        :color="main ? 'accent' : ''"
        prepend-icon="mdi-plus"
        :disabled="item.Depth >= 10">
        {{ main ? $t('gm.campaign.addSectionBtn') : $t('gm.titles.addSubsection') }}
      </v-btn>
    </template>
    <v-card variant="outlined" color="panel">
      <v-list density="compact" lines="three">
        <v-list-item
          :title="$t('gm.titles.addSubsection')"
          prepend-icon="mdi-page-next"
          :subtitle="$t('gm.subtitles.addANewEmptyFreeform')"
          @click="item[main ? 'AddSection' : 'AddChildSection']()" />
        <v-list-item
          :title="$t('gm.titles.addBeat')"
          prepend-icon="mdi-metronome"
          :subtitle="$t('gm.subtitles.addANewEmptyBeat')"
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'beat' })" />
        <v-list-item
          :title="$t('gm.titles.addMission')"
          prepend-icon="cc:orbit"
          :subtitle="$t('gm.subtitles.addANewEmptyMission')"
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'mission' })" />
        <v-list-item
          :title="$t('gm.titles.addCombat')"
          prepend-icon="cc:encounter"
          :subtitle="$t('gm.subtitles.addANewEmptyCombat')"
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'combat' })" />
        <v-list-item
          :title="$t('gm.titles.addDowntime')"
          prepend-icon="cc:downtime"
          :subtitle="$t('gm.subtitles.addANewEmptyDowntime')"
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'downtime' })" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import type { GMItem } from '../../gmItem'
defineOptions({ name: 'section-add-menu' })

const props = withDefaults(defineProps<{
  item: GMItem
  main?: boolean
}>(), {
  main: false
})
</script>
