<template>
  <div
    v-if="!tag.IsHidden"
    :class="`text-center d-inline-block ${
      dense || $vuetify.display.mdAndDown ? '' : 'my-2'
    }`"
  >
    <cc-tooltip
      :err="tag.err"
      :title="tag.GetName(bonus)"
      :content="tag.GetDescription(bonus)"
    >
      <v-chip
        :class="$vuetify.display.mdAndUp ? 'px-2 py-2 mx-1' : 'ma-1'"
        :color="tag.err ? 'error' : tag.IsExotic ? 'exotic' : color"
        dark
        label
        :small="small"
        :outlined="outlined"
      >
        <v-avatar>
          <v-icon v-if="tag.err" small>label_off</v-icon>
          <v-icon v-else small>label</v-icon>
        </v-avatar>
        <span v-if="tag.err">MISSING DATA</span>
        <span v-else>{{ tag.GetName(bonus).toUpperCase() }}</span>
      </v-chip>
    </cc-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCTag',
  props: {
    small: {
      type: Boolean,
      required: false,
    },
    dense: {
      type: Boolean,
      required: false,
    },
    outlined: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    tag: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
      required: false,
      default: null,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>
