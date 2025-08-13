<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="cc:frame"
        @click="props.onClick($event)">
        Add NPC
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>add npc</v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'GmAddNpcMenu',
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
  computed: {},

  methods: {},
};
</script>
