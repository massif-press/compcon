<template>
  <print-page-shell :orientation="options.orientation.title">
    <div v-if="selectedNpcs.length">
      <layout :options="options" :npcs="selectedNpcs" />
      <div v-if="options && options.extras">
        <page-break v-if="options.extras.some((x) => x.title === 'Relevant Tag Reference')" />
        <tag-info-print
          v-if="options.extras.some((x) => x.title === 'Relevant Tag Reference')"
          :npcs="selectedNpcs" />
      </div>
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
        clearable>
        <template #selection="{ item, index }">
          <v-chip v-if="index < 4">
            <span>{{ item.title }}</span>
          </v-chip>
          <span v-if="index === 4" class="text-grey text-caption align-self-center">
            {{ $t('gm.print.othersCount', { n: selectedNpcs.length - 4 }) }}
          </span>
        </template>
        <template #prepend-item>
          <v-list-item ripple @click="toggle">
            <v-icon :icon="selectIcon" class="ml-2 mr-1" />
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
import PrintPageShell from '@/ui/components/print/PrintPageShell.vue';
import Layout from './layouts/index.vue';
import TagInfoPrint from '@/ui/components/print/TagInfoPrint.vue';
import OptionsDialog from './OptionsDialog.vue';
import { NpcStore } from '@/stores';
import PageBreak from '@/features/pilot_management/Print/components/PageBreak.vue';
import { Npc } from '@/classes/npc/Npc';

defineOptions({ name: 'combined-print' })

const props = defineProps<{
  ids?: string
}>()

const selectedNpcs = ref([] as Npc[])
const options = ref({
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      include: [],
      extras: [],
      card: [],
    } as any)

const allNpcs = computed(() => {
      return NpcStore().Npcs.filter((x) => !x.SaveController.IsDeleted);
    })
const selectIcon = computed(() => {
      return selectedNpcs.value.length === allNpcs.value.length
        ? 'mdi-checkbox-marked'
        : selectedNpcs.value.length
          ? 'mdi-minus-box'
          : 'mdi-checkbox-blank-outline';
    })

function toggle() {
      if (selectedNpcs.value.length === allNpcs.value.length) selectedNpcs.value = [];
      else selectedNpcs.value = allNpcs.value.slice();
    }

onMounted(() => {
if (!props.ids) return;
    let idArr = typeof props.ids === 'string' ? JSON.parse(props.ids) : props.ids;
    selectedNpcs.value = idArr.map((x) => NpcStore().Npcs.find((p) => p.ID === x) as Npc);
    selectedNpcs.value = selectedNpcs.value.filter((x) => !!x);
})
</script>
