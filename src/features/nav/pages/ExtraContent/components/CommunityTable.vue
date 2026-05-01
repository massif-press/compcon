<template>
  <v-data-table v-model:expanded="expanded"
    density="compact"
    :no-data-text="ct.noData"
    :mobile="mobile"
    :headers="<any>tableHeaders"
    :items="packs"
    :loading="loading"
    item-key="name"
    :show-expand="mobile"
    item-value="name"
    :items-per-page="-1"
    hide-default-footer>
    <template #item.remote_version="{ item }">
      {{ item.version || 'Unknown' }}
    </template>
    <!-- v3 -->
    <template #item.v3="{ item }">
      <v-tooltip v-if="item.v3"
        max-width="300px">
        <template #activator="{ props }">
          <v-icon v-bind="props"
            color="success">mdi-check</v-icon>
        </template>
        {{ ct.v3Compatible }}
      </v-tooltip>
      <v-tooltip v-else
        max-width="300px">
        <template #activator="{ props }">
          <v-icon v-bind="props"
            color="error">mdi-cancel</v-icon>
        </template>
        {{ ct.v3Incompatible }}
      </v-tooltip>
    </template>
    <template #item.local_version="{ item }">
      <span v-if="getInstalledPack(item)">
        {{ getInstalledPack(item)?.Manifest.version }}
        <v-icon v-if="item.version === getInstalledPack(item)?.Manifest.version"
          color="success">
          mdi-check-bold
        </v-icon>
        <v-icon v-else
          color="error"
          icon="mdi-clock-alert-outline" />
      </span>
      <i v-else
        class="text-disabled">{{ ct.notInstalled }}</i>
    </template>
    <template #item.auto="{ item }">
      <v-row v-if="canDownload(item) && getInstalledPack(item)"
        no-gutters
        :justify="mobile ? 'end' : 'center'">
        <v-tooltip max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              icon
              variant="text"
              size="small"
              @click="toggleSubscription(item)">
              <v-icon v-if="hasSubscription(item)"
                size="x-large"
                icon="mdi-checkbox-marked"
                color="accent" />
              <v-icon v-else
                size="x-large"
                class="fade-select"
                icon="mdi-checkbox-blank-outline" />
            </v-btn>
          </template>
          <div v-if="hasSubscription(item)"
            class="text-center">
            {{ ct.subscribedTooltip }}
          </div>
          <div v-else
            class="text-center">
            {{ ct.subscribeTooltip }}
          </div>
        </v-tooltip>
      </v-row>
    </template>
    <template #item.actions="{ item }">
      <!-- <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <v-btn v-if="canDownload(item)"
            icon
            variant="text"
            size="small"
            color="accent"
            :disabled="isLatest(item)"
            :loading="downloadingPacks.includes(item.sortkey)"
            v-bind="props"
            @click="installLatest(item)">
            <v-icon size="large"
              icon="mdi-download" />
          </v-btn>
          <v-icon v-else
            v-bind="props"
            class="fade-select mr-2"
            icon="mdi-cancel" />
        </template>
<div v-if="canDownload(item)" class="text-center">Download and install latest version</div>
<div v-else-if="!loggedIn" class="text-center">
  Direct download requires a COMP/CON account
</div>
<div v-else class="text-center">Requires linked itch.io purchase</div>
</v-tooltip> -->
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <v-btn icon
            variant="text"
            size="small"
            color="accent"
            v-bind="props"
            target="_blank"
            :href="item.website || ''">
            <v-icon size="large"
              icon="mdi-open-in-new" />
          </v-btn>
        </template>
        <div class="text-center">{{ ct.openWebsite }}</div>
      </v-tooltip>
    </template>
    <template #expanded-row="{ columns, item }">
      <td :colspan="columns.length"
        class="pa-4 w-100 bg-light-panel">
        <v-row>
          <v-col>
            <v-card-text>
              <v-row>
                <v-col cols="auto">
                  <v-chip label
                    variant="outlined"
                    tile
                    size="small">
                    <span v-if="item.paid">{{ item.cost }}</span>
                    <span v-else-if="item.pwyw">{{ ct.payWhatYouWant }}</span>
                    <span v-else>{{ ct.free }}</span>
                  </v-chip>
                </v-col>
                <v-col cols="auto"
                  class="heading h3">{{ item.title }}</v-col>
                <v-spacer />
                <v-col cols="auto">
                  <cc-chip icon="cc:campaign"
                    :label="item.collection" />
                </v-col>
              </v-row>
              <div class="text-caption mt-n3">
                {{ item.author }}
                <cc-slashes />
                {{ item.publisher }}
                <cc-slashes />
                {{
                  new Date(item.published * 1000).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }}
              </div>
              <div class="my-1">
                {{ ct.currentVersion }}
                <b>v{{ item.version }}</b>
                <span class="text-caption">
                  ({{ new Date(item.updated * 1000).toLocaleDateString() }})
                </span>
              </div>
              <div v-if="(item as any).description"
                v-html-safe="(item as any).description" />
              <div v-else>No description given.</div>
            </v-card-text>

            <v-divider class="ma-1" />
            <cc-button target="_blank"
              :href="item.website"
              flat
              size="small"
              class="ma-1"
              color="itch">
              <v-icon prepend
                start>mdi-open-in-new</v-icon>
              {{ ct.itchStorePage }}
            </cc-button>
            <cc-button target="_blank"
              :href="item.website"
              flat
              size="small"
              class="ma-1"
              color="primary">
              <v-icon prepend
                start>mdi-open-in-new</v-icon>
              {{ ct.authorsWebsite }}
            </cc-button>
          </v-col>
          <v-col v-if="(item as any).img && !mobile"
            cols="2">
            <cc-img :src="(item as any).img"
              alt="Pack image" />
          </v-col>
        </v-row>
      </td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { CompendiumStore, UserStore } from '@/stores';
import logger from '@/user/logger';
import { useMobile } from '@/mixins/useMobile';
import { NAV_STRINGS } from '@/features/nav/strings';


export default {
  name: 'CommunityTable',
  mixins: [useMobile],
  setup() {
    return { ct: NAV_STRINGS.communityTable }
  },
  props: {
    packs: { type: Array, default: () => [] },
    loading: { type: Boolean, default: true },
  },
  data: () => ({
    lcpHeaders: [
      { title: '', key: 'data-table-expand', width: '0' },
      { title: 'LCP', key: 'title' },
      { title: 'Author', key: 'author' },
      { title: 'v3', value: 'v3' },
      { title: 'Latest Version', key: 'remote_version', align: 'center', sortable: false },
      { title: 'Installed Version', key: 'local_version', align: 'center', sortable: false },
      { title: '', key: 'actions', align: 'end', sortable: false, width: '120px' },
    ],
    expanded: [],
    downloadingPacks: [] as string[],
  }),
  computed: {
    tableHeaders() {
      return this.mobile ? this.lcpHeaders.slice(1) : this.lcpHeaders;
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
    loggedIn() {
      return UserStore().IsLoggedIn;
    },
  },
  methods: {
    packDataItem(save) {
      return this.contentPacks.find((pack) => pack.ID === save.packId);
    },
    getInstalledPack(pack) {
      return this.contentPacks.find(({ Manifest }) =>
        [pack.name, pack.title].some((p) => Manifest.name?.toLowerCase().includes(p?.toLowerCase()))
      );
    },
    canDownload(pack) {
      if (!this.loggedIn) return false;
      if (!pack.paid) return true;
      if (!this.user.Itch || !this.user.Itch.gamedata?.length) return false;

      return this.user.Itch.gamedata.some((purchase) => purchase.game_id === pack.game_id);
    },
    isLatest(pack) {
      const installed = this.getInstalledPack(pack);
      return !!installed && installed.Manifest.version === pack.version;
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
      if (this.isLatest(pack) || this.downloadingPacks.includes(pack.sortkey)) return;
      this.downloadingPacks.push(pack.sortkey);
      try {
        await UserStore().downloadLcp(pack);
        this.$notify({
          title: 'LCP Updated',
          text: `The latest version of ${pack.title} has been downloaded and installed.`,
          data: { color: 'success', icon: 'mdi-check-bold' },
        });
      } catch (err) {
        logger.error(`Error downloading LCP: ${err}`, this, err);
        this.$notify({
          title: 'Error Updating LCP',
          text: `An error occurred while attempting to download ${pack.title}.`,
          data: { color: 'error', icon: 'mdi-alert-circle-outline' },
        });
      } finally {
        this.downloadingPacks = this.downloadingPacks.filter((k) => k !== pack.sortkey);
      }
    },
  },
};
</script>
