<template>
  <v-container>
    <div class="my-2">
      <div class="heading h3 text-accent">Active Campaigns</div>
      <div v-if="!active.length" class="text-center">
        <span class="flavor-text text--disabled">None</span>
      </div>
      <v-simple-table v-else class="my-2">
        <thead>
          <th>Campaign</th>
          <th>Pilots</th>
          <th>Beats</th>
          <th>Missions</th>
          <th>Encounters</th>
          <th>Status</th>
          <th></th>
        </thead>

        <tbody></tbody>
      </v-simple-table>
      <v-row justify="end" align="center">
        <v-col cols="3">
          <v-btn color="primary" class="text-white" disabled>
            <v-icon start v-html="'cc:activate'" />
            Start Campaign
          </v-btn>
        </v-col>
      </v-row>

      <div class="heading h3 text-accent">Campaign Catalog</div>
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <span class="flavor-text text--disabled">None</span>
        </v-col>
      </v-row>
      <v-row justify="end" align="center">
        <v-col cols="3">
          <v-btn color="primary" class="text-white" block disabled>
            <v-icon start v-html="'mdi-import'" />
            Import Campaign
          </v-btn>
        </v-col>
      </v-row>

      <div class="heading h3 text-accent">Unpublished Campaigns</div>
      <div v-if="!unpublished.length" class="text-center">
        <span class="flavor-text text--disabled">None</span>
      </div>
      <v-simple-table v-else class="my-2">
        <thead>
          <th>Campaign</th>
          <th>Beats</th>
          <th>Missions</th>
          <th>Combats</th>
          <th>Downtimes</th>
          <th></th>
          <th></th>
        </thead>

        <tbody>
          <tr v-for="(c, i) in unpublished" class="text-center">
            <td class="text-left">{{ c.Name }}</td>
            <td>{{ c.Count('Beat') }}</td>
            <td>{{ c.Count('Mission') }}</td>
            <td>{{ c.Count('Combat') }}</td>
            <td>{{ c.Count('Downtime') }}</td>
            <td>
              <v-btn small color="accent" @click="openEditCampaign(c)"
                >Edit</v-btn
              >
            </td>
            <td>
              <v-btn small color="accent" @click="openRunCampaign(c)" disabled
                >Run</v-btn
              >
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-row justify="end" align="center">
        <v-col cols="3">
          <v-btn
            color="primary"
            class="text-white"
            block
            @click="openNewCampaign()"
          >
            <v-icon start v-html="'mdi-plus'" />
            Create New Campaign
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-footer fixed>
      <v-row no-gutters>
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <v-alert density="compact" icon="mdi-alert" class="ma-0">
                COMP/CON stores its data locally, which may be erased by other
                browser functions or plugins. It is strongly recommended to
                regularly create campaign data backups.
              </v-alert>
              <v-row density="compact" justify="center" align="center">
                <v-col>
                  <v-btn
                    small
                    color="primary"
                    class="text-white"
                    block
                    to="campaigns/edit"
                  >
                    <v-icon start v-html="'mdi-save'" />
                    Create Campaign Data Backup
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    small
                    color="primary"
                    class="text-white"
                    block
                    to="campaigns/edit"
                  >
                    <v-icon start v-html="'mdi-load'" />
                    Load Campaign Data Backup
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters style="display: contents">
        <v-col cols="12">
          <v-btn small to="/gm">
            <v-icon start>mdi-chevron-left</v-icon>
            Return to GM Menu
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';

import { CampaignStore } from '@/stores';

export default {
  name: 'campaign-landing',
  computed: {
    cstore() {
      return this.getModule(CampaignStore);
    },
    unpublished() {
      return this.cstore.Unpublished;
    },
    active() {
      return this.cstore.Active;
    },
  },
  methods: {
    openNewCampaign() {
      const c = new Campaign();
      this.cstore.addCampaign(c);
      this.openEditCampaign(c);
    },
    async openEditCampaign(c) {
      this.cstore.setEditCampaign(c.ID);
      await this.$nextTick();
      this.$router.push('campaigns/edit');
    },
    openRunCampaign(c) {
      console.error('Not Yet Implemented');
    },
  },
};
</script>
