<template>
  <sortable
    :list="sortableKeys"
    :item-key="(k: string) => k"
    :options="{
      animation: 200,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      handle: '.folder-sort-handle',
      group: { name: 'gm-folders', pull: false, put: false },
      ...drawerAutoScroll,
    }"
    @end="onFolderReorder"
  >
    <template #item="{ element }">
      <item-sidebar-group
        v-bind="groupProps(element as string)"
        @open="$emit('open', $event)"
        @item-transferred="onItemTransferred"
      />
    </template>
  </sortable>
  <item-sidebar-group
    v-if="byFolder && (groupings as any)['N/A']"
    v-bind="groupProps('N/A')"
    @open="$emit('open', $event)"
    @item-transferred="onItemTransferred"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Sortable } from 'sortablejs-vue3'
  import { computeItemGroupings } from '@/composables/useItemGrouping'
  import { drawerAutoScroll } from '@/composables/useFolderDrop'
  import ItemSidebarGroup from './_components/ItemSidebarGroup.vue'
  import * as _ from 'lodash-es'

  const props = withDefaults(
    defineProps<{
      itemType: string
      items: any[]
      selectedId?: string
      search?: string
      big?: boolean
      list?: boolean
      table?: boolean
      grouping?: string
      sorting?: string
      sortDir?: 'asc' | 'desc'
      allFolders?: any[]
      disabled?: boolean
      unfilteredItems?: any[]
      draggable?: boolean
    }>(),
    {
      search: '',
      grouping: 'Folder',
      sorting: 'Name',
      sortDir: 'asc',
      allFolders: () => [],
      disabled: false,
      unfilteredItems: () => [],
      draggable: false,
    }
  )

  const emit = defineEmits<{
    open: [payload: any]
    'add-new': []
    'folder-order': [folders: string[]]
    'item-transferred': []
  }>()

  const transferKey = ref(0)

  const byFolder = computed(() => props.grouping === 'Folder')
  const everyRowIsDisplayed = computed(
    () => !props.search && props.items.length === props.unfilteredItems.length
  )
  const drag = computed(() => props.draggable && byFolder.value && everyRowIsDisplayed.value)
  const groupings = computed(() => {
    return computeItemGroupings(props.items as any[], props.grouping, props.allFolders as string[])
  })
  const sortableKeys = computed<string[]>(() =>
    byFolder.value ? (props.allFolders as string[]) : Object.keys(groupings.value)
  )
  const searchedItems = computed(() => {
    if (!props.search) return sort(props.items)
    return sort(
      props.items.filter((x: any) =>
        (x as any).Name.toLowerCase().includes(props.search?.toLowerCase() || '')
      )
    )
  })

  function groupProps(key: string) {
    return {
      name: key,
      folder: byFolder.value && key !== 'N/A' ? key : '',
      rows: groupedItems(groupings.value[key]),
      total: props.items.length,
      unfilteredItems: props.unfilteredItems,
      drag: drag.value,
      manual: props.sorting === 'Manual',
      transferKey: transferKey.value,
      grouping: props.grouping,
      sorting: props.sorting,
      selectedId: props.selectedId,
    }
  }
  function onFolderReorder(event: any) {
    if (event.oldIndex === event.newIndex) return
    const order = [...sortableKeys.value]
    const [moved] = order.splice(event.oldIndex, 1)
    order.splice(event.newIndex, 0, moved)
    emit('folder-order', order)
  }
  function onItemTransferred() {
    transferKey.value++
    emit('item-transferred')
  }
  function savedOrderWithinFolder(item: any) {
    return byFolder.value ? item.FolderController.SortIndex : 0
  }
  function groupedItems(group) {
    if (props.grouping === 'None') return sort(searchedItems.value)
    return sort(
      group.filter((x: any) =>
        (x as any).Name.toLowerCase().includes(props.search?.toLowerCase() || '')
      )
    )
  }
  function sort(items) {
    if (props.sorting === 'Manual') return _.orderBy(items, [savedOrderWithinFolder, 'Name'])
    return _.orderBy(
      items,
      (x: any) => {
        if (props.sorting === 'Sitrep') return x.Sitrep.Name
        if (props.sorting === 'Environment') return x.Environment.Name

        if (props.sorting === 'Class' && x.EidolonClass) return x.EidolonClass
        if (x[props.sorting]) return x[props.sorting]

        if (x.StatController) {
          const dk = x.StatController.DisplayKeys.find(
            k => k.title === props.sorting || k.key === props.sorting
          )
          if (dk) return x.StatController.getMax(dk.key) ?? 0
        }
        if (x.NarrativeController && x.NarrativeController.LabelDictionary[props.sorting])
          return x.NarrativeController.LabelDictionary[props.sorting]
        if (x.NpcClassController) {
          if (props.sorting === 'Role') return x.NpcClassController.Class?.Role ?? ''
          if (props.sorting === 'Tier') return x.NpcClassController.Tier ?? 0
          if (props.sorting === 'Tag') return x.Tag ?? ''
        }
      },
      props.sortDir
    )
  }
</script>
