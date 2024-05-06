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
        Add {{ main ? 'Section' : 'Subsection' }}
      </v-btn>
    </template>
    <v-card variant="outlined" color="panel">
      <v-list density="compact" lines="three">
        <v-list-item
          title="Add Subsection"
          prepend-icon="mdi-page-next"
          subtitle="Add a new empty free-form section under this page. A Section is a container for other content items, and can be used to organize your campaign in any way you see fit."
          @click="item[main ? 'AddSection' : 'AddChildSection']()" />
        <v-list-item
          title="Add Beat"
          prepend-icon="mdi-metronome"
          subtitle="Add a new empty Beat under this section. A Beat is a section for an important event or moment in the story."
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'beat' })" />
        <v-list-item
          title="Add Mission"
          prepend-icon="cc:orbit"
          subtitle="Add a new empty Mission under this page. A Mission contains specific goals and objectives that can be completed within a discrete period of time, and typically contains Combats."
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'mission' })" />
        <v-list-item
          title="Add Combat"
          prepend-icon="cc:encounter"
          subtitle="Add a new empty Combat under this page. A Combat contains Encounters, as well as GM guidelines, narrative detail regarding the battle, and potential outcomes."
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'combat' })" />
        <v-list-item
          title="Add Downtime"
          prepend-icon="cc:downtime"
          subtitle="Add a new empty Downtime under this page. Downtime is the narrative space between missions, where moment-to-moment action doesn't matter as much and roleplaying matters much more."
          @click="item[main ? 'AddSection' : 'AddChildSection']({ sectionType: 'downtime' })" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'section-add-menu',
  props: {
    item: {
      type: Object,
      required: true,
    },
    main: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
