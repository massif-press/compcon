<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-receipt-text-edit"
        @click="props.onClick($event)">
        Add Stub
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>add stub</v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'GmAddStubMenu',
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
