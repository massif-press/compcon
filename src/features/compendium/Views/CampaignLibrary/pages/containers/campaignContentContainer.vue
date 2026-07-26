<template>
  <div class="my-1">
    <div v-if="item.Title" :class="titleStyle" class="pl-2 mb-1 pr-12" style="width: fit-content">
      {{ item.Title }}
    </div>
    <v-card :variant="cardVariant" :color="cardColor" :class="cardClass" class="text-text">
      <cc-rollable-table
        v-if="item.ContentType === 'table'"
        :table="item.AsTable"
        readonly
        density="compact" />
      <cc-clock
        v-else-if="item.ContentType === 'clock'"
        :clock="item.AsClock"
        density="compact"
        readonly />
      <div v-else-if="item.ContentType === 'image'" class="text-center">
        <img :src="item.AsImage.ImageUrl" class="pa-1" />

        <div v-if="item.AsImage.Caption" class="mt-n5">
          <v-chip variant="flat" size="x-small" label color="panel">
            {{ item.AsImage.Caption }}
          </v-chip>
        </div>
      </div>
      <narrative-content v-else-if="item.ContentType === 'narrative'" :data="item.AsNarrative.Data" />
      <encounter-content v-else-if="item.ContentType === 'encounter'" :data="item.AsEncounter.Data" />
      <v-card-text v-else>
        <v-row dense>
          <v-col v-if="item.Variant === 'quote'" cols="auto">
            <div class="rounded bg-panel pa-1 mx-2" style="height: 100%" />
          </v-col>
          <v-col>
            <p v-html-safe="item.AsText.Body" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ContentBlock } from '@/classes/campaign/CampaignContentBlock'
import { computed, ref } from 'vue'
import NarrativeContent from '@/features/gm/campaigns/pages/_components/NarrativeContent.vue';
import EncounterContent from '@/features/gm/campaigns/pages/_components/EncounterContent.vue';
import { campaignColorSelections, campaignColorPalette } from '@/shared/campaignColorOptions';

defineOptions({ name: 'campaign-page-content-container' })

const props = defineProps<{
  item: ContentBlock
}>()

const colorTab = ref(0)
const colorSelections = ref(campaignColorSelections)
const colorPalette = ref(campaignColorPalette)

const titleStyle = computed(() => {
      let out = '';
      switch (props.item.HeaderType) {
        case 'header-1':
          out += 'heading h1 clipped';
          out += props.item.Color ? ` bg-${props.item.Color}` : '';
          break;
        case 'header-2':
          out += 'heading h3 clipped';
          out += props.item.Color ? ` bg-${props.item.Color}` : '';
          break;
        case 'header-3':
          out += 'heading h3';
          out += props.item.Color ? ` text-${props.item.Color}` : '';
          break;
        case 'header-4':
          out += 'heading';
          out += props.item.Color ? ` text-${props.item.Color}` : '';
          break;
        default:
          return 'd-none';
      }
      return out;
    })
const cardVariant = computed(() => {
      switch (props.item.Variant) {
        case 'block':
        case 'clipped-block':
          return 'flat';
        case 'quote':
        case '':
          return 'text';

        case 'outline':
          return 'outlined';
        default:
          return 'flat';
      }
    })
const cardClass = computed(() => {
      return props.item.Variant === 'clipped-block' ? 'clipped' : '';
    })
const cardColor = computed(() => {
      const noColor = ['text', 'quote', ''];
      if (noColor.includes(props.item.Variant)) return 'transparent';
      return props.item.Color ? props.item.Color : 'transparent';
    })
</script>
