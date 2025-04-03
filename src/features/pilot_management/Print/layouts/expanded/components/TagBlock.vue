<template>
  <div v-if="show()" class="px-4" style="z-index: 3">
    <v-card v-for="t in tags as any[]" class="pa-1 my-n1" variant="plain">
      <v-row no-gutters>
        <v-col cols="auto"><v-icon start size="x-small" icon="mdi-tag-outline" /></v-col>
        <v-col>
          <div class="text-caption" style="line-height: 14px">
            <b>{{ t.GetName() }}</b>
            : {{ t.GetDescription() }}
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <div v-else class="text-right pb-1">
    <v-chip
      v-for="t in tags as any[]"
      size="x-small"
      v-show="showTag(t.ID)"
      label
      variant="outlined"
      class="mx-1 bg-white">
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
  },
  methods: {
    show() {
      if (this.mech) return this.options.mechInclude.includes('show expanded tags');
      return this.options.pilotInclude.includes('show expanded tags');
    },
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
