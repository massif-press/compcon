<template>
  <v-container class="px-12">
    <v-card flat border class="mb-4">
      <v-toolbar density="compact">
        <v-toolbar-title>
          <div class="heading h3">
            <span class="text-accent">
              CONTENT COLLECTION EDITOR
              <v-tooltip max-width="500px" location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="x-small" class="mt-n1">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                Through this tool you can create and publish collections of COMP/CON content to
                other users, who can then subscribe to your content collections and automatically
                receive updates when you publish new content. This tool is intended for GMs and
                LANCER content creators, and is not required for general use or LANCER gameplay.
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
            <v-tabs v-model="colIdx" color="accent" direction="vertical">
              <div class="heading text-accent mb-2">
                COLLECTIONS ({{ collections.length }}/{{ collectionLimit }})
              </div>
              <v-tab
                v-for="collection in collections"
                density="compact"
                prepend-icon="mdi-broadcast"
                size="small"
                :text="collection.Name" />
              <v-btn
                color="accent"
                size="small"
                prepend-icon="mdi-plus"
                text="Add New"
                class="mt-2"
                :disabled="collections.length >= collectionLimit"
                @click="AddNew()" />
            </v-tabs>
          </v-col>
          <v-col>
            <v-window v-model="colIdx">
              <v-window-item v-for="collection in collections">
                <v-card flat>
                  <div class="px-4">
                    <v-row dense>
                      <v-col cols="7">
                        <v-text-field v-model="collection.Name" density="compact" label="Name" />
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="collection.Author"
                          density="compact"
                          label="Author" />
                      </v-col>
                      <v-col>
                        <div class="text-center">
                          <span class="text-caption">Current Version</span>
                          <v-divider />
                          <span class="heading h3 text-accent">
                            {{ collection.Version }}
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                    <v-textarea
                      v-model="collection.Description"
                      density="compact"
                      label="Description"
                      rows="3"
                      auto-grow />
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
                    <v-data-table
                      density="compact"
                      :headers="dataHeaders"
                      :items="collection.Contents"
                      :items-per-page="-1"
                      hide-default-footer>
                      <template #item.update="{ item }">
                        <v-tooltip v-if="newLocalData(item)" max-width="300px" location="top">
                          <template #activator="{ props }">
                            <v-icon v-bind="props" color="accent">mdi-update</v-icon>
                          </template>
                          This item has been modified locally and will be updated to the newest
                          version on publishing.
                        </v-tooltip>
                        <v-tooltip v-else-if="hasLocalData(item)" max-width="300px" location="top">
                          <template #activator="{ props }">
                            <v-icon v-bind="props" color="success">mdi-check-circle-outline</v-icon>
                          </template>
                          This item is up to date with the version found in local data.
                        </v-tooltip>
                        {{ new Date((item as any).last_updated).toLocaleString() }}
                        <v-tooltip v-if="!hasLocalData(item)" max-width="300px" location="top">
                          <template #activator="{ props }">
                            <v-icon v-bind="props" color="error">mdi-alert</v-icon>
                          </template>
                          This item cannot be found in local data and is unable to be updated. It
                          will persist in the collection until removed.
                        </v-tooltip>
                      </template>
                      <template #item.actions="{ item }">
                        <v-tooltip max-width="300px" location="top">
                          <template #activator="{ props }">
                            <v-btn
                              size="small"
                              color="accent"
                              variant="text"
                              v-bind="props"
                              icon
                              @click="collection.RemoveItem(item)">
                              <v-icon size="x-large">mdi-delete-outline</v-icon>
                            </v-btn>
                          </template>
                          <div class="text-center">
                            Remove this item from this collection. This does not remove the item
                            from your local or cloud storage COMP/CON data.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                    <collection-item-selector
                      :added-items="collection.Contents.map((x) => x.id)"
                      @add-item="collection.AddItem($event.type, $event.item)" />
                    <v-row dense align="center" class="mt-4">
                      <v-col class="heading text-accent">CHANGELOG</v-col>
                      <v-col cols="auto">
                        <v-tooltip max-width="300px" location="top">
                          <template #activator="{ props }">
                            <v-btn
                              color="accent"
                              variant="text"
                              icon
                              size="small"
                              v-bind="props"
                              @click="collection.NextChangelog = collection.GenerateChangelog()">
                              <v-icon icon="mdi-auto-fix" />
                            </v-btn>
                          </template>
                          <div class="text-center">Automatically generate this changelog</div>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                    <v-textarea
                      v-model="collection.NextChangelog"
                      density="compact"
                      rows="3"
                      auto-grow
                      hide-details />
                  </div>
                  <v-divider />
                  <v-footer>
                    <v-btn color="accent" size="small" @click="collection.Save()">Save Draft</v-btn>
                    <v-spacer />
                    <v-btn
                      color="accent"
                      size="small"
                      class="mx-4"
                      @click="collection.Publish('minor')">
                      Publish Minor Version ({{ collection.NextVersion('minor') }})
                    </v-btn>
                    <v-btn color="accent" size="small" @click="collection.Publish('major')">
                      Publish Major Version ({{ collection.NextVersion('major') }})
                    </v-btn>
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
import { ContentCollection } from '@/classes/components/cloud/ContentCollection';
import { CompendiumStore, UserStore } from '@/stores';
import CollectionItemSelector from './_components/collectionItemSelector.vue';

export default {
  name: 'cloud-publish',
  components: { CollectionItemSelector },
  data: () => ({
    colIdx: 0,
    dataHeaders: [
      { title: 'Name', key: 'name' },
      { title: 'Type', key: 'item_type' },
      { title: 'Last Updated', key: 'update' },
      { title: '', key: 'actions', width: '115px' },
    ],
  }),
  computed: {
    collectionLimit(): number {
      return UserStore().CollectionPublishLimit;
    },
    collections(): ContentCollection[] {
      return CompendiumStore().ContentCollections as ContentCollection[];
    },
  },
  methods: {
    AddNew() {
      if (this.collections.length >= this.collectionLimit) {
        return;
      }
      CompendiumStore().ContentCollections.push(new ContentCollection());
    },
    hasLocalData(item: any) {
      return !!item.data;
    },
    newLocalData(item: any) {
      if (!this.hasLocalData(item)) return false;
      if (!item.data.SaveController) return false;
      return item.last_updated !== item.data.SaveController.LastModified;
    },
  },
};
</script>
