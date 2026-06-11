<template>
  <cc-modal v-model="dialogValue"
    :title="title"
    icon="mdi-circle-edit-outline"
    :max-width="width"
    shrink>
    <v-card-text class="px-0 pb-0">
      <quill-editor v-model:content="text"
        :options="options"
        theme="snow"
        style="min-height: 150px;"
        content-type="html" />
    </v-card-text>
    <v-row dense
      class="mt-3">
      <v-col cols="auto"
        class="ml-auto">
        <cc-button color="primary"
          @click="dialogValue = false">
          {{ $t('ui.widget.saveAndClose') }}
        </cc-button>
      </v-col>
    </v-row>
  </cc-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { options } from '@/ui/style/quillSetup';
import { debounce } from 'lodash-es';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  original?: string;
  title?: string;
  width?: string;
}>(), {
  original: '',
  title: 'Edit Text',
  width: '70vw',
});

const emit = defineEmits<{
  save: [value: string];
  'update:modelValue': [value: boolean];
}>();

const text = ref(props.original);

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const emitSave = debounce((value: string) => emit('save', value), 300);

watch(text, value => { emitSave(value); });
</script>
