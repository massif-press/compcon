<template>
  <v-dialog v-model="dialog"
    max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>{{ $t('active.campaignDialog.setCampaign') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon
          @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-combobox v-model="campaignName"
          :items="campaigns"
          :label="$t('active.fields.campaign')"
          clearable
          hide-details
          :menu-props="{ retainFocus: false }" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text"
          @click="dialog = false">{{ $t('common.cancel') }}</v-btn>
        <v-spacer />
        <v-btn variant="text"
          color="accent"
          @click="confirm">{{ $t('common.set') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import { ref } from 'vue'

withDefaults(defineProps<{
  campaigns?: Campaign[]
}>(), {
  campaigns: () => []
})

const emit = defineEmits<{
  'confirm': [campaignName: string]
}>()

const dialog = ref(false)
const campaignName = ref('')


function confirm() {
  emit('confirm', campaignName.value);
  dialog.value = false;
}
</script>
