<template>
  <div>
    <v-row>
      current roster -- reinforcements
      <br />
      add pilot to current mission ------- add npc to reinfocements {as ally/enemy/neutral}
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'active-mission-info',
  props: {
    mission: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
})
</script>
