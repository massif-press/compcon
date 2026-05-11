<template>
  <div>
    <v-container>
      <span v-html-safe="highlightedText" @click="handleClick"></span>
    </v-container>
    <v-bottom-sheet v-model="sheet" @click="sheet = false">
      <v-card>
        <v-card-title>
          <v-icon v-if="selectedIcon" start>{{ selectedIcon }}</v-icon>
          <span class="heading h3">{{ selectedWord }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="py-2 mb-6" v-html-safe="selectedDefinition" />
        <div class="panel-footer text-center bg-panel">{{ mobile ? 'TAP' : 'CLICK' }} TO CLOSE</div>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import dictionary from '@/assets/srd/lib/dictionary.json';

const { smAndDown: mobile } = useDisplay();

const props = defineProps<{
  text: string;
}>();

const sheet = ref(false);
const selectedWord = ref('');
const selectedDefinition = ref('');
const selectedIcon = ref('');

const highlightedText = computed(() => {
  const words = dictionary.flatMap(entry => entry.keys.map(key => key.toLowerCase()));
  const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
  return props.text.replace(regex, match =>
    `<span class='cc-dictionary-word' data-word='${match.toLowerCase()}'>${match}</span>`
  );
});

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains('cc-dictionary-word')) {
    selectedWord.value = target.dataset.word ?? '';
    const entry = dictionary.find(e => e.keys.some(k => k.toLowerCase() === selectedWord.value));
    selectedDefinition.value = entry ? entry.definition : 'Definition not found.';
    selectedIcon.value = entry?.icon ?? '';
    sheet.value = true;
  }
}
</script>

<style>
.cc-dictionary-word {
  border-bottom: 1px dashed rgb(var(--v-theme-primary));
  cursor: help;
  transition: color 0.2s ease;
}
.cc-dictionary-word:hover {
  color: rgb(var(--v-theme-accent));
}
</style>

<style scoped>
.panel-footer {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  z-index: 10;
  height: 13px;
  letter-spacing: 4px;
  font-size: 8px;
  line-height: 15px;
  opacity: 0.6;
}
</style>
