<template>
  <v-card-text class="flavor-text">
    <v-card flat
      tile>
      <fieldset class="pa-2">
        <legend class="clipped-small heading h3">{{ $t('print.generalOptions') }}&emsp;</legend>
        <print-option-select v-model="options.layout"
          mandatory
          :title="$t('pm.titles.layout')"
          :items="layoutOptions" />
        <v-row v-if="options.layout.title !== 'Cards'">
          <v-col>
            <print-option-select v-model="options.paper"
              mandatory
              :title="$t('pm.titles.paper')"
              :items="paperOptions" />
          </v-col>
          <v-col>
            <print-option-select v-model="options.content"
              mandatory
              :title="$t('common.contentLabel')"
              :items="contentOptions" />
          </v-col>
          <v-col>
            <print-option-select v-model="options.orientation"
              mandatory
              :title="$t('pm.titles.orientation')"
              :items="orientationOptions" />
          </v-col>
          <v-col>
            <print-option-select v-model="options.bonds"
              mandatory
              :title="$t('pm.sheet.bonds')"
              :items="bondsOptions" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <print-option-select v-model="options.paper"
              mandatory
              :title="$t('pm.titles.paper')"
              :items="paperOptions" />
            <v-col>
              <print-option-select v-model="options.card"
                multiple
                :title="$t('pm.titles.cardOptions')"
                :items="cardOptions" />
            </v-col>
          </v-col>
        </v-row>
      </fieldset>
    </v-card>
    <v-scroll-y-transition>
      <v-card v-if="pilotIncludeOptions.length > 0"
        flat
        tile>
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">{{ $t('pm.print.pilotSheetOptions') }}&emsp;</legend>
          <print-option-select v-model="options.pilotInclude"
            multiple
            widen
            :items="pilotIncludeOptions" />
        </fieldset>
      </v-card>
    </v-scroll-y-transition>
    <v-scroll-y-transition>
      <v-card v-if="mechIncludeOptions.length > 0"
        flat
        tile>
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">{{ $t('pm.print.mechSheetOptions') }}&emsp;</legend>
          <print-option-select v-model="options.mechInclude"
            multiple
            widen
            :items="mechIncludeOptions" />
        </fieldset>
      </v-card>
    </v-scroll-y-transition>
    <v-card flat
      tile>
      <fieldset class="pa-2">
        <legend>{{ $t('pm.print.extras') }}</legend>
        <print-option-select v-model="options.extras"
          multiple
          :items="extraOptions" />
      </fieldset>
    </v-card>
  </v-card-text>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PrintOptionSelect from '@/shared/print/PrintOptionSelect.vue';

defineOptions({ name: 'PrintOptionsDialog' })

const props = defineProps<{
  hasBonds: boolean
  options: any
}>()

const emit = defineEmits<{
  'set': [any]
}>()

const layoutOptions = ref([
  { title: 'Minimal', icon: 'mdi-text-short' },
  { title: 'Terse', icon: 'mdi-file-document-outline' },
  { title: 'Standard', icon: 'mdi-book-open' },
  { title: 'Expanded', icon: 'mdi-book-open-page-variant-outline' },
  { title: 'Cards', icon: 'mdi-cards-outline' },
])
const orientationOptions = ref([
  { title: 'Portrait', icon: 'mdi-file' },
  { title: 'Landscape', icon: 'mdi-note' },
])
const contentOptions = ref([
  { title: 'Pilot', icon: 'cc:pilot' },
  { title: 'Blank', icon: 'mdi-checkbox-blank-badge-outline' },
])
const bondsOptions = ref([
  { title: 'Include', icon: 'mdi-link' },
  { title: 'Omit', icon: 'mdi-link-off' },
])
const paperOptions = ref([
  { title: 'Letter', icon: 'mdi-text-box-check-outline' },
  { title: 'A4', icon: 'mdi-file-star-four-points-outline' },
])
const cardOptions = ref([
  { title: 'Include Standard Actions', icon: 'mdi-hexagon-slice-3 ' },
  { title: 'Include Status/Condition Cards', icon: 'cc:eclipse' },
])

emit('set', props.options);

const pilotIncludeOptions = computed(() => {
  switch (props.options.layout.title) {
    case 'Minimal':
      return [];
    case 'Terse':
      return [
        { title: 'Pilot Portrait' },
        { title: 'Separate Talent Detail' },
        { title: 'Appearance Notes' },
        { title: 'Pilot Biography' },
        { title: 'Pilot Notes' },
        { title: 'Extra Equipment Space' },
        { title: 'Extra Reserve Space' },
        { title: 'Append Unlined Section' },
        { title: 'Append Lined Section' },
      ];

    case 'Standard':
      return [
        { title: 'Show Expanded Tags' },
        { title: 'Separate Talent Detail' },
        { title: 'Appearance Notes' },
        { title: 'Extra Equipment Space' },
        { title: 'Extra Reserve Space' },
        { title: 'Append Unlined Section' },
        { title: 'Append Lined Section' },
      ];
    case 'Expanded':
      return [
        { title: 'Show Expanded Tags' },
        { title: 'Separate Talent Detail' },
        { title: 'Extra Equipment Space' },
        { title: 'Extra Reserve Space' },
        { title: 'Append Unlined Section' },
        { title: 'Append Lined Section' },
      ];
    default:
      return [];
  }
})
const mechIncludeOptions = computed(() => {
  const isBlank = props.options.content.title === 'Blank';
  switch (props.options.layout.title) {
    case 'Minimal':
      return isBlank ? [{ title: 'Extra Mount Panel' }, { title: 'Extra System Space' }] : [];
    case 'Terse':
      return [
        { title: 'Mech Image' },
        { title: 'Mech Notes' },
        ...(isBlank ? [{ title: 'Extra Mount Panel' }, { title: 'Extra System Space' }] : []),
        { title: 'Append Unlined Section' },
        { title: 'Append Lined Section' },
      ];
    case 'Standard':
      return [
        { title: 'Show Expanded Tags' },
        ...(isBlank ? [{ title: 'Extra Mount Panel' }, { title: 'Extra System Space' }] : []),
        { title: 'Append Unlined Section' },
        { title: 'Append Lined Section' },
      ];
    case 'Expanded':
      return [
        ...(isBlank ? [{ title: 'Extra Mount Panel' }, { title: 'Extra System Space' }] : []),
        { title: 'Append Unlined Section' },
        { title: 'Append Lined Section' },
      ];
    default:
      return [];
  }
})
const extraOptions = computed(() => {
  switch (props.options.layout.title) {
    default:
      return [
        { title: 'Relevant Tag Reference' },
        { title: 'Relevant Trigger Reference' },
        { title: 'Combat Quick Reference' },
        { title: 'Action Reference' },
        { title: 'Downtime Quick Reference' },
      ];
  }
})

</script>

<style scoped>
fieldset {
  border-color: rgb(var(--v-theme-primary));
  border-radius: 2px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  background-color: rgb(var(--v-theme-primary));
  color: #fff;
  padding: 3px 6px;
}
</style>
