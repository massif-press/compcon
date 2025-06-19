<template>
  <v-scroll-y-reverse-transition>
    <div v-if="special.length" class="text-cc-overline mt-2">
      <v-progress-linear
        v-for="status in special"
        :key="status"
        model-value="100"
        height="24"
        color="orange"
        striped
      >
        <v-chip
          size="x-large"
          class="heading h3 bg-deep-orange-darken-3"
          flat
          tile
        >
          <cc-slashes />
          &emsp;{{ status }}&emsp;
          <cc-slashes />
        </v-chip>
      </v-progress-linear>
    </div>
  </v-scroll-y-reverse-transition>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'SpecialStatusDisplay',
  props: {
    controller: {
      type: Object,
      required: true,
    },
  },
  computed: {
    special() {
      return this.controller.SpecialStatuses;
    },
  },
};
</script>
