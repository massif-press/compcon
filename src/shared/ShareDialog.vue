<template>
  <v-card-text :class="mobile && 'px-0'">
    <cc-alert density="compact"
      class="text-text"
      :title="$t('share.titles.pleaseUseResponsibly')"
      icon="mdi-alert">
      {{ $t('share.shareCodesNote') }}
    </cc-alert>

    <v-row dense
      class="mt-4 mx-1"
      justify="space-around">
      <v-col cols="auto">
        <div class="text-cc-overline text-disabled">{{ $t('share.lastLocalUpdate') }}</div>
        <div class="font-weight-bold pt-1">
          {{ localModifiedLabel }}
        </div>
      </v-col>
      <v-col cols="auto">
        <div class="text-cc-overline text-disabled">{{ $t('share.lastSynced') }}</div>
        <div class="font-weight-bold pt-1 d-flex align-center ga-1">
          <v-progress-circular v-if="metaRefreshing"
            indeterminate
            size="14"
            width="2" />
          <span>{{ lastSyncLabel }}</span>
        </div>
      </v-col>
      <v-col cols="auto">
        <div class="text-cc-overline text-disabled">{{ $t('common.status') }}</div>
        <div class="d-flex align-center">
          <v-chip v-if="!hasSynced"
            color="warning"
            size="small"
            prepend-icon="mdi-cloud-upload-outline">
            {{ $t('share.notYetSynced') }}
          </v-chip>
          <v-chip v-else-if="!syncedState"
            color="warning"
            size="small"
            prepend-icon="mdi-cloud-sync">
            {{ $t('share.syncNeeded') }}
          </v-chip>
          <v-chip v-else
            color="success"
            size="small"
            class="rounded-0 rounded-be-lg"
            prepend-icon="mdi-cloud-check-variant-outline">
            {{ $t('mainMenu.subscriptions.upToDate') }}
          </v-chip>
        </div>
      </v-col>
      <v-col v-if="!syncedState"
        cols="auto">
        <cc-button size="small"
          color="primary"
          class="ml-2 mt-3"
          :loading="syncing"
          prepend-icon="mdi-sync"
          @click="syncItem">
          {{ $t('common.syncNow') }}
        </cc-button>
      </v-col>
    </v-row>

    <div v-if="shareCode"
      :class="mobile && 'text-center'">
      <v-row justify="center">
        <v-col cols="auto">
          <div class="text-cc-overline mt-4">
            {{ item.ItemType.toUpperCase() }} {{ $t('common.shareCode') }}
            <v-tooltip>
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="mdi-information-slab-box-outline"
                  size="x-large" />
              </template>
              <div>
                {{ $t('share.shareCodeTooltip') }}
              </div>
            </v-tooltip>
          </div>
          <b class="text-accent"
            style="font-size: calc(30px + 2vw)"
            v-text="`${shareCode.slice(0, 4)}-${shareCode.slice(4, 8)}-${shareCode.slice(8, 12)}`" />
          <v-tooltip :text="$t('share.tooltips.copyShareCodeToClipboard')">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                @click.stop="copy()">mdi-clipboard-text-outline</v-icon>
            </template>
          </v-tooltip>

          <fieldset v-if="isPilot"
            class="px-2 pb-2">
            <legend class="text-cc-overline mt-4 mx-3 px-2">
              {{ $t('share.shareLink') }}
            </legend>
            <v-row no-gutters
              align="end">
              <v-col>
                <i18n-t keypath="share.publicLinkNote"
                  tag="div"
                  scope="global"
                  class="text-caption text-center">
                  <template #emphasis><b class="text-accent">{{ $t('share.publicLinkNoteBold') }}</b></template>
                </i18n-t>
                <v-text-field v-model="shareLink"
                  readonly
                  flat
                  tile
                  density="compact"
                  hide-details
                  class="my-1"
                  style="font-size: calc(16px + 0.5vw)"
                  @click="copyShareLink()">
                  <template #append-inner>
                    <v-tooltip :text="$t('share.tooltips.copyShareLinkToClipboard')">
                      <template #activator="{ props }">
                        <v-icon v-bind="props"
                          @click.stop="copyShareLink()">
                          mdi-clipboard-text-outline
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row dense
              align="center">
              <v-col>
                <div class="text-cc-overline">{{ $t('share.sheetStyle') }}</div>
                <cc-select v-model="linkStyle"
                  density="compact"
                  hide-details
                  chip-variant="text"
                  :items="[
                    { title: 'Full', value: 'full' },
                    { title: 'Build Only', value: 'build' },
                  ]" />
              </v-col>
              <v-col>
                <div class="text-cc-overline">{{ $t('share.includeMech') }}</div>
                <cc-select v-model="shareMech"
                  density="compact"
                  chip-variant="text"
                  :items="mechOptions" />
              </v-col>
            </v-row>
          </fieldset>
        </v-col>
      </v-row>
    </div>
    <v-alert v-else
      flat
      tile
      variant="tonal"
      color="warning"
      class="mt-4 text-center">
      {{ $t('share.noShareCode') }}
    </v-alert>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { getUserDataChanged } from '@/io/apis/account'
import { UserStore } from '@/stores'
import { notify } from '@kyvg/vue3-notification'
import logger from '@/user/logger'
import { i18n } from '@/i18n'

const t = i18n.global.t

const props = defineProps<{ item: any }>()

const { smAndDown: mobile } = useDisplay()

const linkStyle = ref('full')
const shareMech = ref('')
const syncing = ref(false)
const metaRefreshing = ref(false)
const postSyncTime = ref<number | null>(null)

async function refreshCloudMetadata() {
  const sortkey = props.item.CloudController?.Metadata?.SortKey
  const updated = props.item.CloudController?.Metadata?.Updated
  if (!UserStore().IsLoggedIn || !sortkey || !updated) return
  metaRefreshing.value = true
  try {
    const { items } = await getUserDataChanged(UserStore().Cognito.userId!, updated)
    const fresh = items.find((i: any) => i.sortkey === sortkey)
    if (fresh) props.item.CloudController.Metadata = fresh
  } catch (e) {
    logger.warn('ShareDialog: failed to refresh cloud metadata', e)
  } finally {
    metaRefreshing.value = false
  }
}

onMounted(refreshCloudMetadata)

const isPilot = computed(() => Array.isArray(props.item.Mechs))

const shareCode = computed(() => props.item.CloudController.ShareCode)
const hasSynced = computed(() => !!postSyncTime.value || !!props.item.CloudController.Metadata?.Updated)
const lastSyncLabel = computed(() => timeAgo(postSyncTime.value ?? props.item.CloudController.Metadata?.Updated, 'Never'))
const syncedState = computed(() => !!postSyncTime.value || props.item.CloudController.isSynced)

const shareLink = computed(
  () => `https://compcon.app/link/pilot/${shareCode.value}/${linkStyle.value}/${shareMech.value}`
)

const mechOptions = computed(() => {
  if (!isPilot.value) return []
  const arr: { title: string; value: string }[] = [{ title: 'None', value: '' }]
  arr.push(...props.item.Mechs.map((m: any) => ({
    title: `${m.Name} (${m.Frame.Source} ${m.Frame.Name})`,
    value: m.ID,
  })))
  return arr
})

function timeAgo(t: number | undefined | null, fallback: string): string {
  if (!t) return fallback
  const diff = Date.now() - t
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
  return new Date(t).toLocaleDateString()
}

const localModifiedLabel = computed(() => timeAgo(props.item.SaveController?.LastModified, 'Unknown'))

function copy() {
  navigator.clipboard.writeText(shareCode.value)
}

function copyShareLink() {
  navigator.clipboard.writeText(shareLink.value)
}

async function syncItem() {
  if (UserStore().IsSyncing) {
    notify({
      title: t('notify.share.syncInProgressTitle'),
      text: t('notify.share.syncInProgressText'),
      data: { icon: 'mdi-sync', color: 'info' },
    })
    return
  }
  syncing.value = true
  const name = props.item.Callsign || props.item.Name
  try {
    if (props.item.CloudController.Metadata?.Updated) {
      await props.item.CloudController.syncFromCloud()
    } else {
      await CloudController.ForceUpload(props.item)
    }
    postSyncTime.value = Date.now()
    notify({
      title: t('notify.share.syncCompleteTitle'),
      text: t('notify.share.syncCompleteText', { name }),
      data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
    })
  } catch (err) {
    logger.error(`ShareDialog: sync failed for ${name}`, err)
    notify({
      title: t('notify.share.syncFailedTitle'),
      text: t('notify.share.syncFailedText', { err: String(err) }),
      data: { icon: 'mdi-alert', color: 'error' },
    })
  } finally {
    syncing.value = false
  }
}
</script>
