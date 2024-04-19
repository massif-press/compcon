<template>
  <div class="my-1">
    <div v-if="item.Title" :class="titleStyle" class="pl-2 mb-1 pr-12" style="width: fit-content">
      {{ item.Title }}
    </div>
    <v-card :variant="cardVariant" :color="cardColor" :class="cardClass" class="text-text">
      <cc-rollable-table
        v-if="item.ContentType === 'table'"
        :table="item.Content"
        readonly
        density="compact" />
      <cc-clock
        v-else-if="item.ContentType === 'clock'"
        :clock="item.Content"
        density="compact"
        readonly />
      <div v-else-if="item.ContentType === 'image'" class="text-center">
        <img :src="item.Content.ImageUrl" class="pa-1" />

        <div v-if="item.Content.Caption" class="mt-n5">
          <v-chip variant="flat" size="x-small" label color="panel">
            {{ item.Content.Caption }}
          </v-chip>
        </div>
      </div>
      <narrative-content v-else-if="item.ContentType === 'narrative'" :data="item.Content.Data" />
      <encounter-content v-else-if="item.ContentType === 'encounter'" :data="item.Content.Data" />
      <v-card-text v-else>
        <v-row dense>
          <v-col v-if="item.Variant === 'quote'" cols="auto">
            <div class="rounded bg-panel pa-1 mx-2" style="height: 100%" />
          </v-col>
          <v-col>
            <p v-html-safe="item.Content.Body" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import NarrativeContent from '@/features/gm/campaigns/pages/_components/NarrativeContent.vue';
import EncounterContent from '@/features/gm/campaigns/pages/_components/EncounterContent.vue';

export default {
  name: 'campaign-page-content-container',
  components: { NarrativeContent, EncounterContent },
  props: { item: { type: Object, required: true } },
  data: () => ({
    colorTab: 0,
    colorSelections: [
      'primary',
      'secondary',
      'accent',
      'error',
      'warning',
      'info',
      'success',
      'background',
      'text',
      'subtle',
      'stark',
      'anti',
      'frame',
      'system',
      'pilot',
      'protocol',
      'mod',
      'weapon',
      'structure',
      'hp',
      'armor',
      'heat',
      'stress',
      'overcharge',
    ],
    colorPalette: [
      'red',
      'pink',
      'purple ',
      'deep-purple ',
      'indigo ',
      'blue ',
      'light-blue ',
      'cyan ',
      'teal ',
      'green ',
      'light-green ',
      'lime ',
      'yellow ',
      'amber ',
      'orange ',
      'deep-orange ',
      'brown ',
      'blue-grey ',
      'grey ',
      'black',
      'white',
      'transparent',
    ],
  }),
  computed: {
    titleStyle() {
      let out = '';
      switch (this.item.HeaderType) {
        case 'header-1':
          out += 'heading h1 clipped';
          out += this.item.Color ? ` bg-${this.item.Color}` : '';
          break;
        case 'header-2':
          out += 'heading h3 clipped';
          out += this.item.Color ? ` bg-${this.item.Color}` : '';
          break;
        case 'header-3':
          out += 'heading h3';
          out += this.item.Color ? ` text-${this.item.Color}` : '';
          break;
        case 'header-4':
          out += 'heading';
          out += this.item.Color ? ` text-${this.item.Color}` : '';
          break;
        default:
          return 'd-none';
      }
      return out;
    },
    cardVariant() {
      switch (this.item.Variant) {
        case 'block':
        case 'clipped':
          return 'flat';
        case 'quote':
        case '':
          return 'text';

        default:
          return this.item.Variant;
      }
    },
    cardClass() {
      return this.item.Variant === 'clipped' ? 'clipped' : '';
    },
    cardColor() {
      const noColor = ['text', 'quote', ''];
      if (noColor.includes(this.item.Variant)) return 'transparent';
      return this.item.Color ? this.item.Color : 'transparent';
    },
  },
  methods: {},
};
</script>
