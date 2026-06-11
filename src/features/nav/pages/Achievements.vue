<template>
  <v-card-text>
    <!-- <v-btn @click="adddebug()">add debug achievement</v-btn>
    {{ user.Achievements }} {{ allUnlocked }} -->
    <v-row align="center">
      <v-col v-if="!showDetail"
        cols="auto">
        <v-icon size="70"
          :icon="`cc:achievement_${aRank}`" />
      </v-col>
      <v-col>
        <v-progress-linear :model-value="(allUnlocked.length / nsAchievements.length) * 100"
          height="30"
          tile
          color="accent"
          @click="showDetail = !showDetail">
          <span class="text-cc-overline">
            {{ ((allUnlocked.length / nsAchievements.length) * 100).toFixed(2) }}%
          </span>
        </v-progress-linear>

        <div class="text-cc-overline text-right text-disabled">
          {{ $t('nav.achievements.progress', { count: allUnlocked.length, total: nsAchievements.length }) }}
          <v-btn icon
            size="x-small"
            variant="plain"
            @click="showDetail = !showDetail">
            <v-icon size="20"
              :icon="showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </v-btn>
          <v-expand-transition>
            <v-card v-if="showDetail"
              variant="outlined"
              flat
              tile>
              <v-card-text>
                <div class="text-cc-overline text-center font-weight-bold">{{ ac.byRarity }}</div>
                <div v-for="(r, i) in rarities"
                  :key="`rarity-${i}`">
                  <v-progress-linear
                    :model-value="(byRarity(i + 1).has / byRarity(i + 1).total) * 100"
                    height="25px"
                    class="my-2"
                    tile
                    :color="rarityColors[i]">
                    <span style="text-transform: capitalize">{{ r }}</span>
                  </v-progress-linear>
                  <div v-if="!mobile"
                    class="text-caption font-italic mt-n2">
                    {{ byRarity(i + 1).has }} / {{ byRarity(i + 1).total }} ({{
                      ((byRarity(i + 1).has / byRarity(i + 1).total) * 100).toFixed(2)
                    }}%)
                  </div>
                </div>
                <v-divider class="my-2" />
                <div class="text-cc-overline text-center font-weight-bold">{{ ac.byLabel }}</div>
                <v-row dense>
                  <v-col v-for="(l, lIdx) in labels"
                    :key="`label-${lIdx}`"
                    cols="6">
                    <v-progress-linear :model-value="(byLabel(l).has / byLabel(l).total) * 100"
                      height="20px"
                      color="primary">
                      {{ l }}
                    </v-progress-linear>
                    <div v-if="!mobile"
                      class="text-caption font-italic">
                      {{ byLabel(l).has }} / {{ byLabel(l).total }} ({{
                        ((byLabel(l).has / byLabel(l).total) * 100).toFixed(2)
                      }}%)
                    </div>
                  </v-col>
                  <v-col v-if="allUnlockedSecret.length > 0"
                    cols="6">
                    <v-progress-linear :model-value="100"
                      height="20px"
                      color="deep-purple">
                      {{ ac.secretAchievements }}
                    </v-progress-linear>
                    <div class="text-caption font-italic">
                      {{ allUnlockedSecret.length }} {{ ac.discovered }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <div class="text-cc-overline ml-n2">{{ ac.display }}</div>
        <v-row justify="space-between"
          dense>
          <v-col>
            <v-btn-toggle v-model="showRarity"
              color="primary"
              multiple
              flat
              tile
              density="compact"
              class="py-1">
              <v-btn size="small">{{ ac.common }}</v-btn>
              <v-btn size="small">{{ ac.epic }}</v-btn>
              <v-btn size="small">{{ ac.legendary }}</v-btn>
              <v-btn size="small">{{ ac.mythic }}</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-btn-toggle v-model="showLock"
              color="primary"
              flat
              tile
              multiple
              density="compact"
              class="py-1">
              <v-btn size="small">{{ ac.locked }}</v-btn>
              <v-btn size="small">{{ ac.unlocked }}</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="auto">
            <v-btn-toggle v-model="showHidden"
              color="primary"
              multiple
              flat
              tile
              density="compact"
              class="py-1">
              <v-btn size="small">{{ ac.hidden }}</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-select v-model="showLabels"
          :items="labels"
          multiple
          flat
          tile
          density="compact"
          variant="outlined"
          class="mt-2">
          <template #selection="{ item, index }">
            <v-chip v-if="index < (mobile ? 7 : 11)"
              size="small">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === (mobile ? 7 : 11)"
              class="text-grey text-caption align-self-center">
              &emsp;{{ $t('nav.achievements.othersCount', { count: showLabels.length - (mobile ? 7 : 11) }) }}
            </span>
          </template>

          <template #prepend-item>
            <v-list-item title="Select All">
              <template #prepend>
                <v-checkbox-btn :model-value="showLabels.length === labels.length"
                  :indeterminate="showLabels.length > 0 && showLabels.length < labels.length"
                  @click="setAllLabels()" />
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row align="end">
      <v-col cols="12"
        md="8">
        <div class="text-cc-overline ml-n2">{{ ac.sort }}</div>
        <v-btn color="primary"
          size="x-small"
          flat
          tile
          @click="sort = 'none'">{{ ac.none }}</v-btn>
        <v-btn color="primary"
          size="x-small"
          flat
          tile
          @click="sort = sort === 'name_asc' ? 'name_desc' : 'name_asc'">
          {{ ac.name }}
        </v-btn>
        <v-btn color="primary"
          size="x-small"
          flat
          tile
          @click="sort = sort === 'rarity_asc' ? 'rarity_desc' : 'rarity_asc'">
          {{ ac.rarity }}
        </v-btn>
        <v-btn color="primary"
          size="x-small"
          flat
          tile
          @click="sort = sort === 'date_asc' ? 'date_desc' : 'date_asc'">
          {{ ac.dateUnlocked }}
        </v-btn>
        <div class="pt-2">
          <cc-text-field v-model="search"
            color="primary"
            clearable
            :width="mobile ? '320' : '480'"
            variant="outlined"
            icon="mdi-magnify" />
        </div>
      </v-col>
      <v-col cols="12"
        md="4">
        <cc-text-field v-model="addCode"
          :loading="achLoading"
          color="exotic"
          variant="outlined"
          append-inner-icon="mdi-plus"
          icon="mdi-barcode-scan"
          @click-append-inner="addAchievement()" />
      </v-col>
    </v-row>
    <v-container class="pt-1"
      :class="mobile && 'px-0'">
      <achievement-item v-for="(a, aIdx) in shownAchievements"
        :key="`achievement-${aIdx}`"
        :item="a" />
      <div v-if="hiddenAchievements > 0"
        class="text-right text-caption px-4">
        <i>
          {{ $t('nav.achievements.hiddenCount', { count: hiddenAchievements }, hiddenAchievements) }}
        </i>
      </div>
    </v-container>

    <v-row class="text-center">
      <v-col cols="auto">
        <cc-button size="small"
          color="primary"
          variant="elevated"
          @click="exportBackup()">
          {{ ac.createBackup }}
        </cc-button>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <cc-dialog v-model="importDialog"
          :close-on-click="false">
          <template #activator="{ open }">
            <cc-button size="x-small"
              color="primary"
              class="mx-3"
              @click="open">
              {{ ac.loadBackup }}
            </cc-button>
          </template>
          <v-card-text class="pa-6">
            <p class="text-center">
              <i18n-t keypath="nav.achievements.warningDataFull"
                tag="span"
                scope="global">
                <template #emphasis>
                  <b class="text-accent">{{ ac.overwriteAllWarning }}</b>
                </template>
              </i18n-t>
              <br />
              <br />
              <i18n-t keypath="nav.achievements.cannotBeUndoneFull"
                tag="span"
                scope="global">
                <template #emphasis>
                  <b class="text-accent">{{ ac.cannot }}</b>
                </template>
              </i18n-t>
            </p>
            <br />
            <v-file-input v-model="fileValue"
              accept=".json"
              variant="outlined"
              density="compact"
              hide-details
              autofocus
              :label="ac.selectExportFile"
              prepend-icon="mdi-paperclip"
              @change="importBackup()" />
          </v-card-text>
        </cc-dialog>
      </v-col>
      <v-col cols="auto">
        <cc-dialog :close-on-click="false"
          title="reset achievements">
          <template #activator="{ open }">
            <cc-button size="x-small"
              color="error"
              variant="outlined"
              @click="open()">
              {{ ac.resetAchievements }}
            </cc-button>
          </template>
          <template #default="{ close }">
            <v-card-text class="pa-6">
              <p class="text-center">
                <i18n-t keypath="nav.achievements.warningDataFull"
                  tag="span"
                  scope="global">
                  <template #emphasis>
                    <b class="text-accent">{{ ac.eraseAllWarning }}</b>
                  </template>
                </i18n-t>
                <br />
                <i18n-t keypath="nav.achievements.cannotBeUndoneFull"
                  tag="span"
                  scope="global">
                  <template #emphasis>
                    <b class="text-accent">{{ ac.cannot }}</b>
                  </template>
                </i18n-t>
              </p>
              <cc-button color="error"
                block
                class="mt-4"
                @click="clearAchievements(close)">
                {{ ac.resetAchievements }}
                <template #info>
                  <v-icon icon="mdi-alert" />
                </template>
              </cc-button>
            </v-card-text>
          </template>
        </cc-dialog>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { orderBy, uniq } from 'lodash-es'
import AchievementItem from './_components/AchievementItem.vue'
import { UserStore } from '@/stores'
import { AchievementManager } from '@/user/achievements/AchievementManager'
import { GetAchievement } from '@/io/apis/account'
import logger from '@/user/logger'
import { notify } from '@/util/notify'
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

const { smAndDown: mobile } = useDisplay()
const ac = section('achievements')

defineEmits<{ close: [] }>()

const user = computed(() => UserStore().User)
const achievements = computed(() => AchievementManager.Instance.Achievements)
const nsAchievements = computed(() => achievements.value.filter(a => !a.Secret))
const allUnlocked = computed(() => achievements.value.filter(x => x.Unlocked))
const allUnlockedSecret = computed(() => achievements.value.filter(x => x.Unlocked && x.Secret))
const labels = computed(() => uniq(achievements.value.flatMap(a => a.Labels)))
const extras = computed(() => achievements.value.filter(a => a.Secret && !a.Unlocked).length)

const showRarity = ref([0, 1, 2, 3])
const showLock = ref([0, 1])
const showHidden = ref([0])
const showLabels = ref<string[]>([])
const sort = ref('date_desc')
const showDetail = ref(false)
const rarities = ['Common', 'Epic', 'Legendary', 'Mythic']
const importDialog = ref(false)
const fileValue = ref<any>(null)
const search = ref('')
const rarityColors = ['blue-accent-4', 'purple-darken-2', 'deep-orange-accent-4', '#d4af37', 'red-accent-4']
const addCode = ref('')
const achLoading = ref(false)

const aRank = computed(() => {
  const pct = allUnlocked.value.length / nsAchievements.value.length
  if (pct > 0.75) return '3'
  if (pct > 0.5) return '2'
  return '1'
})

const shownAchievements = computed(() => {
  let shown = achievements.value.filter(a => {
    if (!showRarity.value.includes(a.Rarity - 1)) return false
    if (!showLock.value.includes(a.Unlocked ? 1 : 0)) return false
    if (!showHidden.value.length && a.Hidden) return false
    if (search.value) {
      if (a.Hidden && !a.Unlocked) return false
      const s = search.value.toLowerCase()
      if (!a.Name.toLowerCase().includes(s) && !a.Description.toLowerCase().includes(s)) return false
    }
    return true
  })

  shown = shown.filter(a => a.Labels.some(l => showLabels.value.includes(l)))

  switch (sort.value) {
    case 'name_asc': return orderBy(shown, a => a.Name.toLowerCase(), 'asc')
    case 'name_desc': return orderBy(shown, a => a.Name.toLowerCase(), 'desc')
    case 'rarity_asc': return orderBy(shown, a => a.Rarity, 'asc')
    case 'rarity_desc': return orderBy(shown, a => a.Rarity, 'desc')
    case 'date_asc': return orderBy(shown, a => a.Date || Infinity, 'asc')
    case 'date_desc': return orderBy(shown, a => a.Date || -1, 'desc')
    default: return shown
  }
})

const hiddenAchievements = computed(() =>
  nsAchievements.value.length - shownAchievements.value.length - extras.value
)

onMounted(() => {
  showLabels.value = labels.value
})

function setAllLabels() {
  showLabels.value = showLabels.value.length === labels.value.length ? [] : labels.value
}

function byRarity(rarity: number) {
  return {
    has: achievements.value.filter(a => a.Rarity === rarity && a.Unlocked).length,
    total: nsAchievements.value.filter(a => a.Rarity === rarity).length,
  }
}

function byLabel(label: string) {
  return {
    has: achievements.value.filter(a => a.Labels.includes(label) && a.Unlocked).length,
    total: nsAchievements.value.filter(a => a.Labels.includes(label)).length,
  }
}

function exportBackup() {
  const jsonBlob = new Blob([JSON.stringify(user.value.AchievementUnlocks)], { type: 'application/json' })
  const url = window.URL.createObjectURL(jsonBlob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'cc_achievement_archive.json')
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}

async function importBackup() {
  if (!fileValue.value) return
  const file = fileValue.value[0]
  const json = await file.text()
  const data = JSON.parse(json)
  user.value.AchievementUnlocks = data
  importDialog.value = false
}

async function clearAchievements(close: () => void) {
  logger.info('clearing achievements', null)
  user.value.AchievementUnlocks = []
  await user.value.save()
  if (UserStore().IsLoggedIn && UserStore().SyncSettings.includeSettings) {
    await UserStore().setUserMetadata()
  }
  window.location.reload()
}

async function addAchievement() {
  achLoading.value = true
  if (!addCode.value) return
  try {
    const code = addCode.value.trim().toUpperCase()
    const res = await GetAchievement(code)
    const alreadyUnlocked = AchievementManager.Instance.Unlock(res)
    if (alreadyUnlocked) throw new Error('Already Unlocked')
  } catch (e) {
    logger.error(`Error adding achievement: ${e}`, null, e)
    notify({
      title: ac.cannotAddTitle,
      text: ac.cannotAddText,
      data: { icon: 'mdi-star-off', color: 'error' },
    })
  }
  achLoading.value = false
}
</script>
