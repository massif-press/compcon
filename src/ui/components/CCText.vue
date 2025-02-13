<template>
  <div>
    <v-container>
      <span v-html="highlightedText" @click="handleClick"></span>
    </v-container>
    <v-bottom-sheet v-model="sheet" @click="sheet = false">
      <v-card>
        <v-card-title>
          <v-icon v-if="selectedIcon" start>{{ selectedIcon }}</v-icon>
          <span class="heading h3">{{ selectedWord }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="py-2 mb-6" v-html="selectedDefinition" />
        <div class="panel-footer text-center bg-panel">{{ mobile ? 'TAP' : 'CLICK' }} TO CLOSE</div>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import dictionary from '@/assets/srd/lib/dictionary.json';

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sheet: false,
      selectedWord: '',
      selectedDefinition: '',
      selectedIcon: '',
    };
  },
  computed: {
    highlightedText() {
      let words = dictionary.flatMap((entry) => entry.keys.map((key) => key.toLowerCase()));
      let regex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
      return this.text.replace(regex, (match) => {
        return `<span class='cc-dictionary-word' data-word='${match.toLowerCase()}'>${match}</span>`;
      });
    },
  },
  methods: {
    handleClick(event) {
      if (event.target.classList.contains('cc-dictionary-word')) {
        this.selectedWord = event.target.dataset.word;
        let entry = dictionary.find((entry) =>
          entry.keys.some((key) => key.toLowerCase() === this.selectedWord)
        );
        this.selectedDefinition = entry ? entry.definition : 'Definition not found.';
        this.selectedIcon = entry ? entry.icon : '';
        this.sheet = true;
      }
    },
  },
};
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
