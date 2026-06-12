<template>
  <cc-tabs ref="tabs"
    fixed
    @changed="setTab($event)">
    <template #tabs>
      <v-tab selected-class="bg-accent">{{ $t('common.compendium') }}</v-tab>
      <v-tab selected-class="bg-accent">{{ $t('compendium.nav.systemReference') }}</v-tab>
      <v-tab v-if="isDevsite"
        selected-class="bg-accent">
        {{ $t('common.campaignLibrary') }}
      </v-tab>
    </template>
    <div :class="mobile ? 'my-2' : 'my-4'" />

    <v-window-item>
      <compendium-view />
    </v-window-item>
    <v-window-item>
      <reference-view />
    </v-window-item>
    <v-window-item>
      <campaign-library />
    </v-window-item>
  </cc-tabs>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { UserStore } from '@/stores'
import CompendiumView from './Views/Compendium/index.vue'
import ReferenceView from './Views/Reference/index.vue'
import CampaignLibrary from './Views/CampaignLibrary/index.vue'
import { useDisplay } from 'vuetify'

defineOptions({ name: 'CompendiumIndex' })

const route = useRoute()
const { smAndDown: mobile, xs: portrait } = useDisplay()
const tabs = ref<any>(null)

const isDevsite = computed(() =>
  window.location.hostname === 'dev.compcon.app' || window.location.hostname === 'localhost'
)

function setTab(tab: number) {
  if (!tabs.value) return
  UserStore().User.SetView('CompendiumTab', tab)
  tabs.value.setTab(tab)
}

onMounted(() => {
  if (route.query.tab) {
    tabs.value?.setTab(parseInt(route.query.tab as string))
  } else {
    setTab(UserStore().User.View('CompendiumTab', 0))
  }
})
</script>
