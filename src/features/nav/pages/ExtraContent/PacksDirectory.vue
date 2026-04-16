<template>
  <v-card-text :style="mobile ? 'margin-top: 14px' : 'margin-top: 16px'">
    <div class="packsList"
      style="min-height: 300px">
      <div class="heading h2 text-stark mt-3 px-2">
        Official
        <a href="https://massifpress.com/shop"
          target="_blank">MASSIF PRESS</a>
        Content
      </div>
      <massif-lcp-table :packs="massifPacks"
        :loading="loading" />
      <v-divider class="my-6" />
      <div class="heading h2 text-stark mt-3 px-2">
        LANCER Community Content
        <cc-dialog title="LANCER Community Content Packs">
          <template #activator="{ open }">
            <v-icon size="x-small"
              class="mt-n1 fade-select"
              @click="open()">
              mdi-information-slab-box-outline
            </v-icon>
          </template>
          <v-card-text>
            COMP/CON is proud to collaborate with the LANCER community in making these unofficial
            content packs available. They are offered as-is at the discretion of the author.
            <br />
            If you are interested in creating your own homebrew LANCER content, or submitting your
            content to be featured in this directory, please
            <a href="https://github.com/massif-press/lancer-data#lancer-community-content-packs"
              target="_blank">
              click here.
            </a>
          </v-card-text>
        </cc-dialog>
      </div>
      <cc-alert>
        In-app downloading and automatic subscription to community LCP updates are not yet
        supported. Once
        the author support tools are available, community LCPs will be migrated to v3 and will be
        able to
        take advantage of the same update and subscription mechanisms as official Massif Press
        content
        packs. Follow the <a href="https://www.patreon.com/compcon"
          target="blank">development blog</a> to
        stay up to date on progress.
      </cc-alert>
    </div>
    <community-table :packs="communityPacks"
      :loading="loading" />
  </v-card-text>
</template>

<script lang="ts">
import CommunityTable from './components/CommunityTable.vue';
import MassifLcpTable from '@/features/main_menu/_components/MassifLcpTable.vue';
import { useMobile } from '@/mixins/useMobile';
import { collectionDataQuery } from '@/user/api';


export default {
  name: 'PacksDirectory',
  components: {
    CommunityTable,
    MassifLcpTable,
  },
  mixins: [useMobile],
  data: () => ({
    catalog: [] as any[],
    loading: true,
  }),
  computed: {
    massifPacks() {
      return this.catalog
        .filter(x => x.sortkey.includes('massif'))
        .sort((a, b) => a.collection.localeCompare(b.collection));
    },
    communityPacks() {
      return this.catalog
        .filter(x => !x.sortkey.includes('massif'))
        .sort((a, b) => a.author.localeCompare(b.author));
    },
  },
  async mounted() {
    try {
      this.catalog = await collectionDataQuery();
    } catch {
      // API unreachable
    } finally {
      this.loading = false;
    }
  },
};
</script>
