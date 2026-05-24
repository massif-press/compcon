<template>
  <v-dialog v-model="searchDialog"
    width="800px"
    max-width="90vw"
    hide-overlay
    opacity="0.65"
    transition="dialog-top-transition">
    <template #activator="{ props }">
      <cc-button v-if="mobile"
        v-bind="props"
        icon="mdi-magnify"
        size="small"
        class="mx-1" />

      <v-btn v-else
        v-bind="props"
        variant="plain"
        size="small"
        prepend-icon="mdi-magnify">
        <v-chip label
          size="x-small"
          class="px-1 ml-1">{{ hasCmdKey ? 'CMD' : 'CTRL' }} + /</v-chip>
      </v-btn>
    </template>
    <v-card border
      tile>
      <v-text-field v-model="search"
        :label="sr.search"
        prepend-inner-icon="mdi-magnify"
        outlined
        autofocus
        hide-details>
        <template #append-inner>
          <v-btn v-if="mobile"
            icon="mdi-close"
            variant="text"
            @click="searchDialog = false" />
          <v-chip v-else
            label
            size="x-small"
            class="px-1"
            @click="searchDialog = false">
            ESC
          </v-chip>
        </template>
      </v-text-field>
      <v-card-text :class="mobile && 'py-0 px-2'">
        <div v-if="search">
          <v-list density="compact">
            <div class="text-caption font-weight-bold text-uppercase">{{ sr.searchResults }}</div>
            <v-scroll-y-transition group>
              <search-result-item v-for="r in searchResults"
                :key="r.path"
                :index-item="r"
                :mobile="mobile"
                @on-nav="
                  search = '';
                searchDialog = false;
                " />
            </v-scroll-y-transition>
          </v-list>
        </div>

        <div v-else>
          <div class="text-caption font-weight-bold text-uppercase">{{ sr.recentSearches }}</div>
          <v-scroll-y-transition group>
            <search-result-item v-for="r in recent"
              :key="r.path"
              :index-item="r"
              @on-nav="
                search = '';
              searchDialog = false;
              " />
          </v-scroll-y-transition>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { NavStore } from '@/stores'
import SearchResultItem from './searchResultItem.vue'
import { NAV_STRINGS } from '@/features/nav/strings'

const { smAndDown: mobile } = useDisplay()
const router = useRouter()
const sr = NAV_STRINGS.search

const search = ref('')
const searchDialog = ref(false)
const hasCmdKey = ref(false)

const searchResults = computed(() => {
  if (!search.value || search.value.length < 3) return []
  return NavStore()
    .Index.filter(item => item.title.toLowerCase().includes(search.value.toLowerCase()))
    .slice(0, 5)
})

const recent = computed(() => NavStore().SearchHistory)

function handleSearch(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === '/') {
    search.value = ''
    searchDialog.value = !searchDialog.value
  }
  if (event.key === 'Escape') {
    searchDialog.value = false
  }
  if (event.key === 'Enter') {
    if (searchResults.value.length > 0) {
      router.push(searchResults.value[0].path)
      searchDialog.value = false
    } else {
      searchDialog.value = false
    }
  }
}

onMounted(() => {
  hasCmdKey.value = navigator.userAgent.includes('Mac')
  window.addEventListener('keydown', handleSearch)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleSearch)
})
</script>
