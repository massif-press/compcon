<template>
  <slot name="activator" v-bind="{ modal, open, close }"></slot>

  <v-dialog
    v-model="modal"
    :id="id"
    :aria-label="title || undefined"
    :fullscreen="fullscreen || mobile"
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
      <v-card-text class="pa-0" :class="!mobile && !tabs ? 'px-4' : ''">
        <slot v-bind="{ modal, close }" />
      </v-card-text>

      <div v-if="cancelAction || confirmAction">
        <v-divider />
        <v-card-actions style="min-height: 36px !important; height: 36px !important">
          <v-btn
            v-if="cancelAction"
            @click="emit('cancel'); modal = false"
            color="error"
            text>
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="confirmAction"
            @click="emit('confirm'); modal = false"
            color="primary"
            text>
            Confirm
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

defineOptions({ inheritAttrs: false });
import { useDisplay } from 'vuetify';

const { smAndDown: mobile } = useDisplay();

const props = withDefaults(defineProps<{
  title?: string;
  icon?: string;
  color?: string;
  maxWidth?: string | number;
  cancelAction?: boolean;
  confirmAction?: boolean;
  extended?: boolean;
  shrink?: boolean;
  persistent?: boolean;
  scrollable?: boolean;
  clip?: boolean;
  tabs?: boolean;
  id?: string;
  fullscreen?: boolean;
  noConfirm?: boolean;
  class?: string | unknown[] | Record<string, unknown>;
  modelValue?: boolean;
  minWidth?: string | number;
}>(), {
  title: 'Default Title',
  color: 'primary',
  maxWidth: '90vw',
});

const emit = defineEmits<{
  cancel: [];
  confirm: [];
  'update:modelValue': [value: boolean];
  close: [];
}>();

const modal = ref(false);
const savedScrollY = ref(0);

watch(() => props.modelValue, val => { if (val !== undefined) modal.value = !!val; }, { immediate: true });

watch(modal, val => {
  if (props.modelValue !== undefined) {
    if (val) {
      savedScrollY.value = window.scrollY;
    } else {
      nextTick(() => window.scrollTo({ top: savedScrollY.value, behavior: 'instant' }));
    }
    emit('update:modelValue', val);
    if (!val) emit('close');
  }
});

function open() { modal.value = true; }
function close() { modal.value = false; }

defineExpose({ open, close });
</script>
