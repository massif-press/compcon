<template>
  <div>
    <fieldset class="pb-2 px-3"
      style="position: relative">
      <legend class="text-caption text-left ml-2 px-2">COLLECTION FOLDER
        <folder-menu v-if="allFolders && allFolders.length > 0"
          :item="item.FolderController"
          :all-folders="allFolders" />
      </legend>
      <v-chip size="small"
        label
        prepend-icon="mdi-folder-outline"
        :class="!item.FolderController.Folder ? 'fade-select' : ''">
        {{ item.FolderController.Folder || 'No Folder' }}
      </v-chip>

    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { EncounterStore, NarrativeStore } from '@/stores';
import { NpcStore } from '../../store/npc_store';
import FolderMenu from '../../_views/_components/FolderMenu.vue';
import { uniq } from 'lodash-es';

const props = defineProps<{
  item: object
  readonly?: boolean
}>()

const stagedName = ref('')
const menu = ref(false)

stagedName.value = props.item.FolderController.Folder;

const allFolders = computed(() => {
      return uniq([...NpcStore().getFolders, ...EncounterStore().getFolders, ...NarrativeStore().getFolders]);
    })

function set() {
      props.item.FolderController.Folder = stagedName.value;
      stagedName.value = '';
      menu.value = false;
    }
</script>
