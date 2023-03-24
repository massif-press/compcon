<template>
  <!-- <v-card
    :style="`height: calc(100% - ${
      allowDupes && hasPower(f) ? '70' : '35'
    }px)!important`"
    variant="outlined"   > -->
  <v-card
    :style="flexHeight ? '' : 'height: calc(100% - 35px) !important'"
    variant="outlined"
    :disabled="disabled"
  >
    <v-row
      no-gutters
      :class="`${headerColor} white--text heading h4 py-1 px-3`"
    >
      <v-col>{{ power.name }}</v-col>
      <v-col v-if="power.veteran" cols="auto">
        <v-chip small color="primary" v-text="'Veteran Power'" />
      </v-col>
      <v-col v-if="power.master" cols="auto">
        <v-chip small color="primary" v-text="'Master Power'" />
      </v-col>
      <v-col v-if="power.frequency" cols="auto">
        <v-chip small v-text="power.frequency" />
      </v-col>
    </v-row>
    <div v-if="power.prerequisite" class="caption pa-3 text--disabled">
      <i v-text="power.prerequisite" />
    </div>
    <v-card-text v-html="power.description" class="px-4 pt-1" />
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
      if (this.power.veteran) return 'indigo lighten-1';
      if (this.power.master) return 'deep-purple darken-3';
      return 'panel darken-2';
    },
  },
};
</script>
