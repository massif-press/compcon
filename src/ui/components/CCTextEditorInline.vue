<template>
  <quill-editor v-model:content="text"
    :options="editorOptions"
    theme="snow"
    content-type="html"
    style="min-height: 75px;" />
</template>

<script lang="ts">
import { options } from '@/ui/style/quillSetup';
import { debounce } from 'lodash-es';

export default {
  name: 'CcTextEditor',
  props: {
    original: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['save'],
  data: () => ({
    title: '',
    text: '',
  }),
  computed: {
    editorOptions() {
      return options;
    },
  },
  watch: {
    text(value) {
      this.emitSave(value);
    },
  },
  created() {
    if (this.original) this.text = this.original;
    this.emitSave = debounce((value: string) => this.$emit('save', value), 300);
  },
};
</script>
