<template>
  <cc-dialog
    v-model="show"
    icon="mdi-book-open-variant"
    :title="$t('mainMenu.coreBookLcp.promptTitle')"
    :close-on-click="false"
    max-width="600px"
    @close="onClose"
  >
    <v-card-text>
      <p>{{ $t('mainMenu.coreBookLcp.promptBody') }}</p>
      <v-checkbox
        v-model="doNotAskAgain"
        density="compact"
        hide-details
        class="mt-4"
        :label="$t('mainMenu.coreBookLcp.promptDoNotAskAgain')"
      />
    </v-card-text>
    <v-card-actions>
      <cc-button
        size="small"
        variant="text"
        @click="show = false"
      >
        {{ $t('mainMenu.coreBookLcp.promptNotNow') }}
      </cc-button>
      <v-spacer />
      <cc-button
        size="small"
        color="accent"
        @click="goToPage"
      >
        {{ $t('mainMenu.coreBookLcp.promptGoToPage') }}
      </cc-button>
    </v-card-actions>
  </cc-dialog>
</template>

<script lang="ts">
  let promptedThisSession = false
</script>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { UserStore, CompendiumStore } from '@/stores'
  import { GetValue, SetValue } from '@/io/Storage'

  const DISMISSED_KEY = 'core_book_lcp_prompt_dismissed'

  const router = useRouter()

  const show = ref(false)
  const doNotAskAgain = ref(false)

  const startupComplete = computed(() => UserStore().StartupComplete)

  function isInstalled() {
    return CompendiumStore().ContentPacks.some(p => p.Manifest.item_prefix === 'core-npc')
  }

  function isOwned() {
    if (!UserStore().IsLoggedIn) return false
    const meta = UserStore().UserMetadata
    if (meta.HasCoreBook) return true
    return !!meta.ItchData?.gamedata?.some(
      (g: any) => g.title === 'Lancer Core Book: First Edition PDF'
    )
  }

  watch(
    startupComplete,
    async done => {
      if (!done || promptedThisSession) return
      if (isInstalled() || isOwned()) return
      if (await GetValue(DISMISSED_KEY)) return
      promptedThisSession = true
      show.value = true
    },
    { immediate: true }
  )

  async function onClose() {
    if (doNotAskAgain.value) await SetValue(DISMISSED_KEY, true)
  }

  function goToPage() {
    show.value = false
    router.push({ name: 'core-book-lcp' })
  }
</script>
