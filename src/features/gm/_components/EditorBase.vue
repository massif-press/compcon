<template>
  <v-container fluid v-show="item">
    <v-card flat outlined class="mb-8">
      <v-toolbar dense color="primary">
        <div class="heading h3 pa-1 white--text">{{ typeText }} EDITOR</div>
        <v-spacer />
        <v-btn icon @click="$emit('exit')">
          <v-icon large color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row justify="space-between" align="center">
          <v-col align-self="start">
            <slot name="builder" />
            <div v-if="showDescription">
              <div class="overline">{{ typeText }} DESCRIPTION</div>
              <tiptap-vuetify
                v-model="item.Description"
                :extensions="extensions"
                :card-props="{ flat: true, outlined: true, 'min-height': '200px' }"
                :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
              />
            </div>
          </v-col>
          <v-col cols="3" class="text-center">
            <v-combobox
              v-model="item.Labels"
              small-chips
              multiple
              outlined
              hide-details
              label="GM Labels"
              class="mb-2"
            />
            <v-combobox v-model="item.Campaign" outlined hide-details label="Campaign" />
            <v-img :src="item.PortraitController.Image" />
            <v-btn small outlined block color="accent" @click="$refs.imageSelector.open()">
              Change Image
            </v-btn>
            <cc-simple-image-selector
              ref="imageSelector"
              @set="item.PortraitController.Image = $event"
            />
          </v-col>
        </v-row>
        <slot />
        <v-divider class="my-2" />
        <section-editor :item="item" />
        <v-divider class="my-2" />
        <div class="caption">{{ typeText }} CLOCKS</div>
        <cc-clock
          v-for="(c, i) in item.NarrativeController.Clocks"
          :key="`${item.Name}_clock_${i}`"
          :clock="c"
          class="mx-1 my-2"
          @delete="item.DeleteClock(c)"
        />
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn color="accent" outlined small @click="item.NarrativeController.AddClock()">
              <v-icon left>mdi-plus</v-icon>
              Add New Clock
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <div class="caption">{{ typeText }} TABLES</div>
        <cc-rollable-table
          v-for="(t, i) in item.NarrativeController.Tables"
          :key="`${item.Name}_table_${i}`"
          :table="t"
          class="mx-1 my-2"
          @delete="item.DeleteTable(t)"
        />
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn color="accent" outlined small @click="item.NarrativeController.AddTable()">
              <v-icon left>mdi-plus</v-icon>
              Add New Table
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <div class="caption">GM NOTES</div>
        <tiptap-vuetify
          v-model="item.Notes"
          :extensions="extensions"
          :card-props="{ flat: true, outlined: true }"
          :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions v-if="isNew">
        <v-btn @click="$emit('exit')">Exit without Saving</v-btn>
        <v-spacer />
        <v-btn color="secondary" @click="saveExit()">Save and Exit</v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-btn :to="`/gm/print/${typeText.toLowerCase()}/${item.ID}`">Print</v-btn>
        <v-spacer />
        <v-menu v-model="dupeMenu" offset-y offset-x top left>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" class="mx-3" v-on="on">Duplicate</v-btn>
          </template>
          <cc-confirmation content="Confirm duplication of this NPC" @confirm="dupeNpc()" />
        </v-menu>
        <v-menu v-model="deleteMenu" offset-y offset-x top left>
          <template v-slot:activator="{ on }">
            <v-btn color="error" v-on="on">Delete</v-btn>
          </template>
          <cc-confirmation
            content="This will reset delete this NPC from your NPC roster. NPCs of this type added to Encounters will not be affected. Are you sure?"
            @confirm="deleteItem()"
          />
        </v-menu>
        <v-btn color="secondary" @click="saveExit()">Save and Exit</v-btn>
      </v-card-actions>
    </v-card>
    <v-footer fixed>
      <v-btn small @click="$emit('exit')">
        <v-icon left>mdi-chevron-left</v-icon>
        Return to Collection
      </v-btn>
    </v-footer>
  </v-container>
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
import SectionEditor from './SectionEditor.vue'

export default Vue.extend({
  name: 'gm-editor-base',
  components: { TiptapVuetify, SectionEditor },
  props: {
    isNew: { type: Boolean },
    showDescription: { type: Boolean },
    item: { type: Object, required: true },
  },

  data: () => ({
    printDialog: false,
    dupeMenu: false,
    deleteMenu: false,
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
  computed: {
    typeText() {
      if (!this.item) return 'ERR'
      return this.item.ItemType.toUpperCase()
    },
  },
  methods: {
    deleteItem() {
      if (!this.isNew) this.$emit('delete')
    },
    copy() {
      if (!this.isNew) this.$emit('copy')
      this.$emit('exit')
    },
    saveExit() {
      if (this.isNew) this.$emit('add-new', this.item)
      else this.$emit('save')
    },
  },
})
</script>
