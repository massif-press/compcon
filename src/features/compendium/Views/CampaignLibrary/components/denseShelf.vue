<template>
  <v-card v-if="!campaigns.length" class="text-center py-6 text-disabled">
    <div class="heading">No Campaigns Found</div>
    <div class="text-caption">
      Campaigns can be imported via File Import or the Lancer Campaign Directory
    </div>
  </v-card>
  <v-sheet v-else class="mx-auto" border>
    <v-slide-group
      v-model="slide"
      class="pa-2"
      selected-class="text-secondary"
      show-arrows
      center-active>
      <v-slide-group-item
        v-for="(c, n) in campaigns"
        v-slot="{ isSelected, toggle, selectedClass }">
        <v-card
          :class="['ma-4', selectedClass]"
          :color="c.cover_image_url ? 'transparent' : 'rgba(125, 125, 125, 0.5)'"
          variant="outlined"
          height="220"
          width="170"
          style="border-width: 2px"
          @click="toggle">
          <v-img v-if="c.cover_image_url" :src="c.cover_image_url" height="220" />
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
      </v-slide-group-item>
    </v-slide-group>

    <v-expand-transition>
      <v-card-text v-if="slide != null">
        <v-toolbar density="compact" color="primary">
          <v-toolbar-title class="heading h2 text-center">
            {{ campaigns[slide].title }}
          </v-toolbar-title>
        </v-toolbar>
        <div class="text-center heading my-2">{{ campaigns[slide].author }}</div>
        <div class="text-center my-1">
          v.{{ getLatest(campaigns[slide].publish_info).ver }}
          <cc-slashes />
          {{
            new Date(getLatest(campaigns[slide].publish_info).date).toLocaleDateString(
              undefined,
              dOptions as any
            )
          }}
        </div>
        <div class="text-center my-1">
          <v-tooltip location="top" open-delay="300">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" icon="cc:pilot" class="mt-n1" start />
            </template>
            <span>Recommended Players</span>
          </v-tooltip>
          {{ campaigns[slide].players[0] }} - {{ campaigns[slide].players[1] }}
          <cc-slashes class="mx-4" />
          <v-tooltip location="top" open-delay="300">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" icon="cc:license" class="mt-n1" start />
            </template>
            <span>Recommended License Level</span>
          </v-tooltip>
          {{ campaigns[slide].ll[0] }} - {{ campaigns[slide].ll[1] }}
        </div>
        <v-row align="center">
          <v-col>
            <v-card variant="outlined" class="mx-auto pa-2" color="panel">
              <p class="text-text" v-html-safe="campaigns[slide].description" />
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" open-delay="300">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :href="campaigns[slide].website"
                  target="_blank"
                  icon
                  variant="text">
                  <v-icon icon="mdi-web" />
                </v-btn>
              </template>
              <span>Campaign Website ({{ campaigns[slide].website }})</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <div class="text-right mt-2">
          <v-btn
            variant="tonal"
            color="accent"
            prepend-icon="mdi-magnify"
            :to="`/srd/campaign/${campaigns[slide].id}`">
            Open in Reader
          </v-btn>
          <v-spacer class="my-2" />
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
                <v-btn
                  variant="text"
                  color="error"
                  @click="removeCampaign(campaigns[slide as number])">
                  Remove
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </v-card-text>
    </v-expand-transition>
  </v-sheet>
</template>

<script lang="ts">
import { CampaignStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'campaign-library-dense',
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
    slide: null as number | null,
    libDialog: false,
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
    removeCampaign(campaign) {
      this.slide = null;
      CampaignStore().DeleteCollectionCampaign(campaign);
    },
    getLatest(publish_info) {
      return publish_info.version_history[publish_info.version_history.length - 1];
    },
  },
};
</script>
