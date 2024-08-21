<template>
  <v-card
    :style="flexHeight ? '' : 'height: calc(100% - 35px) !important'"
    variant="outlined"
    :disabled="disabled">
    <v-row dense :class="`bg-${headerColor} text-white heading h4 pt-1 px-3`">
      <v-col>{{ power.name }}</v-col>
      <v-col v-if="power.veteran" cols="auto">
        <v-chip size="small" variant="tonal">Veteran Power</v-chip>
      </v-col>
      <v-col v-if="power.master" cols="auto">
        <v-chip size="small" variant="tonal">Master Power</v-chip>
      </v-col>
      <v-col v-if="power.frequency" cols="auto">
        <v-chip size="small" variant="tonal">{{ power.frequency }}</v-chip>
      </v-col>
    </v-row>
    <div v-if="power.prerequisite" class="caption pa-3 text--disabled">
      <i v-text="power.prerequisite" />
    </div>
    <v-card-text v-html="power.description" class="pa-3" />
  </v-card>
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
    headerColor() {
      if (this.power.veteran) return 'indigo-lighten-1';
      if (this.power.master) return 'deep-purple-darken-3';
      return 'primary';
    },
  },
};
</script>
