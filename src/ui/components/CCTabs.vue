<template>
  <v-tabs v-model="tab"
    class="px-2"
    :class="`tabs ${fixed ? 'fixed' : 'sticky'} ${portrait ? 'portrait' : mobile ? 'mobile' : 'desktop'}`"
    :bg-color="color"
    slider-color="secondary"
    :height="mobile ? '24px' : '32px'"
    density="compact"
    :grow="!fixedTabs"
    :fixed-tabs="fixedTabs"
    style="margin-top: -1px"
    :style="modal && 'left: 1px; width: calc(100% - 2px);'">
    <slot name="tabs"
      v-bind="{ setTab }" />
  </v-tabs>
  <div v-if="fixed"
    style="position: fixed; top: 0; left: 0; right: 0; height: 45px"
    :class="`bg-${color}`" />
  <div v-if="fixed"
    :class="mobile ? 'mt-4' : 'mt-6'" />

  <v-window v-model="tab">
    <slot v-bind="{ setTab }" />
  </v-window>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown, xs } = useDisplay()
const mobile = smAndDown
const portrait = xs

interface Props {
  color?: string
  sliderColor?: string
  fixed?: boolean
  modal?: boolean
  fixedTabs?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  sliderColor: 'secondary',
  fixed: false,
  modal: false,
  fixedTabs: false,
})

const emit = defineEmits<{ changed: [tab: number] }>()

const tab = ref(0)

watch(tab, (newTab) => {
  emit('changed', newTab)
})

function setTab(newTab: number) {
  tab.value = newTab
}
</script>

<style scoped>
.tabs {
  z-index: 901;
  height: 32px;
  max-height: 32px;
}

.fixed {
  position: fixed;
  width: 100%;
}

.sticky {
  position: sticky;
}

.portrait {
  top: 28px;
  height: 24px;
  max-height: 24px;
}

.mobile {
  top: 45px;
  height: 24px;
  max-height: 24px;
}

.desktop {
  top: 42px !important;
}
</style>
