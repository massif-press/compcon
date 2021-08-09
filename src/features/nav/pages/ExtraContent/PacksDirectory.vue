<template>
  <div class="packsList" style="min-height: 300px;">
    <div class="heading h2 stark--text mt-3 px-2">Official Massif LANCER Content</div>
    <directory-table :items="massifPacks" :loading="massifLoading" no-author />
    <v-divider class="my-6" />
    <div class="heading h2 stark--text mt-3 px-2">
      LANCER Community Content
      <v-menu bottom open-on-hover>
        <template v-slot:activator="{ on }">
          <v-icon class="fadeSelect" v-on="on">mdi-information-outline</v-icon>
        </template>
        <v-card max-width="500px">
          <v-card-title>
            LANCER Community Content Packs
          </v-card-title>
          <v-card-text>
            <span v-if="communityPacks.length">
              COMP/CON is proud to collborate with the LANCER community in making these unofficial
              content packs available. They are offered as-is at the discretion of the author.
            </span>
            <br />
            If you are interested in creating your own homebrew LANCER content, or submitting your
            content to be featured in this directory, please
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
    <directory-table :items="communityPacks" :loading="communityLoading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import DirectoryTable from './components/DirectoryTable.vue'

@Component({
  components: { DirectoryTable },
})
export default class PacksDirectory extends Vue {
  private massifPacksUrl = 'https://compcon-text-assets.s3.amazonaws.com/massifpacks.json'
  private communityPacksUrl = 'https://compcon-text-assets.s3.amazonaws.com/communitypacks.json'
  private massifPacks = []
  private massifLoading = true
  private communityPacks = []
  private communityLoading = true

  mounted(): void {
    fetch(this.massifPacksUrl, {
      method: 'GET',
      mode: 'cors',
    })
      .then(res => res.json())
      .then(list => (this.massifPacks = list))
      .catch(err => {
        console.error('There was an issue downloading the Massif content packs.', err)
      })
      .finally(() => (this.massifLoading = false))

    fetch(this.communityPacksUrl, {
      method: 'GET',
      mode: 'cors',
    })
      .then(res => res.json())
      .then(list => (this.communityPacks = list))
      .catch(err => {
        console.error('There was an issue downloading the community content packs.', err)
      })
      .finally(() => (this.communityLoading = false))
  }
}
</script>
