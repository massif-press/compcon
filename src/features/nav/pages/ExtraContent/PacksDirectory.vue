<template>
  <div class="packsList" style="min-height: 300px">
    <div class="heading h2 text-stark mt-3 px-2">Official MASSIF LANCER Content</div>
    <massif-lcp-table :headers="massifHeaders" />
    <v-divider class="my-6" />
    <div class="heading h2 text-stark mt-3 px-2">
      LANCER Community Content
      <v-menu bottom open-on-hover>
        <template #activator="{ props }">
          <v-icon variant="plain" v-bind="props">mdi-information-outline</v-icon>
        </template>
        <v-card max-width="500px">
          <v-card-title>LANCER Community Content Packs</v-card-title>
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
              click here
            </a>
            .
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
    <directory-table :items="communityPacks" :loading="loading" />
  </div>
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
    massifHeaders: [
      { title: '', key: 'data-table-expand', width: '0' },
      { title: 'LCP', key: 'title' },
      { title: 'Collection', key: 'collection' },
      { title: 'Installed Version', key: 'local_version', align: 'center', sortable: false },
      { title: '', key: 'actions', align: 'end', sortable: false },
    ],
  }),
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
