<template>
  <v-card v-if="!campaigns.length" class="text-center py-6 text-disabled mt-6">
    <div class="heading">No Campaigns Found</div>
    <div class="text-caption">
      Campaigns can be imported via File Import or the Lancer Campaign Directory
    </div>
  </v-card>
  <div class="pl-8">
    <v-row justify="start" class="mt-5 mb-12">
      <v-col cols="auto" v-for="(c, n) in campaigns">
        <v-card
          variant="plain"
          height="320"
          width="250"
          style="border-width: 2px"
          @click="openInfo(c)">
          <v-img v-if="c.cover_image_url" :src="c.cover_image_url" height="320" />
          <v-row v-else align="center" justify="center" style="height: 100%">
            <v-col cols="auto" class="text-text text-center">
              <v-icon size="60" icon="cc:campaign" />
              <div class="heading">{{ c.title }}</div>
              <div class="text-caption">{{ c.subtitle }}</div>
              <v-divider class="mt-1" />
              <i class="text-caption">{{ c.author }}</i>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="80vw">
      <v-card v-if="selected" style="overflow-y: hidden; position: relative">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <span class="heading h3">{{ selected.title }}</span>
          </v-toolbar-title>
          <v-toolbar-items>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div v-if="selected != null">
          <v-row dense>
            <v-col cols="5" v-if="selected.cover_image_url">
              <v-img :src="selected.cover_image_url" />
            </v-col>
            <v-col>
              <div
                style="
                  overflow-y: scroll;
                  overflow-x: hidden;
                  height: 100%;
                  min-height: 400px;
                  position: relative;
                "
                class="py-2"
                :class="selected.cover_image_url ? '' : 'px-4'">
                <div class="text-center">
                  <div class="heading h2">{{ selected.title }}</div>
                  <div>{{ selected.author }}</div>
                </div>
                <div class="text-center my-1 text-caption">
                  Version {{ getLatest(selected.publish_info).ver }}, published
                  {{
                    new Date(getLatest(selected.publish_info).date).toLocaleDateString(
                      'en-us',
                      dOptions as any
                    )
                  }}
                </div>
                <div class="text-center my-1">
                  Recommended for
                  {{ selected.players[0] }}-{{ selected.players[1] }} players at License Level
                  {{ selected.ll[0] }}-{{ selected.ll[1] }}
                </div>
                <v-card variant="outlined" class="mx-auto pa-2" color="panel">
                  <p class="text-text" v-html-safe="selected.description" />
                </v-card>
                <div class="text-right my-1 px-2">
                  <a :href="selected.website" target="_blank">
                    {{ selected.website }}
                  </a>
                  <v-row dense justify="end">
                    <v-col cols="auto" v-for="e in selected.author_contact">
                      <v-chip variant="outlined" size="x-small">
                        {{ e.service }}
                        <cc-slashes class="mx-1" />
                        {{ e.contact }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </div>
                <div class="text-right mt-2">
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        size="x-small"
                        variant="tonal"
                        color="error"
                        prepend-icon="mdi-delete">
                        Remove from Collection
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text>
                        This will remove the campaign from your collection. Are you sure?
                      </v-card-text>
                      <v-divider />
                      <v-card-actions>
                        <v-btn variant="text" @click="">Cancel</v-btn>
                        <v-spacer />
                        <v-btn variant="text" color="error" @click="removeCampaign(selected)">
                          Remove
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </div>

                <div style="position: fixed; bottom: 8px; left: 8px; right: 2px">
                  <v-btn
                    block
                    size="x-large"
                    variant="tonal"
                    color="accent"
                    :to="`/srd/campaign/${selected.id}`">
                    Open Campaign
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { CampaignStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'campaign-library-compendium',
  props: {
    search: {
      type: String,
      default: '',
    },
    sort: {
      type: String,
      default: 'title',
    },
    sortDir: {
      type: Boolean,
    },
  },
  data: () => ({
    selected: null as any,
    dialog: false,
    dOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }),

  computed: {
    campaigns() {
      return _.orderBy(
        CampaignStore().CampaignCollection.filter((c) =>
          c.title.toLowerCase().includes(this.search.toLowerCase())
        ),
        this.sort,
        this.sortDir ? 'asc' : 'desc'
      );
    },
  },

  methods: {
    openInfo(p) {
      if (p) {
        this.selected = p;
        this.dialog = true;
      }
    },
    removeCampaign(campaign) {
      this.selected = null;
      CampaignStore().DeleteCollectionCampaign(campaign);
      this.dialog = false;
    },
    getLatest(publish_info) {
      return publish_info.version_history[publish_info.version_history.length - 1];
    },
  },
};
</script>
