<template>
  <v-layout style="position: relative">
    <cc-button
      :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
      size="small"
      color="primary"
      :style="`position: absolute; z-index: 999; left: ${showNav ? '258' : '4'}px; top: 6px`"
      @click="(showNav as any) = !showNav" />
    <div v-if="!campaign">{{ $t('compendium.campaign.errNoCampaign') }}</div>
    <v-row v-else no-gutters>
      <v-slide-x-transition>
        <sidebar
          v-if="showNav"
          :campaign="campaign"
          :current-page="currentPage"
          @set-selected="setSelected"
          @set-page="setPage" />
      </v-slide-x-transition>
      <v-col>
        <v-fade-transition leave-absolute>
          <div :style="`padding-left: ${!mobile && showNav ? '256px' : 0}; padding-bottom: 45px`">
            <component
              v-if="itemComponent"
              :is="itemComponent"
              :campaign="campaign"
              :item="selected" />
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Campaign } from '@/classes/campaign/Campaign';
import sidebar from './components/sidebar.vue';
import Credits from './pages/credits.vue';
import Page from './pages/contentPage.vue';
import Indices from './pages/indices.vue';
import { CampaignStore } from '@/stores';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'campaign-viewer' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  id: string
}>()

const showNav = ref(true)
const componentType = ref('Credits')
const selected = ref(null)
const campaign = ref(null as any)

await CampaignStore().LoadCampaigns();
    const data = CampaignStore().CampaignCollection.find((c) => c.id === props.id);
    campaign.value = new Campaign(data);

const itemComponent = computed(() => {
      switch (componentType.value.toLowerCase()) {
        case 'credits':
          return Credits;
        case 'index':
          return Indices;
        default:
          return Page;
      }
    })
const currentPage = computed(() => {
      return componentType.value;
    })

function setPage(type) {
      componentType.value = type;
      selected.value = null;
    }
function setSelected(item) {
      componentType.value = item.SectionType;
      selected.value = item;
    }
</script>
