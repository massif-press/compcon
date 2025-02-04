<template>
  <v-btn-toggle
    v-if="!mobile"
    v-model="itemTypeFilter"
    multiple
    tile
    flat
    style="height: 20px; margin-top: -6px; width: 100%">
    <v-btn
      v-for="itemType in syncableItemTypes"
      size="small"
      :key="itemType.value"
      v-model="itemTypeFilter"
      :value="itemType.value"
      :style="`width: ${100 / syncableItemTypes.length}%`"
      color="primary">
      {{ itemType.title }}
    </v-btn>
  </v-btn-toggle>
  <cc-select v-else v-model="itemTypeFilter" :items="syncableItemTypes" multiple color="primary">
    <template #prepend-inner>
      <v-icon>mdi-filter</v-icon>
    </template>
  </cc-select>
  <v-data-table
    density="compact"
    :mobile="mobile"
    :headers="<any>dataHeaders"
    :items="shownItems"
    item-key="name"
    :loading="loading"
    :items-per-page="50">
    <template #item.Name="{ item }">
      <cc-missing-content-hover :item="item" />
      {{ item.Name }}
    </template>
    <template #item.author="{ item }">
      <span v-if="item.SaveController.RemoteCollection">
        {{ item.SaveController.RemoteCollection.author }}
      </span>
      <span v-else-if="item.SaveController.RemoteAuthor">
        {{ item.SaveController.RemoteAuthor }}
      </span>
    </template>
    <template #item.collection="{ item }">
      <span v-if="item.SaveController.RemoteCollection">
        {{ item.SaveController.RemoteCollection.name }}
        <v-chip size="x-small">v.{{ item.SaveController.RemoteCollection.version }}</v-chip>
      </span>
    </template>

    <template #item.cloudLastModified="{ item }">
      <span v-if="item.CloudController.Metadata?.ItemModified">
        {{ new Date(item.CloudController.Metadata.ItemModified).toLocaleString() }}
      </span>
      <i v-else class="text-disabled">No Data</i>
    </template>
    <template #item.syncStatus="{ item }">
      <span v-if="item.CloudController.SyncStatus === 'Synced'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="success" icon="mdi-cloud-check-variant-outline" />
          </template>
          <div class="text-center">
            Synced
            <br />
            <i class="text-caption">This item is up to date with the cloud. No action is needed.</i>
          </div>
        </v-tooltip>
      </span>
      <span v-if="item.CloudController.SyncStatus === 'CloudNewer'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="warning" icon="mdi-cloud-upload" />
          </template>
          <div class="text-center">
            Local Out of Date
            <br />
            <i class="text-caption">
              This item has new changes in the cloud that have not been downloaded.
            </i>
          </div>
        </v-tooltip>
      </span>

      <span v-else-if="item.CloudController.SyncStatus === 'CloudOnly'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="warning">mdi-cloud-outline</v-icon>
          </template>
          <div class="text-center">
            Cloud Only
            <br />
            <i class="text-caption">
              This item is stored in your cloud account but has not been downloaded to this device.
            </i>
          </div>
        </v-tooltip>
      </span>
    </template>
    <template #item.code="{ item }">
      <span v-if="item.SaveController?.RemoteCode?.length > 0">
        {{
          `${item.SaveController.RemoteCode.slice(0, 4)}-${item.SaveController.RemoteCode.slice(4, 8)}-${item.SaveController.RemoteCode.slice(8, 12)}`
        }}
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              color="accent"
              size="small"
              icon="mdi-content-copy"
              class="fade-select"
              @click="copy(item.SaveController.RemoteCode)" />
          </template>
          <div class="text-center">Copy Share Code</div>
        </v-tooltip>
      </span>
    </template>
    <template #item.actions="{ item }">
      <div>
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn size="small" color="accent" icon variant="text" v-bind="props">
              <v-tooltip max-width="300px" location="top">
                <template #activator="{ props }">
                  <v-icon size="x-large" v-bind="props">mdi-cloud-braces</v-icon>
                </template>
                <div class="text-center">Manual Controls</div>
              </v-tooltip>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              title="Sync"
              subtitle="Sync this item to the latest remote version."
              @click="sync(item)" />
          </v-list>
        </v-menu>

        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              size="small"
              color="accent"
              icon
              variant="text"
              v-bind="props"
              @click="removeItem(item)">
              <v-icon size="x-large" v-bind="props">mdi-broadcast-off</v-icon>
            </v-btn>
          </template>
          <div class="text-center">Remove Remote Item</div>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
  <div class="text-right">
    <share-code-dialog />
  </div>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController';
import ShareCodeDialog from './shareCodeDialog.vue';

export default {
  name: 'cloud-item-remote-tab',
  components: { ShareCodeDialog },
  props: {
    search: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    tab: 'Data',
    codeSearch: '',
    diffLoading: false,
    diffDialog: false,
    deleteLoading: false,
    diffItem: {},
    localDiff: {},
    cloudDiff: {},
    dataHeaders: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'ItemType' },
      {
        title: 'Author',
        key: 'author',
        sortRaw: (a, b) => {
          if (a.SaveController.RemoteCollection) {
            return a.SaveController.RemoteCollection.author.localeCompare(
              b.SaveController.RemoteCollection.author
            );
          }
          return a.SaveController.RemoteAuthor.localeCompare(b.SaveController.RemoteAuthor);
        },
      },
      {
        title: 'Collection',
        key: 'collection',
        sortRaw: (a, b) =>
          (a.SaveController.RemoteCollection?.name || '').localeCompare(
            b.SaveController.RemoteCollection?.name || ''
          ),
      },
      {
        title: 'Latest Update',
        key: 'cloudLastModified',
        align: 'center',
        sortRaw: (a, b) =>
          a.CloudController.Metadata?.ItemModified - b.CloudController.Metadata?.ItemModified,
      },
      {
        title: 'Sync Status',
        key: 'syncStatus',
        align: 'center',
        sortRaw: (a, b) => {
          const order = ['Synced', 'LocalNewer', 'CloudNewer', 'LocalOnly', 'CloudOnly'];
          return (
            order.indexOf(a.CloudController.SyncStatus) -
            order.indexOf(b.CloudController.SyncStatus)
          );
        },
      },
      {
        title: 'Share Code',
        key: 'code',
        align: 'center',
        width: '175px',
        sortable: false,
      },
      { title: '', key: 'actions', width: '155px', align: 'end' },
    ],
    itemTypeFilter: ['pilot', 'npc', 'collectionItem', 'encounter'],
    syncableItemTypes: [
      { title: 'Pilot', value: 'pilot' },
      { title: 'NPC', value: 'npc' },
      { title: 'Narrative Element', value: 'collectionItem' },
      { title: 'Encounter', value: 'encounter' },
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    remoteItems() {
      console.log(UserStore().AllRemoteItems);
      return UserStore().AllRemoteItems;
    },
    shownItems() {
      const typeFilter = [...this.itemTypeFilter];
      if (typeFilter.includes('collectionItem'))
        typeFilter.push(...['character', 'location', 'faction']);
      if (typeFilter.includes('npc')) typeFilter.push(...['unit', 'doodad', 'eidolon']);

      return this.remoteItems.filter((item) => {
        if (typeFilter.length && !typeFilter.includes(item.ItemType.toLowerCase())) return false;
        // if (this.statusFilter.length && !this.statusFilter.includes(item.syncStatus)) return false;
        if (this.search && !item.Name.toLowerCase().includes(this.search.toLowerCase()))
          return false;
        return true;
      });
    },
  },
  created() {
    this.itemTypeFilter = UserStore().User.View('cloudItemFilters', [
      'pilot',
      'npc',
      'collectionItem',
      'encounter',
    ]);
  },
  watch: {
    itemTypeFilter(val) {
      if (!val) return;
      UserStore().User.SetView('cloudItemFilters', val);
    },
  },
  emits: ['refresh'],
  methods: {
    async sync(item) {
      try {
        await CloudController.UpdateRemote(item);
        this.$notify({
          title: `Sync Complete`,
          text: `${item.ItemType} ${item.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        });
      } catch (err) {
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync ${item.ItemType} ${item.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
    async removeItem(item) {
      item.SaveController.Delete();
      UserStore().deleteRemoteItem(item.SaveController.RemoteCode);
      this.$notify({
        title: `Item Removed`,
        text: `${item.ItemType} ${item.Name} removed from this device.`,
        data: { icon: 'mdi-delete', color: 'error' },
      });
    },
    copy(text: string) {
      navigator.clipboard.writeText(text);
      this.$notify({
        title: 'Copied',
        text: 'Share code copied to clipboard.',
        data: { icon: 'mdi-content-copy', color: 'success' },
      });
    },
  },
};
</script>

<style>
.v-data-table-header__content {
  font-weight: bold !important;
}
</style>
