<template>
  <v-btn-toggle v-model="internalValue"
    mandatory
    divided
    variant="plain"
    border
    tile
    color="accent"
    density="compact"
    style="width: 100%; height: 30px"
    class="mb-2">
    <v-tooltip v-for="g in options.groups"
      :key="`group-${g}`"
      :text="groupTooltip(g)"
      location="top">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          :value="g"
          icon
          tile
          size="small"
          :style="`width: ${100 / (options.groups.length)}%`">
          <v-icon size="25"
            :icon="groupIcon(g)" />
        </v-btn>
      </template>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'BrowserGroupToggle' })

const props = defineProps<{
  modelValue: string
  options: object
}>()

const emit = defineEmits<{
  'update:modelValue': []
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => {emit('update:modelValue', value);},
})

function groupIcon(i: string) {
      switch (i) {
        case 'source':
          return 'cc:manufacturer';
        case 'lcp':
          return 'cc:content_manager';
        case 'type':
          return 'cc:generic_item';
        case 'license':
          return 'cc:license';
        case 'role':
          return 'cc:role_support';
        case 'featureType':
          return 'cc:npc_feature';
        case 'origin':
          return 'cc:npc_template';
        case 'none':
          return 'mdi-cancel';
        default:
          return '';
      }
    }
function groupTooltip(i: string) {
      switch (i) {
        case 'source':
          return 'Group by Source';
        case 'lcp':
          return 'Group by LCP';
        case 'license':
          return 'Group by License';
        case 'type':
          return 'Group by Item Subtype';
        case 'role':
          return 'Group by NPC Role';
        case 'featureType':
          return 'Group by Feature Type';
        case 'origin':
          return 'Group by Origin';
        case 'none':
          return 'No Grouping';
        default:
          return '';
      }
    }
</script>
