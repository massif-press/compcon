<template>
  <div>
    <div v-if="contentPacks.length === 0">
      <v-alert type="info" variant="outlined"> No content packs installed.</v-alert>
    </div>
    <v-table v-else>
      <thead>
        <tr class="text-overline">
          <th style="width: 0" />
          <th style="width: 0">Active</th>
          <th class="text-center">Name</th>
          <th class="text-center">Author</th>
          <th class="text-center">Version</th>
          <th style="width: 0" />
        </tr>
      </thead>
      <tbody v-for="(pack, i) in contentPacks">
        <tr>
          <td>
            <v-btn
              icon
              variant="plain"
              @click="expandedRows.includes(i) ? expandedRows.splice(i, 1) : expandedRows.push(i)"
            >
              <v-icon :icon="expandedRows.includes(i) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </v-btn>
          </td>
          <td class="text-center">
            <v-switch
              v-if="!pack.Missing"
              :model-value="pack.Active"
              color="accent"
              inset
              hide-details
              @change="toggleActive(pack.ID)"
            />
            <v-tooltip v-else location="top" max-width="400px">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" color="error" icon="mdi-alert" />
              </template>
              This pack is missing one or more dependencies and cannot be activated.
            </v-tooltip>
          </td>
          <td class="text-center" :style="pack.Missing ? 'opacity: 0.4' : ''">
            {{ pack.Name }}
          </td>
          <td class="text-center" :style="pack.Missing ? 'opacity: 0.4' : ''">
            {{ pack.Author }}
          </td>
          <td class="text-center" :style="pack.Missing ? 'opacity: 0.4' : ''">
            {{ pack.Version }}
          </td>
          <td>
            <v-menu width="400px">
              <template #activator="{ props }">
                <v-btn icon color="error" variant="plain" v-bind="props">
                  <v-icon icon="mdi-delete" />
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  This will remove this pack and all of its contents from COMP/CON. User data that
                  relies on this content will be unavailable and may cause errors. Are you sure you
                  want to continue?
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn size="small">CANCEL</v-btn>
                  <v-btn size="small" color="error" class="ml-auto" @click="deletePack(pack.ID)">
                    CONFIRM
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </td>
        </tr>
        <tr class="bg-light-panel">
          <td colspan="6" style="height: 0">
            <v-expand-transition>
              <div v-show="expandedRows.includes(i)">
                <pack-info-card :pack="(pack as ContentPack)" />
              </div>
            </v-expand-transition>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script lang="ts">
import { ContentPack } from '@/class';
import PackInfoCard from './components/PackInfoCard.vue';
import { CompendiumStore } from '@/stores';

export default {
  name: 'PacksList',
  components: { PackInfoCard },
  data: () => ({
    expandedRows: [] as number[],
    headers: [
      { title: 'Active', value: 'toggleActive', sortable: false },
      { title: 'Name', value: 'Name' },
      { title: 'Author', value: 'Author' },
      { title: 'Version', value: 'Version' },
      { title: '', value: 'deleteAction', sortable: false },
    ],
  }),
  computed: {
    contentPacks() {
      return CompendiumStore().ContentPacks;
    },
  },
  methods: {
    async toggleActive(packID: string): Promise<void> {
      await CompendiumStore().togglePackActive(packID);
      await this.reload();
    },
    async deletePack(id: string): Promise<void> {
      await CompendiumStore().deleteContentPack(id);
      await this.reload();
    },
    async reload() {
      // this.$emit('start-load');
      // const pilotStore =PilotStore();
      // const npcStore =NpcStore();
      // const missing = { pilots: [], npcs: [] };
      // await pilotStore.loadPilots();
      // missing.pilots = pilotStore.MissingPilots;
      // await npcStore.loadNpcs();
      // missing.npcs = npcStore.MissingNpcs;
      // await CompendiumStore().setMissingContent(missing);
      // this.$emit('end-load');
    },
  },
};
</script>
