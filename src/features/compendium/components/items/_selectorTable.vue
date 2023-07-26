<template>
  <v-table>
    <thead>
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
    </tbody>
  </v-table>
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
