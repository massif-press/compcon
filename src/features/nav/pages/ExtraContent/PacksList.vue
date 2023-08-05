<template>
  <div class="packsList">
    <v-data-table
      hide-default-footer
      disable-pagination
      no-data-text="No content packs installed."
      :headers="headers"
      :items="contentPacks"
      show-expand
      item-key="Key"
    >
      <!-- Active toggle -->
      <template v-slot:[`item.toggleActive`]="{ item }">
        <v-switch
          v-if="!item.Missing"
          :input-value="item.Active"
          color="primary"
          @change="toggleActive(item.ID, $event)"
        />
        <cc-tooltip
          v-else
          location="top"
          inline
          content="This pack is missing one or more dependencies and cannot be activated."
        >
          <v-icon color="error" v-text="'mdi-alert'" />
        </cc-tooltip>
      </template>
      <!-- Name -->
      <template v-slot:[`item.Name`]="{ item }">
        <span
          class="heading h3"
          :class="item.Active ? 'accent--text' : 'subtle--text font-italic'"
          :style="item.Missing ? 'opacity: 0.4' : ''"
        >
          {{ item.Name }}
        </span>
      </template>
      <!-- Version -->
      <template v-slot:[`item.Version`]="{ item }">
        <span class="packVersion" :style="item.Missing ? 'opacity: 0.4' : ''">
          {{ item.Version }}
        </span>
      </template>
      <!-- Delete action -->
      <template v-slot:[`item.deleteAction`]="{ item }">
        <v-menu offset-y offset-x top nudge-left="30px">
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="fadeSelect" v-on="on">
              <v-icon>delete</v-icon>
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
          <pack-info-card :pack="item" />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore, NpcStore } from '@/store'
import PackInfoCard from './components/PackInfoCard.vue'

import { ContentPack } from '@/class'

@Component({
  components: { PackInfoCard },
})
export default class PacksList extends Vue {
  private expanded
  private compendiumStore = getModule(CompendiumStore, this.$store)

  public async toggleActive(packID: string, active: boolean): Promise<void> {
    await this.compendiumStore.setPackActive({
      packID,
      active,
    })
    await this.reload()
  }

  public async deletePack(id: string): Promise<void> {
    await this.compendiumStore.deleteContentPack(id)
    await this.reload()
  }

  public get contentPacks(): ContentPack[] {
    return this.compendiumStore.ContentPacks
  }

  public async reload() {
    this.$emit('start-load')
    const pilotStore = getModule(PilotManagementStore, this.$store)
    const npcStore = getModule(NpcStore, this.$store)
    const missing = { pilots: [], npcs: [] }
    await pilotStore.loadPilots()
    missing.pilots = pilotStore.MissingPilots
    await npcStore.loadNpcs()
    missing.npcs = npcStore.MissingNpcs
    await this.compendiumStore.setMissingContent(missing)
    this.$emit('end-load')
  }

  public headers = [
    { text: 'Active', value: 'toggleActive', sortable: false },
    { text: 'Name', value: 'Name' },
    { text: 'Author', value: 'Author' },
    { text: 'Version', value: 'Version' },
    { text: '', value: 'deleteAction', sortable: false },
  ]
}
</script>

<style scoped>
.packsList >>> .v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none;
}
</style>
