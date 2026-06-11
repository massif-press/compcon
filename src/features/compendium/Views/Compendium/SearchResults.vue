<template>
  <v-container :class="mobile ? 'py-0 px-2' : 'px-12'"
    fluid>
    <v-row align="center">
      <v-col>
        <div class="heading h2">
          {{ $t('compendium.search.search') }}
          <cc-slashes />
          {{ $t('compendium.titles.compendium') }}
        </div>
      </v-col>
      <v-col cols="auto">
        <cc-button color="accent"
          size="small"
          variant="outlined"
          :to="`/srd/reference/search?search=${searchText}`">
          {{ $t('compendium.search.switchToReference') }}
        </cc-button>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12"
        sm="10"
        md="8">
        <cc-text-field ref="input"
          v-model="searchText"
          color="primary"
          class="search-field"
          icon="mdi-magnify"
          placeholder="Search" />
      </v-col>
    </v-row>
    <i class="text-overline">
      {{ $t('compendium.search.resultCount', { count: searchResults.length }, searchResults.length) }}
    </i>
    <v-card-text :style="!mobile && 'height: calc(100vh - 198px); overflow-y: scroll'">
      <v-slide-y-reverse-transition mode="out-in">
        <cc-masonry-grid :key="searchText"
          :items="searchResults">
          <template #default="{ item }">
            <CCSearchResultModal :item="item" />
          </template>
        </cc-masonry-grid>
      </v-slide-y-reverse-transition>
    </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import CCSearchResultModal from '@/ui/components/cards/CCSearchResultModal.vue'
import { useDisplay } from 'vuetify'
import { flatten, values, pick } from 'lodash-es';
import { CompendiumItem } from '@/classes/CompendiumItem'
import { accentInclude } from '@/classes/utility/accent_fold';
import { CompendiumStore } from '@/stores';
const router = useRouter()

const _display = useDisplay()

const { smAndDown: mobile, xs: portrait } = useDisplay()

const input = ref<any>(null)

const selected = ref(null as any)
const searchText = ref('')
const loaded = ref(false)

const widescreen = computed(() => {
      return _display.lgAndUp.value;
    })
const validResults = computed(() => {
      return flatten(
        values(
          pick(CompendiumStore(), [
            'Frames',
            'MechSystems',
            'MechWeapons',
            'WeaponMods',
            'Talents',
            'PilotGear',
            'Reserves',
            'Actions',
            'CoreBonuses',
            'NpcFeatures',
            'NpcClasses',
            'NpcTemplates',
            'Backgrounds',
            'Bonds',
            'Skills',
          ])
        )
      ) as CompendiumItem[];
    })
const searchResults = computed(() => {
      if (!searchText.value || searchText.value.length < 3) {
        return [];
      }
      const results = validResults.value.filter(
        (r) => !r.IsHidden && accentInclude(r.Name, searchText.value)
      );
      return results;
    })

function setSearch(value: string) {
      if (value === searchText.value) {
        return;
      }
      searchText.value = value;
      router.replace(`search?search=${value}`);
    }
function forceInput() {
      setSearch((input.value as HTMLInputElement).value);
    }

onMounted(() => {
searchText.value = route.query.search as string;
})
</script>
