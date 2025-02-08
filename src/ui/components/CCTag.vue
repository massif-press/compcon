<template>
  <v-tooltip v-if="!mobile" max-width="350px">
    <template #activator="{ props }">
      <v-chip v-bind="props" class="ma-1 cc-tag-clip" :color="getColor" tile :size="size">
        <v-avatar>
          <v-icon v-if="tag.err" icon="mdi-label-off" />
          <v-icon v-else start icon="mdi-label" />
        </v-avatar>
        <span v-if="tag.err">MISSING DATA</span>
        <span v-else>{{ tag.GetName(bonus, tier).toUpperCase() }}</span>
      </v-chip>
    </template>
    <div class="heading h3">{{ tag.GetName(bonus, tier) }}</div>
    <v-divider class="my-2" />
    <div v-html-safe="tag.GetDescription(bonus, tier)" />
  </v-tooltip>
  <v-menu v-else bottom max-width="350px">
    <template #activator="{ props }">
      <v-chip
        v-bind.stop="props"
        class="ma-1 cc-tag-clip"
        :color="getColor"
        tile
        :size="size"
        variant="elevated">
        <v-avatar>
          <v-icon v-if="tag.err" icon="mdi-label-off" />
          <v-icon v-else start icon="mdi-label" />
        </v-avatar>
        <span v-if="tag.err">MISSING DATA</span>
        <span v-else>{{ tag.GetName(bonus, tier).toUpperCase() }}</span>
      </v-chip>
    </template>
    <v-card color="surface-variant" class="pa-2">
      <div class="heading h3">{{ tag.GetName(bonus, tier) }}</div>
      <v-divider class="my-2" />
      <div v-html-safe="tag.GetDescription(bonus, tier)" />
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'CCTag',
  props: {
    size: {
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
    tier: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    getColor(): string {
      return this.tag.err ? 'error' : this.tag.IsExotic ? 'exotic' : this.color;
    },
  },
};
</script>

<style scoped>
.cc-tag-clip {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  padding-right: 16px;
}
</style>
