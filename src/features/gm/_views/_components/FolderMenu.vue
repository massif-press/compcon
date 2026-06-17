<template>
  <div style="position: absolute; top: 0; left: 0; z-index: 1">
    <v-menu width="250px"
      :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn size="25"
          icon
          color="primary"
          class="fade-select"
          v-bind="props">
          <v-icon size="20"
            icon="mdi-folder-edit" />
        </v-btn>
      </template>
      <v-card>
        <v-toolbar density="compact"><v-toolbar-title>{{ $t('gm.folder.setFolder') }}</v-toolbar-title></v-toolbar>
        <v-card-text>
          <v-combobox v-model="stagedName"
            :items="allFolders"
            :label="$t('gm.fields.folder')"
            outlined
            dense
            clearable
            hide-details />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn text
            @click="menu = false">{{ $t('common.cancel') }}</v-btn>
          <v-spacer />
          <v-btn text
            color="accent"
            @click="set">{{ $t('common.set') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  item: object
  allFolders: any[]
}>()

const stagedName = ref('')
const menu = ref(false)

function set() {
      props.item.Folder = stagedName.value;
      stagedName.value = '';
      menu.value = false;
    }
</script>
