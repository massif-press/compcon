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
      :options="editorOptions"
      content-type="html"
      @ready="onEditorReady"
      @text-change="item[noteProperty] = notes"
      @blur="$emit('blur')" />
  </div>
</template>

<script lang="ts">
// import { Quill } from '@vueup/vue-quill';

// const Inline = Quill.import('blots/inline');

// class HorusCode extends Inline {
//   static blotName = 'horusCode';
//   static tagName = 'span';

//   static create(value) {
//     let node = super.create();
//     node.setAttribute('class', 'horus-quill');
//     return node;
//   }
// }

// Quill.register(HorusCode);

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
    editorOptions: {
      modules: {
        toolbar: {
          container: [
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold'],
            ['italic'],
            ['underline'],
            ['strike'],
            [{ color: [] }],
            [{ background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            // ['horusCode'],
            ['clean'],
          ],
        },
      },
    },
  }),
  created() {
    this.notes = this.item[this.noteProperty] || '';
  },
  methods: {
    onEditorReady(editor) {
      // const toolbar = editor.getModule('toolbar');
      // toolbar.container.querySelector('.ql-horusText').replaceWith(horusText);
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
