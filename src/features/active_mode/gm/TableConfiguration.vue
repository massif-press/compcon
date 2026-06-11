<template>
  <v-container>
    <div class="pa-2 text-white" :style="`background-color: rgb(var(--v-theme-primary))`">
      <span class="heading h2">
        {{ table.name }}
      </span>
    </div>
    <v-row>
      <v-col>
        <cc-text-field v-model="table.name" color="primary" label="Table Name" />
      </v-col>
      <v-col>
        <cc-text-field v-model="table.gm" color="primary" label="Game Master" />
      </v-col>
    </v-row>
    <br />
    {{ $t('active.tableConfig.note1') }}
    <br />
    {{ $t('active.tableConfig.note2') }}
    <br />
    {{ $t('active.tableConfig.note3') }}
    <br />
    {{ $t('active.tableConfig.note4') }}
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'active-table-configuration' })

const table = ref({
      name: 'New Table',
    })
</script>
