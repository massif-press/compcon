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
      :options="editorOptions"
      content-type="html"
      @ready="quill = $event"
      @blur="set()"
      @update:content="set()" />
  </div>
</template>

<script lang="ts">
import { options } from '@/ui/style/quillSetup';
import { debounce } from 'lodash-es';

export default {
  name: 'CcRichTextArea',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
  data: () => ({
    quill: null as any,
    emitUpdate: null as any,
  }),
  computed: {
    editorOptions() {
      return options;
    },
  },
  created() {
    this.emitUpdate = debounce(function (this: any) {
      this.$emit('update:modelValue', this.quill.root.innerHTML);
    }, 100);
  },
  beforeUnmount() {
    this.emitUpdate.flush();
  },
  methods: {
    set() {
      if (!this.quill) return;
      this.emitUpdate();
    },
  },
};
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
