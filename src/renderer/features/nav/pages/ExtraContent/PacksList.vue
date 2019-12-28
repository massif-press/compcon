<template>
  <div class="packsList" style="height: 600px;">
    <v-data-table
      hide-default-footer
      no-data-text="No content packs installed."
      :headers="headers"
      :items="contentPacks"
      show-expand
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
        <span class="title" :class="item.Active ? 'primary--text' : 'grey--text font-italic'">
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
        <v-btn icon color="primary" @click="deletePack(item.ID)">
          <v-icon>
            delete
          </v-icon>
        </v-btn>
      </template>
      <!-- Expanded view -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="py-4 px-6 w-100">
          <div class="d-flex">
            <div style="display: flex; flex-direction: column;">
              <span v-if="item.Description">
                {{ item.Description }}
              </span>
              <span v-else class="font-italic grey--text text--darken-1">
                No description.
              </span>
              <div v-if="item.Website" class="mt-auto" style="flex-grow: 0;">
                <v-btn v-extlink="item.Website" text small color="secondary" :href="item.Website">
                  <v-icon prepend>open_in_new</v-icon>
                  &nbsp;Website
                </v-btn>
              </div>
            </div>
            <div style="margin-left: 1em; max-width: 40%; min-width: 25%;">
              <img v-if="item.ImageURL" style="max-width: 100%" :src="item.ImageURL" />
            </div>
          </div>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/features/_shared/store'

import { ContentPack } from '@/class'

@Component
export default class PacksList extends Vue {

  private compendiumStore = getModule(CompendiumStore, this.$store)

  public async toggleActive(packID: string, active: boolean): Promise<void> {
    console.log(packID, active)
    await this.compendiumStore.setPackActive({
      packID, active
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
    { text: '', value: 'deleteAction', sortable: false }
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