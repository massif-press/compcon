<template>
  <v-row dense class="mb-1">
    <v-col cols="auto">
      <cc-tooltip simple inline content="Feature In Development">
        <v-icon color="panel" class="mt-2">mdi-dice-multiple</v-icon>
      </cc-tooltip>
    </v-col>
    <v-col cols="11" class="pr-6">
      <v-btn outlined large block color="secondary" @click="$refs.dialog.show()">
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
      <tiptap-vuetify
        v-model="text"
        :extensions="extensions"
        :card-props="{ flat: true, tile: true, elevation: 0 }"
        class="mt-4"
        :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
      />
    </cc-solo-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from 'tiptap-vuetify'

export default Vue.extend({
  name: 'text-entry-popup',
  components: { TiptapVuetify },
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
    text: '',
    extensions: [
      History,
      Blockquote,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3],
          },
        },
      ],
      Bold,
      Code,
      HorizontalRule,
      HardBreak,
    ],
  }),
  mounted() {
    if (this.prepopulate) this.text = this.prepopulate
  },
  methods: {
    save() {
      this.$emit('save', this.text)
    },
  },
})
</script>
