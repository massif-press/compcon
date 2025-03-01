<template>
  <cc-panel v-if="power" variant="outlined" :disabled="disabled">
    <template #toolbar>
      <cc-toolbar
        :title="power.name"
        hide-close
        minor
        :color="headerColor"
        :extended="power.veteran || power.master">
        <template #title>
          {{ power.name }}
        </template>
        <template #toolbar-items>
          <span v-if="power.frequency" class="text-caption mr-1">
            {{ power.frequency }}
          </span>
        </template>
        <template #extension>
          <div
            class="text-cc-overline pl-2 text-disabled mt-n1"
            style="letter-spacing: 3px !important">
            <i v-if="power.veteran">Veteran Power</i>
            <i v-if="power.master">Master Power</i>
          </div>
        </template>
      </cc-toolbar>
    </template>

    <div v-if="power.prerequisite" class="caption pa-1 pt-0 pb-2 text--disabled text-text">
      <i v-text="power.prerequisite" />
    </div>
    <v-card-text v-html="power.description" class="pa-1 pt-0" />
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
