<template>
  <div class="d-inline">
    <span>
      <cc-tooltip inline simple content="Edit">
        <v-icon dark class="fade-select" @click="show()"
          >mdi-circle-edit-outline</v-icon
        >
      </cc-tooltip>
    </span>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      :title="label"
      @confirm="$emit('save', text)"
    >
      <cc-rte v-model="text" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-text-editor',

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
  },
  data: () => ({
    title: '',
  }),
  created() {
    this.text = this.original || '';
  },
  methods: {
    show() {
      this.text = this.original || '';
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
