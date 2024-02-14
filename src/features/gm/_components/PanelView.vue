<template>
  <v-container fluid style="height: 100%">
    <slot name="title" />
    <v-row>
      <v-col cols="4" style="height: 82vh; overflow-y: scroll">
        <slot name="left" />
      </v-col>
      <v-divider vertical />
      <v-col
        id="scrollTarget"
        :class="noBorder ? '' : 'bordered-view'"
        style="height: 82vh; overflow-y: scroll">
        <slot name="right" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'panel-view',
  props: {
    noBorder: { type: Boolean },
  },
  methods: {
    resetScroll() {
      document.getElementById('scrollTarget')!.scrollTop = 0;
    },
  },
};
</script>

<style scoped>
.bordered-view {
  overflow-y: scroll;
  border: 1px solid darkgrey;
  border-radius: 3px;
}
</style>
