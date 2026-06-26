<template>
  <v-card flat
    border
    tile
    class="mb-4">
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          :text="mobile ? 'LCPs' : 'LCP Subscriptions'"
          :tooltip="$t('mainMenu.tooltips.paidLcpContentRequiresA')" />
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <span class="mx-1"
            v-bind="props">
            <cc-button icon="mdi-refresh"
              :loading="loading"
              class="mx-1"
              variant="tonal"
              :size="mobile ? 'small' : ''"
              @click="refresh" />
          </span>
        </template>
        <div class="text-center">
          {{ $t('mainMenu.ui.refreshList') }}
          <br />
          {{ $t('mainMenu.ui.doesNotSync') }}
        </div>
      </v-tooltip>
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <span class="mx-1"
            v-bind="props">
            <cc-button icon="mdi-download-multiple-outline"
              :loading="loading"
              class="mx-1"
              variant="tonal"
              :size="mobile ? 'small' : ''"
              @click="updateAll" />
          </span>
        </template>
        <div class="text-center">{{ $t('common.updateAll') }}</div>
      </v-tooltip>
    </v-toolbar>

    <v-divider />
    <massif-lcp-table :packs="packs"
      :loading="loading" />
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { computed, ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore, UserStore } from '@/stores';
import { collectionDataQuery } from '@/user/api';
import MassifLcpTable from '../../MassifLcpTable.vue';
import logger from '@/user/logger';
import { notify } from '@/util/notify.js';

const _display = useDisplay()
const packs = ref([] as any[])
const loading = ref(true)

const mobile = computed(() => {
  return _display.mdAndDown.value;
})
const contentPacks = computed(() => {
  return CompendiumStore().ContentPacks;
})
const lcpSubscriptions = computed(() => {
  return UserStore().User.LcpSubscriptions;
})
const user = computed(() => {
  return UserStore().User;
})

async function refresh() {
  loading.value = true;
  packs.value = await collectionDataQuery();
  packs.value = packs.value.filter(x => x.sortkey.includes('massif'))
    .sort((a, b) => a.collection.localeCompare(b.collection));

  loading.value = false;
}
function getInstalledPack(pack) {
  return contentPacks.value.find(
    (p) => p.Manifest.name === pack.name || p.Manifest.name === pack.title
  );
}
function hasSubscription(pack) {
  return lcpSubscriptions.value.includes(pack.sortkey);
}
async function installLatest(pack) {
  loading.value = true;
  try {
    await UserStore().downloadLcp(pack);
    notify({
      title: t('notify.lcp.lcpUpdatedTitle'),
      text: t('mainMenu.account.lcpUpdatedText', { title: pack.title }),
      color: 'success', icon: 'mdi-check-bold',
    });
  } catch (err) {
    logger.error(`Error downloading LCP: ${err}`, this, err);
    notify({
      title: t('notify.lcp.lcpUpdateErrorTitle'),
      text: t('mainMenu.account.lcpUpdateErrorText', { title: pack.title }),
      color: 'error', icon: 'mdi-alert-circle-outline',
    });
  } finally {
    loading.value = false;
  }
}
async function updateAll() {
  loading.value = true;
  try {
    for (const pack of packs.value) {
      if (hasSubscription(pack)) {
        if (
          !getInstalledPack(pack) ||
          getInstalledPack(pack)?.Manifest.version !== pack.version
        )
          await installLatest(pack);
      }
    }
    notify({
      title: t('mainMenu.account.allLcpsUpdatedTitle'),
      text: t('mainMenu.account.allLcpsUpdatedText'),
      color: 'success', icon: 'mdi-check-bold',
    });
  } catch (err) {
    logger.error(`Error updating LCPs: ${err}`, this, err);
    notify({
      title: t('mainMenu.account.allLcpsUpdateErrorTitle'),
      text: t('mainMenu.account.allLcpsUpdateErrorText'),
      color: 'error', icon: 'mdi-alert-circle-outline',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await refresh();
})
</script>
