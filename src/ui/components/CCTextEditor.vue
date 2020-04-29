<template>
  <div class="d-inline">
    <span>
      <cc-tooltip inline simple content="Edit">
        <v-icon dark class="fadeSelect" @click="show()">mdi-circle-edit-outline</v-icon>
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
      <tiptap-vuetify
        v-model="text"
        :extensions="extensions"
        :card-props="{ flat: true, tile: true, elevation: 0 }"
        class="mt-4"
        :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
      />
    </cc-solo-dialog>
  </div>
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
  name: 'cc-text-editor',
  components: { TiptapVuetify },
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
  created() {
    this.text = this.original || ''
  },
  methods: {
    show() {
      this.text = this.original || ''
      this.$refs.dialog.show()
    },
  },
})
</script>
