<template>
  <div>
    <div v-for="(l, i) in log" :key="`${l.id}_${i}`">
      <div class="caption subtle--text mb-n1">
        ENCOUNTER {{ l.encounter }} // ROUND {{ l.round }} :: {{ l.timestamp }}
      </div>
      <p class="flavor-text ma-0 ml-3 mb-2">
        >//[
        <span class="accent--text">{{ l.event }}</span>
        ]
        <span class="stark--text">{{ l.detail }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'combat-log-renderer',
  props: {
    log: {
      type: Array,
      required: true,
    },
  },
})
</script>
