<template>
  <v-card v-show="npc" flat outlined class="mb-8">
    <v-toolbar dense color="primary">
      <div class="heading h3 pa-1 white--text">NPC EDITOR</div>
      <v-spacer />
      <v-btn icon @click="exit()"><v-icon large color="white">mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-card-text>
      <v-row justify="space-between" align="start">
        <v-col>
          <builder :item="npc" />
        </v-col>
        <v-col cols="3" class="text-center">
          <v-combobox
            v-model="npc.Labels"
            small-chips
            multiple
            outlined
            hide-details
            label="GM Labels"
          />
          <v-img :src="npc.Image" />
          <v-btn small outlined block color="accent" @click="$refs.imageSelector.open()">
            Change Image
          </v-btn>
          <cc-simple-image-selector ref="imageSelector" @set="npc.Image = $event" />
        </v-col>
      </v-row>
      <div v-if="npc.Class"><features :item="npc" /></div>
      <v-divider class="my-2" />
      <section-editor :item="npc" />
      <v-divider class="my-2" />
      <div class="caption">NPC CLOCKS</div>
      <cc-clock
        v-for="(c, i) in npc.Clocks"
        :key="`${npc.Name}_clock_${i}`"
        :clock="c"
        class="mx-1 my-2"
        @delete="npc.DeleteClock(c)"
      />
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn color="accent" outlined small @click="npc.AddClock()">
            <v-icon left>mdi-plus</v-icon>
            Add New Clock
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2" />
      <div class="caption">NPC TABLES</div>
      <cc-rollable-table
        v-for="(t, i) in npc.Tables"
        :key="`${npc.Name}_table_${i}`"
        :table="t"
        class="mx-1 my-2"
        @delete="npc.DeleteTable(t)"
      />
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn color="accent" outlined small @click="npc.AddTable()">
            <v-icon left>mdi-plus</v-icon>
            Add New Table
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2" />
      <div class="caption">GM NOTES</div>
      <tiptap-vuetify
        v-model="npc.Notes"
        :extensions="extensions"
        :card-props="{ flat: true, outlined: true }"
        :toolbar-attributes="$vuetify.theme.dark ? { color: 'black', dark: true } : {}"
      />
    </v-card-text>
    <v-divider />
    <v-card-actions v-if="id === 'new'">
      <v-btn @click="exit()">Exit without Saving</v-btn>
      <v-spacer />
      <v-btn color="secondary" @click="SaveAsNew()">Save and Exit</v-btn>
    </v-card-actions>
    <v-card-actions v-else>
      <v-btn :to="`/gm/npc-print/${npc.ID}`">Print</v-btn>
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
          @confirm="deleteNpc()"
        />
      </v-menu>
      <v-btn color="secondary" @click="Save()">Save and Exit</v-btn>
    </v-card-actions>
  </v-card>
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
import RenderBase from '../../gm/_components/RenderBase.vue'
import SectionEditor from '../_components/SectionEditor.vue'
import Printable from './printable.vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore } from '@/store'
import Features from './features.vue'
import Builder from './builder.vue'
import { Npc } from '@/class'

export default Vue.extend({
  name: 'gm-editor-base',
  components: { TiptapVuetify, RenderBase, SectionEditor, Printable, Builder, Features },
  props: {
    // item: { type: Object, required: true },
    id: { type: String, required: true },
  },
  data: () => ({
    newNpc: null,
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
    npc() {
      if (this.id === 'new') {
        if (!this.newNpc) this.newNpc = new Npc()
        return this.newNpc
      }
      return getModule(NpcStore, this.$store).Npcs.find(x => x.ID === this.id)
    },
  },
  methods: {
    exit() {
      this.$set(this, 'newNpc', null)
      this.$emit('exit')
    },
    SaveAsNew() {
      const store = getModule(NpcStore, this.$store)
      store.addNpc(this.npc)
      this.exit()
    },
    Save() {
      const store = getModule(NpcStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.saveNpcData()
      this.$emit('exit')
    },
    deleteNpc() {
      const store = getModule(NpcStore, this.$store)
      store.deleteNpc(this.npc)
      this.$emit('exit')
    },
    dupeNpc() {
      const store = getModule(NpcStore, this.$store)
      const dupe = Npc.Deserialize(Npc.Serialize(this.npc))
      dupe.RenewID()
      store.addNpc(dupe)
      this.$emit('exit')
    },
  },
})
</script>
