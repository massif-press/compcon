<template>
  <v-row class="mb-1"
    dense>
    <v-col>
      <div class="heading h2">{{ combatant.actor.Name }}</div>
      <div class="text-cc-overline">{{ $t('active.eidolon.tierEidolon', { n: combatant.actor.Tier }) }}</div>
    </v-col>
    <v-col v-for="n in combatant.actor.Layers.length"
      :key="`layer-${n}`"
      cols="auto"
      align-self="center"
      class="text-center">
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            flat
            tile
            icon
            stacked
            :variant="n - 1 === combatant.actor.ActiveLayerIndex ? 'elevated' : 'tonal'"
            :color="n - 1 === combatant.actor.ActiveLayerIndex ? 'exotic' : 'primary'"
            @click="combatant.actor.ActiveLayerIndex = n - 1">
            <v-icon icon="mdi-layers"
              :size="n - 1 === combatant.actor.ActiveLayerIndex ? 50 : 40" />
            <div class="text-cc-overline">{{ combatant.actor.Layers[n - 1].Name }}</div>
          </v-btn>
        </template>
        {{ $t('active.eidolon.nameLayer', { name: combatant.actor.Layers[n - 1].Name }) }}
        <span v-if="n - 1 === combatant.actor.ActiveLayerIndex">&nbsp;{{ $t('active.eidolon.active') }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
  <panel-base
    :item="layer"
    hide-palette>
    <template #name-block>
      <div class="mr-12">
        <div class="text-cc-overline">{{ $t('active.eidolon.activeLayer') }}</div>
        <div class="heading h3 border-primary text-accent text-center">
          {{ layer.Name }}
        </div>
        <v-divider class="my-1" />
        <cc-button block
          size="small"
          color="primary"
          :disabled="!layer.Layer.Shards?.Count"
          @click="genShards()">
          <span v-if="layer.Layer.Shards?.Count">
            {{ $t('active.eidolon.generateN', { n: shardCount }) }}
            <span>{{ shardCount > 1 ? $t('active.eidolon.shards') : $t('active.eidolon.shard') }}</span>
          </span>
          <span v-else>{{ $t('active.eidolon.noShards') }}</span>
        </cc-button>
      </div>
    </template>

    <template #subtitle>
      <div v-if="layer.Description"
        class="text-cc-overline mt-2">{{ $t('active.eidolon.layerDescription') }}</div>
      <p v-if="layer.Description"
        v-html-safe="layer.Description"
        class="px-4 py-2 border" />
      <div v-if="layer.Layer.Appearance"
        class="my-2">
        <cc-panel title="Reported Appearances">
          <p v-html-safe="layer.Layer.Appearance" />
        </cc-panel>
      </div>
      <div v-if="layer.Layer.Hints"
        class="my-2">
        <cc-panel title="Hints">
          <p v-html-safe="layer.Layer.Hints" />
          <div class="text-right"
            style="position: absolute; bottom: 0; right: 22px">
            <v-btn variant="text"
              size="x-small"
              class="fade-select"
              @click="clip(layer.Layer.Hints)">
              <v-icon start
                icon="mdi-content-copy" />
              {{ $t('active.eidolon.scan') }}
            </v-btn>
          </div>
        </cc-panel>
      </div>
      <div v-if="layer.Layer.Rules"
        class="my-2">
        <cc-panel title="Rules">
          <p v-html-safe="layer.Layer.RulesByTier(combatant.actor.Tier)" />
        </cc-panel>
      </div>
    </template>

    <v-expansion-panels class="mt-2"
      multiple
      flat
      tile
      bg-color="background"
      variant="accordion">
      <v-expansion-panel class="py-0">
        <v-expansion-panel-title class="text-cc-overline py-0">
          <div class="text-cc-overline">
            <v-icon icon="cc:trait"
              class="mt-n1"
              start />
            {{ $t('active.eidolon.persistentTraits', { n: traits.length }) }}
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <cc-masonry-grid :items="traits"
            :xl-columns="xlColumns">
            <template #default="{ item }">
              <div class="heading h4 text-accent">{{ item.name }}</div>
              <p v-html-safe="item.detail" />
            </template>
          </cc-masonry-grid>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <cc-masonry-grid :items="features"
      :xl-columns="xlColumns">
      <template #default="{ item }">
        <fieldset class="px-2 pb-2"
          style="border-color: rgba(155, 155, 155, 0.6)">
          <unit-feature-card :key="item.ID"
            :item="item"
            :unit="layer"
            @deploy="deploy($event)" />
        </fieldset>
      </template>
    </cc-masonry-grid>
  </panel-base>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useDisplay } from 'vuetify'
import { EncounterContextKey } from './encounterContext';
import type { CombatantData } from '@/classes/encounter/Encounter';
import UnitFeatureCard from './_components/loadouts/_unitFeatureCard.vue';
import PanelBase from './_PanelBase.vue';
import PersistentTraits from '@/classes/npc/eidolon/persistent_traits.json';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';

const props = defineProps({
  combatant: {
    type: Object,
    required: true,
  },
  encounterInstance: {
    type: EncounterInstance,
    required: true,
  },
})

provide(EncounterContextKey, {
  owner: computed(() => props.combatant as CombatantData),
  encounterInstance: computed(() => props.encounterInstance),
})

const emit = defineEmits(['deselect'])

const { smAndDown: mobile, xs: portrait } = useDisplay()

const xlColumns = computed(() => {
  if (mobile.value) return 1
  else return (props.encounterInstance as any).MaxMasonryColumns
})
const traits = computed(() => PersistentTraits)
const layer = computed(() => (props.combatant as any).actor.ActiveLayer)
const features = computed(() => layer.value?.Layer?.Features || [])
const shardCount = computed(() => {
  const shardCount = layer.value.Layer.Shards?.Count || 0;
  if (!shardCount) return 0;
  if (typeof layer.value.Layer.Shards?.Count === 'string') {
    const str = (layer.value.Layer.Shards.Count as string).toLowerCase().trim();
    if (str === 'hostile_characters') {
      return props.encounterInstance.Combatants.filter((c) => c.side === 'ally').length;
    } else if (str === 'characters') {
      return props.encounterInstance.Combatants.length;
    } else {
      return isNaN(Number(str)) ? 0 : Number(str);
    }
  }
  return shardCount;
})

function deploy(deployable) { (props.encounterInstance as any).Deploy(deployable, props.combatant) }
function clip(text) { navigator.clipboard.writeText(text) }
function genShards() {
  if (!shardCount.value) return
  for (let i = 0; i < shardCount.value; i += 1) {
    (props.combatant as any).deployables.push(
      layer.value.Layer.Shards.Create(props.combatant, layer.value.Name)
    )
  }
}
</script>
