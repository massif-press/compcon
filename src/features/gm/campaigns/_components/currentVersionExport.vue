<template>
  <v-card v-if="latest"
    variant="tonal">
    <div class="text-overline ml-2">{{ $t('gm.campaign.latestVersion') }}</div>
    <v-toolbar density="compact">
      <v-toolbar-title>
        {{ latest.ver }}
        <span class="text-caption text-disabled">
          <cc-slashes />
          {{ new Date(latest.date).toLocaleDateString(undefined, dOptions as any) }}
        </span>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <div class="text-caption text-disabled">{{ $t('gm.campaign.latestChanges') }}:</div>
      {{ latest.changes }}
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-tooltip location="top"
        max-width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="primary"
            size="small"
            variant="elevated"
            prepend-icon="mdi-upload"
            @click="exportLcd()">
            {{ $t('gm.campaign.exportLcd') }}
          </v-btn>
        </template>
        <span>{{ $t('gm.campaign.exportLcdHelp') }}</span>
      </v-tooltip>

      <v-spacer />
      <v-tooltip location="top"
        max-width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="small"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-content-save"
            @click="saveLocalCollection()">
            {{ $t('gm.campaign.saveLocal') }}
          </v-btn>
        </template>
        <span>{{ $t('gm.campaign.saveLocalHelp') }}</span>
      </v-tooltip>
      <v-spacer />
      <div v-if="shareCode">
        <v-tooltip max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              size="small"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-code-block-brackets"
              @click="copyShareCode">
              {{ $t('common.copyShareCode') }}
            </v-btn>
          </template>
          <div class="text-center">
            <b class="text-accent">
              {{ shareCode.substring(0, 4) }}-{{ shareCode.substring(4, 8) }}
            </b>
            <v-divider />
            <span class="text-caption">{{ $t('gm.campaign.copyShareCodeHelp') }}</span>
          </div>
        </v-tooltip>
      </div>
      <v-tooltip v-else-if="isLoggedIn"
        location="top"
        max-width="300px">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="small"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-code-block-brackets"
            :loading="uploading"
            @click="upload">
            {{ $t('gm.campaign.generateShareCode') }}
          </v-btn>
        </template>
        <span>{{ $t('gm.campaign.generateShareCodeHelp') }}</span>
      </v-tooltip>
      <v-spacer v-if="isLoggedIn" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { Campaign } from '@/classes/campaign/Campaign';
import JSZip from 'jszip';
import { CampaignStore } from '../../store/campaign_store';
import { UserStore } from '@/stores';

defineOptions({ name: 'campaign-current-version-export' })

const props = defineProps<{
  campaign: Campaign
}>()

const dOptions = ref({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const uploading = ref(false)

const latest = computed(() => {
      return props.campaign.VersionHistory.length
        ? props.campaign.VersionHistory[props.campaign.VersionHistory.length - 1]
        : null;
    })
const isLoggedIn = computed(() => {
      return UserStore().IsLoggedIn;
    })
const shareCode = computed(() => {
      return props.campaign.CloudController.ShareCode;
    })

async function exportLcd() {
      const filename = `${props.campaign.Name} - ${latest.value.ver}.lcd`;
      const zip = new JSZip();

      zip.file('campaign_data.json', JSON.stringify(Campaign.Serialize(props.campaign as Campaign)));

      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(content);
      link.download = filename;

      // Add the link to the DOM and trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
async function saveLocalCollection() {
      try {
        await CampaignStore().AddCollectionCampaign(Campaign.Serialize(props.campaign as Campaign));
        notify({
          title: t('notify.gm.importCompleteTitle'),
          text: t('notify.gm.importCompleteText'),
          data: { icon: 'cc:campaign', color: 'success' },
        });
      } catch (error) {
        notify({
          title: t('notify.gm.importErrorTitle'),
          text: t('notify.gm.campaignTransferErrorText', { error }),
          data: { icon: 'cc:campaign', color: 'error' },
        });
      }
    }
async function upload() {
      if (!isLoggedIn.value) {
        notify({
          title: t('notify.gm.loginRequiredTitle'),
          text: t('notify.gm.loginRequiredText'),
          data: { icon: 'cc:campaign', color: 'error' },
        });
        return;
      }
      try {
        uploading.value = true;
        await props.campaign.CloudController.UpdateCloud('campaign');
        notify({
          title: t('notify.gm.uploadSuccessTitle'),
          text: t('notify.gm.uploadSuccessText'),
          data: { icon: 'cc:campaign', color: 'success' },
        });
      } catch (error) {
        notify({
          title: t('notify.gm.uploadErrorTitle'),
          text: t('notify.gm.uploadErrorText', { error }),
          data: { icon: 'cc:campaign', color: 'error' },
        });
      } finally {
        uploading.value = false;
      }
    }
function copyShareCode() {
      navigator.clipboard.writeText(shareCode.value);
      notify({
        title: t('notify.common.copied'),
        text: t('notify.shareCode.copiedText'),
        data: { icon: 'cc:campaign', color: 'success' },
      });
    }
</script>
