<template>
  <div>
    <v-card
      v-if="readonly"
      variant="outlined"
      class="pa-2"
      style="border-color: rgb(var(--v-theme-panel))">
      <p v-html-safe="modelValue" />
    </v-card>
    <quill-editor
      v-else
      :content="modelValue"
      :options="editorOptions"
      content-type="html"
      @ready="quill = $event"
      @blur="set($event)"
      @update:content="set($event)" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-rich-text-area',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    quill: null as any,
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
  methods: {
    set(e) {
      if (!this.quill) return;
      this.$emit('update:modelValue', this.quill.root.innerHTML);
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
