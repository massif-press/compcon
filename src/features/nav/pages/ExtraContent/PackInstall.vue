<template>
  <v-card-text :style="mobile ? 'margin-top: 24px; padding: 8px' : 'margin-top: 8px'">
    <v-row class="packInstaller"
      style="height: 100%">
      <v-col :style="mobile ? '' : 'height: calc(95vh - 83px)'"
        style="overflow-y: scroll"
        cols="12"
        md="4"
        class="px-3 py-4">
        <v-file-input v-model="value"
          :placeholder="$t('nav.packInstall.selectFile')"
          variant="outlined"
          type="file"
          accept=".lcp"
          prepend-icon="cc:content_manager"
          clearable
          multiple
          clear-icon="mdi-close"
          tile
          chips
          density="compact"
          @click:clear="reset()"
          @change="fileChange($event)" />
        <cc-button block
          type="flat"
          size="small"
          :disabled="disableInstall"
          color="primary"
          @click="install">
          <template #info>
            <v-icon icon="mdi-tray-arrow-down" />
          </template>

          <span>{{ $t('nav.packInstall.install') }}</span>
        </cc-button>
        <v-progress-linear v-if="installing"
          indeterminate
          height="20" />
        <cc-alert v-if="hasAlreadyInstalled"
          color="warning"
          class="my-3">
          <span class="text-caption">
            {{ $t('nav.packInstall.alreadyInstalledWarning', alreadyInstalledCount) }}:
          </span>
          <div v-for="pack in contentPacks.filter((x) => packAlreadyInstalled(x))"
            :key="pack.id"
            class="text-caption">
            <b>{{ pack.manifest.name }}</b>
            {{ $t('nav.packInstall.byAuthorVersion', {
              author: pack.manifest.author, version:
                alreadyInstalledVersion(pack) }) }}
            <div class="ml-3 mb-2"
              style="margin-top: -2px">
              <v-chip v-if="gradeType(pack) === 'upgrade'"
                color="success"
                size="x-small"
                variant="elevated"
                class="elevation-0">
                <v-icon start
                  icon="mdi-arrow-up" />
                {{ $t('nav.packInstall.upgradeFromTo', {
                  from: alreadyInstalledVersion(pack), to:
                    pack.manifest.version }) }}
              </v-chip>
              <v-chip v-else-if="gradeType(pack) === 'downgrade'"
                color="error"
                size="x-small"
                variant="elevated"
                class="elevation-0">
                <v-icon start
                  icon="mdi-arrow-down" />
                {{ $t('nav.packInstall.downgradeTo', { version: pack.manifest.version }) }}
              </v-chip>
              <i v-else>
                <v-icon class="pb-1"
                  icon="mdi-swap-horizontal" />
                {{ $t('nav.packInstall.noChange', {
                  from: pack.manifest.version, to:
                    pack.manifest.version
                }) }}
              </i>
            </div>
          </div>
        </cc-alert>

        <cc-alert v-if="contentPacks.some((x) => !x.manifest.v3)"
          color="warning"
          class="my-3">
          <span class="text-caption">
            {{ $t('nav.packInstall.v3Warning') }}
          </span>
          <div v-for="pack in contentPacks.filter((x) => !x.manifest.v3)"
            :key="pack.id"
            class="text-caption">
            <b>{{ pack.manifest.name }}</b>
            {{ $t('nav.packConfig.byAuthor', { author: pack.manifest.author }) }}
          </div>
        </cc-alert>

        <cc-alert v-if="hasUninstalledDependencies"
          color="error"
          class="my-3">
          <span class="text-caption">
            {{ $t('nav.packInstall.dependencyError', dependencyErrorCount) }}:
          </span>
          <div v-for="pack in contentPacks.filter((x) => uninstalledDependencies(x).length > 0)"
            :key="pack.id"
            class="text-caption">
            <b>{{ pack.manifest.name }}</b>
            {{ $t('nav.packInstall.byAuthorRequires', { author: pack.manifest.author }) }}
            <div v-for="dep in uninstalledDependencies(pack)"
              :key="dep.name + dep.version"
              class="text-caption">
              <v-chip size="x-small"
                variant="elevated"
                class="elevation-0"
                @click="openLink(dep.link)">
                {{ dep.name }} @ {{ parseVersion(dep.version) }}
              </v-chip>
            </div>
          </div>
        </cc-alert>

        <v-fade-transition mode="out-in">
          <cc-alert v-if="installing"
            type="info"
            class="mt-3">
            {{ $t('nav.packInstall.installingPacks', { count: contentPacks.length },
              contentPacks.length) }}
          </cc-alert>
        </v-fade-transition>

        <p v-if="error"
          style="color: red">{{ error }}</p>
      </v-col>
      <v-divider v-if="!mobile"
        vertical
        class="mx-3" />
      <v-col class="px-3 py-4"
        :style="mobile ? '' : 'height: calc(95vh - 83px)'"
        style="overflow-y: scroll">
        <v-fade-transition v-for="contentPack in contentPacks"
          :key="contentPack ? contentPack.id : 'nopack'"
          mode="out-in">
          <div v-if="contentPack"
            class="mb-4">
            <pack-info :pack="contentPack" />
            <v-alert v-show="packAlreadyInstalled(contentPack) && !installing"
              flat
              tile
              :color="gradeType(contentPack) === 'upgrade'
                ? 'success'
                : gradeType(contentPack) === 'downgrade'
                  ? 'error'
                  : ''
                "
              class="transition-swing"
              transition="slide-y-reverse-transition">
              {{ $t('nav.packInstall.alreadyInstalledNote') }}
              <span v-if="gradeType(contentPack) === 'upgrade'">
                {{ $t('nav.packInstall.willUpgradeTo', { version: contentPack.manifest.version }) }}
              </span>
              <span v-else-if="gradeType(contentPack) === 'downgrade'">
                {{ $t('nav.packInstall.willDowngradeTo', { version: contentPack.manifest.version })
                }}
              </span>
              <span v-else>{{ $t('nav.packInstall.willReplace') }}</span>
            </v-alert>
            <v-alert v-show="uninstalledDependencies(contentPack).length > 0 && !installing"
              flat
              tile
              color="error"
              class="transition-swing"
              transition="slide-y-reverse-transition">
              {{ $t('nav.packInstall.requiresContent') }}
              <div v-for="dep in uninstalledDependencies(contentPack)"
                :key="dep.name + dep.version"
                class="text-caption">
                <v-chip size="small">{{ dep.name }}</v-chip>
                @ {{ parseVersion(dep.version) }}
                <v-btn v-if="dep.link"
                  icon
                  variant="plain"
                  size="x-small"
                  @click="openLink(dep.link)">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </div>
            </v-alert>
          </div>
          <div v-else
            key="nopack"
            class="text-center my-6">
            <div class="heading h3 font-italic text-disabled">{{
              $t('nav.packInstall.noPackSelected') }}
            </div>
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { ref, computed, nextTick } from 'vue'
import { useDisplay } from 'vuetify'
import { parseContentPack } from '@/io/ContentPackParser'
import { CompendiumStore, ContentPackStore } from '@/stores'
import PackInfo from './PackInfo.vue'
import { IContentPack, ContentPackDependency } from '@/classes/ContentPack'
import { compare, coerce } from 'semver'
import logger from '@/user/logger'
import { notify } from '@/util/notify'

const { smAndDown: mobile } = useDisplay()

const emit = defineEmits<{ 'start-load': [] }>()

const value = ref<any>(null)
const installing = ref(false)
const contentPacks = ref<IContentPack[]>([])
const error = ref('')

const hasAlreadyInstalled = computed(() =>
  contentPacks.value.some(pack => packAlreadyInstalled(pack))
)

const hasUninstalledDependencies = computed(() => {
  if (!contentPacks.value.length) return false
  return contentPacks.value.some(pack => uninstalledDependencies(pack).length > 0)
})

const alreadyInstalledCount = computed(() =>
  contentPacks.value.filter(pack => packAlreadyInstalled(pack)).length
)

const dependencyErrorCount = computed(() =>
  contentPacks.value.filter(pack => uninstalledDependencies(pack).length > 0).length
)

const disableInstall = computed(() =>
  installing.value ||
  contentPacks.value.length === 0 ||
  contentPacks.value.filter(pack => uninstalledDependencies(pack).length > 0).length === contentPacks.value.length
)

async function reset() {
  contentPacks.value = []
  error.value = ''
  value.value = null
  await nextTick()
}

function openLink(link: string) {
  window.open(link, '_blank')
}

function parseVersion(version: string) {
  if (version.includes('*')) return 'any version'
  if (version.includes('=')) return version.replace('=', '')
  return version + ' or later'
}

async function fileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files?.length) {
    for (let i = 0; i < files.length; i++) {
      await readFileAsBinaryString(files[i])
    }
  }
}

async function readFileAsBinaryString(file: File) {
  try {
    const fileData = await readAsBinaryStringAsync(file)
    const pack = await parseContentPack(fileData as string)
    contentPacks.value.push(pack)
  } catch (err) {
    logger.error(`Error reading file: ${err}`, null, err)
  }
}

function readAsBinaryStringAsync(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsBinaryString(file)
  })
}

async function install(): Promise<void> {
  if (installing.value) return
  emit('start-load')
  installing.value = true

  await new Promise(resolve => setTimeout(resolve, 500))

  contentPacks.value = contentPacks.value.filter(pack => {
    const installed = CompendiumStore().ContentPacks.find(x => x.ID === pack.id)
    if (installed) {
      let c
      try {
        c = compare(coerce(installed.Version), coerce(pack.manifest.version))
      } catch (e) {
        logger.error(`Error comparing versions: ${e} (likely bad semver)`, null, e)
        return false
      }
      if (c === 1) {
        logger.warn(`A newer version of ${pack.manifest.name} is already installed. Skipping.`, null)
        return false
      }
    }
    return true
  })

  const uniquePacks = new Map<string, IContentPack>()
  contentPacks.value.forEach(pack => {
    const existingPack = uniquePacks.get(pack.manifest.name)
    if (!existingPack || compare(coerce(existingPack.manifest.version), coerce(pack.manifest.version)) === -1) {
      uniquePacks.set(pack.manifest.name, pack)
    }
  })
  contentPacks.value = Array.from(uniquePacks.values())

  contentPacks.value = resolveInstallable(contentPacks.value)
  contentPacks.value = orderByDependencies(contentPacks.value)

  ContentPackStore().installContentPacks(contentPacks.value)

  contentPacks.value = []
  installing.value = false
  error.value = ''
  value.value = null

  notify({
    title: t('nav.packInstall.success'),
    text: t('nav.packInstall.successText'),
    color: 'success',
  })
}

function packAlreadyInstalled(pack: IContentPack) {
  return ContentPackStore().packAlreadyInstalled(pack.id)
}

function alreadyInstalledVersion(pack: IContentPack) {
  return CompendiumStore().ContentPacks.find(x => x.ID === pack.id)?.Version || '0.0.0'
}

function uninstalledDependencies(pack: IContentPack) {
  const deps = pack.manifest ? pack.manifest.dependencies : []
  if (!deps) return []
  return deps.filter(
    dep =>
      !ContentPackStore().packAlreadyInstalled(dep.name, dep.version, true) &&
      !contentPacks.value.some(p => p !== pack && packMatchesDependency(p, dep))
  )
}

function packMatchesDependency(pack: IContentPack, dep: ContentPackDependency): boolean {
  if (pack.manifest.name.toLowerCase() !== dep.name.toLowerCase()) return false
  const v = dep.version
  if (!v || v === '*') return true
  if (v.startsWith('=')) return pack.manifest.version === v.slice(1)
  try {
    return compare(coerce(pack.manifest.version), coerce(v)) >= 0
  } catch (e) {
    logger.error(`Error comparing dependency versions: ${e} (likely bad semver)`, null, e)
    return false
  }
}

function dependencyMet(dep: ContentPackDependency, batch: IContentPack[], pack: IContentPack) {
  return (
    ContentPackStore().packAlreadyInstalled(dep.name, dep.version, true) ||
    batch.some(p => p !== pack && packMatchesDependency(p, dep))
  )
}

function resolveInstallable(packs: IContentPack[]): IContentPack[] {
  let remaining = [...packs]
  let changed = true
  while (changed) {
    changed = false
    const next = remaining.filter(pack => {
      const deps = pack.manifest?.dependencies || []
      const ok = deps.every(dep => dependencyMet(dep, remaining, pack))
      if (!ok) changed = true
      return ok
    })
    remaining = next
  }
  return remaining
}

function orderByDependencies(packs: IContentPack[]): IContentPack[] {
  const ordered: IContentPack[] = []
  let pool = [...packs]
  while (pool.length) {
    const ready = pool.filter(pack => {
      const deps = pack.manifest?.dependencies || []
      return deps.every(
        dep =>
          ContentPackStore().packAlreadyInstalled(dep.name, dep.version, true) ||
          ordered.some(p => packMatchesDependency(p, dep))
      )
    })
    if (!ready.length) {
      ordered.push(...pool)
      break
    }
    ordered.push(...ready)
    pool = pool.filter(p => !ready.includes(p))
  }
  return ordered
}

function gradeType(pack: IContentPack) {
  const installed = alreadyInstalledVersion(pack)
  const staged = pack.manifest.version || '0.0.0'
  try {
    const c = compare(coerce(String(installed)), coerce(String(staged)))
    if (c === -1) return 'upgrade'
    if (c === 0) return 'same'
    if (c === 1) return 'downgrade'
  } catch (e) {
    logger.error(`grade: Error comparing versions: ${e} (likely bad version number)`, null, e)
    contentPacks.value = contentPacks.value.filter(x => x.id !== pack.id)
    logger.error(`Removed ${pack.manifest.name || (pack.manifest as any).title || 'unknown LCP'} from import -- invalid version string breaks semver`, null, e)
    notify({
      title: t('notify.common.error'),
      text: t('notify.lcp.removedInvalidVersionText', { name: pack.manifest.name || (pack.manifest as any).title || 'unknown LCP' }),
      color: 'error',
    })
    return 'error'
  }
}
</script>

<style scoped>
.packInstaller :deep(.v-btn) {
  transition: background-color 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
}

.check {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 750ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
