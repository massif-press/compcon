<template>
  <v-card class="clipped-large"
    tile>
    <v-toolbar :height="getHeight"
      :style="`--slot-toolbar-h: ${getHeight}px; cursor: pointer`"
      :color="titleColor"
      :extended="extended"
      extension-height="10"
      @click="empty ? '' : (detailDialog = true)">
      <div class="d-inline-flex ml-0"
        style="min-width: 0; overflow: hidden"
        :class="mobile ? 'text-cc-overline' : 'heading h3 text-uppercase'">
        <slot name="header" />
      </div>
      <v-spacer />
      <v-toolbar-items v-if="!portrait"
        :class="mobile ? 'text-cc-overline' : 'heading h3 text-uppercase'">
        <slot name="header-items" />
      </v-toolbar-items>
      <template v-if="extended"
        #extension>
        <v-spacer />

        <slot name="extension" />
      </template>
    </v-toolbar>
    <div v-if="portrait"
      style="position: absolute; top: 12px; right: -4px">
      <slot name="header-items" />
    </div>

    <v-card-text class="px-2 pt-0 pb-2">
      <v-card v-if="item?.FlavorDescription"
        tile
        color="panel"
        class="px-2 py-1 mb-2 clipped">
        <p v-html-safe="item.FlavorDescription"
          style="white-space: pre-wrap" />
      </v-card>

      <slot />

      <equipment-details v-if="item"
        :item="item"
        :mech="mech"
        :color="color"
        :synergy-location="synergyLocation" />

      <div v-if="empty"
        class="py-3 text-center fade-select"
        style="height: 100%; cursor: pointer"
        @click="openSelector">
        <v-row style="height: 100%">
          <div class="heading h2 text-disabled my-auto py-5"
            style="width: 100%">
            // {{ mobile ? 'TAP' : 'CLICK' }} TO ADD //
          </div>
        </v-row>
      </div>
    </v-card-text>
  </v-card>

  <cc-modal v-model="detailDialog"
    :title="item?.Name || ''"
    :icon="item?.Icon || ''"
    shrink>
    <cc-item-card :item="item"
      notes />
    <slot name="detail" />
  </cc-modal>

  <cc-modal v-model="selectorDialog"
    title="select equipment"
    clip
    @close="$emit('selector-close')">
    <slot name="selector" />
  </cc-modal>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { computed, ref, useSlots } from 'vue'
import { ItemType } from '@/classes/enums'
import { useDisplay } from 'vuetify'
import EquipmentDetails from './_EquipmentDetails.vue'

const { smAndDown: mobile, xs: portrait } = useDisplay()
const slots = useSlots()

const props = withDefaults(defineProps<{
  item?: object
  mech: Mech
  empty?: boolean
  color?: string
  titleColor?: string
  extended?: boolean
  weapon?: boolean
  readonly?: boolean
}>(), {
  item: null,
  mech: null,
  empty: false,
  color: 'primary',
  extended: false,
  weapon: false,
  readonly: false
})

const emit = defineEmits<{
  'selector-close': []
  'selector-open': []
}>()

const detailDialog = ref(false)
const selectorDialog = ref(false)

const synergyLocation = computed(() => {
      if (!props.item) return 'none'
      return props.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system'
    })
const getHeight = computed(() => {
      return mobile.value ? 18 : 20
    })

function openSelector() {
      if (slots.selector) {
        selectorDialog.value = true
        return
      }
      emit('selector-open')
    }

defineExpose({ selectorDialog, openSelector })
</script>

<style scoped>
:deep(.v-toolbar),
:deep(.v-toolbar__content) {
  height: auto !important;
  min-height: var(--slot-toolbar-h) !important;
}
</style>
