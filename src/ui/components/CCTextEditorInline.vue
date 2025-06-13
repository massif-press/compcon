<template>
  <quill-editor :options="editorOptions" theme="snow" v-model:content="text" content-type="html" />
</template>

<script lang="ts">
import { options } from '@/ui/style/quillSetup';
import { debounce } from 'lodash';

export default {
  name: 'cc-text-editor',
  emits: ['save'],
  props: {
    original: {
      type: String,
      required: false,
      default: '',
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
      const self = this;
      debounce(() => self.$emit('save', value), 300)();
    },
  },
  computed: {
    editorOptions() {
      return options;
    },
  },
};
</script>
