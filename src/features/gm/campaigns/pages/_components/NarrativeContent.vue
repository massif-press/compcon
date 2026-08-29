<template>
  <div v-if="item">
    <v-row class="text-text">
      <v-col cols="2">
        <cc-img :src="item.PortraitController.Image" />
      </v-col>
      <v-col>
        <div class="heading h3">
          {{ item.Name }}
          <b
            v-if="item.Pronouns"
            class="text-caption text-uppercase text-disabled"
          >
            ({{ item.Pronouns }})
          </b>
        </div>
        <div
          v-if="item.ItemType === 'Character'"
          class="heading"
        >
          {{ item.Title }}
          <cc-slashes
            v-if="item.Alias"
            class="mx-3"
          />
          {{ item.Alias }}
        </div>
        <div
          v-else-if="item.ItemType === 'Faction'"
          class="heading"
        >
          {{ item.FactionType }}
        </div>
        <div v-html-safe="item.Description" />
      </v-col>
    </v-row>
    <div class="text-text px-4">
      <v-card
        v-for="(t, index) in item.NarrativeController.TextItems"
        :key="`text-${index}`"
        variant="plain"
      >
        <div class="heading mt-1">{{ t.header }}</div>
        <p
          v-html-safe="t.body"
          class="pl-4"
        />
      </v-card>
      <cc-clock
        v-for="(c, index) in item.NarrativeController.Clocks"
        :key="`clock-${index}`"
        :clock="c"
        density="compact"
        class="my-2"
        readonly
      />
      <cc-rollable-table
        v-for="(t, index) in item.NarrativeController.Tables"
        :key="`table-${index}`"
        :table="t"
        density="compact"
        class="my-2"
        readonly
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { INarrativeEntity } from '@/classes/narrative/INarrativeEntity'
  import { computed } from 'vue'
  import { NarrativeStore } from '@/stores'

  defineOptions({ name: 'narrative-content' })

  const props = defineProps<{
    data: INarrativeEntity | null
  }>()

  const item = computed(() => {
    const refElement = NarrativeStore()
      .CollectionItems.filter(x => !x.SaveController.IsDeleted)
      .find(x => x.ID === props.data?.ID)
    if (refElement) return refElement
    return props.data
  })
</script>
