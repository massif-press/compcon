<template>
  <div class="d-inline">
    <cc-modal :title="label" icon="mdi-circle-edit-outline">
      <template #activator="{ open }">
        <v-tooltip inline simple content="Edit">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              :color="color"
              icon="mdi-circle-edit-outline"
              :class="color ? '' : 'fade-select'"
              @click="open" />
          </template>
        </v-tooltip>
      </template>
      <quill-editor theme="snow" v-model:content="text" content-type="html" />
    </cc-modal>
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
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
