<template>
  <div v-if="!hide">
    <div v-if="expanded">
      <cc-alert
        v-for="item in templateController.FeatureRequirements.filter(item => !item.complete || !item.optional_complete)"
        v-show="showItem(item)"
        :key="`alert-${item.source_id}`"
        density="compact"
        :title="item.source"
        :color="getColor(item)"
        :icon="getIcon(item)"
        class="mb-4">

        <div v-if="!item.optional_complete && item.optionalMin && !item.optionalMax">
          You may select up to {{ item.optionalMin - item.selected }} additional feature(s)
        </div>
        <div v-else-if="!item.optional_complete">
          You may select up to {{ item.optionalMax - item.selected }} additional feature(s)
        </div>
        <div v-else-if="!item.complete">Select {{ item.max - item.selected }} additional feature(s)
        </div>
      </cc-alert>
    </div>
    <v-menu v-for="item in templateController.FeatureRequirements"
      v-else
      :key="`menu-${item.source_id}`"
      open-on-hover>
      <template #activator="{ props }">
        <div v-show="showItem(item)"
          v-bind="props"
          class="d-inline-block mx-1">
          <cc-button :icon="getIcon(item)"
            :color="getColor(item)"
            size="small" />
        </div>
      </template>
      <v-card flat
        tile
        border>
        <v-toolbar density="compact"
          height="42"
          :color="getColor(item)">
          <div class="heading h3 px-2">
            <v-icon :icon="getIcon(item)" />
            {{ item.source }}
          </div>
        </v-toolbar>
        <v-card-text>
          <div v-if="!item.complete">Select {{ item.max - item.selected }} additional feature(s)
          </div>
          <div v-else-if="!item.optional_complete">
            You may select up to {{ item.optionalMax - item.selected }} additional feature(s)
          </div>
          <div v-else>{{ item.source }} selections complete</div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NpcFeatureAlerts',
  props: {
    templateController: {
      type: Object,
      required: true,
    },
    expanded: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideComplete: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: '',
    },
    hide: {
      type: Boolean,
    },
  },
  methods: {
    showItem(item) {
      if (this.hideComplete) return !item.complete || !item.optional_complete;
      return item.min + item.max + item.optionalMin + item.optionalMax > 0;
    },
    getColor(item) {
      if (!item.optional_complete) return 'secondary';
      if (!item.complete) return 'error';
      return 'success';
    },
    getIcon(item) {
      if (!item.optional_complete) return 'cc:npc_feature';
      if (!item.complete) return 'mdi-alert';
      return 'mdi-check';
    },
  },
};
</script>
