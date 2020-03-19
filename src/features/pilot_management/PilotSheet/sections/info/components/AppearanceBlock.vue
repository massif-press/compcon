<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-icon label="Edit Pilot Appearance" @open-selector="show()" />
      Pilot Appearance
    </cc-title>
    <div class="my-2">
      <p
        v-if="pilot.TextAppearance"
        class="flavor-text text--text mx-2 preserve-linebreaks"
        v-html="pilot.TextAppearance"
      />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Appearance"
      @confirm="pilot.TextAppearance = appearance"
    >
      <tiptap-vuetify
        v-model="appearance"
        :extensions="extensions"
        :card-props="{ flat: true, tile: true, elevation: 0 }"
        class="mt-4"
        :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
      />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionEditIcon from '../../components/SectionEditIcon.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
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

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'appearance-block',
  components: { SectionEditIcon, NoDataBlock, TiptapVuetify },
  data: () => ({
    appearance: '',
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
    // this.$vuetify.lang.current = 'en'
    this.appearance = this.pilot.TextAppearance || ''
  },
  methods: {
    show() {
      this.appearance = this.pilot.TextAppearance || ''
      this.$refs.dialog.show()
    },
  },
})
</script>
