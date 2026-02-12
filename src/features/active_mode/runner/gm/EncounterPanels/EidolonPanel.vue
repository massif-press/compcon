<template>
  <v-row class="mb-1"
    dense>
    <v-col>
      <div class="heading h2">{{ combatant.actor.Name }}</div>
      <div class="text-cc-overline">Tier {{ combatant.actor.Tier }} Eidolon</div>
    </v-col>
    <v-col v-for="n in combatant.actor.Layers.length"
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
        {{ combatant.actor.Layers[n - 1].Name }} Layer
        <span v-if="n - 1 === combatant.actor.ActiveLayerIndex">&nbsp;(Active)</span>
      </v-tooltip>
    </v-col>
  </v-row>
  <panel-base :encounter-instance="encounterInstance"
    :item="layer"
    hide-palette>
    <template #name-block>
      <div class="mr-12">
        <div class="text-cc-overline">Active Layer</div>
        <div class="heading h3 border-primary text-accent text-center">
          {{ layer.Name }}
        </div>
        <v-divider class="my-1" />
        <cc-button block
          size="small"
          color="primary"
          :disabled="!layer.Layer.Shards.Count"
          @click="genShards()">
          <span v-if="layer.Layer.Shards.Count">
            Generate {{ layer.Layer.Shards.Count }}
            <span>{{ layer.Layer.Shards.Count > 1 ? 'Shards' : 'Shard' }}</span>
          </span>
          <span v-else>Layer has no Shards</span>
        </cc-button>
      </div>
    </template>

    <template #subtitle>
      <div v-if="layer.Description"
        class="text-cc-overline mt-2">Layer Description</div>
      <p v-if="layer.Description"
        v-html="layer.Description"
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
              SCAN
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
            Persistent Traits ({{ traits.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <masonry-wall :items="traits"
            :column-width="500"
            :gap="8"
            :min-columns="1"
            :max-columns="2">
            <template #default="{ item, index }">
              <div class="heading h4 text-accent">{{ item.name }}</div>
              <p v-html="item.detail" />
            </template>
          </masonry-wall>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <masonry-wall :items="features"
      :column-width="600"
      :gap="16"
      :min-columns="1"
      :max-columns="2">
      <template #default="{ item }">
        <fieldset class="px-2 pb-2"
          style="border-color: rgba(155, 155, 155, 0.6)">
          <unit-feature-card :encounter="encounterInstance"
            :key="item.ID"
            :item="item"
            :unit="layer"
            @deploy="deploy($event)" />
        </fieldset>
      </template>
    </masonry-wall>
  </panel-base>
</template>

<script>
import UnitFeatureCard from './_components/loadouts/_unitFeatureCard.vue';
import PanelBase from './_PanelBase.vue';
import PersistentTraits from '@/classes/npc/eidolon/persistent_traits.json';

export default {
  name: 'EidolonPanel',
  components: {
    PanelBase,
    UnitFeatureCard,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    traits() {
      return PersistentTraits;
    },
    layer() {
      return this.combatant.actor.ActiveLayer;
    },
    features() {
      return this.layer.Layer.Features || [];
    },
  },
  methods: {
    deploy(deployable) {
      this.encounterInstance.Deploy(deployable, this.combatant);
    },
    clip(text) {
      navigator.clipboard.writeText(text);
    },
    genShards() {
      if (!this.layer.Layer.Shards.Count) return;
      for (let i = 0; i < this.layer.Layer.Shards.Count; i += 1) {
        this.combatant.deployables.push(
          this.layer.Layer.Shards.Create(this.combatant, this.layer.Name)
        );
      }
    },
  },
};
</script>
