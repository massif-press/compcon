<template>
  <v-card flat
    border
    tile
    class="mb-4">
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          :text="mobile ? 'Author Content' : 'AUTHOR CONTENT SUBSCRIPTIONS'"
          tooltip=" You can subscribe to COMP/CON data content authors to receive updates when they
              publish new content. This can include pilots, GM data like NPCs and Narrative
              Elements, and limited or reserved collection content, such as table-specific homebrew.
              You can add new subscriptions by adding the author's Content collection ID (CSID) to
              the list below. <br /> <br />
              <strong>
                Neither Massif Press nor the COMP/CON developer take any responsibility for any
                content published to any author's content collection. Subscribe to authors at your
                own discretion.
              </strong>" />
      </v-toolbar-title>
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <cc-button icon="mdi-refresh"
            class="mx-1"
            :size="mobile ? 'small' : ''"
            v-bind="props"
            @click="refresh" />
        </template>
        <div class="text-center">
          {{ $t("mainMenu.ui.refreshList") }}
          <br />
          {{ $t("mainMenu.ui.doesNotSync") }}
        </div>
      </v-tooltip>
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <cc-button icon="mdi-download-multiple-outline"
            class="mx-1"
            :size="mobile ? 'small' : ''"
            v-bind="props"
            @click="updateAll" />
        </template>
        <div class="text-center">{{ $t("common.updateAll") }}</div>
      </v-tooltip>
    </v-toolbar>
    <v-divider />
    <cc-select v-model="cloudUser.CollectionSubscriptionSettings.updateOn"
      :label="$t('mainMenu.fields.updates')"
      color="primary"
      :items="update_on"
      :loading="loading"
      @update:model-value="saveUserMetadata()" />
    <v-data-table v-model:expanded="expanded"
      density="compact"
      :headers="<any>collectionHeaders"
      :items="collectionItems"
      show-expand
      item-key="name"
      :items-per-page="-1"
      :loading="loading"
      hide-default-footer>
      <template #item.last_update="{ item }">
        {{ new Date(item.updated).toLocaleString() }}
      </template>
      <template #item.vers="{ item }">
        <span v-if="!getLocalUserSetting(item)">-</span>
        <span v-else>
          {{ getLocalUserSetting(item)!.metadata.version }}
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                :color="isLatestVersion(item) ? 'success' : 'warning'"
                :icon="isLatestVersion(item) ? 'mdi-check' : 'mdi-alert'" />
            </template>
            <span v-if="isLatestVersion(item)">{{ $t("mainMenu.subscriptions.upToDate") }}</span>
            <span v-else>
              <span v-text="majorMinor(item)" />
              {{ $t("mainMenu.subscriptions.updateAvailable") }}
              <v-divider />
              <b class="heading">{{ item.version }}</b>
              <div class="text-caption">
                {{ $t("mainMenu.subscriptions.updatedOn", {
                  date: new
                    Date(item.updated).toLocaleString()
                })
                }}
              </div>
            </span>
          </v-tooltip>
        </span>
      </template>
      <template #item.actions="{ item }">
        <v-tooltip max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-btn variant="text"
              size="small"
              icon
              v-bind="props"
              :loading="loading"
              :disabled="isLatestVersion(item)"
              @click="update(item)">
              <v-icon color="accent"
                size="large"
                icon="mdi-download" />
            </v-btn>
          </template>
          {{ $t("mainMenu.subscriptions.updateToLatest") }}
        </v-tooltip>
        <v-tooltip max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-btn variant="text"
              size="small"
              icon
              v-bind="props"
              :loading="loading"
              @click="unsubscribe(item)">
              <v-icon color="error"
                size="large"
                icon="mdi-broadcast-off" />
            </v-btn>
          </template>
          <div class="text-center">
            {{ $t("mainMenu.subscriptions.unsubscribe") }}
            <v-divider />
            <i class="text-caption">
              {{ $t("mainMenu.subscriptions.unsubscribeInfo") }}
            </i>
          </div>
        </v-tooltip>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <td :colspan="columns.length"
          class="pa-4 w-100 bg-light-panel">
          <v-alert v-if="!isLatestVersion(item)"
            density="compact"
            border
            color="warning"
            icon="mdi-alert"
            class="mb-2">
            {{ $t("mainMenu.subscriptions.newVersionAvailable") }}
            <div class="text-right">
              <v-btn size="small"
                color="warning"
                @click@click="update(item)">{{ $t("ui.pwa.updateNow") }}</v-btn>
            </div>
          </v-alert>
          <collection-info :collection="item" />
        </td>
      </template>
    </v-data-table>
    <v-alert v-for="(item, itemIdx) in remoteDeletedItems"
      :key="`deleted-${itemIdx}`"
      class="mx-8 my-2"
      density="compact"
      prominent
      border
      closable
      color="error"
      icon="mdi-alert"
      @click:close="unsubscribe(item.metadata)">
      <div class="heading h4">{{ $t("mainMenu.subscriptions.deletedCollection") }}</div>
      <div class="text-caption">
        {{ $t("mainMenu.subscriptions.deletedCollectionInfo", { name: item.metadata.name }) }}
      </div>
    </v-alert>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <collection-share-code-dialog />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { UserStore } from '@/stores';
import CollectionShareCodeDialog from './data_viewer/collectionShareCodeDialog.vue';
import CollectionInfo from './data_viewer/collectionInfo.vue';
import logger from '@/user/logger';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'collection-subscriptions' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const loading = ref(false)
const expanded = ref([])
const collectionHeaders = ref([
  { title: '', key: 'data-table-expand', width: '0' },
  { title: 'Content Collection', key: 'name' },
  { title: 'Author', key: 'author' },
  { title: 'Version', key: 'vers', align: 'center' },
  { title: '', key: 'actions' },
])
const update_on = ref([
  {
    title: 'On Startup',
    value: 'startup',
  },
  {
    title: 'Manual Only',
    value: 'manual',
  },
])

const cloudUser = computed(() => {
  return UserStore().UserMetadata;
})
const collectionItems = computed(() => {
  return UserStore().RemoteCollections;
})
const remoteDeletedItems = computed(() => {
  return cloudUser.value.CollectionSubscriptionSettings.items.filter(
    (sub) => !collectionItems.value.find((item) => item.id === sub.metadata.id)
  );
})

async function saveUserMetadata() {
  loading.value = true;
  await UserStore().setUserMetadata();
  loading.value = false;
}
async function unsubscribe(item) {
  loading.value = true;
  await UserStore().removeContentSubscription(item);
  loading.value = false;
}
async function update(item) {
  loading.value = true;
  let errors = await UserStore().updateRemoteCollection(item);
  if (errors.length > 0) {
    logger.error(`Error updating collection: ${errors}`, this);
    notify({
      title: t('mainMenu.account.collectionErrorTitle'),
      text: t('mainMenu.account.collectionErrorText'),
      color: 'error', icon: 'mdi-alert-circle-outline',
    });
  } else {
    notify({
      title: t('mainMenu.account.collectionUpdatedTitle'),
      text: t('mainMenu.account.collectionUpdatedText'),
      color: 'success', icon: 'mdi-check-circle-outline',
    });
  }
  loading.value = false;
}
async function refresh() {
  loading.value = true;
  await UserStore().getRemoteCollectionMetadata();
  loading.value = false;
}
async function updateAll() {
  for (let item of collectionItems.value) {
    const localSetting = getLocalUserSetting(item);
    if (localSetting && localSetting.metadata.version === item.version) continue;
    else await update(item);
  }
}
function getLocalUserSetting(item) {
  return cloudUser.value.CollectionSubscriptionSettings.items.find(
    (sub) => sub.metadata.id === item.id
  );
}
function isLatestVersion(item) {
  if (!getLocalUserSetting(item)) return false;
  return item.version === getLocalUserSetting(item)!.metadata.version;
}
function copy(code) {
  navigator.clipboard.writeText(code);
}
function parsedContent(json) {
  return JSON.parse(json);
}
function majorMinor(item) {
  if (!getLocalUserSetting(item)) return '';
  if (
    getLocalUserSetting(item)!.metadata.version.split('.')[0] ===
    item.version.split('.')[0]
  )
    return 'Minor';
  return 'Major';
}
</script>
