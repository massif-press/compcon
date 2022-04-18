<template>
  <div>
    <v-row dense class="heading h3" justify="space-between" align="end">
      <v-col cols="auto">
        <cc-short-string-editor large @set="item.title = $event">
          {{ item.title }}
        </cc-short-string-editor>
      </v-col>
      <v-col cols="auto">
        <v-switch v-model="item.Alert" label="Emphasize" dense hide-details inset class="mt-0" />
      </v-col>
    </v-row>
    <tiptap-vuetify
      v-model="item.content"
      :extensions="extensions"
      :card-props="{ flat: true, outlined: true }"
      :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
    />
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
  name: 'campaign-page-text-editor',
  components: { TiptapVuetify },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
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
})
</script>
