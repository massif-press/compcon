<template>
  <cc-share-code-importer ref="importer"
    import-type="pilot"
    block-btn
    :title="$t('active.titles.addFromShareCode')"
    :user-id="userId"
    :remote-items="remoteItems"
    @set-query-result="queryResult = $event">
    <template #result>
      <share-code-result :query-result="queryResult" />
    </template>
    <template #actions>
      <cc-button color="primary"
        class="mb-1 mt-4 text-left"
        block
        :loading="dlLoading"
        :tooltip="$t('active.tooltips.thisWillAddACopy')"
        @click="addToEncounter">
        {{ $t('active.roster.addToEncounter') }}
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CloudController } from '@/classes/components/cloud/CloudController';
import { downloadFromS3 } from '@/io/apis/account';
import { UserStore } from '@/stores';
import ShareCodeResult from '@/shared/ShareCodeResult.vue';
import { Pilot } from '@/classes/pilot/Pilot';

defineOptions({ name: 'ShareCodeDialog' })

const props = defineProps<{
  pilots: Pilot[]
}>()

const emit = defineEmits<{
  'close': []
  'add': [item: Pilot]
}>()

const importer = ref<any>(null)

const queryResult = ref(null as any)
const dlLoading = ref(false)

const userId = computed(() => { return UserStore().Cognito?.userId })
const remoteItems = computed(() => { return UserStore().UserMetadata?.RemoteItems ?? [] })

async function addToEncounter() {
  dlLoading.value = true;
  const itemData = await downloadFromS3(queryResult.value.uri);
  const itemType = queryResult.value.sortkey.split('_')[1];
  const item = await CloudController.NewByType(itemType, itemData) as Pilot;

  props.pilots.push(item);

  emit('add', item);

  dlLoading.value = false;
  importer.value.reset();
  importer.value.$refs.modal.close();
}
</script>
