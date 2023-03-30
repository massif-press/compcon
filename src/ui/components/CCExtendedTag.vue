<template>
  <span v-if="tag.err">ERR: {{ tag.err.toUpperCase() }}</span>
  <v-alert
    v-show="!tag.IsHidden"
    icon="mdi-label"
    :color="tag.isExotic ? 'exotic' : color"
    variant="outlined"
    density="compact"
    class="my-1"
  >
    <h3 :class="`heading ${tag.IsExotic ? 'exotic' : 'accent'}text-`">
      {{ tag.GetName(bonus) }}
    </h3>
    <div class="text-text" v-html="tag.GetDescription(bonus)" />
  </v-alert>
</template>

<script lang="ts">
export default {
  name: 'CCExtendedTag',
  props: {
    tag: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'active',
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>
