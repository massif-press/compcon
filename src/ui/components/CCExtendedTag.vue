<template>
  <v-alert
    v-show="!tag.IsHidden"
    variant="outlined"
    dense
    :color="tag.isExotic ? 'exotic' : color"
    class="mb-1"
  >
    <v-icon
      v-if="$vuetify.display.lgAndUp"
      slot="prepend"
      x-large
      class="ml-n2 mr-1"
      :color="tag.isExotic ? 'exotic' : color"
    >
      label
    </v-icon>
    <span v-if="tag.err">ERR: {{ tag.err.toUpperCase() }}</span>
    <div v-else>
      <h3 :class="`heading ${tag.IsExotic ? 'exotic' : 'accent'}--text`">
        <v-icon
          v-if="$vuetify.display.mdAndDown"
          class="mt-n1"
          :color="tag.isExotic ? 'exotic' : color"
        >
          label
        </v-icon>
        {{ tag.GetName(bonus) }}
      </h3>
      <p
        class="text--text body-text pb-0 mb-0"
        v-html="tag.GetDescription(bonus)"
      />
    </div>
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
