<template>
  <v-toolbar>
    <v-toolbar-title>
      <span v-if="originItem" class="heading h3 mr-2">{{ originItem.Name }}</span>
      <v-icon v-if="originItem" icon="mdi-minus" />
      <v-chip size="small" variant="outlined" class="mx-n1">{{ item.relationship }}</v-chip>
      <v-icon icon="mdi-arrow-right" />
      <span class="heading h3 ml-2">{{ item.name }}</span>
    </v-toolbar-title>
  </v-toolbar>
  <v-card-text>
    <v-row dense>
      <v-col v-if="linkedItem" cols="auto">
        <v-avatar size="256" class="mr-2">
          <v-img :src="linkedItem.Portrait" />
        </v-avatar>
      </v-col>
      <v-col>
        <p v-if="item.notes" v-html-safe="item.notes" />
        <v-row v-else align="center" justify="center">
          <v-col cols="auto" class="mt-5">
            <i class="text-caption text-disabled">{{ $t('ui.widget.noData') }}</i>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import { CollectionItem } from '@/classes/narrative/CollectionItem'

withDefaults(defineProps<{
  item: Record<string, any>
  originItem?: Record<string, any> | null
  linkedItem?: CollectionItem | null
}>(), { originItem: null, linkedItem: null })
</script>
