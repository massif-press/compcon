<template>
  <v-navigation-drawer permanent fixed style="overflow-y: scroll" class="pb-8">
    <v-row density="compact" class="pa-2" justify="center" align="center">
      <v-col cols="auto" class="heading h3 text-center">
        {{ campaign.Title }}
        <div class="text-caption text-disabled">{{ campaign.Subtitle }}</div>
      </v-col>
    </v-row>
    <v-divider class="mb-3" />
    <div class="ma-2">
      <v-btn
        :color="currentPage === 'Credits' ? 'secondary' : ''"
        block
        tile
        flat
        size="small"
        @click="setPage('Credits')">
        Credits
      </v-btn>

      <indented-list
        :items="campaign.Contents"
        :level="0"
        :selected="<any>selected"
        @clicked="setSelected($event)" />

      <v-btn
        :color="currentPage === 'index' ? 'secondary' : ''"
        block
        tile
        flat
        size="small"
        @click="setPage('index')">
        Index
      </v-btn>
    </div>
    <v-divider class="my-2" />

    <div style="position: absolute; bottom: 0; left: 0; right: 0" class="px-2">
      <v-btn
        block
        tile
        flat
        size="small"
        class="my-2 pa-2"
        color="primary"
        prepend-icon="mdi-arrow-left"
        to="/gm/campaigns">
        Return to Library
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import IndentedList from './IndentedList.vue';
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'campaign-editor-sidebar',
  components: { IndentedList },
  props: {
    campaign: { type: Object, required: true },
    currentPage: { type: String },
  },
  data: () => ({
    lastSave: '',
    selected: null,
  }),
  created() {
    this.lastSave = this.campaign.SaveController.LastModified;
  },
  computed: {
    dirty() {
      return this.lastSave !== this.campaign.SaveController.LastModified;
    },
  },
  methods: {
    setPage(type: string) {
      this.$emit('set-page', type);
      this.selected = null;
    },
    setSelected(item: any) {
      this.selected = item;
      this.$emit('set-selected', item);
    },
    exportEditable() {
      const filename =
        this.campaign.Title.replace(/\s/g, '_').toLowerCase() +
        new Date().toLocaleString() +
        '.json';
      exportAsJson(Campaign.Serialize(this.campaign as Campaign), filename);
    },
  },
};
</script>
