<template>
  <v-card flat border class="mb-4">
    <v-toolbar density="compact">
      <v-toolbar-title>
        <div class="heading h3">
          <span class="text-accent">
            LCP SUBSCRIPTIONS
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-small" class="mt-n1">mdi-help-circle-outline</v-icon>
              </template>
              This setting is device-based and will not sync between devices. Some LCPs may require
              a purchase via itch.io before they can be auto-updated.
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
      :headers="lcpHeaders"
      :items="lcpItems"
      item-key="name"
      :items-per-page="-1">
      <template #item.auto="{ item }">
        <v-checkbox
          v-model="item.auto"
          density="compact"
          hide-details
          color="accent"
          class="pr-6"
          style="justify-content: end" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'lcp-subscriptions',
  data: () => ({
    lcpHeaders: [
      { title: 'LCP', key: 'name' },
      { title: 'Latest Update', key: 'last_update' },
      { title: 'Version', key: 'version' },
      { title: 'Auto-Update', key: 'auto', width: '135px' },
    ],
    lcpItems: [
      {
        name: 'TEST LCP 1',
        last_update: '2021-01-01',
        version: '1.0',
        auto: true,
      },
    ],
  }),
};
</script>
