<template>
  <v-row dense>
    <v-col>
      <div class="text-overline">LAYERS</div>
    </v-col>
    <v-col v-if="!readonly" cols="auto">
      <cc-button color="primary" prepend-icon="mdi-plus" @click="layerSelector = true">
        add layer
      </cc-button>
    </v-col>
    <v-col v-if="!readonly" cols="auto">
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            size="x-small"
            flat
            class="fade-select"
            @click="addRandomLayer()">
            <v-icon size="30" color="accent" icon="mdi-dice-d20-outline" />
          </v-btn>
        </template>
        <span>Add random layer</span>
      </v-tooltip>
    </v-col>
  </v-row>
  <v-card v-if="!item.Layers.length" variant="outlined" color="primary" class="pa-2">
    no layers
  </v-card>
  <v-card
    v-else-if="!item.Layers.some((x) => x.Layer)"
    variant="outlined"
    color="primary"
    class="pa-2">
    no layers
  </v-card>
  <div v-else>
    <v-tabs v-model="tab" density="compact" class="mt-2" fixed-tabs bg-color="primary">
      <v-tab v-for="(layer, idx) in item.Layers">
        <v-tooltip v-if="idx > 1" location="top">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              size="small"
              icon="mdi-chevron-left"
              class="mx-1 fade-select"
              @click.stop="item.MoveLayer(idx, idx - 1)" />
          </template>
          <span>Order Lower</span>
        </v-tooltip>
        <span v-else class="mx-3" />
        {{ layer.Layer?.Name }}
        <v-tooltip v-if="idx && idx < item.Layers.length - 1" location="top">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              size="small"
              icon="mdi-chevron-right"
              class="mx-1 fade-select"
              @click.stop="item.MoveLayer(idx, idx + 1)" />
          </template>
          <span>Order Higher</span>
        </v-tooltip>
        <span v-else class="mx-3" />
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="(layer, index) in item.Layers">
        <v-card
          variant="outlined"
          class="rounded-0 rounded-b bg-transparent"
          style="border-color: rgb(var(--v-theme-primary))">
          <v-card-text class="my-0 py-0">
            <div class="text-overline">Layer Description</div>
            <cc-rich-text-area v-model="layer.Description" :readonly="readonly" />
          </v-card-text>
          <v-card-text class="pt-0 mt-2">
            <stat-editor
              :item="layer"
              :controller="layer"
              :bonuses="layer.FeatureController.Bonuses"
              :readonly="readonly"
              prefix="layer" />
            <cc-dense-card v-if="layer.Layer" :item="layer.Layer" :tier="item.Tier">
              <template v-if="layer.Layer?.Shards?.Count !== 0" #extra>
                <v-card-text class="mt-n2 pt-0">
                  <!-- <stat-editor
                    :item="layer.Layer.Shards"
                    :controller="layer.Layer.Shards.StatController"
                    prefix="Shard"
                    readonly /> -->
                </v-card-text>
              </template>
            </cc-dense-card>
          </v-card-text>
          <v-divider />
          <v-card-actions class="my-n2">
            <v-spacer />
            <cc-button
              size="small"
              variant="outlined"
              color="error"
              prepend-icon="mdi-delete"
              :disabled="layer.ID === 'el_core' || index === 0"
              @click="removeLayer(index)">
              remove
            </cc-button>
          </v-card-actions>
        </v-card>
      </v-window-item>
    </v-window>
  </div>

  <div class="my-4" />

  <cc-solo-modal v-model="layerSelector" title="Select Layer" icon="mdi-layers-triple">
    <layer-selector :item="item" @add-layer="addLayer($event)" />
  </cc-solo-modal>
</template>

<script lang="ts">
import StatEditor from '@/features/gm/_components/StatEditor.vue';
import LayerSelector from './LayerSelector.vue';

export default {
  name: 'eidolon-layers',
  components: { LayerSelector, StatEditor },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    tab: 0,
    layerSelector: false,
  }),
  methods: {
    removeLayer(index: number) {
      this.item.RemoveLayer(index);
      this.tab--;
    },
    addLayer(layer) {
      this.item.AddLayer(layer);
      this.tab = this.item.Layers.length - 1;
      this.layerSelector = false;
    },
    addRandomLayer() {
      this.item.AddRandomLayer();
      this.tab = this.item.Layers.length - 1;
    },
  },
};
</script>
