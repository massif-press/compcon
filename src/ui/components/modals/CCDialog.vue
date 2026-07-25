<template>
  <slot name="activator"
    v-bind="{ dialog, open, close }"></slot>

  <v-dialog v-model="dialog"
    :id="id"
    :aria-label="title || undefined"
    :fullscreen="fullscreen || mobile"
    :max-width="mobile ? '' : maxWidth"
    :min-width="mobile ? '' : minWidth"
    :min-height="mobile ? '100vh' : fullHeight ? '95vh' : ''"
    :persistent="persistent"
    :close-on-content-click="closeOnClick">
    <v-card tile
      flat
      :min-height="mobile ? '100vh' : fullHeight ? '95vh' : ''"
      :class="[!mobile && 'cc-panel-clip', closeOnClick && 'hoverClose']"
      :style="clip ? 'position: relative; overflow: clip' : 'position: relative'"
      :border="mobile || fullscreen ? false : 'sm'"
      :ripple="false">
      <cc-toolbar :minor="!major"
        :title="title"
        :icon="icon"
        :color="color"
        :extended="extended"
        :class="major && 'border-b-sm'"
        :style="`position: sticky; top: 0; z-index: ${major ? 999 : 10}`"
        :hide-close="closeOnClick"
        @close="close">
        <template #title>
          <slot name="title" />
        </template>
        <template #toolbar-items>
          <slot name="toolbar-items"
            v-bind="{ close }" />
        </template>
        <template #extension>
          <slot name="extension" />
        </template>
      </cc-toolbar>
      <v-card-text :class="cardTextClass">
        <slot v-bind="{ dialog, open, close }" />
      </v-card-text>
      <div v-if="closeOnClick">
        <div class="panel-footer text-center bg-panel">{{ mobile ? $t('ui.widget.tap') :
          $t('ui.widget.click') }} {{ $t('ui.widget.toClose') }}</div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';

import { useDisplay } from 'vuetify';

defineOptions({ inheritAttrs: false });

const { smAndDown: mobile } = useDisplay();

const props = withDefaults(defineProps<{
  title?: string;
  icon?: string;
  color?: string;
  closeOnClick?: boolean;
  persistent?: boolean;
  maxWidth?: string | number;
  minWidth?: string | number;
  noGutters?: boolean;
  tabs?: boolean;
  extended?: boolean;
  clip?: boolean;
  fullscreen?: boolean;
  fullHeight?: boolean;
  major?: boolean;
  id?: string;
  modelValue?: boolean;
}>(), {
  title: 'Default Title',
  color: 'primary',
  closeOnClick: true,
  maxWidth: '60vw',
  minWidth: '40vw',
  icon: undefined
});

const emit = defineEmits<{
  close: [];
  'update:modelValue': [value: boolean];
}>();

const dialog = ref(false);
const savedScrollY = ref(0);

const cardTextClass = computed(() => {
  if (props.noGutters) return 'pa-0';
  if (props.tabs) return mobile.value ? 'pa-0' : 'pa-0 px-4';
  return 'pt-1 pb-4 px-4';
});

watch(() => props.modelValue, val => { if (val !== undefined) dialog.value = !!val; }, { immediate: true });
watch(dialog, val => {
  if (props.modelValue !== undefined) {
    if (val) {
      savedScrollY.value = window.scrollY;
    } else {
      nextTick(() => window.scrollTo({ top: savedScrollY.value, behavior: 'instant' }));
    }
    emit('update:modelValue', val);
  }
  if (!val) emit('close');
});

function open() { dialog.value = true; }
function close() { dialog.value = false; }

defineExpose({ open, close });
</script>

<style scoped>
@import '@/ui/style/panel.css';

.hoverClose:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-surface-hover));
}

.hoverClose {
  transition: background-color 0.3s ease-in-out;
}
</style>
