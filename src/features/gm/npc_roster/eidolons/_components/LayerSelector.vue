<template>
  <v-card-text v-if="!hasLayerData"
    class="mt-n4">
    <v-container>
      <div style="min-height: 20vh; width: 700px; margin: auto"
        class="py-4">
        <div class="heading h2 mb-2 text-center pb-4">{{ $t('gm.layerSelector.noData') }}</div>

        <i18n-t keypath="gm.layerSelector.help1" tag="span" scope="global">
          <template #link><a href="https://massif-press.itch.io/no-room-for-a-wallflower-act-1">{{ $t('gm.layerSelector.linkText') }}</a></template>
        </i18n-t>
        <br />
        <br />
        {{ $t('gm.layerSelector.help2') }}
      </div>
    </v-container>
  </v-card-text>
  <cc-compendium-browser v-else
    ref="browser"
    :items="layers"
    item-type="EidolonLayer"
    :table-headers="headers"
    :options="options"
    view-key="sel-eidolon-layer"
    equippable
    @equip="AddLayer($event)">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('gm.layerSelector.mechWeapons') }}</div>
    </template>
    <template #top>
      <cc-switch v-model="allowDupes"
        label="Allow Duplicates"
        color="error"
        on-icon="mdi-lock-open"
        off-icon="mdi-lock" />
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores';

defineOptions({ name: 'npc-class-selector' })

const props = withDefaults(defineProps<{
  item: object
  readonly?: boolean
}>(), {
  readonly: false
})

const emit = defineEmits<{
  'add-layer': []
}>()

const browser = ref<any>(null)

const allowDupes = ref(false)
const options = ref({
      views: ['single', 'table', 'cards'],
      initialView: 'single',
      groups: ['lcp', 'none'],
      initialGroup: 'none',
    })
const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      {
        title: 'Shards',
        key: 'ShardCount',
      },
    ])

const hasLayerData = computed(() => {
      return CompendiumStore().EidolonLayers.length > 0;
    })
const layers = computed(() => {
      const layers = allowDupes.value
        ? CompendiumStore().EidolonLayers
        : CompendiumStore().EidolonLayers.filter(
          (x) => !props.item.Layers.some((y) => x.ID === y.ID)
        );
      return layers;
    })

function AddLayer(layer) {
      emit('add-layer', layer);
    }
</script>
