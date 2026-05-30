<template>
  <div>
    <template v-for="(item, index) in <any[]>items" :key="`toc-${index}`">
      <div v-if="item" class="heading mt-3" :style="{ marginLeft: `${level * 8}px` }">
        <div :style="`font-size: ${textSize}`">
          <v-icon :icon="getIconByType(item.SectionType)" start />
          {{ item.Title }}
        </div>
        <div v-if="item.Content.length" class="body-text font-weight-light">
          <div v-for="(e, eIdx) in item.Content" :key="`content-${eIdx}`" class="mt-2 ml-4 text-button">
            <v-icon :icon="getIconByType(e.ContentType)" start size="small" />
            {{ e.Title }}
          </div>
        </div>
        <template v-if="item.Children.length">
          <toc-item :items="item.Children" :level="level + 1" />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'toc-item' })

const props = withDefaults(defineProps<{
  items: any[]
  level: number
}>(), {
  level: 0
})

const textSize = computed(() => {
      let s = 24 - props.level * 2;
      if (s < 8) s = 8;
      return `${s}px`;
    })

function getIconByType(type: string) {
      switch (type) {
        case 'section':
          return 'cc:campaign';
        case 'beat':
          return 'mdi-metronome';
        case 'mission':
          return 'cc:orbit';
        case 'combat':
          return 'cc:encounter';
        case 'downtime':
          return 'cc:downtime';
        case 'text':
          return 'mdi-text';
        case 'image':
          return 'mdi-image';
        case 'table':
          return 'mdi-table';
        case 'clock':
          return 'mdi-clock';
        case 'narrative':
          return 'mdi-puzzle';
        case 'encounter':
          return 'mdi-sword';
      }
    }
</script>
