<template>
  <cc-panel>
    <template #toolbar>
      <v-toolbar v-if="mobile"
        flat
        color="primary"
        extended
        extension-height="20">
        <v-toolbar-title class="heading text-uppercase"
          style="font-size: calc(10px + 2.5vw)">
          {{ pack.manifest.name }}
        </v-toolbar-title>
        <template #extension>
          <div class="text-cc-overline pl-1">{{ pack.manifest.author }}</div>
          <v-spacer />
          <cc-chip size="x-small"
            color="secondary">v.{{ pack.manifest.version }}</cc-chip>
        </template>
      </v-toolbar>
      <cc-toolbar v-else
        icon="cc:content_manager"
        :title="pack.manifest.name"
        hide-close>
        <template #toolbar-items>
          <cc-chip :title="$t('common.version').toUpperCase()"
            size="x-small"
            color="secondary"
            :label="pack.manifest.version"
            class="my-1" />
        </template>
        <template #subtitle>
          <div class="pl-2 mb-n2">{{ $t('nav.packConfig.byAuthor', { author: pack.manifest.author })
          }}</div>
        </template>
      </cc-toolbar>
    </template>

    <cc-alert v-if="!pack.manifest.v3"
      color="warning"
      :title="$t('nav.packInfo.v2ContentTitle')"
      icon="mdi-alert"
      variant="outlined"
      class="my-3">
      <span class="text-text">
        {{ $t('nav.packInfo.v2ContentDescription') }}
      </span>
    </cc-alert>

    <pack-info-card :pack="pack" />

  </cc-panel>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { IContentPack } from '@/classes/ContentPack'
import PackInfoCard from './components/PackInfoCard.vue'
import { LocalizationStore } from '@/stores/localization'
import { packPatches, removePatch, type LanguagePatch } from '@/i18n/translationPatch'

const props = defineProps<{ pack: IContentPack }>()

const { smAndDown: mobile } = useDisplay()
const { t } = useI18n()

const dialog = ref(false)

const localizationStore = LocalizationStore()
onMounted(() => localizationStore.ensurePatchesLoaded())

const languagePatches = computed(() =>
  packPatches([props.pack.id, props.pack.manifest.item_prefix, props.pack.manifest.name])
)

function patchSubtitle(p: LanguagePatch): string {
  const by = p.translator
    ? t('nav.packInfo.patchByAuthor', { translator: p.translator })
    : t('nav.packInfo.patchUnknownAuthor')
  return p.translation_version ? `${by} · v${p.translation_version}` : by
}

async function remove(id: string) {
  await removePatch(id)
  if (!languagePatches.value.length) dialog.value = false
}
</script>
