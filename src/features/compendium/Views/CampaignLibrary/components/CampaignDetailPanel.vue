<template>
  <div v-if="campaign != null">
    <v-row dense>
      <v-col cols="12" md="5" v-if="campaign.cover_image_url">
        <v-img :src="campaign.cover_image_url" :max-height="mobile ? '200px' : '500px'" cover />
      </v-col>
      <v-col>
        <v-card-text style="position: relative" :class="campaign.cover_image_url ? '' : 'px-4'">
          <div class="text-center" style="container: inline-size">
            <div class="heading" style="font-size: calc(20px + 2.5cqw)">{{ campaign.title }}</div>
            <div>{{ campaign.author }}</div>
          </div>
          <div class="text-center my-1 text-caption px-2">
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
          <div class="text-center text-caption my-1 px-2">
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
                <cc-chip>
                  {{ e.service }}
                  <cc-slashes class="mx-1" />
                  {{ e.contact }}
                </cc-chip>
              </v-col>
            </v-row>
          </div>
          <slot />
        </v-card-text>
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
    dOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    getLatest(publish_info) {
      return publish_info.version_history[publish_info.version_history.length - 1];
    },
  },
};
</script>
