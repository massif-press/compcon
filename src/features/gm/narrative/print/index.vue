<template>
  <print-page-shell :options="options">
    <div v-if="selectedItems.length">
      <layout
        :options="options"
        :items="selectedItems"
      />
    </div>

    <template #selector>
      <v-select
        v-model="selectedItems"
        multiple
        :items="allItems"
        item-title="Name"
        return-object
        density="compact"
        hide-details
        variant="outlined"
        :label="$t('gm.fields.items')"
        class="mx-3"
        clearable
      >
        <template #selection="{ item, index }">
          <v-chip v-if="index < 4">
            <span>{{ item.title }}</span>
          </v-chip>
          <span
            v-if="index === 4"
            class="text-grey text-caption align-self-center"
          >
            {{ $t('gm.print.othersCount', { n: selectedItems.length - 4 }) }}
          </span>
        </template>
        <template #prepend-item>
          <v-list-item
            ripple
            @click="toggle"
          >
            <v-icon
              :icon="selectIcon"
              class="ml-2 mr-1"
            />
            {{ $t('common.selectAll') }}
          </v-list-item>
          <v-divider class="mt-2" />
        </template>
      </v-select>
    </template>

    <template #options-dialog>
      <options-dialog :options="options" />
    </template>
  </print-page-shell>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'
  import PrintPageShell from '@/ui/components/print/PrintPageShell.vue'
  import Layout from './layouts/index.vue'
  import OptionsDialog from './OptionsDialog.vue'
  import { NarrativeStore } from '@/stores'
  import { CollectionItem } from '@/classes/narrative/CollectionItem'
  import { LAYOUT, ORIENTATION, PAPER } from '@/ui/print/options'
  import type { GmPrintOptions } from '@/ui/print/types'

  defineOptions({ name: 'NarrativePrint' })

  const props = defineProps<{
    ids?: string
  }>()

  const selectedItems = ref([] as CollectionItem[])
  const options = ref<GmPrintOptions>({
    layout: LAYOUT.standard,
    orientation: ORIENTATION.portrait,
    paper: PAPER.letter,
    include: [],
    extras: [],
  })

  const allItems = computed(() => {
    return NarrativeStore().CollectionItems.filter(x => !x.SaveController.IsDeleted)
  })
  const selectIcon = computed(() => {
    return selectedItems.value.length === allItems.value.length
      ? 'mdi-checkbox-marked'
      : selectedItems.value.length
        ? 'mdi-minus-box'
        : 'mdi-checkbox-blank-outline'
  })

  function toggle() {
    if (selectedItems.value.length === allItems.value.length) selectedItems.value = []
    else selectedItems.value = allItems.value.slice()
  }

  onMounted(() => {
    if (!props.ids) return
    const idArr = typeof props.ids === 'string' ? JSON.parse(props.ids) : props.ids
    selectedItems.value = idArr
      .map(x => NarrativeStore().CollectionItems.find(p => p.ID === x) as CollectionItem)
      .filter(x => !!x)
  })
</script>
