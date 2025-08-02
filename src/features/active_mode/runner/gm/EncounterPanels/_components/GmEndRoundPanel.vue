<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-clock-end"
        @click="props.onClick($event)">
        End Round
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
          <div>reinforcements arriving</div>
          <v-divider />
          <div>round history</div>
          <div>action items - [undo]</div>
          <div>remaining actions</div>
          <div>actor - action</div>
          <div>pending items</div>
          <div>- ongoing effects [x] apply</div>
          <div>- timed conditions [x] apply</div>
          <div>- on next round conditions [x] apply</div>
          <div>- meltdown/self destruct/etc [x] apply</div>
          <div>bolster etc</div>
          <v-divider />
          <div>confirm end round</div>
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
    encounter: {
      type: Object,
      required: true,
    },
  },
  computed: {},

  methods: {},
};
</script>
