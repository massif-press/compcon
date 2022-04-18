<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="auto">
        <div v-if="item.ItemNumber" class="overline mt-n2 mb-n3">
          <b>{{ item.ItemType }} {{ item.ItemNumber }}:</b>
        </div>
        <cc-short-string-editor large @set="item.Title = $event">
          <span class="heading mech accent--text">
            {{ item.Title }}
          </span>
        </cc-short-string-editor>
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="item.ItemNumber" dense outlined label="ID" hint="Optional" />
      </v-col>
    </v-row>
    <page-content-container
      v-for="(e, i) in item.Content"
      :key="`content_item_${i}`"
      :item="e"
      @move-up="moveUp(i)"
      @move-down="moveDown(i)"
      @delete-item="item.DeleteItem(i)"
    />
    <v-row dense>
      <v-col>
        <v-btn small block color="primary" @click="item.AddTextArea()">Add Text Section</v-btn>
      </v-col>
      <v-col>
        <v-btn small block color="primary" @click="item.AddClock()">Add Clock</v-btn>
      </v-col>
      <v-col>
        <v-btn small block color="primary" @click="item.AddTable()">Add Rollable Table</v-btn>
      </v-col>
      <v-col>
        <v-btn small block color="primary" @click="linkSelectDialog = true">Link Item</v-btn>
        <v-dialog v-model="linkSelectDialog">
          <link-selector @add-link="item.AddLink($event)" @close="linkSelectDialog = false" />
        </v-dialog>
      </v-col>
    </v-row>
    <slot />
    <v-row
      justify="space-between"
      style="position: fixed; bottom: 12px; right: 12px; width: calc(100% - 256px)"
    >
      <v-col cols="auto">
        <v-btn tile color="primary" @click="$emit('move-up')">
          <v-icon left>mdi-arrow-up</v-icon>
          Move {{ item.ItemType }} Up
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn tile color="primary" @click="$emit('move-down')">
          <v-icon left>mdi-arrow-down</v-icon>
          Move {{ item.ItemType }} Down
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn tile color="primary" @click="$emit('duplicate')">
          <v-icon left>mdi-content-copy</v-icon>
          Duplicate {{ item.ItemType }}
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-menu offset-y top>
          <template v-slot:activator="{ on }">
            <v-btn tile color="error" v-on="on">
              <v-icon left>mdi-delete</v-icon>
              Delete {{ item.ItemType }}
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              Do you want to delete the {{ item.ItemType }} "{{ item.Title }}"? This action cannot
              be undone.
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn small color="error" @click="$emit('delete')">
                Confirm Deletion
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PageContentContainer from './PageContentContainer.vue'
import LinkSelector from './LinkSelector.vue'

export default Vue.extend({
  name: 'campaign-editor-page',
  components: { PageContentContainer, LinkSelector },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    linkSelectDialog: false,
  }),
  methods: {
    moveUp(index) {
      if (index > 0) {
        this.item.MoveItem(index, index - 1)
      }
    },
    moveDown(index) {
      if (index < this.item.Content.length) {
        this.item.MoveItem(index, index + 1)
      }
    },
  },
})
</script>
