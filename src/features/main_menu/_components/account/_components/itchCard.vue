<template>
  <v-card v-if="!itch?.hasItch"
    size="small"
    color="itch"
    tile
    flat
    @click="loginWithItch">
    <b>itch.io account:</b>
    <div v-if="loadItch"
      class="ma-2">
      <v-progress-linear tile
        indeterminate
        color="white"
        height="12" />
    </div>
    <div v-else
      class="text-disabled">Unlinked</div>
    Link itch.io
    <v-tooltip max-width="400px">
      <template #activator="{ props }">
        <v-icon v-bind="props"
          size="x-small">mdi-help-circle-outline</v-icon>
      </template>
      Linking your itch.io account will allow you to download Massif content from the itch.io store
      with one click.
      <br />
      You can also subscribe to Massif LCPs to auto-update your local copy when the author releases
      a new version.
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
          <b class="px-2">ITCH LINKED</b>
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
              <div>Click for details</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div class="text-right">
        <v-btn size="x-small"
          flat
          tile
          variant="tonal"
          @click="unlinkItch()">Unlink</v-btn>
      </div>
    </template>

    <v-card :loading="loading"
      flat>
      <v-card-text>
        <div>COMP/CON has linked the following itch.io purchases to your account:</div>
        <cc-chip v-for="(game, gameIdx) in itch.gamedata"
          :key="`game-${gameIdx}`"
          bg-color="primary"
          color="accent"
          variant="elevated"
          icon="cc:compendium"
          :label="game.title"
          class="ma-1" />
        <div class="mt-2">
          Your COMP/CON cloud account is eligible for the following automatic updates:
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
            Unlinked LCPs and other content can still be manually added via the
            <b>Manage Content</b>
            page.
          </div>
        </v-card>

        <cc-alert color="accent"
          density="compact"
          class="mt-2"
          prominent
          icon="mdi-alert-rhombus-outline">
          <div>
            <b>COMP/CON does not automatically track new itch.io data.</b>
            <div class="text-caption">
              If you have new purchases or download keys on your itch.io account click the
              <b>Update</b>
              button below to add these to COMP/CON. Unfortunately, it is not possible to link
              non-Massif purchases at this time due to limitations in the itch.io API.
            </div>
          </div>
        </cc-alert>
        <div class="text-caption text-right">
          COMP/CON last polled your itch account on
          {{ new Date(itch.lastUpdate).toLocaleString() }}
          <br />
          <cc-button color="accent"
            class="mt-4"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click.stop="updateItch">
            Update
          </cc-button>
        </div>
      </v-card-text>
    </v-card>
  </cc-dialog>
</template>

<script setup lang="ts">
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
          title: 'Itch.io Linked',
          text: 'Your itch.io account has been linked',
          data: { color: 'success' },
        });
      } catch (error) {
        logger.error(`Error linking itch.io account: ${error}`, this, error);
        loadItch.value = false;
        notify({
          title: 'Itch.io Link Failed',
          text: 'There was an error linking your itch.io account',
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
        title: 'Itch.io Unlinked',
        text: 'Your itch.io account has been unlinked',
        data: { color: 'success' },
      });
    }
</script>
