<template>
  <cc-share-code-importer ref="importer"
    :import-type="importType"
    :block-btn="blockBtn"
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
        :disabled="isUserOwned"
        :tooltip="$t('pm.tooltips.addingThisItemAsA')"
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
import { ref, computed } from 'vue'
import { CloudController } from '@/classes/components/cloud/CloudController';
import { DownloadViaCode } from '@/io/apis/account';
import { UserStore } from '@/stores';
import ShareCodeResult from '@/shared/ShareCodeResult.vue';

const props = withDefaults(defineProps<{ importType?: string; blockBtn?: boolean }>(), {
  importType: 'item',
})

const emit = defineEmits<{ close: [] }>()

const importer = ref<any>(null)
const queryResult = ref<any>(null)
const shareCode = ref('')
const dlLoading = ref(false)

const isUserOwned = computed(() =>
  !!(queryResult.value?.user_id &&
    UserStore().Cognito?.userId &&
    queryResult.value.user_id === UserStore().Cognito.userId)
)

async function downloadAsRemote() {
  await downloadAsCopy(true)
}

async function downloadAsCopy(remote = false) {
  dlLoading.value = true
  const itemData = await DownloadViaCode(queryResult.value.code)
  const itemType = queryResult.value.sortkey.split('_')[1]
  const item = await CloudController.NewByType(itemType, itemData)
  if (remote) {
    const codeToTrack = shareCode.value || queryResult.value.code
    item.CloudController.setRemoteMetadata(queryResult.value)
    item.SaveController.RemoteCode = codeToTrack
    if (UserStore().IsLoggedIn)
      UserStore().addRemoteItem(codeToTrack)
  } else {
    item.CloudController.GenerateMetadata()
    item.SaveController.ClearRemote()
  }
  await CloudController.AddByType(itemType, item)

  dlLoading.value = false
  importer.value.reset()
  importer.value.$refs.modal.close()
}
</script>
