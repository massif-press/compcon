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
        value="Resource">Resource</v-btn>
      <v-btn size="small"
        height="30"
        width="33.33%"
        value="Mech">Mech</v-btn>
      <v-btn size="small"
        height="30"
        width="33.33%"
        value="Tactical">Tactical</v-btn>
    </v-btn-toggle>
    <cc-text-field v-model="customName"
      color="primary"
      variant="outlined"
      label="Resource Name" />
    <div class="mt-4" />
    <cc-text-area v-model="details"
      color="primary"
      label="Details" />
    <cc-button block
      tile
      class="mt-4"
      color="primary"
      prepend-icon="cc:orbital"
      append-icon="mdi-plus"
      :disabled="!customType || !customName"
      @click="add()">
      Add Reserve
    </cc-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Reserve } from '@/classes/pilot/components/reserves/Reserve'

const emit = defineEmits<{
  'add': []
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
