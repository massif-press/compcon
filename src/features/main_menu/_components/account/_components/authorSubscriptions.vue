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
              Elements, and limited or reserved stream content, such as table-specific homebrew. You
              can add new subscriptions by adding the author's Content Stream ID (CSID) to the list
              below.
              <br />
              <br />
              <strong>
                Neither Massif Press nor the COMP/CON developer take any responsibility for any
                content published to any author's content stream. Subscribe to authors at your own
                discretion.
              </strong>
            </v-tooltip>
          </span>
        </div>
      </v-toolbar-title>
      <v-select
        density="compact"
        hide-details
        label="Check for New Data"
        class="mx-4"
        style="max-width: 225px"
        :items="['On Startup', 'Daily', 'Weekly', 'Never']" />

      <v-select
        density="compact"
        hide-details
        label="Update to"
        class="mx-4"
        style="max-width: 225px"
        :items="['Major Version Only', 'All Versions']" />
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
      density="compact"
      :headers="streamHeaders"
      :items="streamItems"
      item-key="name"
      :items-per-page="-1">
      <template #item.unsub="{ item }">
        <v-btn color="error" size="small" prepend-icon="mdi-broadcast-off" flat>Unsubscribe</v-btn>
      </template>
    </v-data-table>
    <div class="text-right pa-2">
      <v-btn color="primary" size="small" prepend-icon="mdi-plus">Add New Content Stream</v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'stream-subscriptions',
  data: () => ({
    streamHeaders: [
      { title: 'Content Stream', key: 'name' },
      { title: 'Description', key: 'description' },
      { title: 'Latest Update', key: 'last_update' },
      { title: 'Version', key: 'version' },
      { title: '', key: 'unsub', width: '135px' },
    ],
    streamItems: [
      {
        name: 'TEST STREAM 1',
        description: 'This is a test stream',
        last_update: '2021-01-01',
        version: '1.0',
      },
    ],
  }),
};
</script>
