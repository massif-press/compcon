<template>
  <div class="packsList" style="min-height: 300px">
    <div class="heading h2 stark--text mt-3 px-2">
      Official Massif LANCER Content
    </div>
    <directory-table :items="massifPacks" :loading="loading" no-author />
    <v-divider class="my-6" />
    <div class="heading h2 stark--text mt-3 px-2">
      LANCER Community Content
      <v-menu bottom open-on-hover>
        <template v-slot:activator="{ on }">
          <v-icon class="fadeSelect" v-on="on">mdi-information-outline</v-icon>
        </template>
        <v-card max-width="500px">
          <v-card-title> LANCER Community Content Packs </v-card-title>
          <v-card-text>
            <span v-if="communityPacks.length">
              COMP/CON is proud to collborate with the LANCER community in
              making these unofficial content packs available. They are offered
              as-is at the discretion of the author.
            </span>
            <br />
            If you are interested in creating your own homebrew LANCER content,
            or submitting your content to be featured in this directory, please
            <a
              href="https://github.com/massif-press/lancer-data#lancer-community-content-packs"
              target="_blank"
            >
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
import Vue from "vue";
import Component from "vue-class-component";
import DirectoryTable from "./components/DirectoryTable.vue";
import { scan } from "./api";

@Component({
  components: { DirectoryTable },
})
export default class PacksDirectory extends Vue {
  private massifPacks = [];
  private communityPacks = [];
  private loading = true;

  async mounted(): Promise<void> {
    scan()
      .then((res: any) => {
        console.log(res);
        this.communityPacks = res.data.community.Items;
        this.massifPacks = res.data.massif.Items;
        this.loading = false;
      })
      .catch((err) => {
        console.error(
          "There was an issue downloading the community content packs.",
          err
        );
        this.loading = false;
      });
  }
}
</script>
