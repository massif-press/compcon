<template>
  <div style="z-index: 10">
    <div class="abs">
      <div style="position: absolute; right: 5vw; z-index: 11">
        <v-btn color="primary" outlined x-small @mouseenter="$emit('hover')" @click="refresh">
          Refresh COMP/CON
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'web-refresh',
  methods: {
    refresh() {
      location.reload(true)
    },
  },
})
</script>

<style scoped>
.abs {
  position: absolute;
  top: 40px;
  right: 0px;
}
</style>
