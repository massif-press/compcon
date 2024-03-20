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
            <i class="text-caption text-disabled">No Data</i>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { CollectionItem } from '@/classes/narrative/CollectionItem';
import { NarrativeStore } from '@/stores';

export default {
  name: 'cc-narrative-item-content',
  props: {
    item: {
      type: Object,
      required: true,
    },
    originItem: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    linkedItem(): CollectionItem | null {
      return NarrativeStore().getItemByID(this.item.id);
    },
  },
};
</script>
