<template>
  <v-card id="systems-container"
    flat
    tile
    color="transparent">
    <fieldset class="px-3"
      :class="mobile && 'border-0'"
      style="border-color: rgba(155, 155, 155, 0.6)">
      <legend :style="`color: ${color}`"
        class="heading h3 d-flex align-center">
        Systems
        <v-tooltip v-if="!readonly && activeSystems.length > 1"
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
              <v-icon size="small">
                {{ reorderMode ? 'mdi-check' : 'mdi-swap-vertical' }}
              </v-icon>
            </v-btn>
          </template>
          <span> {{ reorderMode ? 'Save Configuration' : 'Reorder Systems' }}</span>
        </v-tooltip>
      </legend>
      <div style="position: relative">
        <div class="side-legend">
          <span :class="`heading h3 ${mech.FreeSP < 0 ? 'text-error' : 'text-disabled text--darken-3'
            }`">
            <v-icon v-if="mech.FreeSP < 0"
              color="error"
              size="small">mdi-alert</v-icon>
            {{ mech.FreeSP }} / {{ mech.MaxSP }}
            <span class="text-cc-overline">SP</span>
          </span>
        </div>
      </div>

      <div v-if="!reorderMode"
        style="position: relative; overflow-anchor: none">
        <cc-masonry-grid :items="systemItems"
          :gap="16"
          :min-columns="1"
          :max-columns="3">
          <template #default="{ item, index }">
            <component :is="item.component"
              :key="item.id"
              :item="item.item"
              :mech="item.props.mech"
              :color="item.props.color"
              :readonly="item.props.readonly"
              :weapon="item.weapon"
              :integrated="item.props.integrated"
              :empty="item.props.empty"
              @selector-open="selector = true"
              @switch="switchSystem($event)" />
          </template>
        </cc-masonry-grid>
      </div>

      <div v-else
        style="position: relative; overflow-anchor: none">
        <div v-for="item in staticTopItems"
          :key="item.id"
          class="mb-2 opacity-60">
          <component :is="item.component"
            :item="item.item"
            :mech="item.props.mech"
            :color="item.props.color"
            :readonly="true"
            :weapon="item.weapon"
            :integrated="item.props.integrated"
            :empty="item.props.empty" />
        </div>

        <sortable :list="activeSystems"
          item-key="ID"
          :options="{ animation: 200, handle: '.system-drag-handle', scroll: false }"
          @start="startDragScroll"
          @end="onSystemReorder">
          <template #item="{ element }">
            <div class="system-reorder-row mb-2"
              style="display: flex; align-items: flex-start; gap: 4px">
              <div class="d-flex flex-column align-center system-drag-controls"
                style="padding-top: 8px">
                <v-icon class="system-drag-handle"
                  icon="mdi-drag"
                  aria-label="Drag to reorder"
                  tabindex="0"
                  color="stark"
                  style="cursor: move; opacity: 0.5" />
              </div>
              <div style="flex: 1; min-width: 0">
                <component :is="_SystemSlotCard"
                  :item="element"
                  :mech="mech"
                  :color="color"
                  :readonly="readonly"
                  @switch="switchSystem($event)" />
              </div>
            </div>
          </template>
        </sortable>

        <div v-for="item in staticBottomItems"
          :key="item.id"
          class="mb-2">
          <component :is="item.component"
            :item="item.item"
            :mech="item.props.mech"
            :color="item.props.color"
            :readonly="item.props.readonly"
            :empty="item.props.empty"
            @selector-open="selector = true" />
        </div>
      </div>

      <v-row v-if="!readonly && mech.FreeSP <= 0"
        justify="end"
        class="mt-1">
        <v-col cols="auto">
          <cc-button size="small"
            color="accent"
            variant="tonal"
            prepend-icon="mdi-plus"
            @click.stop="setAddAdditional">
            Add Additional System
          </cc-button>
        </v-col>
      </v-row>

      <cc-solo-modal v-model="selector"
        icon="cc:system"
        title="SELECT EQUIPMENT"
        clip>
        <system-selector :mech="mech"
          :swap-system="swapSystem"
          @done="handleDone" />
      </cc-solo-modal>
    </fieldset>
  </v-card>
</template>

<script lang="ts">
import * as _ from 'lodash-es';
import { markRaw } from 'vue';
import { Sortable } from 'sortablejs-vue3';
import { startDragScroll, stopDragScroll } from '@/composables/useScrollOnDrag';
import SystemSlotCard from './_SystemSlotCard.vue';
import ModEquippedCard from './_ModEquippedCard.vue';
import SystemSelector from './_SystemSelector.vue';
import { useMobile } from '@/composables/useMobile';

const _SystemSlotCard = markRaw(SystemSlotCard);
const _ModEquippedCard = markRaw(ModEquippedCard);


export default {
  setup() {
    return useMobile()
  },
  name: 'SystemsBlock',
  components: { SystemSlotCard, ModEquippedCard, SystemSelector, Sortable },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    selector: false,
    swapSystem: null as any,
    additionalSystem: false,
    systemItems: [] as any[],
    reorderMode: false,
    _SystemSlotCard,
  }),
  computed: {
    moddedWeapons() {
      return this.mech.MechLoadoutController.ActiveLoadout.Weapons.filter((x) => x.Mod);
    },
    activeSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.Systems;
    },
    integratedSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.IntegratedSystems;
    },
    staticTopItems(): any[] {
      const arr: any[] = [];
      this.integratedSystems.forEach((s) => {
        arr.push({
          component: _SystemSlotCard,
          id: s.ID,
          props: { mech: this.mech, item: s, color: this.color, readonly: this.readonly, integrated: true },
          item: s,
        });
      });
      this.moddedWeapons.forEach((w) => {
        arr.push({
          component: _ModEquippedCard,
          id: w.ID,
          props: { mech: this.mech, color: this.color, readonly: this.readonly },
          item: w.Mod,
          weapon: w,
        });
      });
      return arr;
    },
    staticBottomItems(): any[] {
      if (this.mech.FreeSP > 0 && !this.readonly) {
        return [{
          component: _SystemSlotCard,
          id: 'add-system',
          props: { mech: this.mech, item: null, color: this.color, readonly: this.readonly, empty: true },
          item: null,
        }];
      }
      return [];
    },
  },
  watch: {
    mech: {
      immediate: true,
      deep: true,
      handler() {
        this.updateSystemItems();
      },
    },
  },
  methods: {
    updateSystemItems() {
      const arr: any[] = [];

      this.integratedSystems.forEach((s) => {
        arr.push({
          component: _SystemSlotCard,
          id: s.ID,
          props: {
            mech: this.mech,
            item: s,
            color: this.color,
            readonly: this.readonly,
            integrated: true,
          },
          item: s,
        });
      });

      this.moddedWeapons.forEach((w) => {
        arr.push({
          component: _ModEquippedCard,
          id: w.ID,
          props: {
            mech: this.mech,
            color: this.color,
            readonly: this.readonly,
          },
          item: w.Mod,
          weapon: w,
        });
      });

      this.activeSystems.forEach((s) => {
        arr.push({
          component: _SystemSlotCard,
          id: s.ID,
          props: {
            mech: this.mech,
            item: s,
            color: this.color,
            readonly: this.readonly,
          },
          item: s,
        });
      });

      if (this.mech.FreeSP > 0 && !this.readonly) {
        arr.push({
          component: _SystemSlotCard,
          id: 'add-system',
          props: {
            mech: this.mech,
            item: null,
            color: this.color,
            readonly: this.readonly,
            empty: true,
          },
          item: null,
        });
      }

      this.systemItems = arr;
    },
    startDragScroll,
    onSystemReorder(event: any) {
      stopDragScroll();
      if (event.oldIndex === event.newIndex) return;
      this.mech.MechLoadoutController.ActiveLoadout.ReorderSystem(event.oldIndex, event.newIndex);
    },
    moveSystem(from: number, to: number) {
      this.mech.MechLoadoutController.ActiveLoadout.ReorderSystem(from, to);
    },
    switchSystem(item: any) {
      this.swapSystem = item;
      this.selector = true;
    },
    setAddAdditional() {
      this.additionalSystem = true;
      this.selector = true;
    },
    async handleDone() {
      this.swapSystem = null;

      this.updateSystemItems(); // triggers list update

      // wait for DOM
      await this.$nextTick();
      await new Promise((r) => setTimeout(r, 0));

      this.selector = false;
    },
  },
};
</script>

<style scoped>
fieldset {
  border-color: rgb(var(--v-theme-grey-darken2));
  border-radius: 5px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  padding: 3px 12px;
}

.side-legend {
  position: absolute;
  right: 20px;
  top: -34px;
  background-color: rgb(var(--v-theme-background));
  padding: 0px 8px;
  height: 28px;
  border: 1px solid grey;
  border-radius: 5px;
}
</style>
