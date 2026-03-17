<template>
  <cc-solo-modal v-model="dialogValue"
    :title="title"
    icon="mdi-circle-edit-outline"
    :max-width="width"
    shrink>
    <v-card-text class="px-0 pb-0">
      <quill-editor v-model:content="text"
        :options="editorOptions"
        theme="snow"
        style="min-height: 150px;"
        content-type="html" />
    </v-card-text>
    <v-row dense
      class="mt-3">
      <v-col cols="auto"
        class="ml-auto">
        <cc-button color="primary"
          @click="dialogValue = false">
          Save and Close
        </cc-button>
      </v-col>
    </v-row>
  </cc-solo-modal>
</template>

<script lang="ts">
import { options } from '@/ui/style/quillSetup';
import { debounce } from 'lodash-es';

export default {
  name: 'CcTextEditor',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    original: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: false,
      default: 'Edit Text',
    },
    width: {
      type: String,
      required: false,
      default: '70vw',
    },
  },
  emits: ['save', 'update:modelValue'],
  data: () => ({
    text: '',
  }),
  computed: {
    dialogValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    editorOptions() {
      return options;
    },
  },
  watch: {
    text(value) {
      this.emitSave(value);
    },
  },
  created() {
    if (this.original) this.text = this.original;
    this.emitSave = debounce((value: string) => this.$emit('save', value), 300);
  },
};
</script>
