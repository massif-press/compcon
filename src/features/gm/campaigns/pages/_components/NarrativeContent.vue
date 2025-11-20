<template>
  <div v-if="item">
    <v-row class="text-text">
      <v-col cols="2">
        <cc-img :src="item.PortraitController.Image" />
      </v-col>
      <v-col>
        <div class="heading h3">
          {{ item.Name }}
          <b class="text-caption text-uppercase text-disabled" v-if="item.Pronouns">
            ({{ item.Pronouns }})
          </b>
        </div>
        <div class="heading" v-if="item.ItemType === 'Character'">
          {{ item.Title }}
          <cc-slashes v-if="item.Alias" class="mx-3" />
          {{ item.Alias }}
        </div>
        <div class="heading" v-else-if="item.ItemType === 'Faction'">
          {{ item.FactionType }}
        </div>
        <div v-html-safe="item.Description" />
      </v-col>
    </v-row>
    <div class="text-text px-4">
      <v-card v-for="t in item.NarrativeController.TextItems" variant="plain">
        <div class="heading mt-1">{{ t.header }}</div>
        <p class="pl-4" v-html-safe="t.body" />
      </v-card>
      <cc-clock
        v-for="c in item.NarrativeController.Clocks"
        :clock="c"
        density="compact"
        class="my-2"
        readonly />
      <cc-rollable-table
        v-for="t in item.NarrativeController.Tables"
        :table="t"
        density="compact"
        class="my-2"
        readonly />
    </div>
  </div>
</template>

<script lang="ts">
import { NarrativeStore } from '@/stores';

export default {
  name: 'narrative-content',
  props: {
    data: { type: Object, required: true },
  },
  computed: {
    item() {
      const refElement = NarrativeStore()
        .CollectionItems.filter((x) => !x.SaveController.IsDeleted)
        .find((x) => x.ID === this.data?.ID);
      if (refElement) return refElement;
      return this.data;
    },
  },
};
</script>
