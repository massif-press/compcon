<template>
  <slot name="activator"
    v-bind="{ dialog, open, close }"></slot>

  <v-dialog v-model="dialog"
    :fullscreen="mobile"
    :max-width="mobile ? '' : maxWidth"
    :min-width="mobile ? '' : minWidth"
    :persistent="persistent"
    :close-on-content-click="closeOnClick">
    <v-card tile
      flat
      :class="[!mobile && 'cc-panel-clip', closeOnClick && 'hoverClose']"
      style="position: relative"
      border="sm"
      :ripple="false">
      <cc-toolbar minor
        :title="title"
        :icon="icon"
        :color="color"
        style="position: sticky; top: 0; z-index: 10"
        :hide-close="closeOnClick"
        @close="close">
        <slot name="title" />
        <template #toolbar-items>
          <slot name="toolbar-items"
            v-bind="{ close }" />

        </template>
      </cc-toolbar>
      <v-card-text :class="noGutters ? 'pa-0' : 'pt-1 pb-4 px-4'">
        <slot v-bind="{ dialog, open, close }" />
      </v-card-text>
      <div v-if="closeOnClick">
        <div class="panel-footer text-center bg-panel">{{ mobile ? 'TAP' : 'CLICK' }} TO CLOSE</div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

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
  noActions?: boolean;
  large?: boolean;
  controller?: object;
  modelValue?: boolean;
}>(), {
  title: 'Default Title',
  color: 'primary',
  closeOnClick: true,
  maxWidth: '60vw',
  minWidth: '40vw',
});

const emit = defineEmits<{
  activate: [];
  close: [];
  'update:modelValue': [value: boolean];
}>();

const dialog = ref(false);

watch(() => props.modelValue, val => { if (val !== undefined) dialog.value = !!val; }, { immediate: true });
watch(dialog, val => {
  if (!val) emit('close');
  if (props.modelValue !== undefined) emit('update:modelValue', val);
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
