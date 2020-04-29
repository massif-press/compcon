<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-icon label="Edit Pilot Biography" @open-selector="show()" />
      Pilot Biography
    </cc-title>
    <div class="my-2">
      <p
        v-if="pilot.History"
        class="flavor-text text--text mx-2 preserve-linebreaks"
        v-html="pilot.History"
      />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Biography"
      @confirm="pilot.History = history"
    >
      <tiptap-vuetify
        v-model="history"
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
  name: 'history-block',
  components: { SectionEditIcon, NoDataBlock, TiptapVuetify },
  data: () => ({
    history: '',
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
    this.history = this.pilot.History || ''
  },
  methods: {
    show() {
      this.history = this.pilot.History || ''
      this.$refs.dialog.show()
    },
  },
})
</script>
