<template>
  <v-layout :style="`height: calc(100vh - ${mobile ? '42px' : '68px'})`">
    <div style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '615' : '354') : '3'}px; top: 6px`">
      <cc-button :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="(showNav as any) = !showNav" />
    </div>
    <v-navigation-drawer v-model="showNav"
      app
      :width="mobile ? 600 : 350">
      <div class="mt-2">
        <slot name="tooltip" />
      </div>
      <div class="px-2">
        <v-row density="compact"
          no-gutters
          align="center">
          <v-col class="mr-1">
            <cc-text-field v-model="search"
              type="autocomplete"
              :placeholder="`Search ${title}`"
              :items="items"
              item-title="Name"
              item-value="Name"
              variant="outlined"
              color="primary"
              hide-details
              clearable
              icon="mdi-magnify" />
          </v-col>
          <v-col cols="auto">
            <gm-collection-filter :items="items"
              :filters="filters"
              @add-filter="filters.push($event)"
              @remove-filter="filters.splice(filters.indexOf($event), 1)"
              @set-filters="filters = $event" />
          </v-col>
        </v-row>

        <v-row density="compact"
          no-gutters
          class="mt-5">
          <v-col>
            <cc-select v-model="grouping"
              :items="groupings"
              small
              :label="$t('gm.fields.group')"
              class="mr-1" />
          </v-col>
          <v-col>
            <cc-select v-model="sorting"
              :items="sortings"
              small
              :label="$t('gm.fields.sort')"
              class="ml-1" />
          </v-col>
        </v-row>
        <v-btn prepend-icon="mdi-queue-first-in-last-out"
          color="primary"
          block
          flat
          tile
          size="x-small"
          class="mt-1"
          @click="$emit('open-organizer')">
          {{ $t('common.organize') }}
        </v-btn>
        <v-divider class="my-1" />

        <item-sidebar-list :item-type="itemType"
          :items="filteredItems"
          :search="search"
          :big="view === 'big-grid'"
          :list="view === 'list'"
          :table="view === 'table'"
          :grouping="grouping"
          :sorting="sorting"
          :selected-id="selected?.ID || ''"
          :all-folders="folders"
          :disabled="!canAdd"
          @open="$emit('open', $event)" />

        <div v-if="hidden"
          class="text-right pa-2 text-disabled">
          <i>{{ $t('gm.split.itemsHidden', { n: hidden }) }}</i>
        </div>

        <div class="my-12" />

        <div style="position: absolute; bottom: 4px; left: 4px; right: 4px">
          <v-menu>
            <template #activator="{ props }">
              <cc-button color="success"
                size="small"
                prepend-icon="mdi-plus"
                :disabled="!canAdd"
                block
                @click="props.onClick($event)">
                {{ $t('gm.split.addType', { type: itemType }) }}
              </cc-button>
            </template>
            <template #default="{ isActive }">
              <v-card class="pa-1"
                border>
                <cc-button block
                  prepend-icon="mdi-plus"
                  size="small"
                  color="primary"
                  @click="
                    $emit('add-new');
                  isActive.value = false;
                  ">
                  {{ $t('gm.split.createNewType', { type: itemType }) }}
                </cc-button>
                <div class="my-1" />
                <cc-button block
                  prepend-icon="mdi-download"
                  size="small"
                  color="primary"
                  @click="
                    $emit('open-import');
                  isActive.value = false;
                  ">
                  {{ $t('common.fileImport') }}
                </cc-button>
                <div class="my-1" />
                <share-code-dialog import-type="npc"
                  block-btn />
              </v-card>
            </template>
          </v-menu>
        </div>
      </div>
    </v-navigation-drawer>
    <v-main>
      <div style="
          height: calc(100vh - 65px) !important;
          overflow-y: scroll;
          padding-bottom: 100px;
          overflow-x: hidden;
        ">
        <div class="mx-auto pt-2 px-6"
          style="max-width: 1400px">
          <slot />
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ItemSidebarList from './ItemSidebarList.vue';
import GmCollectionFilter from './_components/GMCollectionFilter.vue';
import { NpcStore } from '../store/npc_store';
import { NarrativeStore } from '../store/narrative_store';
import { CompendiumStore, UserStore } from '@/stores';
import ShareCodeDialog from '@/shared/ShareCodeDialog.vue';
import { Npc } from '@/classes/npc/Npc';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'GmCollectionView' })


const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  items: any[]
  itemType: string
  title: string
  groupings: any[]
  sortings: any[]
  selected?: object
}>(), {
  groupings: ['Folder'],
  sortings: ['Name']
})

const emit = defineEmits<{
  'open': [payload: any]
  'add-new': []
  'open-import': []
  'open-organizer': []
}>()

const search = ref('')
const view = ref('list')
const sorting = ref('Name')
const grouping = ref('Folder')
const filters = ref([] as any[])
const openFolders = ref([] as string[])
const showNoFolder = ref(true)
const showNav = ref(true)

const user = UserStore().User;
if (user?.View) {
  sorting.value = user.View(props.itemType.toLowerCase() + 'Sorting', 'Name');
  grouping.value = user.View(props.itemType.toLowerCase() + 'Grouping', 'Folder');
  filters.value = user.View(props.itemType.toLowerCase() + 'Filters', []) as any[];
}

const folderStore = computed(() => {
      switch (props.itemType.toLowerCase()) {
        case 'npc':
        case 'unit':
        case 'doodad':
        case 'eidolon':
          return NpcStore();
        default:
          return NarrativeStore();
      }
    })
const canAdd = computed(() => {
      if (props.itemType.toLowerCase() === 'npc') {
        return CompendiumStore().hasNpcAccess;
      } else if (props.itemType.toLowerCase() === 'eidolon') {
        return CompendiumStore().hasEidolonAccess;
      }
      return true;
    })
const folders = computed(() => {
      return folderStore.value.getFolders.filter((f) =>
        props.items.some((i) => (i as Npc).FolderController.Folder === f)
      );
    })
const filteredItems = computed(() => {
      let out = props.items;

      if (filters.value.length) {
        out = out.filter((x: any) => {
          if (x.StatController) {
            const stats = x.StatController.DisplayKeys.map((x: any) => x.title);
            if (filters.value.some((f) => stats.some((s) => s === f))) return false;
          }
          if (x.NarrativeController) {
            const labels = x.NarrativeController.Labels.map((x: any) => x.title);
            if (filters.value.some((f) => labels.some((s) => s === f))) return false;
          }
          return true;
        });
      }
      return out;
    })
const hidden = computed(() => {
      return props.items.length - filteredItems.value.length;
    })

function minimize() {
      showNav.value = false;
    }

defineExpose({ minimize })
</script>
