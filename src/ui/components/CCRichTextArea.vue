<template>
  <div>
    <v-card v-if="readonly"
      variant="outlined"
      class="pa-2"
      style="border-color: rgb(var(--v-theme-panel))">
      <p v-html-safe="modelValue" />
    </v-card>
    <quill-editor v-else
      :content="modelValue"
      :options="options"
      content-type="html"
      @ready="quill = $event"
      @blur="set()"
      @update:content="set()" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { options } from '@/ui/style/quillSetup';
import { debounce } from 'lodash-es';

withDefaults(defineProps<{
  modelValue?: string;
  readonly?: boolean;
}>(), {
  modelValue: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const quill = ref<{ root: { innerHTML: string } } | null>(null);

const emitUpdate = debounce(() => {
  if (quill.value) emit('update:modelValue', quill.value.root.innerHTML);
}, 100);

onBeforeUnmount(() => { emitUpdate.flush(); });

function set() {
  if (!quill.value) return;
  emitUpdate();
}
</script>

<style>
.ql-toolbar.ql-snow {
  border: 1px solid rgb(var(--v-theme-panel));
  border-top-right-radius: 3px;
  border-top-right-radius: 3px;

  box-sizing: border-box;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  padding: 2px;
}

.ql-container.ql-snow {
  border: 1px solid rgb(var(--v-theme-panel));
  border-bottom-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>
