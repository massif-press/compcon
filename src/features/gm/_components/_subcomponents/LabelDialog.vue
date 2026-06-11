<template>
  <cc-dialog ref="dialog"
    title="Set GM Label"
    :close-on-click="false"
    max-width="500px">

    <v-tabs v-model="labelTab" grow density="compact">
      <v-tab value="set">{{ $t('common.set') }}</v-tab>
      <v-tab value="delete">{{ $t('common.delete') }}</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="labelTab">
        <v-window-item value="set">
          <i18n-t keypath="gm.labelDialog.addOverwrite" tag="div" class="text-caption" scope="global">
            <template #emphasis><b>{{ $t('gm.labelDialog.orOverwrite') }}</b></template>
          </i18n-t>
          <v-row class="mt-2">
            <v-col>
              <v-combobox v-model="kvpKey"
                :items="allLabels"
                item-title="title"
                item-value="key"
                label="Label"
                hide-details
                :menu-props="{ retainFocus: false }" />
            </v-col>
            <v-col>
              <v-text-field v-model="kvpValue" label="Value" hide-details />
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item value="delete">
          <i18n-t keypath="gm.labelDialog.deleteText" tag="div" class="text-caption" scope="global">
            <template #emphasis><b>{{ $t('gm.labelDialog.deleteWord') }}</b></template>
          </i18n-t>
          <v-row class="mt-2">
            <v-col>
              <v-select v-model="kvpKey"
                :items="selectedLabels"
                item-title="title"
                item-value="key"
                label="Label"
                hide-details />
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn variant="text" @click="close">{{ $t('common.cancel') }}</v-btn>
      <v-spacer />
      <v-btn variant="tonal"
        :color="labelTab === 'set' ? 'accent' : 'error'"
        :disabled="!kvpKey"
        @click="confirm">
        {{ labelTab }}
      </v-btn>
    </v-card-actions>
  </cc-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  allLabels?: any[]
  selectedLabels?: any[]
}>(), {
  allLabels: () => [],
  selectedLabels: () => []
})

const emit = defineEmits<{
  'confirm': []
}>()

const dialog = ref<any>(null)

const labelTab = ref('set' as 'set' | 'delete')
const kvpKey = ref('' as any)
const kvpValue = ref('')

function open() {
      kvpKey.value = '';
      kvpValue.value = '';
      labelTab.value = 'set';
      (dialog.value as any).open();
    }
function close() {
      (dialog.value as any).close();
    }
function confirm() {
      emit('confirm', {
        key: kvpKey.value,
        value: kvpValue.value,
        op: labelTab.value,
      });
      close();
    }
</script>
