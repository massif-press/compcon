<template>
  <v-card @click="dialog = true">
    <div class="bg-patreon text-caption" style="letter-spacing: 4px !important">
      <cc-slashes />
      <b class="px-2">PATREON LINKED</b>
      <cc-slashes />
    </div>
    <v-card-text class="py-2">
      <v-row>
        <v-col cols="auto">
          <v-avatar size="40">
            <v-img :src="patreon.profile.thumb_url" />
          </v-avatar>
        </v-col>
        <v-col>
          <div class="heading h3 text-center text-accent">
            <b>{{ patreon.profile.tierData.title }} Tier</b>
          </div>
          <div>
            {{ supportText }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="dialog" max-width="1000">
    <v-card>
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title class="heading h3">Membership Benefits</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-card flat v-for="t in tiers" :disabled="missingTier(t.title)" class="mb-6">
          <v-row dense>
            <v-col cols="3" class="heading text-accent pr-3">{{ t.title }}</v-col>
            <v-col>
              <div v-for="b in t.benefits">
                <v-icon
                  :color="missingTier(t.title) ? '' : 'success'"
                  :icon="missingTier(t.title) ? 'mdi-close' : 'mdi-check-bold'" />
                {{ b }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'patreon-card',
  data: () => ({
    dialog: false,
    tiers: [
      {
        title: 'Free',
        benefits: [
          '100 MB cloud storage',
          'Ability to join active mode tables as a player or observer',
          'Ability to subscribe to LCP or content stream updates',
        ],
      },
      {
        title: 'Diasporan',
        benefits: [
          'Auto-sync options',
          '+1GB cloud storage',
          'Ability to host an active mode table as GM',
          'Time-based auto-sync',
          'Permanent deleted item retention in the cloud',
          'Cloud backups',
          'Publish up to 3 content collections',
          'Eligible for future public feeds and community spotlight content',
        ],
      },
      {
        title: 'Cosmopolitan',
        benefits: [
          '+4 GB cloud storage',
          'Additional auto-sync options',
          'Multiple concurrent active mode tables',
          'Unlimited content feed publishing',
        ],
      },
      {
        title: 'Lancer (and above)',
        benefits: ['+4 GB cloud storage', 'Unlimited active mode table hosting'],
      },
    ],
  }),
  computed: {
    patreon() {
      return UserStore().User.Patreon;
    },
    tier() {
      return this.patreon.profile.tierData.title;
    },
    supportText() {
      if (this.tier === 'Free') {
        return 'Thank you for following the COMP/CON project!';
      } else {
        return 'Thank you for your generous support of COMP/CON!';
      }
    },
  },
  methods: {
    missingTier(t: string) {
      return (
        this.tiers.indexOf(this.tiers.find((x) => x.title === t) || { title: '', benefits: [] }) >
        this.tiers.indexOf(
          this.tiers.find((x) => x.title === this.tier) || { title: '', benefits: [] }
        )
      );
    },
  },
};
</script>
