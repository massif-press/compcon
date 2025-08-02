<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-star-four-points-box-outline"
        @click="props.onClick($event)">
        GM Overrides
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40" color="primary" class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-star-four-points-box-outline" class="mt-n1 ml-2" start />
            GM Overrides
          </div>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div>set turn</div>
          <div>undo history</div>
          <div>create undo target</div>
          <div>quick stat edit</div>
          <div>set stat maxes</div>
          <div>reinforcements</div>
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
