<template>
  <cc-share-code-importer ref="importer"
    import-type="collection"
    :title="$t('mainMenu.titles.addNewSubscription')"
    :user-id="userId"
    :remote-items="remoteItems"
    @set-query-result="queryResult = $event">
    <template #result>
      <collection-info :collection="queryResult" />
    </template>

    <template #actions>
      <cc-button flat
        color="accent"
        class="mb-1"
        :loading="dlLoading"
        @click="subscribe()">
        {{ $t('mainMenu.ui.subscribe') }}
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserStore } from '@/stores';
import CollectionInfo from './collectionInfo.vue';

defineOptions({ name: 'ShareCodeDialog' })

const importer = ref<any>(null)

const queryResult = ref(null as any)
const dlLoading = ref(false)

const userId = computed(() => { return UserStore().Cognito?.userId })
const remoteItems = computed(() => { return UserStore().UserMetadata?.RemoteItems ?? [] })

async function subscribe() {
      dlLoading.value = true;
      if (!queryResult.value) return;
      await UserStore().addContentSubscription(queryResult.value);
      await UserStore().updateRemoteCollection(queryResult.value);
      dlLoading.value = false;
      importer.value.reset();
      importer.value.close();
    }
</script>
