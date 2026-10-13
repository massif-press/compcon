<template>
  <v-container class="pb-12">
    <h1 class="heading text-center mb-4">{{ $t('compendium.reference.damageTables') }}</h1>

    <cc-rollable-table
      v-for="t in tables"
      :id="t.ID"
      :key="t.ID"
      :table="t"
      class="mb-6"
      show-description
      readonly
    />
  </v-container>
  <v-footer
    v-if="!isModal"
    border
    app
    class="py-0 bg-primary"
  >
    <v-tabs
      density="compact"
      center-active
      grow
    >
      <v-tab
        v-for="t in tables"
        :key="t.ID"
        @click="scrollTo(t.ID)"
        v-text="t.Title"
      />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(tables[0].ID)"
  >
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CompendiumStore } from '@/stores'
  import _scrollTo from '@/util/scrollTo'
  import { localizeTable } from '@/i18n/localize'

  const props = defineProps<{
    isModal?: boolean
  }>()

  const tables = computed(() => {
    return CompendiumStore().Tables.map(localizeTable)
  })

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) _scrollTo(el, props.isModal)
  }
</script>
