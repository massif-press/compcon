<template>
  <v-row dense
    class="text-overline pt-2">
    <v-col>
      <div class="d-flex align-center">
        FEATURES
        <v-btn v-if="!readonly && npc.NpcClassController?.HasClass && allFeatures.length > 1"
          :icon="reorderMode ? 'mdi-check' : 'mdi-sort'"
          size="x-small"
          variant="text"
          :color="reorderMode ? 'success' : 'grey'"
          class="ml-2"
          style="margin-top: -2px"
          @click="reorderMode = !reorderMode" />
      </div>
    </v-col>
    <v-col v-if="passiveCount && !reorderMode"
      cols="auto">
      <cc-switch v-model="showPassives"
        color="error"
        on-icon="cc:npc_feature"
        off-icon="mdi-eye-off"
        :tooltip="showPassives
          ? `Showing ${passiveCount} passive, build-related, and system modifying features`
          : `Hiding ${passiveCount} passive, build-related, and system modifying features`
          " />
    </v-col>
  </v-row>
  <div v-if="npc.NpcClassController?.HasClass">
    <npc-feature-alerts :hide="readonly || npc.BrewController.MissingContent"
      :template-controller="npc.NpcTemplateController"
      expanded />

    <!-- View mode: masonry grid -->
    <cc-masonry-grid v-if="!reorderMode"
      :items="shownFeatures"
      :key-mapper="item => item.ID"
      :column-width="400"
      :gap="14"
      :min-columns="1"
      :max-columns="2">
      <template #default="{ item }">
        <cc-dense-card v-if="item"
          :key="item.ID"
          :item="item"
          :tier="npc.NpcClassController.Tier">
          <template #pre>
            <npc-mod-inset v-for="mod in npc.NpcFeatureController.GetModifiers(item)"
              :key="mod.ID"
              :mod="mod" />
          </template>
        </cc-dense-card>
      </template>
    </cc-masonry-grid>

    <!-- Reorder mode: linear sortable -->
    <sortable v-else
      :list="allFeatures"
      item-key="ID"
      :options="{ animation: 200, handle: '.feature-drag-handle', scroll: true, scrollSpeed: 300 }"
      @end="onFeatureReorder">
      <template #item="{ element, index }">
        <div class="feature-reorder-row mb-2"
          style="display: flex; align-items: flex-start; gap: 4px">
          <div class="d-flex flex-column align-center"
            style="padding-top: 6px">
            <v-icon class="feature-drag-handle"
              icon="mdi-drag"
              size="20"
              aria-label="Drag to reorder"
              tabindex="0"
              style="cursor: move; opacity: 0.5" />
            <v-btn icon
              size="x-small"
              variant="text"
              :disabled="index === 0"
              @click="moveFeature(index, index - 1)">
              <v-icon size="small">mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn icon
              size="x-small"
              variant="text"
              :disabled="index === allFeatures.length - 1"
              @click="moveFeature(index, index + 1)">
              <v-icon size="small">mdi-arrow-down</v-icon>
            </v-btn>
          </div>
          <div style="flex: 1; min-width: 0">
            <cc-dense-card v-if="element"
              :item="element"
              :tier="npc.NpcClassController.Tier">
              <template #pre>
                <npc-mod-inset v-for="mod in npc.NpcFeatureController.GetModifiers(element)"
                  :key="mod.ID"
                  :mod="mod" />
              </template>
            </cc-dense-card>
          </div>
        </div>
      </template>
    </sortable>

    <npc-feature-selector v-if="!readonly"
      :npc="npc" />
  </div>
  <v-card v-else
    variant="outlined"
    class="pa-1"
    style="border-color: rgb(var(--v-theme-panel))">
    <div v-if="!readonly"
      class="text-center text-disabled text-caption pa-2">
      <i>Select a Class to add Features</i>
    </div>
    <div v-else
      class="text-center text-disabled text-caption pa-2">
      <i>No NPC features</i>
    </div>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import { NpcFeatureSelector } from './_components';
import NpcFeatureAlerts from './_components/NpcFeatureAlerts.vue';
import NpcModInset from './_components/NpcModInset.vue';
import { Sortable } from 'sortablejs-vue3';
import * as _ from 'lodash-es';

export default {
  name: 'NpcBuilderContent',
  components: {
    NpcFeatureSelector,
    NpcFeatureAlerts,
    NpcModInset,
    Sortable,
  },
  props: {
    npc: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    reorderMode: false,
  }),
  computed: {
    showPassives: {
      get: function () {
        return UserStore().User.View('showNpcPassives', true);
      },
      set: function (newVal) {
        UserStore().User.SetView('showNpcPassives', newVal);
      },
    },
    passiveCount() {
      return this.npc.NpcFeatureController.Passives.length;
    },
    allFeatures() {
      return this.npc.NpcFeatureController.Features.filter((f: any) => !!f);
    },
    shownFeatures() {
      const arr = this.showPassives
        ? this.npc.NpcFeatureController.Features.filter((f: any) => !!f)
        : this.npc.NpcFeatureController.Features.filter((f: any) => !!f && !f.Passive);
      return _.orderBy(arr, 'FeatureType', 'desc');
    },
  },
  methods: {
    onFeatureReorder(event: any) {
      if (event.oldIndex === event.newIndex) return;
      this.npc.NpcFeatureController.ReorderFeature(event.oldIndex, event.newIndex);
    },
    moveFeature(from: number, to: number) {
      this.npc.NpcFeatureController.ReorderFeature(from, to);
    },
  },
};
</script>
