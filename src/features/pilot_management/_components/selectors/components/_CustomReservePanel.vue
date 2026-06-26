<template>
  <div class="text-center px-2 pt-2 pb-4">
    <v-btn-toggle v-model="customType"
      mandatory
      base-color="panel"
      color="primary"
      flat
      tile
      style="width: 100%">
      <v-btn size="small"
        height="30"
        width="33.33%"
        value="Resource">{{ $t('pm.print.resource') }}</v-btn>
      <v-btn size="small"
        height="30"
        width="33.33%"
        value="Mech">{{ $t('common.mech') }}</v-btn>
      <v-btn size="small"
        height="30"
        width="33.33%"
        value="Tactical">{{ $t('pm.sheet.tactical') }}</v-btn>
    </v-btn-toggle>
    <cc-text-field v-model="customName"
      color="primary"
      variant="outlined"
      :label="$t('pm.fields.resourceName')" />
    <div class="mt-4" />
    <cc-text-area v-model="details"
      color="primary"
      :label="$t('common.details')" />
    <cc-button block
      tile
      class="mt-4"
      color="primary"
      prepend-icon="cc:orbital"
      append-icon="mdi-plus"
      :disabled="!customType || !customName"
      @click="add()">
      {{ $t('pm.selectors.addReserve') }}
    </cc-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Reserve } from '@/classes/pilot/components/reserves/Reserve'

const emit = defineEmits<{
  'add': [payload: any]
}>()

const customType = ref('Resource')
const customName = ref('')
const details = ref('')

function add() {
      const nr = new Reserve({
        id: 'reserve_custom',
        type: customType.value,
        name: customName.value,
        label: customName.value,
        description: details.value,
        resource_name: '',
        resource_note: '',
        resource_cost: '',
        used: false,
        consumable: true,
      });
      clear();
      emit('add', nr);
    }
function clear() {
      customType.value = 'Resources';
      customName.value = '';
      details.value = '';
    }
</script>
