<template>
  <v-data-table
    v-model:expanded="expanded"
    density="compact"
    no-data-text="No content packs available."
    :headers="tableHeaders"
    :items="items"
    show-expand
    item-value="name"
    :loading="loading"
    loading-text="Loading Content Pack Data..."
  >
    <!-- Download -->
    <template v-slot:item.website="{ item }">
      <cc-tooltip content="Download">
        <v-btn target="_blank" :href="item.link" icon variant="plain" color="secondary">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </cc-tooltip>
    </template>
    <!-- Name -->
    <template v-slot:item.name="{ item }">
      {{ item.columns.name }}
    </template>
    <!-- Version -->
    <template v-slot:item.version="{ item }">
      {{ item.columns.version }}
      <span v-if="packInstalled(item)">
        <cc-tooltip
          v-if="packOutdated(item)"
          inline
          title="Pack Outdated"
          content="This content pack is installed but out of date, and may cause errors with the latest version of COMP/CON. Click this pack's Download button to get the latest version."
        >
          <v-icon color="accent">mdi-alert</v-icon>
        </cc-tooltip>
        <cc-tooltip v-else inline content="This content pack is installed and up-to-date">
          <v-icon color="success">mdi-check</v-icon>
        </cc-tooltip>
      </span>
    </template>
    <!-- Version -->
    <template v-slot:item.cost="{ item }">
      {{ item.columns.cost }}
    </template>
    <!-- Expanded view -->
    <template v-slot:expanded-row="{ columns, item }">
      <td :colspan="columns.length" class="pa-4 w-100 bg-light-panel">
        <v-row>
          <v-col>
            <p class="body-text text-text pa-2 mb-1">
              <span v-if="item.raw.description" v-html-safe="item.raw.description" />
              <span v-else>No description given.</span>
            </p>

            <div v-if="item.raw.website" class="mt-2">
              <v-divider class="ma-1" />
              <v-btn target="_blank" :href="item.raw.website" variant="plain" color="secondary">
                <v-icon prepend start>mdi-open-in-new</v-icon>
                Author's Website
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="item.raw.img" cols="2">
            <v-img :src="item.raw.img" alt="Pack image" />
          </v-col>
        </v-row>
      </td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { semverGte } from 'semver/functions/gte';
import { semverCoerce } from 'semver/functions/coerce';

export default {
  name: 'content-pack-directory-table',
  data: () => ({
    expanded: [],
  }),
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
          { title: '', key: 'data-table-expand', width: '0' },
          {
            title: 'Download',
            width: '0',
            key: 'website',
            sortable: false,
            align: 'center',
          },
          { title: 'Name', key: 'name' },
          { title: 'Version', key: 'version' },
          { title: 'Cost', key: 'cost' },
        ];
      return [
        { title: '', key: 'data-table-expand', width: '0' },
        {
          title: 'Download',
          key: 'website',
          sortable: false,
          align: 'center',
          width: '0',
        },
        { title: 'Name', key: 'name' },
        { title: 'Author', key: 'author' },
        { title: 'Version', key: 'version' },
        { title: 'Cost', key: 'cost' },
      ];
    },
    contentPacks() {
      return CompendiumStore().ContentPacks;
    },
  },
  methods: {
    packInstalled(item) {
      return this.contentPacks.some((x) => x.Name === item.name || x.Name === item.title);
    },
    packOutdated(item) {
      const installedPack = this.contentPacks.find(
        (x) => x.Name === item.name || x.Name === item.title
      );
      if (!installedPack) return true;
      return !semverGte(semverCoerce(installedPack.Version), semverCoerce(item.version));
    },
  },
};
</script>
