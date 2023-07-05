<template>
  <v-row density="compact" class="mb-1">
    <v-col :class="$vuetify.display.mdAndUp ? 'pr-6' : ''">
      <v-btn variant="outlined" large block color="secondary" @click="($refs.dialog as any).show()">
        <slot />
      </v-btn>
    </v-col>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      :title="label"
      @confirm="save"
    >
      <quill-editor theme="snow" v-model:content="text" content-type="html" />
    </cc-solo-dialog>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'text-entry-popup',

  props: {
    label: {
      type: String,
      required: true,
    },
    prepopulate: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    title: '',
    text: '',
  }),
  mounted() {
    if (this.prepopulate) this.text = this.prepopulate;
  },
  methods: {
    save() {
      console.log(this.text);
      this.$emit('save', this.text);
    },
  },
};
</script>
