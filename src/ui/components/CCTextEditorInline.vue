<template>
  <quill-editor theme="snow" v-model:content="text" content-type="html" />
</template>

<script lang="ts">
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
      this.$emit('save', value);
    },
  },
};
</script>
