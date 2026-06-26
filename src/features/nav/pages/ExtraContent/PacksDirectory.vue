<template>
  <v-card-text :style="mobile ? 'margin-top: 14px' : 'margin-top: 16px'">
    <div class="packsList"
      style="min-height: 300px">
      <div class="heading h2 text-stark mt-3 px-2">
        {{ $t('nav.packsDirectory.officialContent') }}
        <a href="https://massifpress.com/shop"
          target="_blank">{{ $t('nav.packsDirectory.massifPress') }}</a>
        {{ $t('nav.packsDirectory.content') }}
      </div>
      <massif-lcp-table :packs="massifPacks"
        :loading="loading" />
      <v-divider class="my-6" />
      <div class="heading h2 text-stark mt-3 px-2">
        {{ $t('nav.packsDirectory.communityContent') }}
        <cc-dialog :title="$t('nav.packsDirectory.communityContentTitle')">
          <template #activator="{ open }">
            <v-icon size="x-small"
              class="mt-n1 fade-select"
              @click="open()">
              mdi-information-slab-box-outline
            </v-icon>
          </template>
          <v-card-text>
            {{ $t('nav.packsDirectory.communityAbout') }}
            <br />
            {{ $t('nav.packsDirectory.communityContribute') }}
            <a href="https://github.com/massif-press/lancer-data#lancer-community-content-packs"
              target="_blank">
              {{ $t('nav.packsDirectory.clickHere') }}
            </a>
          </v-card-text>
        </cc-dialog>
      </div>
      <cc-alert>
        <i18n-t keypath="nav.packsDirectory.communityNotice"
          tag="span"
          scope="global">
          <template #blog>
            <a href="https://www.patreon.com/compcon"
              target="blank">{{ $t('nav.packsDirectory.developmentBlog') }}</a>
          </template>
        </i18n-t>
      </cc-alert>
    </div>
    <community-table :packs="communityPacks"
      :loading="loading" />
  </v-card-text>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import CommunityTable from './components/CommunityTable.vue'
import MassifLcpTable from '@/features/main_menu/_components/MassifLcpTable.vue'
import { collectionDataQuery } from '@/user/api'

const { smAndDown: mobile } = useDisplay()

const catalog = ref<any[]>([])
const loading = ref(true)

const massifPacks = computed(() =>
  catalog.value
    .filter(x => x.sortkey.includes('massif'))
    .sort((a, b) => a.collection.localeCompare(b.collection))
)

const communityPacks = computed(() =>
  catalog.value
    .filter(x => !x.sortkey.includes('massif'))
    .sort((a, b) => a.author.localeCompare(b.author))
)

onMounted(async () => {
  try {
    catalog.value = await collectionDataQuery()
  } catch {
    // API unreachable
  } finally {
    loading.value = false
  }
})
</script>
