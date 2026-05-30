<template>
  <cc-compendium-browser :items="talents"
    item-type="Skill"
    :table-headers="headers"
    :options="options"
    view-key="cb-talents">
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Talents</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { Talent } from '@/classes/pilot/components/talent/Talent'

const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: 'Overview', key: 'Terse' },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
      hideTitle: true,
    })

const talents = computed(() => {
      return orderBy(
        CompendiumStore().Talents.filter((x) => !x.IsHidden),
        'Name'
      );
    })
</script>
