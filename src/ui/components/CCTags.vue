<template>
  <v-row v-if="extended && $vuetify.display.mdAndUp" no-gutters>
    <v-col v-for="(t, i) in tags" :key="`${t.ID}_${i}`" cols="12">
      <cc-extended-tag :tag="t" :color="t.IsExotic ? 'exotic' : color" />
    </v-col>
  </v-row>
  <div v-else-if="print">
    <v-chip
      v-for="(t, i) in tags"
      :key="`${t.ID}_${i}`"
      variant="outlined"
      x-small
      label
      class="mx-1 mt-n1 my-0"
    >
      {{ t.GetName(bonus) }}
    </v-chip>
  </div>
  <div v-else class="text-center">
    <cc-tag
      v-for="(t, i) in tags"
      :key="`${t.ID}_${i}`"
      :tag="t"
      :small="small"
      :dense="dense"
      :outlined="outlined"
      :color="color"
      :bonus="bonus"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCTags',
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
    extended: {
      type: Boolean,
      required: false,
    },
    print: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    tags: {
      type: Array,
      required: true,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>
