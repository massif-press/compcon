<template>
  <v-card v-if="!itch?.hasItch"
    size="small"
    color="itch"
    tile
    flat
    @click="loginWithItch">
    <b>{{ $t("mainMenu.itch.accountLabel") }}</b>
    <div v-if="loadItch"
      class="ma-2">
      <v-progress-linear tile
        indeterminate
        color="white"
        height="12" />
    </div>
    <div v-else
      class="text-disabled">{{ $t("mainMenu.ui.unlinked") }}</div>
    {{ $t("mainMenu.itch.linkItch") }}
    <v-tooltip max-width="400px">
      <template #activator="{ props }">
        <v-icon v-bind="props"
          size="x-small">mdi-help-circle-outline</v-icon>
      </template>
      {{ $t("mainMenu.itch.linkInfo1") }}
      <br />
      {{ $t("mainMenu.itch.linkInfo2") }}
    </v-tooltip>
  </v-card>

  <cc-dialog v-if="itch && itch.hasItch"
    title="Linked Massif Content"
    max-width="800">
    <template #activator="{ open }">
      <v-card variant="outlined"
        tile
        flat
        style="border-color: rgb(var(--v-theme-itch))"
        @click="open">
        <div class="bg-itch text-caption"
          style="letter-spacing: 4px !important">
          <cc-slashes />
          <b class="px-2">{{ $t("mainMenu.itch.linked") }}</b>
          <cc-slashes />
        </div>
        <v-card-text v-if="itch.user"
          class="py-2">
          <v-row>
            <v-col cols="auto">
              <v-avatar size="40"
                color="primary">
                <v-img :src="itch.user.cover_url" />
              </v-avatar>
            </v-col>
            <v-col>
              <div class="heading h3 text-center text-accent">
                <b>{{ itch.user.username }}</b>
              </div>
              <div>{{ $t("mainMenu.itch.clickForDetails") }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div class="text-right">
        <v-btn size="x-small"
          flat
          tile
          variant="tonal"
          @click="unlinkItch()">{{ $t("mainMenu.ui.unlink") }}</v-btn>
      </div>
    </template>

    <v-card :loading="loading"
      flat>
      <v-card-text>
        <div>{{ $t("mainMenu.itch.purchasesLinked") }}</div>
        <cc-chip v-for="(game, gameIdx) in itch.gamedata"
          :key="`game-${gameIdx}`"
          bg-color="primary"
          color="accent"
          variant="elevated"
          icon="cc:compendium"
          :label="game.title"
          class="ma-1" />
        <div class="mt-2">
          {{ $t("mainMenu.itch.eligibleUpdates") }}
        </div>
        <v-card flat
          border>
          <v-card-text>
            <v-row v-for="(item, itemIdx) in map"
              :key="`map-${itemIdx}`"
              dense
              :class="{ 'text-disabled': !item.enabled }">
              <v-col cols="auto">
                <v-icon :color="item.enabled ? 'success' : ''"
                  :icon="item.enabled ? 'mdi-check-bold' : 'mdi-cancel'" />
              </v-col>
              <v-col>{{ item.name }}</v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <div class="text-center py-2">
            <i18n-t keypath="mainMenu.itch.manageContentHint" tag="span" scope="global">
              <template #link><b>{{ $t("common.manageContent") }}</b></template>
            </i18n-t>
          </div>
        </v-card>

        <cc-alert color="accent"
          density="compact"
          class="mt-2"
          prominent
          icon="mdi-alert-rhombus-outline">
          <div>
            <b>{{ $t("mainMenu.itch.noAutoTrack") }}</b>
            <div class="text-caption">
              <i18n-t keypath="mainMenu.itch.updateHint" tag="span" scope="global">
                <template #update><b>{{ $t("common.update") }}</b></template>
              </i18n-t>
            </div>
          </div>
        </cc-alert>
        <div class="text-caption text-right">
          {{ $t("mainMenu.itch.lastPolled", { date: new Date(itch.lastUpdate).toLocaleString() }) }}
          <br />
          <cc-button color="accent"
            class="mt-4"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click.stop="updateItch">
            {{ $t("common.update") }}
          </cc-button>
        </div>
      </v-card-text>
    </v-card>
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
import { authItch } from '@/user/oauth';

const _display = useDisplay()

const props = defineProps<{
  active?: boolean
}>()

const dialog = ref(false)
const loading = ref(false)
const loadItch = ref(false)

const itch = computed(() => {
      return UserStore().User.Itch;
    })
const map = computed(() => {
      return UserStore().User.ItchMap;
    })
const mobile = computed(() => {
      return _display.mdAndDown.value;
    })

async function updateItch() {
      loading.value = true;
      await UserStore().refreshItchData();
      loading.value = false;
    }
async function loginWithItch() {
      const isDevSite = window.location.origin.includes('dev.compcon.app');
      const clientId = isDevSite
        ? import.meta.env.VITE_APP_ITCH_DEV_CLIENT_ID || ''
        : import.meta.env.VITE_APP_ITCH_CLIENT_ID || '';
      const redirectUri = isDevSite
        ? import.meta.env.VITE_APP_OAUTH_DEV_CALLBACK_URI || ''
        : import.meta.env.VITE_APP_OAUTH_CALLBACK_URI || '';
      let scope = 'profile:me';
      scope = encodeURIComponent(scope);

      const oauthUrl = `https://itch.io/user/oauth?client_id=${clientId}&scope=${scope}&response_type=token&redirect_uri=${redirectUri}`;

      openOAuthPopup(oauthUrl, 'Itch.io Login');

      // Listen for messages from the popup
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return; // Ensure message is from the same origin
        if (event.data.type === 'access_token') {
          exchangeItchToken(event.data.access_token);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    }
async function exchangeItchToken(access_token) {
      loadItch.value = true;
      try {
        await UserStore().getUserMetadata();
        const data = await authItch(access_token);
        await UserStore().setItchData(access_token, data);
        loadItch.value = false;
        notify({
          title: t('notify.account.itchLinkedTitle'),
          text: t('notify.account.itchLinkedText'),
          data: { color: 'success' },
        });
      } catch (error) {
        logger.error(`Error linking itch.io account: ${error}`, this, error);
        loadItch.value = false;
        notify({
          title: t('notify.account.itchLinkFailedTitle'),
          text: t('notify.account.itchLinkFailedText'),
          data: { color: 'error' },
        });
      }
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
async function unlinkItch() {
      await UserStore().setItchData('', null);
      notify({
        title: t('notify.account.itchUnlinkedTitle'),
        text: t('notify.account.itchUnlinkedText'),
        data: { color: 'success' },
      });
    }
</script>
