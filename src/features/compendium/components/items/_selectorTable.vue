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
          :class="selected && (selected as any).ID === item.raw.ID  ? 'bg-primary' : ''"
        >
          <div v-if="h.key === 'Size'">
            <span v-text="item.raw.Size === 0.5 ? '½' : item.raw.Size" />
          </div>
          <div v-else-if="h.key === 'Name'">
            <cc-item-modal small-btn hide-type :item="item.raw" />
          </div>
          <div v-else-if="h.key === 'Icon'">
            <v-icon :icon="item.raw.Icon" />
          </div>
          <div v-else-if="h.key === 'Range'">
            <cc-range-element small :range="(item as any).raw.Range" />
          </div>
          <div v-else-if="h.key === 'Damage'">
            <cc-damage-element small :damage="(item as any).raw.Damage" />
          </div>
          <div v-else-if="h.key === 'MaxUses'">
            <span v-if="item.raw.MaxUses" v-text="item.raw.MaxUses" />
            <v-icon v-else size="x-small" color="subtle">mdi-infinity</v-icon>
          </div>
          <div v-else-if="h.key === 'T1'">
            <cc-item-modal
              v-for="e in (item.raw as License).Unlocks[0]"
              small-btn
              :item="e"
              style="padding: 2px"
            />
          </div>
          <div v-else-if="h.key === 'T2'">
            <cc-item-modal
              v-for="e in (item.raw as License).Unlocks[1]"
              small-btn
              :item="e"
              style="padding: 2px"
            />
          </div>
          <div v-else-if="h.key === 'T3'">
            <cc-item-modal
              v-for="e in (item.raw as License).Unlocks[2]"
              small-btn
              :item="e"
              style="padding: 2px"
            />
          </div>
          <div v-else>
            {{ item.raw[h.key] }}
          </div>
        </td>
      </tr>
    </template>
    <template #bottom />
  </v-data-table>
</template>

<script lang="ts">
import { License } from '@/class';

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
