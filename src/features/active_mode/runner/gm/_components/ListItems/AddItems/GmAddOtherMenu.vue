<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-cube"
        @click="props.onClick($event)">
        Add Other
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>add other</v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'GmAddOtherMenu',
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {},

  methods: {},
};
</script>
