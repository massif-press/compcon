<template>
  <div v-if="queryResult === null"
    class="text-center">
    <v-progress-circular indeterminate
      color="primary"></v-progress-circular>
  </div>
  <div v-else>
    <v-row dense
      class="mb-n2">
      <v-col cols="auto"
        class="heading h4 text-accent mr-2">{{ $t('common.name') }}</v-col>
      <v-col cols="9">{{ queryResult.name }}</v-col>
    </v-row>
    <v-row dense
      class="my-n2">
      <v-col cols="auto"
        class="heading h4 text-accent mr-2">{{ $t('share.resultAuthor') }}</v-col>
      <v-col cols="9">{{ queryResult.author }}</v-col>
    </v-row>
    <v-row dense
      class="my-n2">
      <v-col cols="auto"
        class="heading h4 text-accent mr-2">{{ $t('common.type') }}</v-col>
      <v-col cols="9">{{ queryResult.sortkey.split('_')[1] }}</v-col>
    </v-row>
    <v-row dense
      class="my-n2">
      <v-col cols="auto"
        class="heading h4 text-accent mr-2">{{ $t('common.created') }}</v-col>
      <v-col cols="9">{{ new Date(queryResult.created).toLocaleString() }}</v-col>
    </v-row>
    <v-row dense
      class="my-n2">
      <v-col cols="auto"
        class="heading h4 text-accent mr-2">{{ $t('share.resultLastUpdated') }}</v-col>
      <v-col cols="9">{{ new Date(queryResult.item_modified).toLocaleString() }}</v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  queryResult: any | null
}>()
</script>
