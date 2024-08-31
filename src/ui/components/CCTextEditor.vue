<template>
  <div class="d-inline">
    <cc-tooltip inline simple content="Edit">
      <v-icon :color="color" dark :class="color ? '' : 'fade-select'" @click="show()">
        mdi-circle-edit-outline
      </v-icon>
    </cc-tooltip>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      :title="label"
      @confirm="save()">
      <quill-editor theme="snow" v-model:content="text" content-type="html" />
    </cc-solo-dialog>
  </div>
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
    label: {
      type: String,
      required: false,
      default: 'Edit Text',
    },
    color: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    title: '',
    text: '',
  }),
  created() {
    if (this.original) this.text = this.original;
  },
  methods: {
    save() {
      this.$emit('save', this.text);
      (this.$refs.dialog as any).hide();
    },
    show() {
      if (this.original) this.text = this.original;
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
