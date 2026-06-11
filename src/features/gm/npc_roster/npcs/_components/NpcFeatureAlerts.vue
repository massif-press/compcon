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
          {{ $t('gm.npcAlert.selectUpTo', { n: item.optionalMin - item.selected }) }}
        </div>
        <div v-else-if="!item.optional_complete">
          {{ $t('gm.npcAlert.selectUpTo', { n: item.optionalMax - item.selected }) }}
        </div>
        <div v-else-if="!item.complete">{{ $t('gm.npcAlert.selectN', { n: item.max - item.selected }) }}
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
          <div v-if="!item.complete">{{ $t('gm.npcAlert.selectN', { n: item.max - item.selected }) }}
          </div>
          <div v-else-if="!item.optional_complete">
            {{ $t('gm.npcAlert.selectUpTo', { n: item.optionalMax - item.selected }) }}
          </div>
          <div v-else>{{ $t('gm.npcAlert.selectionsComplete', { source: item.source }) }}</div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  templateController: object
  expanded?: boolean
  hideComplete?: boolean
  color?: string
  hide?: boolean
}>(), {
  expanded: false,
  hideComplete: false,
  color: ''
})

function showItem(item) {
      if (props.hideComplete) return !item.complete || !item.optional_complete;
      return item.min + item.max + item.optionalMin + item.optionalMax > 0;
    }
function getColor(item) {
      if (!item.optional_complete) return 'secondary';
      if (!item.complete) return 'error';
      return 'success';
    }
function getIcon(item) {
      if (!item.optional_complete) return 'cc:npc_feature';
      if (!item.complete) return 'mdi-alert';
      return 'mdi-check';
    }
</script>
