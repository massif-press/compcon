<template>
  <v-card-text>
    <v-row>
      <v-col>
        <slot name="filters" />
        <v-data-table :headers="allHeaders"
          :items="items"
          item-value="ID"
          :sort-by="[{ key: 'Name', order: 'asc' }]"
          :items-per-page="-1"
          density="compact">
          <template #header.select>
            <v-btn icon
              flat
              size="small"
              @click="selected.length ? (selected = []) : (selected = items.map((x: any) => x.ID))">
              <v-icon size="x-large"
                :icon="selected.length === items.length
                  ? 'mdi-checkbox-outline'
                  : selected.length > 0
                    ? 'mdi-minus-box-outline'
                    : 'mdi-checkbox-blank-outline'" />
            </v-btn>
          </template>

          <template #item.select="{ item }">
            <v-checkbox v-model="selected"
              multiple
              :value="(item as any).ID"
              hide-details />
          </template>

          <template #item.Name="{ item }">
            <span :class="(item as any).SaveController?.IsDeleted ? 'text-error text-decoration-line-through' : ''">
              <slot name="name-prefix"
                :item="item" />
              {{ (item as any).Name }}
            </span>
          </template>

          <template v-for="col in customSlotKeys"
            #[`item.${col}`]="slotData">
            <slot :name="`item.${col}`"
              v-bind="slotData || {}" />
          </template>

          <template #bottom>
            <v-row dense
              justify="end">
              <v-col cols="auto">
                <v-checkbox v-model="showDeleted"
                  density="compact"
                  label="Show Deleted"
                  @update:model-value="$emit('update:showDeleted', $event)" />
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>

      <v-col cols="auto"
        style="width: 350px">
        <div>
          <b class="text-accent">{{ selected.length }}</b>
          selected
        </div>
        <v-list>
          <slot name="actions"
            :selected="selected"
            :items="items"
            :show-deleted="showDeleted"
            :clear-selected="() => { selected = [] }"
            :show-delete-confirm="showDeleteConfirm"
            :set-show-delete-confirm="(v: boolean) => { showDeleteConfirm = v }" />
        </v-list>
      </v-col>
    </v-row>
  </v-card-text>

  <slot name="dialogs" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'CCOrganizer' })

const props = defineProps<{
  items: any[]
  headers: any[]
  showDeleted?: boolean
}>()

const emit = defineEmits<{
  'update:showDeleted': [val: boolean]
  'update:selected': [val: string[]]
}>()

const selected = ref<string[]>([])
const showDeleted = ref(props.showDeleted ?? false)
const showDeleteConfirm = ref(false)

const customSlotKeys = computed(() => {
  const builtIn = new Set(['select', 'Name'])
  return props.headers.map((h) => h.key).filter((k) => !builtIn.has(k))
})

const allHeaders = computed(() => [
  { key: 'select', sortable: false, width: '40px' },
  ...props.headers,
])
</script>
