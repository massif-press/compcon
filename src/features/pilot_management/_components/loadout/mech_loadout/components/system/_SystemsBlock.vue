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

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
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

const { mobile, portrait } = useMobile()

const props = defineProps<{
  mech: object
  color: string
  readonly?: boolean
}>()

const selector = ref(false)
const swapSystem = ref(null as any)
const additionalSystem = ref(false)
const systemItems = ref([] as any[])
const reorderMode = ref(false)

const moddedWeapons = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.Weapons.filter((x) => x.Mod);
    })
const activeSystems = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.Systems;
    })
const integratedSystems = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.IntegratedSystems;
    })
const staticTopItems = computed(() => {
      const arr: any[] = [];
      integratedSystems.value.forEach((s) => {
        arr.push({
          component: _SystemSlotCard,
          id: s.ID,
          props: { mech: props.mech, item: s, color: props.color, readonly: props.readonly, integrated: true },
          item: s,
        });
      });
      moddedWeapons.value.forEach((w) => {
        arr.push({
          component: _ModEquippedCard,
          id: w.ID,
          props: { mech: props.mech, color: props.color, readonly: props.readonly },
          item: w.Mod,
          weapon: w,
        });
      });
      return arr;
    })
const staticBottomItems = computed(() => {
      if (props.mech.FreeSP > 0 && !props.readonly) {
        return [{
          component: _SystemSlotCard,
          id: 'add-system',
          props: { mech: props.mech, item: null, color: props.color, readonly: props.readonly, empty: true },
          item: null,
        }];
      }
      return [];
    })

function updateSystemItems() {
      const arr: any[] = [];

      integratedSystems.value.forEach((s) => {
        arr.push({
          component: _SystemSlotCard,
          id: s.ID,
          props: {
            mech: props.mech,
            item: s,
            color: props.color,
            readonly: props.readonly,
            integrated: true,
          },
          item: s,
        });
      });

      moddedWeapons.value.forEach((w) => {
        arr.push({
          component: _ModEquippedCard,
          id: w.ID,
          props: {
            mech: props.mech,
            color: props.color,
            readonly: props.readonly,
          },
          item: w.Mod,
          weapon: w,
        });
      });

      activeSystems.value.forEach((s) => {
        arr.push({
          component: _SystemSlotCard,
          id: s.ID,
          props: {
            mech: props.mech,
            item: s,
            color: props.color,
            readonly: props.readonly,
          },
          item: s,
        });
      });

      if (props.mech.FreeSP > 0 && !props.readonly) {
        arr.push({
          component: _SystemSlotCard,
          id: 'add-system',
          props: {
            mech: props.mech,
            item: null,
            color: props.color,
            readonly: props.readonly,
            empty: true,
          },
          item: null,
        });
      }

      systemItems.value = arr;
    }
function onSystemReorder(event: any) {
      stopDragScroll();
      if (event.oldIndex === event.newIndex) return;
      props.mech.MechLoadoutController.ActiveLoadout.ReorderSystem(event.oldIndex, event.newIndex);
    }
function moveSystem(from: number, to: number) {
      props.mech.MechLoadoutController.ActiveLoadout.ReorderSystem(from, to);
    }
function switchSystem(item: any) {
      swapSystem.value = item;
      selector.value = true;
    }
function setAddAdditional() {
      additionalSystem.value = true;
      selector.value = true;
    }
async function handleDone() {
      swapSystem.value = null;

      updateSystemItems(); // triggers list update

      // wait for DOM
      await nextTick();
      await new Promise((r) => setTimeout(r, 0));

      selector.value = false;
    }
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
