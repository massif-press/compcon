<template>
  <v-data-table density="compact"
    :headers="<any[]>headers"
    :items="<any[]>items"
    :items-per-page="-1"
    :custom-key-sort="customKeySort"
    multi-sort
    hide-default-footer
    style="width: 100%">
    <template #item="{ item }">
      <tr :id="item.ID">
        <td v-for="h in <any[]>headers"
          :key="h.key"
          class="text-left px-2"
          :class="`text-${h.align} ${selected && (selected as any).ID === item.ID ? 'bg-light-panel' : ''
            }`">
          <div v-if="h.key === 'Source'">
            <span v-if="item.Source">
              <cc-logo v-if="item.Manufacturer?.LogoIsExternal"
                :source="item.Manufacturer"
                size="x-large"
                class="pt-3 mb-n1" />
              <v-icon v-else-if="item.Manufacturer"
                size="x-large"
                :icon="item.Manufacturer.Icon"
                :color="item.Manufacturer?.GetColor($vuetify.theme.current.dark) || 'panel'" />
              <span v-if="!mobile"
                class="px-1">{{ item.Source }}</span>
            </span>
          </div>
          <div v-else-if="h.key === 'Size'">
            <span v-text="item.Size === 0.5 ? '½' : item.Size" />
          </div>

          <div v-else-if="h.key === 'Name'">
            <div class="d-inline-block">
              <cc-item-modal hide-type
                :item="item" />
            </div>

            <v-icon v-if="selectable"
              class="fade-select"
              icon="mdi-plus-box"
              color="success"
              size="32"
              style="margin-bottom: 2px"
              @click="$emit('select', item)" />
          </div>
          <div v-else-if="h.key === 'Origin'">
            <cc-item-modal hide-type
              :item="item.Origin" />
          </div>
          <div v-else-if="h.key === 'Effect' || h.key === 'Description' || h.key === 'Detail'"
            class="my-1">
            <p v-if="h.key === 'Effect'"
              v-html-safe="item.Effect" />
            <p v-else-if="h.key === 'Description'"
              v-html-safe="item.Description" />
            <p v-else-if="h.key === 'Detail'"
              v-html-safe="item.Detail" />
          </div>
          <div v-else-if="h.key === 'Icon'"
            class="text-center">
            <v-icon :icon="item.Icon" />
          </div>
          <div v-else-if="h.key === 'SizeIcon'">
            <v-icon :icon="item.SizeIcon"
              size="35"
              color="primary" />
          </div>
          <div v-else-if="h.key === 'Mounts'"
            style="white-space: nowrap">
            <v-chip v-for="m in item.Mounts"
              :key="m"
              size="x-small"
              label
              style="margin: 1px"
              variant="elevated"
              elevation="0"
              color="primary">
              {{ m }}
            </v-chip>
          </div>
          <div v-else-if="h.key === 'Range'">
            <cc-range-element small
              :range="(item as any).Range" />
          </div>
          <div v-else-if="h.key === 'Damage'">
            <cc-damage-element small
              :damage="(item as any).Damage" />
          </div>
          <div v-else-if="h.key === 'MaxUses'">
            <span v-if="item.MaxUses"
              v-text="item.MaxUses" />
            <v-icon v-else
              size="x-small"
              color="subtle">mdi-infinity</v-icon>
          </div>
          <div v-else-if="h.key === 'WeaponTypes'">
            <span v-if="item.WeaponTypes"
              v-text="item.WeaponTypes.join('/')" />
          </div>

          <div v-else-if="h.key === 'sizes'">
            {{ formatSize((item as NpcClass).Stats.Stat(h.key, h.tier)) }}
          </div>

          <div v-else-if="h.tier"
            class="text-center">
            {{ (item as NpcClass).Stats.Stat(h.key, h.tier) }}
          </div>

          <div v-else-if="h.key === 'T1'">
            <div v-for="e in (item as License).Unlocks[0]"
              :key="e.ID"
              style="padding: 2px">
              <cc-item-modal :item="e" />
            </div>
          </div>
          <div v-else-if="h.key === 'T2'">
            <div v-for="e in (item as License).Unlocks[1]"
              :key="e.ID"
              style="padding: 2px">
              <cc-item-modal :item="e" />
            </div>
          </div>
          <div v-else-if="h.key === 'T3'">
            <div v-for="e in (item as License).Unlocks[2]"
              :key="e.ID"
              style="padding: 2px">
              <cc-item-modal :item="e" />
            </div>
          </div>

          <div v-else-if="h.key === 'Tags'">
            <cc-tags :tags="item[h.key]"
              small />
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
  name: 'SelectorTable',
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    selected: {
      type: Object,
      required: false,
      default: null,
    },
    selectable: {
      type: Boolean,
    },
  },
  emits: ['select'],
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    customKeySort() {
      const weaponSizeOrder: Record<string, number> = { Auxiliary: 0, Main: 1, Heavy: 2, Superheavy: 3 };
      return {
        Size: (a: any, b: any) => {
          if (typeof a === 'string' && typeof b === 'string') {
            return (weaponSizeOrder[a] ?? 99) - (weaponSizeOrder[b] ?? 99);
          }
          return a - b;
        },
      };
    },
  },
  methods: {
    formatSize(size: number | Array<number>): string {
      if (!Array.isArray(size)) {
        size = [size];
      }
      return size.map((s) => (s === 0.5 ? '½' : s)).join(' or ');
    },
  },
};
</script>
