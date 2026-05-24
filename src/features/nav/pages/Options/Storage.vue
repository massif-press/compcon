<template>
  <v-container :class="!mobile && 'px-12'">
    <v-card-text v-if="size.usage && size.quota"
      class="flavor-text">
      <v-progress-linear :model-value="((size.usage / size.quota) * 100).toFixed(3)"
        height="20"
        class="mb-5"
        tile
        color="primary">
        <v-chip small
          tile
          variant="elevated"
          color="primary-lighten-5"
          style="opacity: 0.5">
          {{ ((size.usage / size.quota) * 100).toFixed(3) }}%
        </v-chip>
      </v-progress-linear>

      <p class="px-2">
        {{ st.storageUsagePrefix }} {{ bytesToSize(size.usage) }} of {{ bytesToSize(size.quota) }},
        or
        <b class="text-accent">{{ ((size.usage / size.quota || 1) * 100).toFixed(3) }}%</b>
        {{ st.storageUsageSuffix }}
      </p>

      <div class="mb-4">
        <cc-heading is-title
          :text="st.storageSettings" />
        <cc-heading is-title
          small
          :text="st.storageThresholds" />
        <v-range-slider v-model="storageRange"
          thumb-label
          hide-details
          strict
          tile
          type="number"
          track-fill-color="secondary"
          color="primary"
          @end="updateUserStorage" />
        <v-row dense
          class="mt-2">
          <v-col cols="auto">
            <v-btn-toggle v-model="thresholdType"
              flat
              tile
              density="compact">
              <v-btn value="pct"
                :color="thresholdType === 'pct' ? 'primary' : 'panel'"
                size="x-small">
                <v-icon size="large"
                  icon="mdi-percent" />
              </v-btn>
              <v-btn value="abs"
                :color="thresholdType === 'abs' ? 'primary' : 'panel'"
                size="x-small">
                <v-icon size="large"
                  icon="mdi-database" />
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col v-if="thresholdType === 'pct'">
            <v-text-field v-model.number="storageRange[0]"
              :label="st.warningThresholdPct"
              type="number"
              min="0"
              :max="storageRange[1]"
              variant="outlined"
              tile
              hide-details
              density="compact"
              @change="updateUserStorage" />
          </v-col>
          <v-col v-else>
            <v-text-field v-model.number="warnMb"
              :label="st.warningThresholdMb"
              type="number"
              min="0"
              :max="maxMb"
              variant="outlined"
              tile
              hide-details
              density="compact" />
          </v-col>
          <v-col v-if="thresholdType === 'pct'">
            <v-text-field v-model.number="storageRange[1]"
              :label="st.maxThresholdPct"
              type="number"
              :min="storageRange[0]"
              max="100"
              variant="outlined"
              tile
              hide-details
              density="compact"
              @change="updateUserStorage" />
          </v-col>
          <v-col v-else>
            <v-text-field v-model.number="maxMb"
              :label="st.maxThresholdMb"
              type="number"
              :min="warnMb"
              variant="outlined"
              tile
              hide-details
              density="compact" />
          </v-col>
        </v-row>
        <div class="text-caption text-right text-stark">
          {{ st.warningDescription }} {{ storageRange[0].toFixed(2) }}{{ st.ofAvailableStorage }}
          <b class="text-accent">{{ bytesToSize((storageRange[0] / 100) * size.quota) }}</b>
          {{ st.hasBeenUsed }}
        </div>
        <div class="text-caption text-right text-stark">
          {{ st.maxDescription }} {{ storageRange[1].toFixed(2) }}{{ st.ofAvailableStorage }}
          <b class="text-accent">{{ bytesToSize((storageRange[1] / 100) * size.quota) }}</b>
          {{ st.hasBeenUsed }}
        </div>
      </div>

      <div class="mb-8">
        <cc-heading is-title
          small
          :text="st.autoDelete" />

        <cc-select v-model="deleteDays"
          :items="deleteDaySelections"
          hide-details
          density="compact"
          @update:model-value="updateDeleteDays()" />
        <div class="text-caption text-right text-stark">
          <span v-if="!deleteDays">
            COMP/CON will <b class="text-accent">never</b> automatically delete data marked for
            deletion.
          </span>
          <span v-else>
            COMP/CON will permanently delete data after it has been marked as deleted for at least
            <b class="text-accent">{{ deleteDays }} days.</b>
            This will not affect items not already marked for deletion.
          </span>
        </div>
      </div>
    </v-card-text>
    <v-card-text v-else
      class="flavor-text">
      {{ st.noStorageAccess }}
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      :text="st.deletedItems" />
    <v-card-text>
      <deleted-items />
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      :text="st.userData" />
    <user-data-viewer />

    <v-dialog v-model="deleteDialog"
      width="80%">
      <template #activator="{ props }">
        <div class="text-center">
          <cc-button size="large"
            variant="outlined"
            color="error"
            class="my-6"
            append-icon="mdi-alert-outline"
            prepend-icon="mdi-alert-outline"
            v-bind="props">
            {{ st.clearAllData }}
          </cc-button>
        </div>
      </template>
      <v-card flat
        tile>
        <v-card-text>
          <v-alert prominent
            dark
            color="error"
            icon="mdi-alert-circle"
            border="bottom"
            class="my-3">
            <span class="heading h2">{{ st.deleteWarningBanner }}</span>
          </v-alert>
          <p class="text-center heading h2 text-text">
            This will delete
            <b class="text-accent">{{ st.deleteAllConfirm }}</b>
            {{ st.deleteLocalData }}
            <br />
            This
            <b class="text-accent">{{ st.cannotBeUndone }}</b>
            <br />
            <br />
            <b class="text-accent">{{ st.areYouSure }}</b>
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="secondary"
            variant="text"
            large
            @click="deleteDialog = false">
            Dismiss
          </v-btn>
          <v-spacer />
          <v-btn color="error"
            variant="text"
            @click="deleteAll">
            <v-icon start
              size="x-large"
              icon="mdi-alert-outline" />
            {{ st.deleteAllUserData }}
            <v-icon end
              size="x-large"
              icon="mdi-alert-outline" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import DeletedItems from './components/DeletedItems.vue'
import UserDataViewer from './components/UserDataViewer.vue'
import { ClearAllData, GetLength, GetTotalStorageSize } from '@/io/Storage'
import logger from '@/user/logger'
import { UserStore } from '@/stores'
import { NAV_STRINGS } from '@/features/nav/strings'

const { mdAndDown: mobile } = useDisplay()
const st = NAV_STRINGS.storage

const user = computed(() => UserStore().User)

const deleteDaySelections = [
  { title: 'Never', value: 0 },
  { title: '1 Week', value: 7 },
  { title: '2 Weeks', value: 14 },
  { title: '1 Month', value: 30 },
  { title: '3 Months', value: 90 },
  { title: '6 Months', value: 180 },
  { title: '1 Year', value: 365 },
]

const deleteDialog = ref(false)
const storageRange = ref([0, 0])
const deleteDays = ref(0)
const size = ref<StorageEstimate>({})
const thresholdType = ref('pct')

const warnMb = computed({
  get: () => {
    if (!size.value.quota) return 0
    return Number(((storageRange.value[0] / 100) * size.value.quota / (1024 * 1024)).toFixed(1))
  },
  set: (val: number) => {
    if (!size.value.quota) return
    const pct = (Number(val) * 1024 * 1024 / size.value.quota) * 100
    storageRange.value[0] = Math.max(0, Math.min(pct, storageRange.value[1]))
    updateUserStorage()
  },
})

const maxMb = computed({
  get: () => {
    if (!size.value.quota) return 0
    return Number(((storageRange.value[1] / 100) * size.value.quota / (1024 * 1024)).toFixed(1))
  },
  set: (val: number) => {
    if (!size.value.quota) return
    const pct = (Number(val) * 1024 * 1024 / size.value.quota) * 100
    storageRange.value[1] = Math.max(storageRange.value[0], Math.min(pct, 100))
    updateUserStorage()
  },
})

watch(thresholdType, (val) => {
  if (val === 'pct') {
    storageRange.value[0] = Math.round(storageRange.value[0] * 100) / 100
    storageRange.value[1] = Math.round(storageRange.value[1] * 100) / 100
  }
})

onMounted(async () => {
  storageRange.value[0] = user.value.StorageWarning
  storageRange.value[1] = user.value.StorageMax
  deleteDays.value = user.value.AutoDeleteDays

  const est = await navigator.storage.estimate()
  const actualUsage = await GetTotalStorageSize()
  size.value = { usage: actualUsage, quota: est.quota }

  if (!est.usage || !est.quota) {
    logger.info(`navigator storage estimate: ${est.usage} / ${est.quota}`, null)
  } else {
    logger.info(`navigator storage estimate: ${bytesToSize(est.usage)} / ${bytesToSize(est.quota)}`, null)
  }
})

function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

async function deleteAll() {
  await ClearAllData()
  deleteDialog.value = false
  window.location.reload()
}

function updateUserStorage() {
  const warn = Number(storageRange.value[0])
  if (isNaN(warn)) return
  const max = Number(storageRange.value[1])
  if (isNaN(max)) return
  if (!warn || warn < 0) storageRange.value[0] = 1
  if (max > 100) storageRange.value[1] = 100
  if (warn > max) storageRange.value[0] = max

  if (thresholdType.value === 'pct') {
    storageRange.value[0] = Math.round(storageRange.value[0] * 100) / 100
    storageRange.value[1] = Math.round(storageRange.value[1] * 100) / 100
  }

  user.value.StorageWarning = storageRange.value[0]
  user.value.StorageMax = storageRange.value[1]
}

function updateDeleteDays() {
  user.value.AutoDeleteDays = deleteDays.value
}
</script>
