<template>
  <div>
    <cc-title small :color="color" style="margin-left: -60px!important">
      <section-edit-icon label="Edit Operator Notes" @open-selector="show()" />
      Operator Notes
    </cc-title>
    <div class="my-2">
      <p
        v-if="mech.Notes"
        class="flavor-text text--text mx-2 preserve-linebreaks"
        v-html="mech.Notes"
      />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Operator Notes"
      @confirm="mech.Notes = notes"
    >
      <tiptap-vuetify
        v-model="notes"
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
import SectionEditIcon from '../../components/SectionEditIcon.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'
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
  name: 'notes-block',
  components: { SectionEditIcon, NoDataBlock, TiptapVuetify },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data: () => ({
    notes: '',
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
    this.notes = this.mech.Notes || ''
  },
  methods: {
    show() {
      this.notes = this.mech.Notes || ''
      this.$refs.dialog.show()
    },
  },
})
</script>
