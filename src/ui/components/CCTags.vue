<template>
  <div v-if="extended && !mobile" v-for="t in <Tag[]>tags">
    <cc-extended-tag :tag="t" :color="t.IsExotic ? 'exotic' : color" />
  </div>
  <div v-else-if="print">
    <v-chip v-for="t in <Tag[]>tags" variant="outlined" size="small" label class="mx-1 mt-n1 my-0">
      {{ t.GetName(bonus, tier) }}
    </v-chip>
  </div>
  <div v-else class="text-center">
    <cc-tag
      v-for="t in <Tag[]>tags"
      :tag="t"
      :size="size"
      :density="density"
      :color="color"
      :tier="tier"
      :bonus="bonus" />
  </div>
</template>

<script lang="ts">
import { Tag } from '@/class';

export default {
  name: 'CCTags',
  props: {
    size: {
      type: String,
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
    tier: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
