<template>
  <div>
    <div v-if="item.NarrativeController.TextItems.length">
      <v-card v-for="s in item.NarrativeController.TextItems" variant="tonal" class="mb-2">
        <v-toolbar density="compact" class="px-3">
          <div class="heading h3">
            <cc-short-string-editor large @set="s.header = $event">
              {{ s.header }}
            </cc-short-string-editor>
          </div>
          <div style="width: 100px" />

          <v-checkbox-btn v-model="s.GmOnly" hide-details>
            <template #label>
              GM Only
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon
                    class="fade-select"
                    size="small"
                    end
                    icon="mdi-information-outline"
                    v-bind="props" />
                </template>
                <div>
                  Marking a field or item "GM Only" will hide it from player-facing exports and
                  print output
                </div>
              </v-tooltip>
            </template>
          </v-checkbox-btn>

          <v-menu offset-x left>
            <template #activator="{ props }">
              <v-btn size="small" icon color="error" variant="plain" v-bind="props">
                <v-icon icon="mdi-delete" />
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                Do you want to delete the textItem titled "{{ s.header }}"? This action cannot be
                undone.
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn size="small" color="error" @click="deleteTextItem(s)"
                  >Confirm Deletion</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-toolbar>
        <div class="pa-2">
          <cc-rich-text-area :item="s" note-property="body" />
        </div>
      </v-card>
    </div>
    <v-row justify="end">
      <v-col cols="auto">
        <v-menu
          v-model="textItemMenu"
          offset-x
          left
          :close-on-click="false"
          :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn color="accent" variant="outlined" size="small" v-bind="props">
              <v-icon start>mdi-plus</v-icon>
              Add New Text Section
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-combobox
                v-if="item.SectionSuggestions"
                v-model="newTextItemHeader"
                label="Title"
                :items="item.SectionSuggestions" />
              <v-text-field
                v-else
                v-model="newTextItemHeader"
                label="New Title"
                density="compact"
                hide-details
                variant="outlined" />
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
import NoteEditor from './NoteEditor.vue';

export default {
  name: 'campaign-item-textItem-editor',
  components: { NoteEditor },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    textItemMenu: false,
    newTextItemHeader: '',
  }),
  methods: {
    addTextItem() {
      this.item.NarrativeController.AddTextItem({
        header: this.newTextItemHeader,
        body: '',
      });
      this.newTextItemHeader = '';
      this.textItemMenu = false;
    },
    deleteTextItem(s) {
      const idx = this.item.NarrativeController.TextItems.findIndex(
        (x) => x.header === s.header && x.body === s.body
      );
      if (idx === -1) return;
      this.item.NarrativeController.TextItems.splice(idx, 1);
    },
  },
};
</script>
