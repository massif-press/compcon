<template>
  <div class="pa-2 mt-3 no-print-break">
    <div class="text-overline text-primary"
      style="line-height: 0">EQUIPMENT TAG DETAIL</div>
    <div v-for="t in tags"
      :key="t.ID"
      class="ma-2 no-print-break">
      <v-card variant="outlined"
        class="pa-2"
        color="grey">
        <v-row dense>
          <v-col cols="auto">
            <v-icon icon="mdi-tag-outline" />
          </v-col>
          <v-col>
            <div class="heading text-black">
              {{ t.Name }}
            </div>
            <div class="caption text-black">
              {{ t.Description }}
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ tags: any[] }>();
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
