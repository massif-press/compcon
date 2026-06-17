<template>
  <v-navigation-drawer permanent fixed style="overflow-y: scroll" class="pb-8">
    <v-row density="compact" class="pa-2" justify="center" align="center">
      <v-col cols="auto" class="heading h3 text-center">
        {{ campaign.Title }}
        <div class="text-caption text-disabled">{{ campaign.Subtitle }}</div>
      </v-col>
    </v-row>
    <v-divider class="mb-3" />
    <div class="ma-2">
      <v-btn
        :color="currentPage === 'Credits' ? 'secondary' : ''"
        block
        tile
        flat
        size="small"
        @click="setPage('Credits')">
        {{ $t('common.credits') }}
      </v-btn>

      <indented-list
        :items="campaign.Contents"
        :level="0"
        :selected="<any>selected"
        @clicked="setSelected($event)" />

      <v-btn
        :color="currentPage === 'index' ? 'secondary' : ''"
        block
        tile
        flat
        size="small"
        @click="setPage('index')">
        {{ $t('compendium.campaign.index') }}
      </v-btn>
    </div>
    <v-divider class="my-2" />

    <div style="position: absolute; bottom: 0; left: 0; right: 0" class="px-2">
      <v-btn
        block
        tile
        flat
        size="small"
        class="my-2 pa-2"
        color="primary"
        prepend-icon="mdi-arrow-left"
        to="/gm/campaigns">
        {{ $t('compendium.campaign.returnToLibrary') }}
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Campaign } from '@/classes/campaign/Campaign';
import IndentedList from './IndentedList.vue';
import exportAsJson from '@/util/jsonExport';

defineOptions({ name: 'campaign-editor-sidebar' })

const props = defineProps<{
  campaign: Campaign
  currentPage?: string
}>()

const emit = defineEmits<{
  'set-page': []
  'set-selected': []
}>()

const lastSave = ref('')
const selected = ref(null)

lastSave.value = props.campaign.SaveController.LastModified;

lastSave.value = props.campaign.SaveController.LastModified;

const dirty = computed(() => {
      return lastSave.value !== props.campaign.SaveController.LastModified;
    })

function setPage(type: string) {
      emit('set-page', type);
      selected.value = null;
    }
function setSelected(item: any) {
      selected.value = item;
      emit('set-selected', item);
    }
function exportEditable() {
      const filename =
        props.campaign.Title.replace(/\s/g, '_').toLowerCase() +
        new Date().toLocaleString() +
        '.json';
      exportAsJson(Campaign.Serialize(props.campaign as Campaign), filename);
    }
</script>
