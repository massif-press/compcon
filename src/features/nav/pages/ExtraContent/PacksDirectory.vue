<template>
  <v-card-text :style="mobile ? 'margin-top: 14px' : 'margin-top: 16px'">
    <div class="packsList" style="min-height: 300px">
      <div class="heading h2 text-stark mt-3 px-2">
        Official
        <a href="https://massifpress.com/shop" target="_blank">MASSIF PRESS</a>
        Content
      </div>
      <massif-lcp-table :headers="massifHeaders" />
      <v-divider class="my-6" />
      <div class="heading h2 text-stark mt-3 px-2">
        LANCER Community Content
        <cc-dialog title="LANCER Community Content Packs">
          <template #activator="{ open }">
            <v-icon size="x-small" class="mt-n1 fade-select" @click="open">
              mdi-information-slab-box-outline
            </v-icon>
          </template>
          <v-card-text>
            <span v-if="communityPacks.length">
              COMP/CON is proud to collaborate with the LANCER community in making these unofficial
              content packs available. They are offered as-is at the discretion of the author.
            </span>
            <br />
            If you are interested in creating your own homebrew LANCER content, or submitting your
            content to be featured in this directory, please
            <a
              href="https://github.com/massif-press/lancer-data#lancer-community-content-packs"
              target="_blank">
              click here.
            </a>
          </v-card-text>
        </cc-dialog>
      </div>
      <directory-table :items="communityPacks" :loading="loading" />
    </div>
  </v-card-text>
</template>

<script lang="ts">
import DirectoryTable from './components/DirectoryTable.vue';
import { scan } from './api';
import MassifLcpTable from '@/features/main_menu/_components/MassifLcpTable.vue';

export default {
  name: 'PacksDirectory',
  components: {
    DirectoryTable,
    MassifLcpTable,
  },
  data: () => ({
    communityPacks: [],
    loading: true,
    _massifHeaders: [
      { title: '', key: 'data-table-expand', width: '0' },
      { title: 'LCP', key: 'title' },
      { title: 'Collection', key: 'collection' },
      { title: 'Installed Version', key: 'local_version', align: 'center', sortable: false },
      { title: '', key: 'actions', align: 'end', sortable: false },
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    massifHeaders() {
      return this.mobile ? this._massifHeaders.slice(1) : this._massifHeaders;
    },
  },
  async created(): Promise<void> {
    scan()
      .then((res: any) => {
        console.log(res);
        this.communityPacks = res.data.community.Items;
        this.loading = false;
      })
      .catch((err) => {
        console.error('There was an issue downloading the community content packs.', err);
        this.loading = false;
      });
  },
};
</script>
