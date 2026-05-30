<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>Set Campaign</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-combobox v-model="campaignName"
          :items="campaigns"
          label="Campaign"
          clearable
          hide-details
          :menu-props="{ retainFocus: false }" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn variant="text" color="accent" @click="confirm">Set</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  campaigns?: any[]
}>(), {
  campaigns: () => []
})

const emit = defineEmits<{
  'confirm': []
}>()

const dialog = ref(false)
const campaignName = ref('')

function open(current?: string) {
      campaignName.value = current || '';
      dialog.value = true;
    }
function confirm() {
      emit('confirm', campaignName.value);
      dialog.value = false;
    }
</script>
