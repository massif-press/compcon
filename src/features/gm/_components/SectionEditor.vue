<template>
  <div>
    <div v-if="item.NarrativeController.TextItems.length">
      <v-row v-for="(s, i) in item.NarrativeController.TextItems" :key="`textItem_${i}`" dense>
        <v-col>
          <v-row no-gutters justify="space-between">
            <v-col cols="auto">
              <div class="heading h3">
                <cc-short-string-editor large @set="s.header = $event">
                  {{ s.header }}
                </cc-short-string-editor>
              </div>
            </v-col>
            <v-col cols="auto">
              <v-menu offset-x left>
                <template v-slot:activator="{ on }">
                  <v-btn small icon color="error" class="fadeSelect" v-on="on">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    Do you want to delete the textItem titled "{{ s.header }}"? This action cannot
                    be undone.
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn small color="error" @click="deleteTextItem(s)">Confirm Deletion</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
          <v-col cols="12">
            <tiptap-vuetify
              v-model="s.body"
              :extensions="extensions"
              :card-props="{ flat: true, outlined: true }"
              :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
            />
          </v-col>
        </v-col>
      </v-row>
    </div>
    <v-row justify="end">
      <v-col cols="auto">
        <v-menu
          v-model="textItemMenu"
          offset-x
          left
          :close-on-click="false"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn color="accent" outlined small v-on="on">
              <v-icon left>mdi-plus</v-icon>
              Add New Text Section
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-combobox
                v-if="item.NarrativeController.TextItemSuggestions"
                v-model="newTextItemHeader"
                label="Title"
                :items="item.NarrativeController.TextItemSuggestions"
              />
              <v-text-field
                v-else
                v-model="newTextItemHeader"
                label="New Title"
                dense
                hide-details
                outlined
              />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn text @click="textItemMenu = false">Cancel</v-btn>
              <v-spacer />
              <v-btn color="secondary" @click="addTextItem">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
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
  name: 'campaign-item-textItem-editor',
  components: { TiptapVuetify },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    textItemMenu: false,
    newTextItemHeader: '',
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
  methods: {
    addTextItem() {
      this.item.NarrativeController.AddTextItem({ header: this.newTextItemHeader, body: '' })
      this.newTextItemHeader = ''
      this.textItemMenu = false
    },
    deleteTextItem(s) {
      const idx = this.item.NarrativeController.TextItems.findIndex(
        x => x.header === s.header && x.body === s.body
      )
      if (idx === -1) return
      this.item.NarrativeController.TextItems.splice(idx, 1)
    },
  },
})
</script>
