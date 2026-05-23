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
        label="Npc"
        class="mx-3"
        clearable>
        <template #selection="{ item, index }">
          <v-chip v-if="index < 4">
            <span>{{ item.title }}</span>
          </v-chip>
          <span v-if="index === 4" class="text-grey text-caption align-self-center">
            (+{{ selectedNpcs.length - 4 }} others)
          </span>
        </template>
        <template #prepend-item>
          <v-list-item ripple @click="toggle">
            <v-icon :icon="selectIcon" class="ml-2 mr-1" />
            Select All
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

<script lang="ts">
import PrintPageShell from '@/ui/components/print/PrintPageShell.vue';
import Layout from './layouts/index.vue';
import TagInfoPrint from './extras/TagInfoPrint.vue';
import OptionsDialog from './OptionsDialog.vue';
import { NpcStore } from '@/stores';
import PageBreak from '@/features/pilot_management/Print/components/PageBreak.vue';
import { Npc } from '@/classes/npc/Npc';

export default {
  name: 'combined-print',
  components: {
    PrintPageShell,
    Layout,
    OptionsDialog,
    PageBreak,
    TagInfoPrint,
  },
  props: {
    ids: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    selectedNpcs: [] as Npc[],
    options: {
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      include: [],
      extras: [],
      card: [],
    } as any,
  }),
  mounted() {
    if (!this.ids) return;
    let idArr = typeof this.ids === 'string' ? JSON.parse(this.ids) : this.ids;
    this.selectedNpcs = idArr.map((x) => NpcStore().Npcs.find((p) => p.ID === x) as Npc);
    this.selectedNpcs = this.selectedNpcs.filter((x) => !!x);
  },
  computed: {
    allNpcs() {
      return NpcStore().Npcs.filter((x) => !x.SaveController.IsDeleted);
    },
    selectIcon() {
      return this.selectedNpcs.length === this.allNpcs.length
        ? 'mdi-checkbox-marked'
        : this.selectedNpcs.length
          ? 'mdi-minus-box'
          : 'mdi-checkbox-blank-outline';
    },
  },
  methods: {
    toggle() {
      if (this.selectedNpcs.length === this.allNpcs.length) this.selectedNpcs = [];
      else this.selectedNpcs = this.allNpcs.slice();
    },
  },
};
</script>
