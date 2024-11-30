<template>
  <div v-if="campaign != null">
    <v-row dense>
      <v-col cols="5" v-if="campaign.cover_image_url">
        <v-img :src="campaign.cover_image_url" max-height="500px" />
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
          :class="campaign.cover_image_url ? '' : 'px-4'">
          <div class="text-center">
            <div class="heading h2">{{ campaign.title }}</div>
            <div>{{ campaign.author }}</div>
          </div>
          <div class="text-center my-1 text-caption">
            Version
            <b class="text-accent">{{ getLatest(campaign.publish_info).ver }}</b>
            <cc-slashes class="pl-1" />
            published
            <b class="text-accent">
              {{
                new Date(getLatest(campaign.publish_info).date).toLocaleDateString(
                  undefined,
                  dOptions as any
                )
              }}
            </b>
          </div>
          <div class="text-center my-1">
            Recommended for
            {{ campaign.players[0] }}-{{ campaign.players[1] }} players at License Level
            {{ campaign.ll[0] }}-{{ campaign.ll[1] }}
          </div>
          <v-card variant="outlined" class="mx-auto pa-2" color="panel">
            <p class="text-text" v-html-safe="campaign.description" />
          </v-card>
          <div class="text-right my-1 px-2">
            <a :href="campaign.website" target="_blank">
              {{ campaign.website }}
            </a>
            <v-row dense justify="end">
              <v-col cols="auto" v-for="e in campaign.author_contact">
                <v-chip variant="outlined" size="x-small">
                  {{ e.service }}
                  <cc-slashes class="mx-1" />
                  {{ e.contact }}
                </v-chip>
              </v-col>
            </v-row>
          </div>
          <slot />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'campaign-detail-panel',
  props: {
    campaign: Object,
  },
  data: () => ({
    campaign: null as any,
    dOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }),
  methods: {
    getLatest(publish_info) {
      return publish_info.version_history[publish_info.version_history.length - 1];
    },
  },
};
</script>
