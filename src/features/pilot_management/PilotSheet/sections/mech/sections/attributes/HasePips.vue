<template>
  <div>
    <cc-tooltip simple inline :content="`${attr.toUpperCase()}: ${val}`">
      <span class="text-overline no-height ml-n1">
        {{ attr }}
      </span>
    </cc-tooltip>
    <cc-synergy-display :location="attr" :mech="mech" class="d-inline" />
    <div class="mt-n2 ml-1">
      <span class="no-height">
        <v-icon v-for="n in val" size="small" :color="color" icon="mdi-hexagon" />
      </span>
      <span class="no-height">
        <v-icon v-for="n in 6 - val" size="small" color="grey" icon="mdi-hexagon-outline" />
      </span>
    </div>
  </div>
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
