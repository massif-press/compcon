<template>
  <v-dialog
    v-model="modal"
    :fullscreen="mobile"
    :max-width="mobile ? '100vw' : maxWidth"
    :min-height="mobile ? '100vh' : shrink ? '' : '95vh'"
    :persistent="persistent"
    @keydown.esc="close">
    <v-card
      tile
      flat
      :min-height="mobile ? '100vh' : shrink ? '' : '95vh'"
      :class="!mobile && 'cc-panel-clip'"
      style="position: relative"
      :style="clip ? 'overflow: clip' : ''"
      :border="mobile ? false : 'sm'">
      <cc-toolbar
        :title="title"
        :icon="icon"
        :color="color"
        style="position: sticky; top: 0; z-index: 999"
        class="border-b-sm"
        :extended="extended"
        @close="close">
        <template #title>
          <slot name="title" />
        </template>
        <template #toolbar-items>
          <slot name="toolbar-items" />
        </template>
      </cc-toolbar>
      <v-card-text class="pa-0 pb-12" :class="!mobile && 'px-4'">
        <slot v-bind="{ modal, close }" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useDisplay } from 'vuetify';

const { smAndDown: mobile } = useDisplay();

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  title?: string;
  icon?: string;
  color?: string;
  maxWidth?: string | number;
  extended?: boolean;
  shrink?: boolean;
  persistent?: boolean;
  clip?: boolean;
}>(), {
  title: 'Default Title',
  color: 'primary',
  maxWidth: '90vw',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

const modal = ref(false);
const savedScrollY = ref(0);

watch(() => props.modelValue, val => { modal.value = !!val; }, { immediate: true });

watch(modal, val => {
  if (val) {
    savedScrollY.value = window.scrollY;
  } else {
    nextTick(() => window.scrollTo({ top: savedScrollY.value, behavior: 'instant' }));
  }
  emit('update:modelValue', val);
  if (!val) emit('close');
});

function open() { modal.value = true; }
function close() { modal.value = false; }

defineExpose({ open, close });
</script>
