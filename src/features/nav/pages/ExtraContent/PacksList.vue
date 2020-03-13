<template>
  <div class="packsList" style="min-height: 300px;">
    <v-data-table
      hide-default-footer
      disable-pagination
      no-data-text="No content packs installed."
      :headers="headers"
      :items="contentPacks"
      show-expand
      :expanded.sync="expanded"
      item-key="Name"
    >
      <!-- Active toggle -->
      <template v-slot:item.toggleActive="{ item }">
        <v-switch
          :input-value="item.Active"
          color="primary"
          @change="toggleActive(item.ID, $event)"
        />
      </template>
      <!-- Name -->
      <template v-slot:item.name="{ item }">
        <span class="title" :class="item.Active ? 'accent--text' : 'subtle--text font-italic'">
          {{ item.Name }}
        </span>
      </template>
      <!-- Version -->
      <template v-slot:item.version="{ item }">
        <span class="packVersion">
          {{ item.Version }}
        </span>
      </template>
      <!-- Delete action -->
      <template v-slot:item.deleteAction="{ item }">
        <v-menu offset-y offset-x top nudge-left="30px">
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="fadeSelect" v-on="on">
              <v-icon>
                delete
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="text-center body-text">
              <p>
                This will remove this pack and all of its contents from COMP/CON. User data that
                relies on this content will be unavailable and may cause errors. Are you sure you
                want to continue?
              </p>
              <v-divider class="my-2" />
              <v-row dense>
                <v-btn small text>CANCEL</v-btn>
                <v-btn small color="error" class="ml-auto" @click="deletePack(item.ID)">
                  CONFIRM
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <!-- Expanded view -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="py-4 px-6 w-100 light-panel">
          <v-row>
            <v-col>
              <p class="body-text text--text pa-2 mb-1">
                <span v-if="item.Description">
                  {{ item.Description }}
                </span>
                <span v-else>
                  No description given.
                </span>
              </p>

              <div v-if="item.Website" class="mt-2">
                <v-divider class="ma-1" />
                <v-btn v-extlink="item.Website" :href="item.Website" text color="secondary">
                  <v-icon prepend class="mr-1">open_in_new</v-icon>
                  &nbsp;Website
                </v-btn>
              </div>
            </v-col>
            <v-col cols="2">
              <v-img :src="item.ImageURL" alt="Pack image" />
            </v-col>
          </v-row>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

import { ContentPack } from '@/class'

@Component
export default class PacksList extends Vue {
  private expanded
  private compendiumStore = getModule(CompendiumStore, this.$store)

  public async toggleActive(packID: string, active: boolean): Promise<void> {
    await this.compendiumStore.setPackActive({
      packID,
      active,
    })
  }

  public async deletePack(id: string): Promise<void> {
    return await this.compendiumStore.deleteContentPack(id)
  }

  public get contentPacks(): ContentPack[] {
    return this.compendiumStore.ContentPacks
  }
  public headers = [
    { text: 'Active', value: 'toggleActive', sortable: false },
    { text: 'Name', value: 'name' },
    { text: 'Author', value: 'Author' },
    { text: 'Version', value: 'version' },
    { text: '', value: 'deleteAction', sortable: false },
  ]
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
