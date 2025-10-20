<template>
  <div v-if="extended && !mobile" v-for="t in filteredTags" :key="t.ID" class="mb-1">
    <cc-extended-tag :tag="t" :color="t.IsExotic ? 'exotic' : color" />
  </div>
  <div v-else-if="print">
    <v-chip
      v-for="t in filteredTags"
      :key="t.ID"
      variant="outlined"
      size="small"
      label
      class="mx-1 mt-n1 my-0">
      {{ t.GetName(bonus, tier) }}
    </v-chip>
  </div>
  <div v-if="!extended || mobile">
    <cc-tag
      v-for="t in filteredTags"
      :tag="t"
      :size="size ? size : mobile ? 'x-small' : 'small'"
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
    combat: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    filteredTags(): Tag[] {
      if (this.combat) {
        return (this.tags as Tag[]).filter((t: Tag) => t.IsCombatTag);
      }
      // sort tags by name, bringing exotic tags to the front
      return (this.tags as Tag[]).sort((a: Tag, b: Tag) => {
        if (a.IsExotic && !b.IsExotic) return -1;
        if (!a.IsExotic && b.IsExotic) return 1;
        return a.GetName().localeCompare(b.GetName());
      });
    },
  },
};
</script>
