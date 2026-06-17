<template>
  <cc-share-code-importer ref="importer"
    :import-type="importType"
    :block-btn="blockBtn"
    :size="size"
    :color="color"
    :full-width="fullWidth"
    :subtitle="subtitle"
    :user-id="UserStore().Cognito?.userId"
    :remote-items="UserStore().UserMetadata?.RemoteItems ?? []"
    @set-query-result="queryResult = $event"
    @set-share-code="shareCode = $event">
    <template #result>
      <share-code-result :query-result="queryResult" />
    </template>
    <template #actions>
      <cc-button color="primary"
        class="my-1"
        :loading="dlLoading"
        :disabled="!isLoggedIn || isUserOwned"
        :tooltip="isLoggedIn
          ? 'You must be logged in to add items as remote resources.'
          : 'Adding this item as a remote resource will create a readonly version of this item linked to the author\'s original data. When the author saves an update to this item to their COMP/CON cloud account, your local version can receive those changes.'"
        @click="downloadAsRemote()">
        {{ $t('share.addAsRemote') }}
      </cc-button>
      <br />
      <cc-button size="small"
        color="primary"
        :loading="dlLoading"
        :tooltip="$t('common.addingLocalCopyTooltip')"
        @click="downloadAsCopy(false)">
        {{ $t('share.addAsLocalCopy') }}
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue';
import { useDisplay } from 'vuetify';
import { CloudController } from '@/classes/components/cloud/CloudController';
import { DownloadViaCode } from '@/io/apis/account';
import { UserStore } from '@/stores';
import ShareCodeResult from './ShareCodeResult.vue';

withDefaults(defineProps<{
  importType?: string
  blockBtn?: boolean
  size?: string
  color?: string
  fullWidth?: boolean
  subtitle?: string
}>(), {
  importType: 'item',
  size: 'small',
  color: 'primary',
  fullWidth: false,
  subtitle: '',
});

defineEmits<{
  (e: 'close'): void
}>();

const display = useDisplay();

const importer = useTemplateRef<any>('importer');
const queryResult = ref<any>(null);
const shareCode = ref('');
const dlLoading = ref(false);

const isLoggedIn = computed(() => UserStore().IsLoggedIn);
const isUserOwned = computed(() =>
  !!(queryResult.value?.user_id &&
    UserStore().Cognito?.userId &&
    queryResult.value.user_id === UserStore().Cognito.userId)
);

async function downloadAsRemote() {
  if (!UserStore().IsLoggedIn) return;
  await downloadAsCopy(true);
}

async function downloadAsCopy(remote = false) {
  dlLoading.value = true;
  const itemData = await DownloadViaCode(queryResult.value.code);
  const itemType = queryResult.value.sortkey.split('_')[1];
  const item = await CloudController.NewByType(itemType, itemData);
  if (remote) {
    const codeToTrack = shareCode.value || queryResult.value.code;
    item.CloudController.setRemoteMetadata(queryResult.value);
    item.SaveController.RemoteCode = codeToTrack;
    if (UserStore().IsLoggedIn)
      UserStore().addRemoteItem(codeToTrack);
  } else {
    item.CloudController.GenerateMetadata();
    item.SaveController.ClearRemote();
  }
  await CloudController.AddByType(itemType, item);

  dlLoading.value = false;
  importer.value?.reset();
  importer.value?.close();
}
</script>
