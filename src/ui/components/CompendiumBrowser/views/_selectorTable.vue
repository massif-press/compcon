<template>
  <v-data-table
    density="compact"
    :headers="<any[]>headers"
    :items="<any[]>items"
    :items-per-page="-1"
    hide-default-footer
    style="width: 100%">
    <template v-slot:item="{ item }">
      <tr :id="item.ID">
        <td
          v-for="h in <any[]>headers"
          class="text-left px-2"
          :class="`text-${h.align} ${
            selected && (selected as any).ID === item.ID ? 'bg-light-panel' : ''
          }`">
          <div v-if="h.key === 'Source'">
            <span v-if="item.Source">
              <cc-logo
                v-if="item.Manufacturer?.LogoIsExternal"
                :source="item.Manufacturer"
                size="x-large"
                class="pt-3 mb-n1" />
              <v-icon
                v-else-if="item.Manufacturer"
                size="x-large"
                :icon="item.Manufacturer.Icon"
                :color="item.Manufacturer.GetColor($vuetify.theme.current.dark)" />
              <span v-if="!mobile" class="px-1">{{ item.Source }}</span>
            </span>
          </div>
          <div v-else-if="h.key === 'Size'">
            <span v-text="item.Size === 0.5 ? '½' : item.Size" />
          </div>

          <div v-else-if="h.key === 'Name'">
            <cc-item-modal hide-type :item="item" />

            <v-icon
              v-if="selectable"
              class="fade-select"
              icon="mdi-plus-box"
              color="success"
              size="35"
              @click="$emit('select', item)" />
          </div>
          <div v-else-if="h.key === 'Origin'">
            <cc-item-modal hide-type :item="item.Origin" />
          </div>
          <div
            v-else-if="h.key === 'Effect' || h.key === 'Description' || h.key === 'Detail'"
            class="my-1">
            <p v-if="h.key === 'Effect'" v-html="item.Effect" />
            <p v-else-if="h.key === 'Description'" v-html="item.Description" />
            <p v-else-if="h.key === 'Detail'" v-html="item.Detail" />
          </div>
          <div v-else-if="h.key === 'Icon'" class="text-center">
            <v-icon :icon="item.Icon" />
          </div>
          <div v-else-if="h.key === 'SizeIcon'">
            <v-icon :icon="item.SizeIcon" size="35" color="primary" />
          </div>
          <div v-else-if="h.key === 'Mounts'" style="white-space: nowrap">
            <v-chip
              v-for="m in item.Mounts"
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
            <cc-range-element small :range="(item as any).Range" />
          </div>
          <div v-else-if="h.key === 'Damage'">
            <cc-damage-element small :damage="(item as any).Damage" />
          </div>
          <div v-else-if="h.key === 'MaxUses'">
            <span v-if="item.MaxUses" v-text="item.MaxUses" />
            <v-icon v-else size="x-small" color="subtle">mdi-infinity</v-icon>
          </div>
          <div v-else-if="h.key === 'WeaponTypes'">
            <span v-if="item.WeaponTypes" v-text="item.WeaponTypes.join('/')" />
          </div>

          <div v-else-if="h.key === 'Tags'">
            <cc-tags :tags="item.Tags" density="compact" size="small" />
          </div>

          <div v-else-if="h.key === 'T1'">
            <cc-item-modal
              v-for="e in (item as License).Unlocks[0]"
              :item="e"
              style="padding: 2px" />
          </div>
          <div v-else-if="h.key === 'T2'">
            <cc-item-modal
              v-for="e in (item as License).Unlocks[1]"
              :item="e"
              style="padding: 2px" />
          </div>
          <div v-else-if="h.key === 'T3'">
            <cc-item-modal
              v-for="e in (item as License).Unlocks[2]"
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
    selectable: {
      type: Boolean,
    },
  },
  emits: ['select'],
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
