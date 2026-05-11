<template>
  <v-dialog v-model="dialog"
    :fullscreen="mobile"
    :max-width="mobile ? '100vw' : maxWidth">
    <v-card tile
      flat
      :class="!mobile && 'cc-panel-clip'"
      style="position: relative"
      border="sm"
      :ripple="false"
      @click.stop="closeOnClick ? close() : undefined">
      <cc-toolbar minor
        :title="title"
        :icon="icon"
        :color="color"
        style="position: sticky; top: 0; z-index: 10"
        hide-close
        @close="close">
        <slot name="title" />
        <template #toolbar-items>
          <slot name="toolbar-items"
            v-bind="{ close }" />
          <v-btn v-if="!closeOnClick && mobile"
            icon
            @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </cc-toolbar>
      <v-card-text class="pt-1 pb-4 px-4">
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

const { smAndDown: mobile } = useDisplay();

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  title?: string;
  icon?: string;
  color?: string;
  closeOnClick?: boolean;
  maxWidth?: string | number;
}>(), {
  title: 'Default Title',
  icon: '',
  color: 'primary',
  closeOnClick: true,
  maxWidth: '500px',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const dialog = ref(false);

watch(() => props.modelValue, val => { dialog.value = !!val; }, { immediate: true });
watch(dialog, val => { emit('update:modelValue', val); });

function open() { dialog.value = true; }
function close() { dialog.value = false; }

defineExpose({ open, close });
</script>

<style scoped>
.cc-panel-clip {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%);
}

.panel-footer {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  z-index: 10;
  height: 13px;
  letter-spacing: 4px;
  font-size: 8px;
  line-height: 15px;
  opacity: 0.6;
}
</style>
