<template>
  <div>
    <div v-if="item.NarrativeController.TextItems.length">
      <v-row
        v-for="(s, i) in item.NarrativeController.TextItems"
        :key="`textItem_${i}`"
        dense
      >
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
                <template v-slot:activator="{ props }">
                  <v-btn
                    small
                    icon
                    color="error"
                    class="fadeSelect"
                    v-bind="props"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    Do you want to delete the textItem titled "{{ s.header }}"?
                    This action cannot be undone.
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn small color="error" @click="deleteTextItem(s)"
                      >Confirm Deletion</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
          <v-col cols="12">
            <cc-rte v-model="s.body" />
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
          <template v-slot:activator="{ props }">
            <v-btn color="accent" variant="outlined" small v-bind="props">
              <v-icon start>mdi-plus</v-icon>
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
                variant="outlined"
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
export default {
  name: 'campaign-item-textItem-editor',
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
