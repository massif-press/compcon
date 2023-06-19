<template>
  <v-container fluid v-show="item">
    <v-card flat variant="outlined" class="mb-8">
      <v-toolbar density="compact" color="primary">
        <div class="heading h3 pa-1 text-white">{{ typeText }} EDITOR</div>
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
              <div class="text-overline">{{ typeText }} DESCRIPTION</div>
              <cc-rte v-model="item.Description" />
            </div>
          </v-col>
          <v-col cols="3" class="text-center">
            <v-combobox
              v-model="item.Labels"
              multiple
              variant="outlined"
              hide-details
              label="GM Labels"
              class="mb-2"
            />
            <v-combobox v-model="item.Campaign" variant="outlined" hide-details label="Campaign" />
            <v-img :src="item.PortraitController.Image" />
            <v-btn
              small
              variant="outlined"
              block
              color="accent"
              @click="$refs.imageSelector.open()"
            >
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
          :clock="c"
          class="mx-1 my-2"
          @delete="item.DeleteClock(c)"
        />
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn
              color="accent"
              variant="outlined"
              small
              @click="item.NarrativeController.AddClock()"
            >
              <v-icon start>mdi-plus</v-icon>
              Add New Clock
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <div class="caption">{{ typeText }} TABLES</div>
        <cc-rollable-table
          v-for="(t, i) in item.NarrativeController.Tables"
          :table="t"
          class="mx-1 my-2"
          @delete="item.DeleteTable(t)"
        />
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn
              color="accent"
              variant="outlined"
              small
              @click="item.NarrativeController.AddTable()"
            >
              <v-icon start>mdi-plus</v-icon>
              Add New Table
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <div class="caption">GM NOTES</div>
        <cc-rte v-model="item.Notes" />
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
          <template #activator="{ props }">
            <v-btn color="primary" class="mx-3" v-bind="props">Duplicate</v-btn>
          </template>
          <cc-confirmation content="Confirm duplication of this NPC" @confirm="dupeNpc()" />
        </v-menu>
        <v-menu v-model="deleteMenu" offset-y offset-x top left>
          <template #activator="{ props }">
            <v-btn color="error" v-bind="props">Delete</v-btn>
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
        <v-icon start>mdi-chevron-left</v-icon>
        Return to Collection
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import SectionEditor from './SectionEditor.vue';

export default {
  name: 'gm-editor-base',
  components: { SectionEditor },
  props: {
    isNew: { type: Boolean },
    showDescription: { type: Boolean },
    item: { type: Object, required: true },
  },

  data: () => ({
    printDialog: false,
    dupeMenu: false,
    deleteMenu: false,
  }),
  computed: {
    typeText() {
      if (!this.item) return 'ERR';
      return this.item.ItemType.toUpperCase();
    },
  },
  methods: {
    deleteItem() {
      if (!this.isNew) this.$emit('delete');
    },
    copy() {
      if (!this.isNew) this.$emit('copy');
      this.$emit('exit');
    },
    saveExit() {
      if (this.isNew) this.$emit('add-new', this.item);
      else this.$emit('save');
    },
  },
};
</script>
