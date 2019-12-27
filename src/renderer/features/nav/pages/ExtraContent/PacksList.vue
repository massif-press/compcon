<template>
  <div class="packsList">
    <h3 class="mb-2 title">Packs currently installed</h3>
    <v-card>
      <v-data-table :headers="headers" :items="contentPacks" show-expand>
        <!-- Name -->
        <template v-slot:item.name="{ item }">
          <span class="primary--text title">
            {{ item.manifest.name }}
          </span>
        </template>
        <!-- Version -->
        <template v-slot:item.version="{ item }">
          <span class="packVersion">
            {{ item.manifest.version }}
          </span>
        </template>
        <!-- Delete action -->
        <template v-slot:item.action="{ item }">
          <v-btn icon color="primary" @click="deletePack(item.id)">
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </template>
        <!-- Expanded view -->
        <template v-slot:expanded-item="{ item, headers }">
          <td :colspan="headers.length" class="py-4 px-6 w-100">
            <span v-if="item.manifest.description">
              {{ item.manifest.description }}
            </span>
            <span v-else class="font-italic grey--text text--darken-1">
              No description.
            </span>
            <div v-if="item.manifest.website" class="flex mt-1">
              <v-btn
                class="d-block"
                text
                small
                color="secondary"
                :href="item.manifest.website"
                @click="visitWebsite(item.manifest.website)"
              >
                <v-icon prepend>open_in_new</v-icon>
                &nbsp;Website
              </v-btn>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/features/_shared/store'
import { IContentPackInfo } from '@/io/ExtraContent'

import { Plugins } from '@capacitor/core'
const { Browser } = Plugins

@Component
export default class PacksList extends Vue {

  private compendiumStore = getModule(CompendiumStore)

  public async deletePack(id: string): Promise<void> {
    return await this.compendiumStore.deleteContentPack(id)
  }

  public get contentPacks(): IContentPackInfo[] {
    return this.compendiumStore.ContentPacks
  }
  public headers = [
    { text: 'Name', value: 'name' },
    { text: 'Author', value: 'manifest.author' },
    { text: 'Version', value: 'version' },
    { text: '', value: 'action', sortable: false }
  ]

  public visitWebsite(url) {
    Browser.open({
      url: url
    })
  }


}
</script>

<style scoped>
.packsList >>> .packVersion {
  font-family: 'Roboto Mono', monospace;
}
.packsList >>> .v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none;
}
</style>