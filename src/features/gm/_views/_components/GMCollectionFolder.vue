<template>
  <v-card
    class="my-1"
    tile
    @dragenter.prevent="onItemDragEnter"
    @dragleave="onItemDragLeave"
  >
    <v-toolbar
      density="compact"
      :color="dropActive ? 'success' : 'primary'"
      style="height: 40px"
      class="mt-n3"
      tile
      @dragover.prevent
      @drop="onDrop"
    >
      <v-icon
        v-if="folderDrag"
        class="folder-sort-handle ml-2"
        icon="mdi-drag"
        :aria-label="$t('gm.a11y.dragToReorder')"
        style="cursor: move; opacity: 0.5"
        @click.stop
      />
      <v-btn
        size="x-small"
        icon
      >
        <v-icon
          size="30"
          icon="mdi-menu-right"
          class="mt-1"
          :class="open ? 'mdi-rotate-90' : ''"
          @click="open = !open"
        />
      </v-btn>
      <v-toolbar-title class="heading h3">
        <cc-short-string-editor
          justify="start"
          @set="setFolderName"
        >
          {{ folder }}
        </cc-short-string-editor>
      </v-toolbar-title>
      <v-spacer />
      <div class="px-2 text-disabled text-caption">
        {{ filteredItems.filter((x: any) => x.FolderController.Folder === folder).length }}
        ({{ items.filter((x: any) => x.FolderController.Folder === folder).length }})
      </div>
      <v-menu
        v-model="deleteMenu"
        offset-y
        offset-x
        top
        left
      >
        <template #activator="{ props }">
          <v-btn
            variant="tonal"
            size="x-small"
            color="error"
            icon
            flat
            tile
            v-bind="props"
          >
            <v-icon
              size="x-large"
              icon="mdi-delete"
            />
          </v-btn>
        </template>
        <cc-confirmation
          :content="
            $t('gm.folder.deleteFolderWarning', { folder, noFolder: $t('gm.folder.noFolder') })
          "
          @confirm="$emit('remove-folder', folder)"
        />
      </v-menu>
    </v-toolbar>
    <v-expand-transition>
      <v-card-text v-if="open">
        <sortable
          :key="`${folder}-${transferKey}`"
          :list="sortedFolderItems"
          item-key="ID"
          :options="{
            animation: 200,
            easing: 'cubic-bezier(1, 0, 0, 1)',
            handle: '.folder-drag-handle',
            group: { name: 'gm-folder-items', pull: true, put: true },
          }"
          @start="startDragScroll"
          @end="onItemReorder"
          @add="onItemAdded"
        >
          <template #item="{ element }">
            <div
              style="position: relative"
              :data-item-id="(element as any).ID"
            >
              <item-card
                :item="element as any"
                list
                :grouping="grouping"
                :sorting="sorting"
                @open="$emit('open', $event)"
              />
            </div>
          </template>
        </sortable>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Sortable } from 'sortablejs-vue3'
  import { startDragScroll } from '@/composables/useScrollOnDrag'
  import { useFolderDrop } from '@/composables/useFolderDrop'
  import ItemCard from '../_components/GMItemCard.vue'

  const props = withDefaults(
    defineProps<{
      folder: string
      allFolders: any[]
      filteredItems: any[]
      items: any[]
      itemType: string
      search: string
      view: string
      grouping: string
      sorting: string
      folderDrag?: boolean
      transferKey?: number
    }>(),
    {
      folderDrag: false,
      transferKey: 0,
    }
  )

  const emit = defineEmits<{
    open: [payload: any]
    'add-new': []
    'set-folder-name': [payload: any]
    'remove-folder': [payload: any]
    'item-transferred': []
  }>()

  const deleteMenu = ref(false)

  const folderItems = computed(() => {
    return props.filteredItems.filter((x: any) => x.FolderController.Folder === props.folder)
  })

  const sortedFolderItems = computed(() => {
    return [...(folderItems.value as any[])].sort(
      (a, b) => a.FolderController.SortIndex - b.FolderController.SortIndex
    )
  })

  const { open, dropActive, onItemReorder, onItemAdded, onItemDragEnter, onItemDragLeave, onDrop } =
    useFolderDrop({
      folder: () => props.folder,
      droppableItems: () => props.items,
      displayedRows: () => sortedFolderItems.value,
      transferred: () => emit('item-transferred'),
    })
  open.value = folderItems.value.length > 0

  function setFolderName(name: string) {
    if (name === props.folder) return
    if (!name || name.trim() === '') {
      return
    }
    emit('set-folder-name', name)
  }
</script>
