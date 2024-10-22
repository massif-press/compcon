<template>
  <v-card flat border class="mb-4">
    <v-toolbar density="compact">
      <v-toolbar-title>
        <div class="heading h3">
          <span class="text-accent">
            AUTHOR CONTENT SUBSCRIPTIONS
            <v-tooltip max-width="500px" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-small" class="mt-n1">mdi-help-circle-outline</v-icon>
              </template>
              You can subscribe to COMP/CON data content authors to receive updates when they
              publish new content. This can include pilots, GM data like NPCs and Narrative
              Elements, and limited or reserved collection content, such as table-specific homebrew.
              You can add new subscriptions by adding the author's Content collection ID (CSID) to
              the list below.
              <br />
              <br />
              <strong>
                Neither Massif Press nor the COMP/CON developer take any responsibility for any
                content published to any author's content collection. Subscribe to authors at your
                own discretion.
              </strong>
            </v-tooltip>
          </span>
        </div>
      </v-toolbar-title>
      <v-select
        v-model="cloudUser.CollectionSubscriptionSettings.updateOn"
        density="compact"
        hide-details
        label="Updates"
        class="mx-2"
        style="max-width: 200px"
        :items="update_on"
        :loading="loading"
        @update:model-value="saveUserMetadata()" />
      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn size="small" color="accent" icon v-bind="props">
            <v-icon size="x-large">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          Refresh List
          <br />
          (This does not sync)
        </div>
      </v-tooltip>
      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn size="small" color="accent" icon v-bind="props">
            <v-icon size="x-large">mdi-download-multiple-outline</v-icon>
          </v-btn>
        </template>
        <div class="text-center">Update All</div>
      </v-tooltip>
    </v-toolbar>
    <v-divider />
    <v-data-table
      v-model:expanded="expanded"
      density="compact"
      :headers="collectionHeaders"
      :items="collectionItems"
      show-expand
      item-key="name"
      :items-per-page="-1"
      hide-default-footer>
      <template #item.actions="{ item }">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn variant="text" size="small" icon v-bind="props">
              <v-icon color="error" size="large" icon="mdi-broadcast-off" />
            </v-btn>
          </template>
          Unsubscribe
        </v-tooltip>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <td :colspan="columns.length" class="pa-4 w-100 bg-light-panel">
          <v-row dense>
            <v-col cols="3">
              author -- author contact
              <br />
              share code - copy code
            </v-col>
            <v-col>description</v-col>
          </v-row>
          <v-divider class="my-2" />
          <v-table>contents</v-table>
        </td>
      </template>
    </v-data-table>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" size="small" variant="tonal" prepend-icon="mdi-plus">
        Add New Subscription
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'collection-subscriptions',
  data: () => ({
    loading: false,
    expanded: [],
    collectionHeaders: [
      { title: '', key: 'data-table-expand', width: '0' },
      { title: 'Content Collection', key: 'name' },
      { title: 'Author', key: 'author' },
      { title: 'Description', key: 'description' },
      { title: 'Latest Update', key: 'last_update' },
      { title: 'Version', key: 'version' },
      { title: '', key: 'actions' },
    ],
    update_on: [
      {
        title: 'On Startup',
        value: 'auto',
      },
      {
        title: 'Manual Only',
        value: 'manual',
      },
    ],
    collectionItems: [
      {
        name: 'TEST collection 1',
        author: 'test author',
        description: 'This is a test collection',
        last_update: '2021-01-01',
        version: '1.0',
      },
    ],
  }),
  computed: {
    cloudUser() {
      return UserStore().UserMetadata;
    },
  },
  methods: {
    async saveUserMetadata() {
      this.loading = true;
      await UserStore().setUserMetadata();
      this.loading = false;
    },
  },
};
</script>
