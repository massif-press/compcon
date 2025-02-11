<template>
  <cc-panel
    :style="flexHeight ? '' : 'height: calc(100% - 35px) !important'"
    variant="outlined"
    :disabled="disabled">
    <template #toolbar>
      <cc-toolbar hide-close :color="headerColor" :extended="power.veteran || power.master">
        <template #title>
          {{ power.name }}
        </template>
        <template #toolbar-items>
          <span v-if="power.frequency" class="text-caption">
            {{ power.frequency }}
          </span>
        </template>
        <template #extension>
          <div class="text-cc-overline pl-2 mt-n1 py-1">
            <b v-if="power.veteran">Veteran Power</b>
            <b v-if="power.master">Master Power</b>
          </div>
        </template>
      </cc-toolbar>
    </template>

    <div v-if="power.prerequisite" class="caption pa-3 text--disabled">
      <i v-text="power.prerequisite" />
    </div>
    <v-card-text v-html="power.description" class="pa-3" />
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-bond-info',
  props: {
    power: { type: Object, required: true },
    flexHeight: { type: Boolean },
    disabled: { type: Boolean },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    headerColor() {
      if (this.power.veteran) return 'indigo-lighten-1';
      if (this.power.master) return 'deep-purple-darken-3';
      return 'primary';
    },
  },
};
</script>
