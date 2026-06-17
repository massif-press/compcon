<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>{{ $t('gm.folder.setFolder') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-combobox v-model="folderName"
          :items="folders"
          :label="$t('gm.fields.folder')"
          clearable
          hide-details
          :menu-props="{ retainFocus: false }" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="dialog = false">{{ $t('common.cancel') }}</v-btn>
        <v-spacer />
        <v-btn variant="text" color="accent" @click="confirm">{{ $t('common.set') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  folders?: any[]
}>(), {
  folders: () => []
})

const emit = defineEmits<{
  'confirm': []
}>()

const dialog = ref(false)
const folderName = ref('')

function open() {
      folderName.value = '';
      dialog.value = true;
    }
function confirm() {
      emit('confirm', folderName.value);
      dialog.value = false;
    }
</script>
