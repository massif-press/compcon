<template>
  <print-page-shell :options="options">
    <div v-if="selectedNpcs.length">
      <layout
        :options="options"
        :npcs="<Npc[]>selectedNpcs"
      />
      <template v-if="has(options.extras, 'tagRef')">
        <page-break />
        <tag-info-print :npcs="<Npc[]>selectedNpcs" />
      </template>
    </div>

    <template #selector>
      <v-select
        v-model="selectedNpcs"
        multiple
        :items="allNpcs"
        item-title="Name"
        return-object
        density="compact"
        hide-details
        variant="outlined"
        :label="$t('gm.fields.npc')"
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
            {{ $t('gm.print.othersCount', { n: selectedNpcs.length - 4 }) }}
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
  import { computed, onMounted, ref } from 'vue'
  import PrintPageShell from '@/ui/components/print/PrintPageShell.vue'
  import Layout from './layouts/index.vue'
  import TagInfoPrint from '@/ui/components/print/TagInfoPrint.vue'
  import OptionsDialog from './OptionsDialog.vue'
  import { NpcStore } from '@/stores'
  import PageBreak from '@/ui/components/print/PageBreak.vue'
  import { Npc } from '@/classes/npc/Npc'
  import { LAYOUT, ORIENTATION, PAPER, INCLUDE, has } from '@/ui/print/options'
  import type { GmPrintOptions } from '@/ui/print/types'

  defineOptions({ name: 'NpcRosterPrint' })

  const props = defineProps<{
    ids?: string
  }>()

  const selectedNpcs = ref([] as Npc[])
  const options = ref<GmPrintOptions>({
    layout: LAYOUT.standard,
    orientation: ORIENTATION.portrait,
    paper: PAPER.letter,
    include: [INCLUDE.passiveFeatures],
    extras: [],
  })

  const allNpcs = computed(() => {
    return NpcStore().Npcs.filter(x => !x.SaveController.IsDeleted)
  })
  const selectIcon = computed(() => {
    return selectedNpcs.value.length === allNpcs.value.length
      ? 'mdi-checkbox-marked'
      : selectedNpcs.value.length
        ? 'mdi-minus-box'
        : 'mdi-checkbox-blank-outline'
  })

  function toggle() {
    if (selectedNpcs.value.length === allNpcs.value.length) selectedNpcs.value = []
    else selectedNpcs.value = allNpcs.value.slice()
  }

  onMounted(() => {
    if (!props.ids) return
    const idArr = typeof props.ids === 'string' ? JSON.parse(props.ids) : props.ids
    selectedNpcs.value = idArr
      .map(x => NpcStore().Npcs.find(p => p.ID === x) as Npc)
      .filter(x => !!x)
  })
</script>
