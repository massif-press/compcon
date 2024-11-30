<template>
  <v-container>
    <v-alert color="accent" class="ma-4" border icon="cc:campaign" dense>
      Imported campaigns are managed in the
      <v-btn size="small" class="mx-1" to="/srd?tab=2">Campaign Library</v-btn>
    </v-alert>

    <v-card class="mt-5">
      <v-card-title>
        <div class="heading h3 text-accent">Your Campaigns</div>
      </v-card-title>
      <v-card-text>
        <div v-if="!campaigns.length" class="text-center text-disabled pa-5">
          <i>No data</i>
        </div>
        <v-card
          v-else
          v-for="(c, i) in campaigns"
          class="px-2 py-3"
          elevation="0"
          :color="i % 2 == 0 ? 'rgba(125, 125, 125, 0.05)' : 'rgba(125, 125, 125, 0.16)'">
          <v-row align="center">
            <v-col v-if="c.CoverImageUrl" cols="auto">
              <v-avatar>
                <v-img :src="c.CoverImageUrl" height="100" />
              </v-avatar>
            </v-col>
            <v-col>
              <div class="heading h6">{{ c.Title }}</div>
              <div class="text-caption">{{ c.Subtitle }}</div>
              <div class="text-caption">
                <i>v{{ c.Version || 'Unpublished' }}</i>
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="accent"
                size="small"
                variant="tonal"
                prepend-icon="mdi-pencil"
                @click="openEditCampaign(<Campaign>c)">
                Edit
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-dialog width="50vw">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    color="error"
                    size="small"
                    variant="tonal"
                    prepend-icon="mdi-delete">
                    Delete
                  </v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card>
                    <v-toolbar color="error-darken-3">
                      <v-toolbar-title>
                        <v-icon start icon="mdi-alert" />
                        Permanent Deletion
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      This campaign will be
                      <b class="text-error">permanently deleted</b>
                      . This action cannot be undone. If you're sure you want to delete
                      <div class="text-h6 text-center py-2">{{ c.Title }}</div>
                      type the campaign title into the text entry field below and click
                      <b>Confirm Deletion</b>
                      .
                      <v-text-field
                        v-model="deleteText"
                        density="compact"
                        hide="detail"
                        class="my-2"
                        :placeholder="c.Title"
                        color="error" />
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <v-btn color="accent" @click="isActive.value = false">Dismiss</v-btn>
                      <v-spacer />
                      <v-btn
                        :color="deleteText !== c.Title ? '' : 'error'"
                        variant="elevated"
                        prepend-icon="mdi-delete"
                        :disabled="deleteText !== c.Title"
                        @click="deleteCampaign(<Campaign>c, isActive)">
                        Delete campaign permanently
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
      <v-divider />

      <v-footer>
        <v-spacer />
        <v-btn color="accent" variant="tonal" class="mx-2" size="small" @click="addCampaign">
          <v-icon start icon="mdi-plus" />
          New Campaign
        </v-btn>
        <v-dialog v-model="importDialog" max-width="750px">
          <template #activator="{ props }">
            <v-btn v-bind="props" color="accent" variant="tonal" class="mx-2" size="small">
              <v-icon start icon="mdi-import" />
              File Import
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Import Campaign JSON Data</v-card-title>
            <v-divider />
            <v-card-text>
              <p class="text-caption text-center">
                <i>
                  This tool will import an editable, unpublished Campaign
                  <b class="text-secondary">JSON file</b>
                  from your device.
                  <br />
                  To import a published campaign file with the
                  <b class="text-secondary">.lcd</b>
                  extension into your collection, use the file import tool in the
                  <b>Campaign Collection</b>
                  menu, or the Import Campaign tool in the
                  <b>Manage Content</b>
                  dialog under the main menu .
                </i>
              </p>
              <v-row align="center" justify="center" class="mt-2">
                <v-col cols="10">
                  <v-file-input
                    v-model="<any>fileValue"
                    accept="text/json"
                    variant="outlined"
                    label="Select Data File"
                    prepend-icon="mdi-paperclip"
                    @change="stageImport"
                    @click:clear="reset" />
                </v-col>
              </v-row>
              <div v-if="errorMessage" class="text-error text-center mt-2">{{ errorMessage }}</div>
              <div v-else-if="stagedData">
                <div class="text-caption">Staged Campaign Data</div>
                <v-card variant="tonal">
                  <v-card-title>{{ stagedData.Title }}</v-card-title>
                  <v-card-subtitle>{{ stagedData.Subtitle }}</v-card-subtitle>
                  <v-card-text class="pl-6">
                    <div class="text-center">
                      <i>{{ stagedData.Author }}</i>
                    </div>
                    {{ stagedData.Description }}

                    <v-alert
                      v-if="importSameId"
                      variant="outlined"
                      :color="importIsOlder ? 'error' : 'warning'"
                      class="my-2"
                      density="compact"
                      icon="mdi-alert">
                      <div class="text-caption">Warning</div>
                      <div v-if="importIsOlder" class="my-2 font-weight-bold">
                        The existing campaign is newer than the imported data.
                      </div>
                      This import data will overwrite an existing campaign with the same ID ({{
                        importSameId.Title
                      }}). The existing campaign was last updated on
                      {{ new Date(importSameId.SaveController.LastModified).toLocaleString() }}.
                    </v-alert>

                    <div class="text-caption text-right">
                      Last Updated: &nbsp;
                      <b>{{ new Date(stagedData.SaveController.LastModified).toLocaleString() }}</b>
                    </div>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="accent" @click="importCampaign">Import Campaign</v-btn>
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn color="accent" @click="importDialog = false">Dismiss</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-footer>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import CampaignBookshelf from '@/features/compendium/Views/CampaignLibrary/components/CampaignBookshelf.vue';
import { ImportData } from '@/io/Data';
import { CampaignStore } from '@/stores';

export default {
  name: 'campaign-landing',
  components: { CampaignBookshelf },
  data: () => ({
    slide: null,
    libDialog: false,
    deleteDialog: false,
    importDialog: false,
    deleteText: '',
    fileValue: null as any,
    stagedData: null as any,
    errorMessage: '',
  }),
  computed: {
    campaigns() {
      return CampaignStore().Campaigns.filter((x) => !x.SaveController.IsDeleted);
    },

    importSameId() {
      if (!this.stagedData) return null;
      return CampaignStore().Campaigns.find((c) => c.ID === this.stagedData.ID);
    },

    importIsOlder() {
      if (!this.stagedData) return false;
      const existing = CampaignStore().Campaigns.find((c) => c.ID === this.stagedData.ID);
      if (!existing) return false;
      return existing.SaveController.LastModified > this.stagedData.SaveController.LastModified;
    },
  },
  methods: {
    addCampaign() {
      const c = new Campaign();
      CampaignStore().AddCampaign(c);
    },

    async openEditCampaign(c: Campaign) {
      this.$router.push(`campaigns/edit/${c.ID}`);
    },

    async deleteCampaign(c: Campaign, isActive: any) {
      CampaignStore().DeleteCampaign(c);
      isActive.value = false;
      this.deleteText = '';
    },

    reset() {
      this.fileValue = null;
      this.stagedData = null;
      this.errorMessage = '';
    },

    async stageImport(file: any) {
      if (!file) return;
      const data = await ImportData<any>(file.target.files[0]);

      try {
        const c = new Campaign(data);
        this.stagedData = c;
      } catch (e) {
        console.error(e);
        this.stagedData = null;
        this.errorMessage = JSON.stringify(e);
      }
    },

    importCampaign() {
      if (!this.stagedData) return;
      CampaignStore().AddCampaign(this.stagedData);
      this.reset();
      this.importDialog = false;
    },
  },
};
</script>
