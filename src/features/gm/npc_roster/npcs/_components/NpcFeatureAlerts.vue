<template>
  <div>
    <cc-alert
      v-if="expanded"
      v-for="item in templateController.FeatureRequirements"
      v-show="showItem(item)"
      density="compact"
      prominent
      :color="getColor(item)"
      :icon="getIcon(item)"
      class="mb-4">
      <div class="heading">{{ item.source }}</div>
      <div v-if="!item.complete">Select {{ item.max - item.selected }} additional features</div>
      <div v-else-if="!item.optional_complete">
        You may select up to {{ item.optionalMax - item.selected }} additional features
      </div>
      <div v-else>{{ item.source }} selections complete</div>
    </cc-alert>
    <v-menu v-else v-for="item in templateController.FeatureRequirements" open-on-hover>
      <template v-slot:activator="{ props }">
        <span v-bind="props">
          <cc-button
            :icon="getIcon(item)"
            :color="getColor(item)"
            variant="outlined"
            size="small"
            v-show="showItem(item)" />
        </span>
      </template>
      <v-card>
        <v-toolbar density="compact" :color="getColor(item)">
          <v-toolbar-title>
            <v-icon :icon="getIcon(item)" start />
            {{ item.source }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div v-if="!item.complete">Select {{ item.max - item.selected }} additional features</div>
          <div v-else-if="!item.optional_complete">
            You may select up to {{ item.optionalMax - item.selected }} additional features
          </div>
          <div v-else>{{ item.source }} selections complete</div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
export default {
  name: 'npc-feature-alerts',
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
    },
  },
  methods: {
    showItem(item) {
      if (this.hideComplete) return !item.complete || !item.optional_complete;
      return item.min + item.max + item.optionalMin + item.optionalMax > 0;
    },
    getColor(item) {
      if (!item.complete) return 'error';
      if (!item.optional_complete) return 'secondary';
      return 'success';
    },
    getIcon(item) {
      if (!item.complete) return 'mdi-alert';
      if (!item.optional_complete) return 'cc:npc_feature';
      return 'mdi-check';
    },
  },
};
</script>
