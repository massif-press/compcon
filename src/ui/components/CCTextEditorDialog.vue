<template>
  <cc-solo-modal
    v-model="dialogValue"
    :title="title"
    icon="mdi-circle-edit-outline"
    :max-width="width"
    shrink>
    <v-card-text class="px-0">
      <quill-editor
        :options="editorOptions"
        theme="snow"
        v-model:content="text"
        content-type="html" />
    </v-card-text>
  </cc-solo-modal>
</template>

<script lang="ts">
import { options } from '@/ui/style/quillSetup';

export default {
  name: 'cc-text-editor',
  emits: ['save', 'update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    original: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: false,
      default: 'Edit Text',
    },
    width: {
      type: String,
      required: false,
      default: '70vw',
    },
  },
  data: () => ({
    title: '',
    text: '',
  }),
  created() {
    if (this.original) this.text = this.original;
  },
  watch: {
    text(value) {
      this.$emit('save', value);
    },
  },
  computed: {
    dialogValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    editorOptions() {
      return options;
    },
  },
};
</script>
