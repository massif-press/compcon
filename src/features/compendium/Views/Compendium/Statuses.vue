<template>
  <cc-compendium-browser :items="statuses"
    item-type="Status"
    :table-headers="headers"
    :options="options"
    view-key="cb-statuses">
    <template #header>
      <div class="heading h3 text-center text-accent">Statuses & Conditions</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { Status } from '@/classes/Status';

const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Icon', key: 'Icon', sortable: false },
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'StatusType' },
      { title: '', key: 'Terse' },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    })

const statuses = computed(() => {
      return orderBy(CompendiumStore().Statuses, 'Name');
    })
</script>
