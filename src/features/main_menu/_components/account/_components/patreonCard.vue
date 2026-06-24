<template>
  <v-card v-if="!patreon?.hasPatreon"
    size="small"
    color="#FF424D"
    tile
    flat
    @click="loginWithPatreon">
    <b>{{ $t("mainMenu.patreon.accountLabel") }}:</b>

    <div v-if="loadPatreon"
      class="ma-2">
      <v-progress-linear tile
        indeterminate
        color="white"
        height="12" />
    </div>
    <div v-else
      class="text-disabled">{{ $t("mainMenu.ui.unlinked") }}</div>
    {{ $t("mainMenu.patreon.linkPatreon") }}
    <v-tooltip max-width="400px">
      <template #activator="{ props }">
        <v-icon v-bind="props"
          size="x-small">mdi-help-circle-outline</v-icon>
      </template>
      {{ $t("mainMenu.patreon.linkInfo") }}
    </v-tooltip>
  </v-card>
  <cc-dialog v-else
    :title="$t('mainMenu.titles.membershipBenefits')"
    max-width="800">
    <template #activator="{ open }">
      <v-card @click="open"
        variant="outlined"
        tile
        flat
        style="border-color: rgb(var(--v-theme-patreon))">
        <div class="bg-patreon text-caption"
          style="letter-spacing: 4px !important">
          <cc-slashes />
          <b class="px-2">{{ $t("notify.account.patreonLinkedTitle") }}</b>
          <cc-slashes />
        </div>
        <v-card-text class="py-2">
          <v-row>
            <v-col cols="auto">
              <v-avatar size="40"
                color="primary">
                <v-img :src="patreon.profile.thumb_url" />
              </v-avatar>
            </v-col>
            <v-col>
              <div class="heading h3 text-center text-accent">
                <b>{{ $t("mainMenu.patreon.tierSuffix", { title: patreon.profile.tierData.title }) }}</b>
              </div>
              <div>
                {{ supportText }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div class="text-right">
        <v-btn size="x-small"
          flat
          tile
          variant="tonal"
          @click="unlinkPatreon()">{{ $t("mainMenu.ui.unlink") }}</v-btn>
      </div>
    </template>

    <v-card-text>
      <v-card flat
        v-for="t in tiers"
        :key="t.title"
        :disabled="missingTier(t.title)"
        class="mb-6">
        <v-row dense>
          <v-col cols="12"
            lg="3"
            class="heading text-accent pr-3">{{ t.title }}</v-col>
          <v-col>
            <div v-for="(b, bIdx) in t.benefits"
              :key="`benefit-${bIdx}`">
              <v-icon :color="missingTier(t.title) ? '' : 'success'"
                :icon="missingTier(t.title) ? 'mdi-close' : 'mdi-check-bold'" />
              {{ b }}
            </div>
          </v-col>
        </v-row>
      </v-card>
      <div v-if="tierValue < 5"
        class="text-right">
        <v-btn color="exotic"
          size="x-small"
          tile
          variant="tonal"
          prepend-icon="mdi-star"
          href="https://www.patreon.com/compcon"
          target="_blank">
          {{ $t("mainMenu.ui.upgrade") }}
        </v-btn>
      </div>
    </v-card-text>
  </cc-dialog>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { useDisplay } from 'vuetify'
import { UserStore } from '@/stores';
import logger from '@/user/logger';
import { authPatreon } from '@/user/oauth';
import { NoPatreonTierError } from '@/user/store/OAuthService';

const _display = useDisplay()

defineOptions({ name: 'patreon-card' })

const dialog = ref(false)
const loadPatreon = ref(false)
const tiers = ref([
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
    ])

const patreon = computed(() => {
      return UserStore().User.Patreon;
    })
const tier = computed(() => {
      return patreon.value.profile.tierData.title || 'Free';
    })
const tierValue = computed(() => {
      return UserStore().User.PatreonTierValue || 0;
    })
const supportText = computed(() => {
      if (tier.value === 'Free') {
        return 'Thank you for following the COMP/CON project!';
      } else {
        return 'Thank you for your generous support of COMP/CON!';
      }
    })
const mobile = computed(() => {
      return _display.mdAndDown.value;
    })

function missingTier(t: string) {
      return tierValue.value < tiers.value.find((x) => x.title === t)!.value;
    }
function openOAuthPopup(url, name, width = 500, height = 600) {
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      return window.open(
        url,
        name,
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
      );
    }
async function loginWithPatreon() {
      const clientId = import.meta.env.VITE_APP_PATREON_CLIENT_ID || '';
      const redirectUri = import.meta.env.VITE_APP_OAUTH_DEV_CALLBACK_URI || '';
      const state = Math.random().toString(36).substring(2); // Simple state generation

      const oauthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identity&state=${state}`;

      openOAuthPopup(oauthUrl, 'Patreon Login');

      // Listen for messages from the popup
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return; // Ensure message is from the same origin
        if (event.data.type === 'oauth-code') {
          exchangePatreonToken(event.data.code);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    }
async function exchangePatreonToken(code) {
      loadPatreon.value = true;
      try {
        const data = await authPatreon(code);
        await UserStore().setPatreonData(data);
        loadPatreon.value = false;
        notify({
          title: t('notify.account.patreonLinkedTitle'),
          text: t('notify.account.patreonLinkedText'),
          data: { color: 'success' },
        });
      } catch (error) {
        logger.error(`Error linking Patreon account: ${error}`, this, error);
        loadPatreon.value = false;
        if (error instanceof NoPatreonTierError) {
          notify({
            title: t('notify.account.noSubscriptionTitle'),
            text: t('notify.account.noSubscriptionText'),
            data: { color: 'warning' },
          });
        } else {
          notify({
            title: t('notify.account.patreonLinkFailedTitle'),
            text: t('notify.account.patreonLinkFailedText'),
            data: { color: 'error' },
          });
        }
      }
    }
async function unlinkPatreon() {
      UserStore().User.ClearPatreonData();
      notify({
        title: t('notify.account.patreonUnlinkedTitle'),
        text: t('notify.account.patreonUnlinkedText'),
        data: { color: 'success' },
      });
    }
</script>
