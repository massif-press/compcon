<template>
  <v-card-text :style="mobile ? 'margin-top: 14px' : 'margin-top: 16px'">
    <div class="packsList"
      style="min-height: 300px">
      <div class="heading h2 text-stark mt-3 px-2">
        {{ pd.officialContent }}
        <a href="https://massifpress.com/shop"
          target="_blank">{{ pd.massifPress }}</a>
        {{ pd.content }}
      </div>
      <massif-lcp-table :packs="massifPacks"
        :loading="loading" />
      <v-divider class="my-6" />
      <div class="heading h2 text-stark mt-3 px-2">
        {{ pd.communityContent }}
        <cc-dialog :title="pd.communityContentTitle">
          <template #activator="{ open }">
            <v-icon size="x-small"
              class="mt-n1 fade-select"
              @click="open()">
              mdi-information-slab-box-outline
            </v-icon>
          </template>
          <v-card-text>
            {{ pd.communityAbout }}
            <br />
            {{ pd.communityContribute }}
            <a href="https://github.com/massif-press/lancer-data#lancer-community-content-packs"
              target="_blank">
              {{ pd.clickHere }}
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
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

const { smAndDown: mobile } = useDisplay()
const pd = section('packsDirectory')

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
