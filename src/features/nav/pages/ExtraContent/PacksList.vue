<template>
  <div v-if="contentPacks.length === 0">
    <cc-alert color="primary">No content packs installed.</cc-alert>
  </div>
  <div v-else>
    <v-data-table
      v-model:expanded="expandedRows"
      :headers="headers"
      :items="contentPacks"
      item-value="Key"
      :items-per-page="-1"
      hide-default-footer
      density="compact"
      :show-expand="mobile"
      :mobile="$vuetify.display.xs">
      <template #item.toggleActive="{ item }">
        <cc-switch
          v-if="!item.Missing"
          :value="item.Active"
          size="large"
          @update:model-value="toggleActive(item.ID, item.Active)" />
        <cc-tooltip v-else icon="mdi-alert">
          This pack is missing one or more dependencies and cannot be activated.
        </cc-tooltip>
      </template>
      <template v-slot:item.v3="{ item }">
        <v-tooltip v-if="item.v3">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="success">mdi-check</v-icon>
          </template>
          This content pack is compatible with the latest version of COMP/CON and supports v3
          features.
        </v-tooltip>
        <v-tooltip v-else max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="error">mdi-cancel</v-icon>
          </template>
          This content pack uses the v2 content format. It will function correctly but will lack
          features of v3-compatible packs. COMP/CON will not be able to manage effects or statuses
          from this pack in Active Mode.
        </v-tooltip>
      </template>
      <template #item.deleteAction="{ item }">
        <v-menu width="400px">
          <template #activator="{ props }">
            <v-btn icon color="error" variant="plain" v-bind="props">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              This will remove this pack and all of its contents from COMP/CON. User data that
              relies on this content will remain available. Are you sure you want to continue?
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn size="small">CANCEL</v-btn>
              <v-btn size="small" color="error" class="ml-auto" @click="deletePack(item.ID)">
                CONFIRM
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr class="bg-panel">
          <td :colspan="columns.length">
            <pack-info-card :pack="<ContentPack>item" />
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-end mt-2">
      <cc-button :loading="loading" size="small" color="error" @click="deleteAll">
        Delete All
      </cc-button>
    </div>
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
    expandedRows: [] as any[],
    _headers: [
      { title: '', key: 'data-table-expand' },
      { title: 'Active', value: 'toggleActive', sortable: false },
      { title: 'Name', value: 'Name' },
      { title: 'Author', value: 'Author' },
      { title: 'Version', value: 'Version' },
      { title: 'v3', value: 'v3' },
      { title: '', value: 'deleteAction', sortable: false },
    ],
    loading: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    headers() {
      return this.mobile ? this._headers.slice(1) : this._headers;
    },
    contentPacks() {
      return CompendiumStore().ContentPacks;
    },
  },
  methods: {
    async toggleActive(packID: string, state: boolean): Promise<void> {
      try {
        await CompendiumStore().togglePackActive(packID);
        this.$notify({
          color: 'success',
          text: `Successfully ${!state ? 'activated' : 'deactivated'} pack.`,
        });
      } catch (e) {
        this.$notify({
          color: 'error',
          text: `Unable to activate LCP: ${e}`,
        });
      }
    },
    async deletePack(id: string): Promise<void> {
      await CompendiumStore().deleteContentPack(id);
    },
    async deleteAll() {
      this.loading = true;
      await CompendiumStore().deleteAllContentPacks();
      this.$notify({
        color: 'success',
        text: 'Successfully deleted all content packs.',
      });
      this.loading = false;
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

<style scoped>
.v-table >>> .v-table__wrapper {
  overflow: visible !important;
}
</style>
