<template>
  <v-data-table
    density="compact"
    :headers="headers"
    :items="items"
    :items-per-page="-1"
    style="max-width: calc(100vw - 390px)"
  >
    <template v-slot:item="{ item }">
      <tr :id="item.raw.ID">
        <td
          v-for="h in (headers as any[])"
          class="text-left"
          :class="item.raw.ID === selected && (selected as any).ID ? 'bg-primary' : ''"
        >
          <div v-if="h.key === 'Size'">
            <span v-text="item.raw.Size === 0.5 ? '½' : item.raw.Size" />
          </div>
          <div v-else-if="h.key === 'Name'">
            <cc-item-modal small-btn hide-type :item="item.raw" />
          </div>
          <div v-else-if="h.key === 'Range'">
            <cc-range-element small :range="(item as any).raw.Range" />
          </div>
          <div v-else-if="h.key === 'Damage'">
            <cc-damage-element small :damage="(item as any).raw.Damage" />
          </div>
          <div v-else>
            {{ item.raw[h.key] }}
          </div>
        </td>
      </tr>
    </template>
    <template #bottom />
  </v-data-table>
  <!-- <thead>
      <th v-for="h in (headers as any[])" class="text-left">{{ h.title }}</th>
    </thead>
    <tbody>
      <tr
        v-for="item in (items as CompendiumItem[])"
        :id="item.ID"
        :class="item.ID === (selected && (selected as any).ID) ? 'bg-primary' : ''"
      >
        <td v-for="h in (headers as any[])" class="text-left">
          <cc-item-modal v-if="h.key === 'Name'" :item="item" />
          <div v-else-if="h.key === 'Range'">
            <cc-range-element small :range="(item as any).Range" />
          </div>
          <div v-else-if="h.key === 'Damage'">
            <cc-damage-element small :damage="(item as any).Damage" />
          </div>
          <div v-else>
            {{ item[h.key] }}
          </div>
        </td>
      </tr>
    </tbody> -->
</template>

<script lang="ts">
import { CompendiumItem } from '@/class';

export default {
  name: 'selector-table',
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    selected: {
      type: Object,
      required: false,
    },
  },
};
</script>
