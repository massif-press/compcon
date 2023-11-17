<template>
  <div class="pb-1" :style="block ? '' : 'position: absolute; bottom: 0; left: 4px; right: 4px'">
    <v-divider />
    <v-chip
      v-for="t in (tags as any[])"
      size="x-small"
      v-show="showTag(t.ID)"
      label
      variant="outlined"
      class="bg-white"
      style="width: 100%"
    >
      <v-icon start size="x-small" icon="mdi-tag-outline" />
      {{ t.GetName() }}
    </v-chip>
  </div>
</template>

<script lang="ts">
export default {
  name: 'print-action',
  props: {
    tags: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    mech: {
      type: Boolean,
    },
    block: {
      type: Boolean,
    },
  },
  methods: {
    showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
