<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="cc:pilot"
        @click="props.onClick($event)">
        Add PC
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>add pc</v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'GmAddPcMenu',
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
