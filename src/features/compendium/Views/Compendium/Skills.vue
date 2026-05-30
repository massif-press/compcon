<template>
  <cc-compendium-browser :items="skills"
    item-type="Skill"
    :table-headers="headers"
    :options="options"
    view-key="cb-skills">
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Skill Triggers</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { Skill } from '@/classes/pilot/components/skill/Skill'
import { CompendiumStore } from '@/stores';

const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: 'Description', key: 'Description' },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    })

const skills = computed(() => {
      return orderBy(CompendiumStore().Skills, 'Name');
    })
</script>
