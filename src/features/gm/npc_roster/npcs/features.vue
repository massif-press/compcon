<template>
  <v-row dense
    class="text-overline pt-2">
    <v-col>
      <div class="d-flex align-center">
        FEATURES
        <v-tooltip v-if="!readonly && npc.NpcClassController?.HasClass && allFeatures.length > 1"
          location="top">
          <template #activator="{ props }">
            <v-btn size="26"
              variant="outlined"
              icon
              flat
              tile
              :color="reorderMode ? 'success' : 'accent'"
              class="ml-2"
              style="margin-top: -2px"
              v-bind="props"
              @click="reorderMode = !reorderMode">
              <v-icon size="22">
                {{ reorderMode ? 'mdi-check' : 'mdi-swap-vertical' }}
              </v-icon>
            </v-btn>
          </template>
          <span> {{ reorderMode ? 'Save Configuration' : 'Reorder Features' }}</span>
        </v-tooltip>
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
          <template #title-prepend>
            <v-menu :close-on-content-click="false">
              <template #activator="{ props }">
                <v-btn v-if="!readonly"
                  size="20"
                  icon
                  flat
                  tile
                  class="mt-n1 ml-n1 mr-1"
                  variant="plain"
                  v-bind="props">
                  <v-icon icon="mdi-cog" />
                </v-btn>
              </template>
              <v-list density="compact"
                slim
                border
                tile
                class="pa-0">
                <cc-dialog :close-on-click="false"
                  title="Set Custom Name"
                  @close="npc.SaveController.save()">
                  <template #activator="{ open }">
                    <v-list-item prepend-icon="mdi-circle-edit-outline"
                      title="Set Custom Name"
                      @click="open" />
                  </template>
                  <cc-text-field v-model="item.FlavorName"
                    label="Custom Item Name"
                    :placeholder="item.TrueName"
                    variant="outlined"
                    hide-details
                    autofocus
                    class="pa-4"
                    @focus="$event.target.select()" />
                </cc-dialog>
                <cc-dialog :close-on-click="false"
                  title="Set Custom Description"
                  @close="npc.SaveController.save()">
                  <template #activator="{ open }">
                    <v-list-item prepend-icon="mdi-circle-edit-outline"
                      title="Set Custom Description"
                      @click="open" />
                  </template>
                  <cc-text-area v-model="item.FlavorDescription"
                    label="Custom Item Description"
                    :placeholder="item.FlavorDescription || item.Description"
                    variant="outlined"
                    hide-details
                    auto-grow
                    class="pa-4"
                    @focus="$event.target.select()" />
                </cc-dialog>

              </v-list>
            </v-menu>
          </template>
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
      :options="{ animation: 200, handle: '.feature-drag-handle', scroll: false }"
      @start="startDragScroll"
      @end="onFeatureReorder">
      <template #item="{ element }">
        <div class="feature-reorder-row mb-2"
          style="display: flex; align-items: flex-start; gap: 4px">
          <div class="d-flex flex-column align-center">
            <v-icon class="feature-drag-handle"
              icon="mdi-drag"
              aria-label="Drag to reorder"
              tabindex="0"
              style="cursor: move; opacity: 0.5" />
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
import { startDragScroll, stopDragScroll } from '@/mixins/useScrollOnDrag';
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
    startDragScroll,
    onFeatureReorder(event: any) {
      stopDragScroll();
      if (event.oldIndex === event.newIndex) return;
      this.npc.NpcFeatureController.ReorderFeature(event.oldIndex, event.newIndex);
    },
    moveFeature(from: number, to: number) {
      this.npc.NpcFeatureController.ReorderFeature(from, to);
    },
  },
};
</script>
