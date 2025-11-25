<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-progress-check"
        @click="props.onClick($event)">
        End Encounter
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40" color="primary" class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-clock-end" class="mt-n1 ml-2" start />
            Confirm End Round
          </div>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div>encounter results</div>
          <div>action history</div>
          <div>PC end condition results</div>
          <div>pilot history exports</div>
          <v-divider />
          <div>confirm end encounter</div>
          <div>archive encounter [x]</div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { Statblock } from '@/class';

export default {
  name: 'DamageMenu',
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
