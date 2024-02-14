<template>
  <div
    v-if="!tag.IsHidden"
    :class="`text-center d-inline-block ${
      density === `compact` || $vuetify.display.mdAndDown ? '' : 'my-2'
    }`">
    <cc-tooltip :err="tag.err" :title="tag.GetName(bonus)" :content="tag.GetDescription(bonus)">
      <v-chip
        :class="$vuetify.display.mdAndUp ? 'px-2 mx-1' : 'ma-1'"
        :color="getColor"
        dark
        label
        :size="small ? 'small' : ''"
        :outlined="outlined">
        <v-avatar>
          <v-icon v-if="tag.err" size="small" icon="mdi-label-off" :color="getColor" />
          <v-icon v-else size="small" start icon="mdi-label" :color="getColor" />
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
    density: {
      type: String,
      required: false,
    },
    outlined: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
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
  computed: {
    getColor(): string {
      return this.tag.err ? 'error' : this.tag.IsExotic ? 'exotic' : this.color;
    },
  },
};
</script>
