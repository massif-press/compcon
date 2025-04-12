<template>
  <v-container :class="!mobile && 'px-12'">
    <v-card flat border tile class="mb-4">
      <v-toolbar density="compact" color="panel">
        <v-toolbar-title>
          <cc-heading
            title
            :text="mobile ? 'COLLECTION PUBLISHING' : 'CONTENT COLLECTION PUBLISHING'"
            tooltip="Through this tool you can create and publish collections of COMP/CON content to
                other users, who can then subscribe to your content collections and automatically
                receive updates when you publish new content. This tool is intended for GMs and
                LANCER content creators, and is not required for general use or LANCER gameplay.
                <br />
                <br />
                Please use this tool responsibly. Publishing inappropriate or harmful content, or
                content you do not have permission to distribute, may result in your account being
                banned from the COMP/CON cloud service." />
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="!collectionLimit">
        <cc-alert
          color="secondary"
          prominent
          title="You do not have access to the collection publishing tool.">
          Due to the server costs associated with the creation and distribution of these
          collections, this tool is only available to Patreon subscribers. If you would like to
          access this tool and create and distribute collections of your COMP/CON content, please
          consider
          <a href="https://www.patreon.com/compcon" target="_blank">subscribing</a>
          to support the development of COMP/CON and gain access to additional features.
          <br />
          <br />
          However, you can still view and subscribe to collections created by other users.
        </cc-alert>
      </v-card-text>
      <v-card-text v-else>
        <v-row dense>
          <v-col :style="!mobile && 'max-width: 250px'">
            <v-tabs v-model="colIdx" color="accent" direction="vertical">
              <div class="heading text-accent mb-2">
                COLLECTIONS ({{ collections.length }}/{{
                  collectionLimit > -1 ? collectionLimit : '∞'
                }})
              </div>
              <v-tab
                v-for="collection in collections"
                density="compact"
                prepend-icon="mdi-broadcast"
                size="small"
                :text="collection.Name" />
              <cc-button
                color="primary"
                size="small"
                tile
                block
                prepend-icon="mdi-plus"
                class="mt-2"
                :disabled="
                  collections.length >= (collectionLimit > -1 ? collectionLimit : Infinity)
                "
                @click="AddNew()">
                Add New
              </cc-button>
            </v-tabs>
          </v-col>
          <v-divider v-if="mobile" class="my-1" />
          <v-col>
            <v-window v-model="colIdx">
              <v-window-item v-for="collection in collections">
                <v-card flat>
                  <div class="px-4">
                    <v-row dense>
                      <v-col cols="12" lg="7">
                        <v-text-field
                          v-model="collection.Name"
                          :label="!collection.Name ? 'Name (required)' : 'Name'"
                          density="compact" />
                      </v-col>
                      <v-col cols="12" lg="">
                        <v-text-field
                          v-model="collection.Author"
                          density="compact"
                          :label="!collection.Author ? 'Author (required)' : 'Author'" />
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
                        <cc-button
                          color="accent"
                          variant="tonal"
                          size="x-small"
                          tile
                          flat
                          prepend-icon="mdi-update">
                          Update All
                        </cc-button>
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
                            <v-icon v-bind="props" color="primary">mdi-update</v-icon>
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
                            <cc-button
                              size="small"
                              color="primary"
                              variant="text"
                              v-bind="props"
                              icon
                              @click="collection.RemoveItem(item)">
                              <v-icon size="x-large">mdi-delete-outline</v-icon>
                            </cc-button>
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
                            <cc-button
                              color="accent"
                              variant="outlined"
                              icon="mdi-auto-fix"
                              size="small"
                              class="mb-2"
                              v-bind="props"
                              @click="collection.NextChangelog = collection.GenerateChangelog()" />
                          </template>
                          <div class="text-center">Automatically generate this changelog</div>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                    <v-textarea
                      v-model="collection.NextChangelog"
                      density="compact"
                      rows="3"
                      hide-details
                      auto-grow />
                  </div>
                  <div class="text-right">
                    <cc-dialog title="Changelog">
                      <template #activator="{ open }">
                        <cc-button
                          size="x-small"
                          class="my-2"
                          variant="tonal"
                          prepend-icon="mdi-note-multiple-outline"
                          @click="open">
                          View Full Changelog
                        </cc-button>
                      </template>
                      <template #default="{ isActive }">
                        <v-card v-show="isActive">
                          <v-toolbar color="primary" density="compact">
                            <v-toolbar-title class="heading h3">
                              {{ collection.Name.toUpperCase() }} CHANGELOG
                            </v-toolbar-title>
                            <cc-button icon @click="isActive.value = false">
                              <v-icon>mdi-close</v-icon>
                            </cc-button>
                          </v-toolbar>
                          <v-card-text>
                            <div v-for="entry in collection.Changelog">
                              <div class="heading h4">version {{ entry.version }}</div>
                              <v-textarea
                                v-model="entry.changes"
                                density="compact"
                                rows="2"
                                hide-details
                                auto-grow
                                readonly />
                            </div>
                          </v-card-text>
                        </v-card>
                      </template>
                    </cc-dialog>
                  </div>
                  <v-divider class="mb-3" />
                  <v-footer>
                    <cc-button color="primary" size="small" @click="collection.Save()">
                      Save Draft
                    </cc-button>

                    <v-spacer />
                    <cc-button
                      color="primary"
                      :loading="loading"
                      size="small"
                      class="mx-4"
                      :disabled="!canPublish(collection)"
                      @click="Publish('minor')">
                      Publish Minor Version ({{ collection.NextVersion('minor') }})
                    </cc-button>
                    <cc-button
                      color="primary"
                      :loading="loading"
                      size="small"
                      :disabled="!canPublish(collection)"
                      @click="Publish('major')">
                      Publish Major Version ({{ collection.NextVersion('major') }})
                    </cc-button>
                  </v-footer>
                  <div class="my-2">
                    <span class="text-caption">COLLECTION SHARE CODE</span>
                    <div v-if="collection.Metadata?.code" class="text-center">
                      <v-chip
                        color="primary"
                        class="mt-1 mx-1"
                        size="x-large"
                        label
                        v-for="n in collection.Metadata.code.substring(0, 4)">
                        <span class="heading h2">{{ n }}</span>
                      </v-chip>
                      <v-chip variant="text" class="mt-1" size="x-large" label>
                        <span class="heading h2">&ndash;</span>
                      </v-chip>
                      <v-chip
                        color="primary"
                        class="mt-1 mx-1"
                        size="x-large"
                        label
                        v-for="n in collection.Metadata.code.substring(4, 8)">
                        <span class="heading h2">{{ n }}</span>
                      </v-chip>
                      <v-chip variant="text" class="mt-1" size="x-large" label>
                        <span class="heading h2">&ndash;</span>
                      </v-chip>
                      <v-chip
                        color="primary"
                        class="mt-1 mx-1"
                        size="x-large"
                        label
                        v-for="n in collection.Metadata.code.substring(8, 12)">
                        <span class="heading h2">{{ n }}</span>
                      </v-chip>
                      <v-tooltip max-width="300px" location="top">
                        <template #activator="{ props }">
                          <v-icon
                            v-bind="props"
                            color="primary"
                            size="small"
                            end
                            icon="mdi-content-copy"
                            class="fade-select"
                            @click="copy(collection.Metadata.code)" />
                        </template>
                        <div class="text-center">Copy Share Code</div>
                      </v-tooltip>
                      <div class="text-left text-caption text-disabled">
                        Last update on
                        {{ new Date(collection.Metadata?.updated || 0).toLocaleString() }}
                      </div>
                    </div>
                    <div v-else class="text-caption text-disabled">
                      <i>Collection must be published to generate a share code.</i>
                    </div>
                  </div>
                  <v-card-actions>
                    <v-spacer />
                    <cc-dialog title="delete collection" color="error" :close-on-click="false">
                      <template #activator="{ open }">
                        <cc-button
                          color="error"
                          variant="tonal"
                          size="small"
                          prepend-icon="mdi-delete"
                          @click="open">
                          Delete Collection
                        </cc-button>
                      </template>
                      <template #default="{ close }">
                        <v-card-text v-if="collection.Metadata?.code">
                          <div>
                            <p>
                              Deleting this collection will remove the collection from your local
                              and cloud data, and will delete the collection archive from cloud
                              storage. Users will not be able to subscribe to this content and
                              current subscribers will no longer be able to update collection data.
                              It
                              <strong>will not</strong>
                              delete any collection content, either locally or on the cloud for you
                              or collection subscribers.
                            </p>
                            <span class="text-caption">This action cannot be undone.</span>
                          </div>
                        </v-card-text>
                        <v-card-text v-else>
                          <div>
                            <p>Are you sure you want to delete this collection?</p>
                            <span class="text-caption">This action cannot be undone.</span>
                          </div>
                        </v-card-text>
                        <v-divider />
                        <v-card-actions>
                          <cc-button variant="text" @click="close">Cancel</cc-button>
                          <v-spacer />
                          <cc-button
                            color="error"
                            prepend-icon="mdi-delete"
                            variant="tonal"
                            :loading="loading"
                            @click="
                              deleteCollection(collection);
                              close;
                            ">
                            delete collection
                          </cc-button>
                        </v-card-actions>
                      </template>
                    </cc-dialog>
                  </v-card-actions>
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
import logger from '@/user/logger';

export default {
  name: 'cloud-publish',
  components: { CollectionItemSelector },
  data: () => ({
    loading: false,
    colIdx: 0,
    dataHeaders: [
      { title: 'Name', key: 'name' },
      { title: 'Type', key: 'item_type' },
      { title: 'Last Updated', key: 'update' },
      { title: '', key: 'actions', width: '115px' },
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    collectionLimit(): number {
      return UserStore().CollectionPublishLimit;
    },
    collections(): ContentCollection[] {
      return UserStore().UserCollections;
    },
  },
  methods: {
    canPublish(collection) {
      return collection.Contents.length > 0 && collection.Name && collection.Author;
    },
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
    async Publish(version: 'minor' | 'major') {
      this.loading = true;
      const collection = this.collections[this.colIdx];
      try {
        await collection.Publish(version);
        await UserStore().refreshDbData();
        this.$notify({
          title: 'Published',
          text: `Collection ${collection.Name} published as version ${collection.Version}`,
          data: { color: 'success', icon: 'mdi-check-circle-outline' },
        });
      } catch (e) {
        logger.error(`Failed to publish collection ${collection.Name}: ${e}`, this);
        this.$notify({
          title: 'Error',
          text: `Failed to publish collection ${collection.Name}`,
          data: { color: 'error', icon: 'mdi-alert' },
        });
      } finally {
        this.loading = false;
      }
    },
    copy(code) {
      navigator.clipboard.writeText(code);
      this.$notify({
        title: 'Copied',
        text: 'Collection share code copied to clipboard',
        data: { color: 'success', icon: 'mdi-check-circle-outline' },
      });
    },
    async deleteCollection(collection) {
      this.loading = true;
      await ContentCollection.Delete(collection);
      this.loading = false;
    },
  },
};
</script>
