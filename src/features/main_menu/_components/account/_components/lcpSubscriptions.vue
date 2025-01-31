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
              Paid LCP content requires a linked itch.io purchase before they can be automatically
              updated. At this time, only Massif-published LCPs are supported.
            </v-tooltip>
          </span>
        </div>
      </v-toolbar-title>
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
    <massif-lcp-table />
  </v-card>
</template>

<script lang="ts">
import { CompendiumStore, UserStore } from '@/stores';
import { collectionDataQuery } from '@/user/api';
import MassifLcpTable from '../../MassifLcpTable.vue';

export default {
  name: 'lcp-subscriptions',
  components: { MassifLcpTable },
  data: () => ({
    lcpHeaders: [
      { title: 'LCP', key: 'title' },
      { title: 'Author', key: 'author' },
      { title: 'Latest Version', key: 'remote_version', align: 'center', sortable: false },
      { title: 'Installed Version', key: 'local_version', align: 'center', sortable: false },
      { title: 'Auto Update', key: 'auto', align: 'center', sortable: false },
      { title: '', key: 'actions', align: 'end', sortable: false },
    ],
    packs: [] as any[],
    loading: true,
  }),
  async mounted() {
    await this.refresh();
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    contentPacks() {
      return CompendiumStore().ContentPacks;
    },
    lcpSubscriptions() {
      return UserStore().User.LcpSubscriptions;
    },
    installedPacks() {
      return CompendiumStore().ContentPacks;
    },
    user() {
      return UserStore().User;
    },
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.packs = await collectionDataQuery('lcp');

      this.loading = false;
    },
    packDataItem(save) {
      return this.contentPacks.find((pack) => pack.ID === save.packId);
    },
    getInstalledPack(pack) {
      return this.contentPacks.find(
        (p) => p.Manifest.name === pack.name || p.Manifest.name === pack.title
      );
    },
    canDownload(pack) {
      return !pack.paid
        ? true
        : this.user.Itch.gamedata.some((purchase) => purchase.game_id === pack.game_id);
    },
    hasSubscription(pack) {
      return this.lcpSubscriptions.includes(pack.sortkey);
    },
    async toggleSubscription(pack) {
      if (this.hasSubscription(pack)) {
        this.lcpSubscriptions.splice(this.lcpSubscriptions.indexOf(pack.sortkey), 1);
        this.user.save();
      } else {
        this.lcpSubscriptions.push(pack.sortkey);
        this.user.save();
        if (
          !this.getInstalledPack(pack) ||
          this.getInstalledPack(pack)?.Manifest.version !== pack.version
        ) {
          await this.installLatest(pack);
        }
      }
    },
    async installLatest(pack) {
      this.loading = true;
      try {
        await UserStore().downloadLcp(pack);
        this.$notify({
          title: 'LCP Updated',
          text: `The latest version of ${pack.title} has been downloaded and installed.`,
          data: { color: 'success', icon: 'mdi-check-bold' },
        });
      } catch (err) {
        console.error(err);
        this.$notify({
          title: 'Error Updating LCP',
          text: `An error occurred while attempting to download ${pack.title}.`,
          data: { color: 'error', icon: 'mdi-alert-circle-outline' },
        });
      } finally {
        this.loading = false;
      }
    },
    async updateAll() {
      this.loading = true;
      for (const pack of this.packs) {
        if (this.hasSubscription(pack)) {
          if (
            !this.getInstalledPack(pack) ||
            this.getInstalledPack(pack)?.Manifest.version !== pack.version
          )
            await this.installLatest(pack);
        }
      }
      this.loading = false;
    },
  },
};
</script>
