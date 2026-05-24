<template>
  <cc-share-code-importer ref="importer"
    :import-type="importType"
    :block-btn="blockBtn"
    :user-id="UserStore().Cognito?.userId"
    :remote-items="UserStore().UserMetadata?.RemoteItems ?? []"
    @set-query-result="queryResult = $event"
    @set-share-code="shareCode = $event">
    <template #result>
      <div v-if="queryResult === null"
        class="text-center">
        <v-progress-circular indeterminate
          color="primary"></v-progress-circular>
      </div>
      <div v-else>
        <v-row dense
          class="mb-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Name</v-col>
          <v-col cols="9">{{ queryResult.name }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Author</v-col>
          <v-col cols="9">{{ queryResult.author }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Type</v-col>
          <v-col cols="9">{{ queryResult.sortkey.split('_')[1] }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Created</v-col>
          <v-col cols="9">{{ new Date(queryResult.created).toLocaleString() }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Last Updated</v-col>
          <v-col cols="9">{{ new Date(queryResult.item_modified).toLocaleString() }}</v-col>
        </v-row>
      </div>
    </template>
    <template #actions>
      <cc-button color="primary"
        class="my-1"
        :loading="dlLoading"
        :disabled="isUserOwned"
        tooltip="Adding this item as a remote resource will create a readonly version of this item linked
            to the author's original data. When the author saves an update to this item to their
            COMP/CON cloud account, your local version can receive those changes."
        @click="downloadAsRemote()">
        add as remote resource
      </cc-button>
      <br />
      <cc-button size="small"
        color="primary"
        :loading="dlLoading"
        tooltip="Adding this item as a local copy will create a new, editable version of this item saved
            to your local COMP/CON data. Changes made to this item will not affect the author's
            original data, and you will not receive updates from the author."
        @click="downloadAsCopy(false)">
        add as local copy
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CloudController } from '@/classes/components/cloud/CloudController';
import { DownloadViaCode } from '@/io/apis/account';
import { UserStore } from '@/stores';

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
