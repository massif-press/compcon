<template>
  <div>
    <v-card
      v-if="readonly"
      variant="outlined"
      class="pa-2"
      style="border-color: rgb(var(--v-theme-panel))">
      <p v-html-safe="notes" />
    </v-card>
    <quill-editor
      v-else
      v-model:content="notes"
      :toolbar="[
        { size: ['small', false, 'large', 'huge'] },
        'bold',
        'italic',
        'underline',
        'strike',
        { color: [] },
        { background: [] },
        { font: [] },
        { align: [] },
        'clean',
      ]"
      content-type="html"
      @text-change="item[noteProperty] = notes"
      @blur="$emit('blur')" />
  </div>
</template>

<script lang="ts">
import { readonly } from 'vue';

export default {
  name: 'cc-rich-text-area',
  props: {
    item: {
      type: Object,
      required: true,
    },
    noteProperty: {
      type: String,
      default: 'Notes',
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    notes: '',
  }),
  created() {
    this.notes = this.item[this.noteProperty] || '';
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
