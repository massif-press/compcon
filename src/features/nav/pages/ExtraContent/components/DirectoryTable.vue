<template>
  <v-data-table
    hide-default-footer
    disable-pagination
    no-data-text="No content packs available."
    :headers="tableHeaders"
    :items="items"
    show-expand
    item-key="name"
    :loading="loading"
    loading-text="Loading Content Pack Data..."
  >
    <!-- Download -->
    <template v-slot:[`item.website`]="{ item }">
      <cc-tooltip content="Download">
        <v-btn target="_blank" :href="item.link" fab small color="secondary">
          <v-icon color="anti">open_in_new</v-icon>
        </v-btn>
      </cc-tooltip>
    </template>
    <!-- Name -->
    <template v-slot:[`item.name`]="{ item }">
      <span class="title">
        {{ item.title }}
      </span>
    </template>
    <!-- Version -->
    <template v-slot:[`item.version`]="{ item }">
      <span class="packVersion">
        {{ item.version }}
        <span v-if="packInstalled(item)">
          <cc-tooltip
            v-if="packOutdated(item)"
            inline
            title="Pack Outdated"
            content="This content pack is installed but out of date, and may cause errors with the latest version of COMP/CON. Click this pack's Download button to get the latest version."
          >
            <v-icon color="accent">mdi-alert</v-icon>
          </cc-tooltip>
          <cc-tooltip
            v-else
            inline
            content="This content pack is installed and up-to-date"
          >
            <v-icon color="success">mdi-check</v-icon>
          </cc-tooltip>
        </span>
      </span>
    </template>
    <!-- Version -->
    <template v-slot:[`item.cost`]="{ item }">
      <span class="cost">
        {{ item.cost }}
      </span>
    </template>
    <!-- Expanded view -->
    <template v-slot:expanded-item="{ item, headers }">
      <td :colspan="headers.length" class="py-4 px-6 w-100 light-panel">
        <v-row>
          <v-col>
            <p class="body-text text-text pa-2 mb-1">
              <span v-if="item.description" v-html-safe="item.description" />
              <span v-else>No description given.</span>
            </p>

            <div v-if="item.website" class="mt-2">
              <v-divider class="ma-1" />
              <v-btn
                target="_blank"
                :href="item.website"
                text
                color="secondary"
              >
                <v-icon prepend left>open_in_new</v-icon>
                Author's Website
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="item.img" cols="2">
            <v-img :src="item.img" alt="Pack image" />
          </v-col>
        </v-row>
      </td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'content-pack-directory-table',
  props: {
    items: {
      type: Array,
      required: true,
    },
    noAuthor: { type: Boolean },
    loading: { type: Boolean },
  },
  computed: {
    tableHeaders() {
      if (this.noAuthor)
        return [
          { text: '', value: 'data-table-expand' },
          {
            text: 'Download',
            value: 'website',
            sortable: false,
            align: 'center',
          },
          { text: 'Name', value: 'name' },
          { text: 'Version', value: 'version' },
          { text: 'Cost', value: 'cost' },
        ];
      return [
        { text: '', value: 'data-table-expand' },
        {
          text: 'Download',
          value: 'website',
          sortable: false,
          align: 'center',
        },
        { text: 'Name', value: 'name' },
        { text: 'Author', value: 'author' },
        { text: 'Version', value: 'version' },
        { text: 'Cost', value: 'cost' },
      ];
    },
    contentPacks() {
      return CompendiumStore().ContentPacks;
    },
  },
  methods: {
    packInstalled(item) {
      return this.contentPacks.some(
        (x) => x.Name === item.name || x.Name === item.title
      );
    },
    packOutdated(item) {
      const installedPack = this.contentPacks.find(
        (x) => x.Name === item.name || x.Name === item.title
      );
      if (!installedPack) return true;
      return installedPack.Version !== item.version;
    },
  },
};
</script>

<style scoped>
.packsList >>> .v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none;
}
</style>
