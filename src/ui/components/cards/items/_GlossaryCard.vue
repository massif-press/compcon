<template>
  <div v-html-safe="item.Description" />
</template>

<script setup lang="ts">

type GlossaryEntry = {
  ID: string, Name: string, Description: string, ItemType: 'Glossary', Icon: 'mdi-book-open-variant', LcpName: string
}

defineProps<{
  item: GlossaryEntry
}>()
</script>
