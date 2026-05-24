<template>
  <cc-modal :title="`Organize ${title}`"
    icon="mdi-queue-first-in-last-out">
    <template #activator="{ open }">
      <cc-button color="primary"
        size="small"
        prepend-icon="mdi-queue-first-in-last-out"
        @click="open">
        Organize
      </cc-button>
    </template>
    <v-card-text>
      <v-row>
        <v-col>
          <v-data-table :headers="allHeaders"
            :items="items"
            item-value="ID"
            :sort-by="[{ key: columns[0]?.key ?? 'Name', order: 'asc' }]"
            :items-per-page="-1"
            density="compact">
            <template #header.select>
              <v-btn icon
                flat
                size="small"
                @click="toggleAll">
                <v-icon size="x-large"
                  :icon="selectAllIcon" />
              </v-btn>
            </template>
            <template #item.select="{ item }">
              <v-checkbox v-model="selected"
                multiple
                :value="(item as any).ID"
                hide-details />
            </template>
            <template #bottom />
          </v-data-table>
        </v-col>
        <v-col cols="auto"
          style="width: 320px">
          <div>
            <b class="text-accent">{{ selected.length }}</b> selected
          </div>
          <v-list>
            <v-list-item :title="selected.length < 2 ? 'Archive' : 'Archive Multiple'"
              :subtitle="selected.length < 2
                ? `Move ${noun} to archive`
                : `Move selected ${noun}s to archive`"
              prepend-icon="mdi-archive-arrow-down-outline"
              :disabled="!selected.length"
              @click="emitArchive" />
            <v-list-item :title="selected.length < 2 ? 'Delete' : 'Delete Multiple'"
              :subtitle="selected.length < 2
                ? `Permanently remove ${noun}`
                : `Permanently remove selected ${noun}s`"
              prepend-icon="mdi-delete"
              :disabled="!selected.length"
              @click="emitDelete" />
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </cc-modal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

interface OrganizerColumn {
  key: string;
  title: string;
  sortable?: boolean;
  value: (item: any) => string | number;
}

const props = withDefaults(defineProps<{
  items: any[];
  columns: OrganizerColumn[];
  noun?: string;
  title?: string;
}>(), {
  noun: 'item',
  title: 'Items',
});

const emit = defineEmits<{
  archive: [ids: string[]];
  delete: [ids: string[]];
}>();

const selected = ref<string[]>([]);

const allHeaders = computed(() => [
  { key: 'select', sortable: false, width: '40px' },
  ...props.columns.map(col => ({
    key: col.key,
    title: col.title,
    sortable: col.sortable ?? false,
    value: col.value,
  })),
]);

const selectAllIcon = computed(() => {
  if (selected.value.length === props.items.length && props.items.length > 0)
    return 'mdi-checkbox-outline';
  if (selected.value.length > 0)
    return 'mdi-minus-box-outline';
  return 'mdi-checkbox-blank-outline';
});

function toggleAll() {
  if (selected.value.length) {
    selected.value = [];
  } else {
    selected.value = props.items.map(e => e.ID);
  }
}

function emitArchive() {
  emit('archive', [...selected.value]);
  selected.value = [];
}

function emitDelete() {
  emit('delete', [...selected.value]);
  selected.value = [];
}
</script>
