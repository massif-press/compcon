<template>
  <v-card
    v-if="!patreon?.hasPatreon"
    size="small"
    color="#FF424D"
    tile
    flat
    @click="loginWithPatreon">
    <b>Patreon account:</b>

    <div v-if="loadPatreon" class="ma-2">
      <v-progress-linear tile indeterminate color="white" height="12" />
    </div>
    <div v-else class="text-disabled">Unlinked</div>
    Link Patreon
    <v-tooltip max-width="400px">
      <template #activator="{ props }">
        <v-icon v-bind="props" size="x-small">mdi-help-circle-outline</v-icon>
      </template>
      If you are subscribed to the COMP/CON Patreon, linking your Patreon account will increase your
      maximum cloud storage space and unlock realtime table creation in GM mode.
    </v-tooltip>
  </v-card>
  <cc-dialog v-else title="Membership Benefits" max-width="800">
    <template #activator="{ open }">
      <v-card
        @click="open"
        variant="outlined"
        tile
        flat
        style="border-color: rgb(var(--v-theme-patreon))">
        <div class="bg-patreon text-caption" style="letter-spacing: 4px !important">
          <cc-slashes />
          <b class="px-2">PATREON LINKED</b>
          <cc-slashes />
        </div>
        <v-card-text class="py-2">
          <v-row>
            <v-col cols="auto">
              <v-avatar size="40" color="primary">
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
    </template>

    <v-card-text>
      <v-card flat v-for="t in tiers" :disabled="missingTier(t.title)" class="mb-6">
        <v-row dense>
          <v-col cols="12" lg="3" class="heading text-accent pr-3">{{ t.title }}</v-col>
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
      <div v-if="tierValue < 5" class="text-right">
        <v-btn
          color="exotic"
          size="x-small"
          tile
          variant="tonal"
          prepend-icon="mdi-star"
          href="https://www.patreon.com/compcon"
          target="_blank">
          Upgrade
        </v-btn>
      </div>
    </v-card-text>
  </cc-dialog>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import logger from '@/user/logger';
import { authPatreon } from '@/user/oauth';

export default {
  name: 'patreon-card',
  data: () => ({
    dialog: false,
    loadPatreon: false,
    tiers: [
      {
        title: 'Free',
        value: 0,
        benefits: [
          '100 MB cloud storage',
          'Auto-sync cloud data',
          'Join active mode tables as a player or observer',
          'Share and subscribe to remote items',
          'Cloud image storage',
          'Access to community spotlight content',
          'Subscribe to LCP and content collection updates',
        ],
      },
      {
        title: 'Diasporan',
        value: 1,
        benefits: [
          '1 GB cloud storage',
          'Additional auto-sync options',
          'Host an active mode table as GM',
          'Cloud backups',
          'Publish up to 3 content collections',
          'Eligible for submissions to community spotlight content',
        ],
      },
      {
        title: 'Cosmopolitan',
        value: 2,
        benefits: [
          '5 GB cloud storage',
          'Additional auto-sync options',
          'Multiple concurrent active mode tables',
          'Unlimited content feed publishing',
        ],
      },
      {
        title: 'Lancer (and above)',
        value: 3,
        benefits: ['10 GB cloud storage', 'Unlimited active mode table hosting'],
      },
    ],
  }),
  computed: {
    patreon() {
      return UserStore().User.Patreon;
    },
    tier() {
      return this.patreon.profile.tierData.title || 'Free';
    },
    tierValue() {
      return UserStore().User.PatreonTierValue || 0;
    },
    supportText() {
      if (this.tier === 'Free') {
        return 'Thank you for following the COMP/CON project!';
      } else {
        return 'Thank you for your generous support of COMP/CON!';
      }
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    missingTier(t: string) {
      return this.tierValue < this.tiers.find((x) => x.title === t)!.value;
    },
    openOAuthPopup(url, name, width = 500, height = 600) {
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      return window.open(
        url,
        name,
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
      );
    },
    async loginWithPatreon() {
      const clientId = import.meta.env.VITE_APP_PATREON_CLIENT_ID || '';
      const redirectUri = import.meta.env.VITE_APP_OAUTH_CALLBACK_URI || '';
      const state = Math.random().toString(36).substring(2); // Simple state generation

      const oauthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identity&state=${state}`;

      this.openOAuthPopup(oauthUrl, 'Patreon Login');

      // Listen for messages from the popup
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return; // Ensure message is from the same origin
        if (event.data.type === 'oauth-code') {
          this.exchangePatreonToken(event.data.code);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    },

    async exchangePatreonToken(code) {
      this.loadPatreon = true;
      try {
        const data = await authPatreon(code);
        await UserStore().setPatreonData(data);
        this.loadPatreon = false;
        this.$notify({
          title: 'Patreon Linked',
          text: 'Your Patreon account has been linked',
          data: { color: 'success' },
        });
      } catch (error) {
        logger.error(`Error linking Patreon account: ${error}`, this, error);
        this.loadPatreon = false;
        this.$notify({
          title: 'Patreon Link Failed',
          text: 'There was an error linking your Patreon account',
          data: { color: 'error' },
        });
      }
    },
  },
};
</script>
