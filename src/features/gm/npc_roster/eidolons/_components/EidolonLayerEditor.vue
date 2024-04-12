<template>
  <v-row>
    <v-col>
      <div class="text-overline">LAYERS</div>
    </v-col>
    <v-col v-if="!readonly" cols="auto">
      <v-btn
        variant="tonal"
        color="accent"
        prepend-icon="mdi-plus"
        style="width: 300px"
        @click="($refs.layerSelector as any).show()"
        >add layer</v-btn
      >
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" class="fade-select" @click="addRandomLayer()">
            <v-icon size="30" icon="mdi-dice-d20-outline" />
          </v-btn>
        </template>
        <span>Add random layer</span>
      </v-tooltip>
    </v-col>
  </v-row>
  <v-card v-if="!item.Layers.length" variant="outlined" color="primary" class="pa-2">
    no layers
  </v-card>
  <div v-else>
    <v-tabs v-model="tab" density="compact" class="mt-2" fixed-tabs bg-color="primary">
      <v-tab v-for="layer in item.Layers">
        {{ layer.Layer.Name }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="(layer, index) in item.Layers">
        <v-card
          variant="outlined"
          class="rounded-0 rounded-b"
          style="border-color: rgb(var(--v-theme-primary))">
          <v-card-text class="my-0 py-0">
            <div class="text-overline">Layer Description</div>
            <cc-rich-text-area :item="layer" note-property="Description" :readonly="readonly" />
          </v-card-text>
          <v-card-text class="mt-n2 pt-0">
            <stat-editor
              :item="layer"
              :controller="layer"
              :bonuses="layer.FeatureController.Bonuses"
              :readonly="readonly"
              prefix="layer" />
          </v-card-text>
          <cc-dense-card :item="layer.Layer" :tier="item.Tier">
            <template v-if="layer.Layer.Shards.Count !== 0" #extra>
              <v-card-text class="mt-n2 pt-0">
                <stat-editor
                  :item="layer.Layer.Shards"
                  :controller="layer.Layer.Shards.StatController"
                  prefix="Shard"
                  readonly />
              </v-card-text>
            </template>
          </cc-dense-card>
          <v-divider />
          <v-card-actions class="my-n2">
            <v-spacer />
            <v-btn
              small
              variant="outlined"
              class="fade-select"
              color="error"
              size="x-small"
              prepend-icon="mdi-delete"
              :disabled="layer.ID === 'el_core' || index === 0"
              @click="removeLayer(index)"
              >remove</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-window-item>
    </v-window>
  </div>

  <div class="my-4" />

  <layer-selector ref="layerSelector" :item="item" @add-layer="tab = item.Layers.length - 1" />
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
  }),
  methods: {
    removeLayer(index: number) {
      this.item.RemoveLayer(index);
      this.tab--;
    },
    addRandomLayer() {
      this.item.AddRandomLayer();
      this.tab = this.item.Layers.length - 1;
    },
  },
};
</script>
