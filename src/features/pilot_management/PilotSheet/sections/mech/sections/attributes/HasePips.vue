<template>
  <v-col cols="auto" md="12">
    <cc-tooltip simple inline :content="`${attr.toUpperCase()}: ${val}`">
      <span class="text-overline no-height ml-n1">
        {{ attr }}
      </span>
    </cc-tooltip>
    <cc-synergy-display :location="attr" :mech="mech" class="d-inline" />
    <div v-if="$vuetify.display.lgAndUp" class="mt-n2 ml-1">
      <span class="no-height">
        <v-icon v-for="n in val" small :color="color" v-html="'mdi-hexagon'" />
      </span>
      <span class="no-height">
        <v-icon
          v-for="n in 6 - val"
          small
          color="grey"
          v-html="'mdi-hexagon-outline'"
        />
      </span>
    </div>
    <div v-else class="mt-n2">
      <span class="text-accent heading h2">{{ val }}</span>
    </div>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'hase-pips',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    attr: {
      type: String,
      required: true,
    },
    val: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data: () => ({
    // TODO: get from rules
    maxHASE: 6,
  }),
};
</script>

<style scoped>
.no-height {
  line-height: 0;
}
</style>
