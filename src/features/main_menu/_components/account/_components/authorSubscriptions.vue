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
          <v-btn size="small" color="accent" icon v-bind="props" @click="refresh">
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
          <v-btn size="small" color="accent" icon v-bind="props" @click="updateAll">
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
      :headers="<any>collectionHeaders"
      :items="collectionItems"
      show-expand
      item-key="name"
      :items-per-page="-1"
      :loading="loading"
      hide-default-footer>
      <template #item.last_update="{ item }">
        {{ new Date(item.updated).toLocaleString() }}
      </template>
      <template #item.vers="{ item }">
        <span v-if="!getLocalUserSetting(item)">-</span>
        <span v-else>
          {{ getLocalUserSetting(item)!.metadata.version }}
          <v-tooltip max-width="300px" location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                :color="isLatestVersion(item) ? 'success' : 'warning'"
                :icon="isLatestVersion(item) ? 'mdi-check' : 'mdi-alert'" />
            </template>
            <span v-if="isLatestVersion(item)">Up to Date</span>
            <span v-else>
              <span v-text="majorMinor(item)" />
              Update Available
              <v-divider />
              <b class="heading">{{ item.version }}</b>
              <div class="text-caption">
                Updated on
                {{ new Date(item.updated).toLocaleString() }}
              </div>
            </span>
          </v-tooltip>
        </span>
      </template>
      <template #item.actions="{ item }">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              icon
              v-bind="props"
              :loading="loading"
              :disabled="isLatestVersion(item)"
              @click="update(item)">
              <v-icon color="accent" size="large" icon="mdi-download" />
            </v-btn>
          </template>
          Update to Latest
        </v-tooltip>
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              icon
              v-bind="props"
              :loading="loading"
              @click="unsubscribe(item)">
              <v-icon color="error" size="large" icon="mdi-broadcast-off" />
            </v-btn>
          </template>
          <div class="text-center">
            Unsubscribe
            <v-divider />
            <i class="text-caption">
              Unsubscribing from this collection will remove it from your collection list. You will
              no longer receive updates from this author. The local data from this collection will
              not be removed.
            </i>
          </div>
        </v-tooltip>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <td :colspan="columns.length" class="pa-4 w-100 bg-light-panel">
          <v-alert
            v-if="!isLatestVersion(item)"
            density="compact"
            border
            color="warning"
            variant="tonal"
            icon="mdi-alert"
            class="mb-2">
            There is a new version of this collection available.
            <div class="text-right">
              <v-btn size="small" color="warning" @click="update(item)">Update Now</v-btn>
            </div>
          </v-alert>
          <collection-info :collection="item" />
        </td>
      </template>
    </v-data-table>
    <v-alert
      v-for="item in remoteDeletedItems"
      class="mx-8 my-2"
      density="compact"
      prominent
      border
      closable
      color="error"
      variant="tonal"
      icon="mdi-alert"
      @click:close="unsubscribe(item.metadata)">
      <div class="heading h4">Deleted Collection</div>
      <div class="text-caption">
        The collection "{{ item.metadata.name }}" has been deleted by the author. Although your
        local data has not been removed, you will no longer receive updates from this collection.
      </div>
    </v-alert>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <collection-share-code-dialog />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import CollectionShareCodeDialog from './data_viewer/collectionShareCodeDialog.vue';
import CollectionInfo from './data_viewer/collectionInfo.vue';

export default {
  name: 'collection-subscriptions',
  components: { CollectionShareCodeDialog, CollectionInfo },
  data: () => ({
    loading: false,
    expanded: [],
    collectionHeaders: [
      { title: '', key: 'data-table-expand', width: '0' },
      { title: 'Content Collection', key: 'name' },
      { title: 'Author', key: 'author' },
      { title: 'Version', key: 'vers', align: 'center' },
      { title: '', key: 'actions' },
    ],
    update_on: [
      {
        title: 'On Startup',
        value: 'startup',
      },
      {
        title: 'Manual Only',
        value: 'manual',
      },
    ],
  }),
  computed: {
    cloudUser() {
      return UserStore().UserMetadata;
    },
    collectionItems() {
      return UserStore().RemoteCollections;
    },
    remoteDeletedItems() {
      return this.cloudUser.CollectionSubscriptionSettings.items.filter(
        (sub) => !this.collectionItems.find((item) => item.id === sub.metadata.id)
      );
    },
  },
  methods: {
    async saveUserMetadata() {
      this.loading = true;
      await UserStore().setUserMetadata();
      this.loading = false;
    },
    async unsubscribe(item) {
      this.loading = true;
      await UserStore().removeContentSubscription(item);
      this.loading = false;
    },
    async update(item) {
      this.loading = true;
      let errors = await UserStore().updateRemoteCollection(item);
      if (errors.length > 0) {
        console.error(errors);
        this.$notify({
          title: 'Error Updating Collection',
          text: 'There was an error updating the collection. Please try again later.',
          data: { color: 'error', icon: 'mdi-alert-circle-outline' },
        });
      } else {
        this.$notify({
          title: 'Collection Updated',
          text: 'Collection items have been updated successfully.',
          data: { color: 'success', icon: 'mdi-check-circle-outline' },
        });
      }
      this.loading = false;
    },
    async refresh() {
      this.loading = true;
      await UserStore().getRemoteCollectionMetadata();
      this.loading = false;
    },
    async updateAll() {
      for (let item of this.collectionItems) {
        const localSetting = this.getLocalUserSetting(item);
        if (localSetting && localSetting.metadata.version === item.version) continue;
        else await this.update(item);
      }
    },
    getLocalUserSetting(item) {
      return this.cloudUser.CollectionSubscriptionSettings.items.find(
        (sub) => sub.metadata.id === item.id
      );
    },
    isLatestVersion(item) {
      if (!this.getLocalUserSetting(item)) return false;
      return item.version === this.getLocalUserSetting(item)!.metadata.version;
    },
    copy(code) {
      navigator.clipboard.writeText(code);
    },
    parsedContent(json) {
      return JSON.parse(json);
    },
    majorMinor(item) {
      if (!this.getLocalUserSetting(item)) return '';
      if (
        this.getLocalUserSetting(item)!.metadata.version.split('.')[0] ===
        item.version.split('.')[0]
      )
        return 'Minor';
      return 'Major';
    },
  },
};
</script>
