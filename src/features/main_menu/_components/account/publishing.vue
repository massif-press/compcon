<template>
  <v-container class="px-12">
    <v-card flat border class="mb-4">
      <v-toolbar density="compact">
        <v-toolbar-title>
          <div class="heading h3">
            <span class="text-accent">
              CONTENT FEED EDITOR
              <v-tooltip max-width="500px" location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="x-small" class="mt-n1">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                Through this tool you can create and publish collections of COMP/CON content to
                other users, who can then subscribe to your content stream and automatically receive
                updates when you publish new content. This tool is intended for GMs and LANCER
                content creators, and is not required for general use or LANCER gameplay.
                <br />
                <br />
                Please use this tool responsibly. Publishing inappropriate or harmful content, or
                content you do not have permission to distribute, may result in your account being
                banned from the COMP/CON cloud service.
              </v-tooltip>
            </span>
          </div>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row dense>
          <v-col style="max-width: 250px">
            <v-tabs v-model="selectedStream" color="accent" direction="vertical">
              <div class="heading text-accent mb-2">CONTENT STREAMS (2/5)</div>
              <v-tab
                v-for="stream in streams"
                density="compact"
                prepend-icon="mdi-broadcast"
                size="small"
                :text="stream.name"
                :value="stream.id" />
              <v-btn
                color="accent"
                size="small"
                prepend-icon="mdi-plus"
                text="Add New"
                class="mt-2" />
            </v-tabs>
          </v-col>
          <v-col>
            <v-window v-model="selectedStream">
              <v-window-item v-for="stream in streams" :value="stream.id">
                <v-card flat>
                  <div class="px-4">
                    <v-row dense>
                      <v-col cols="7">
                        <v-text-field density="compact" label="Name" />
                      </v-col>
                      <v-col>
                        <v-text-field density="compact" label="Author" />
                      </v-col>
                      <v-col>
                        <div class="text-center">
                          <span class="text-caption">Current Version</span>
                          <v-divider />
                          <span class="heading h3 text-accent">0.0</span>
                        </div>
                      </v-col>
                    </v-row>
                    <v-textarea density="compact" label="Description" rows="3" auto-grow />
                    <v-row dense align="center">
                      <v-col class="heading text-accent">CONTENTS</v-col>
                      <v-col cols="auto">
                        <v-btn
                          color="accent"
                          variant="tonal"
                          size="x-small"
                          prepend-icon="mdi-update">
                          Update All
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-table
                      density="compact"
                      :headers="dataHeaders"
                      :items="stream.content"
                      :items-per-page="-1">
                      <thead>
                        <tr>
                          <th v-for="header in dataHeaders" :width="header.width || 'auto'">
                            {{ header.title }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in stream.content">
                          <td>{{ item.name }}</td>
                          <td>{{ item.itemType }}</td>
                          <td>{{ item.lastUpdated }}</td>
                          <td>
                            <v-btn size="small" color="accent" icon variant="text">
                              <v-icon size="x-large">mdi-update</v-icon>
                            </v-btn>
                            <v-btn size="small" color="accent" variant="text" icon>
                              <v-icon size="x-large">mdi-delete-outline</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="4" class="text-right">
                            <v-btn color="accent" size="small" prepend-icon="mdi-plus" class="mt-2">
                              Add New
                            </v-btn>
                          </td>
                        </tr>
                      </tfoot>
                    </v-table>
                    <v-row dense align="center" class="mt-4">
                      <v-col class="heading text-accent">CHANGELOG</v-col>
                      <v-col cols="auto">
                        <v-btn color="accent" variant="text" icon size="small">
                          <v-icon icon="mdi-auto-fix" />
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-textarea density="compact" rows="3" auto-grow hide-details />
                  </div>
                  <v-divider />
                  <v-footer>
                    <v-btn color="accent" size="small">Save Draft</v-btn>
                    <v-spacer />
                    <v-btn color="accent" size="small" class="mx-4">
                      Publish Minor Version (0.1)
                    </v-btn>
                    <v-btn color="accent" size="small">Publish Major Version (1.0)</v-btn>
                  </v-footer>
                </v-card>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'cloud-publish',
  data: () => ({
    selectedStream: null,
    streams: [
      {
        id: '1',
        name: 'Test Stream 1',
        content: [
          {
            name: 'Test Content 1',
            itemType: 'NPC',
            lastUpdated: '2021-01-01',
          },
          {
            name: 'Test Content 1',
            itemType: 'Campaign',
            lastUpdated: '2021-01-01',
          },
        ],
      },
      {
        id: '2',
        name: 'Test Stream 2',
        content: [
          {
            name: 'Test Content 1',
            itemType: 'LCP',
            lastUpdated: '2021-01-01',
            actions: '',
          },
        ],
      },
    ],
    dataHeaders: [
      { title: 'Name', key: 'name' },
      { title: 'Type', key: 'itemType' },
      { title: 'Last Updated', key: 'lastUpdated' },
      { title: '', key: 'actions', width: '115px' },
    ],
  }),
};
</script>
