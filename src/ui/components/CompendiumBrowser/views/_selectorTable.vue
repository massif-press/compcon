<template>
  <v-data-table
    density="compact"
    :headers="<any[]>headers"
    :items="<any[]>items"
    :items-per-page="-1"
    style="width: 100%">
    <template v-slot:item="{ item }">
      <tr :id="item.ID">
        <td
          v-for="h in <any[]>headers"
          class="text-left"
          :class="selected && (selected as any).ID === item.ID ? 'bg-primary' : ''">
          <div v-if="h.key === 'Size'">
            <span v-text="item.Size === 0.5 ? '½' : item.Size" />
          </div>
          <div v-else-if="h.key === 'Name'">
            <cc-item-modal small-btn style="display: inline-block" hide-type :item="item" />
          </div>
          <div v-else-if="h.key === 'Origin'">
            <cc-item-modal small-btn hide-type :item="item.Origin" />
          </div>
          <div v-else-if="h.key === 'Icon'">
            <v-icon :icon="item.Icon" />
          </div>
          <div v-else-if="h.key === 'Range'">
            <cc-range-element small :range="(item as any).Range" />
          </div>
          <div v-else-if="h.key === 'Damage'">
            <cc-damage-element small :damage="(item as any).Damage" />
          </div>
          <div v-else-if="h.key === 'MaxUses'">
            <span v-if="item.MaxUses" v-text="item.MaxUses" />
            <v-icon v-else size="x-small" color="subtle">mdi-infinity</v-icon>
          </div>
          <div v-else-if="h.key === 'T1'">
            <cc-item-modal
              v-for="e in (item as License).Unlocks[0]"
              small-btn
              :item="e"
              style="padding: 2px" />
          </div>
          <div v-else-if="h.key === 'T2'">
            <cc-item-modal
              v-for="e in (item as License).Unlocks[1]"
              small-btn
              :item="e"
              style="padding: 2px" />
          </div>
          <div v-else-if="h.key === 'T3'">
            <cc-item-modal
              v-for="e in (item as License).Unlocks[2]"
              small-btn
              :item="e"
              style="padding: 2px" />
          </div>
          <div v-else-if="h.tier" class="text-center">
            {{ (item as NpcClass).Stats.Stat(h.key, h.tier) }}
          </div>

          <div v-else>
            {{ item[h.key] }}
          </div>
        </td>
      </tr>
    </template>
    <template #bottom />
  </v-data-table>
</template>

<script lang="ts">
import { License } from '@/class';
import { NpcClass } from '@/classes/npc/class/NpcClass';

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
