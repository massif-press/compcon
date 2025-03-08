<template>
  <editor-base
    :item="item"
    :readonly="isRemote"
    @exit="$emit('exit')"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()">
    <template v-slot:builder>
      <v-row dense>
        <v-col>
          <div class="heading mech mt-n5" style="min-width: 30vw">
            <cc-short-string-editor
              large
              :readonly="isRemote"
              justify="start"
              :placeholder="item.Name"
              @set="item.Name = $event">
              <div class="heading-block">
                {{ item.Name }}
              </div>
            </cc-short-string-editor>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-combobox
            v-model="item.FactionType"
            :readonly="isRemote"
            density="compact"
            :items="item.TypeSuggestions"
            variant="outlined"
            hide-details
            label="Organization Type"
            style="width: 335px" />
        </v-col>
      </v-row>
    </template>
    <template v-slot:stats>
      <v-divider class="mt-4 mb-1" />
      <relationship-editor :readonly="isRemote" :item="item" />
    </template>

    <div v-if="!readonly || (readonly && item.NarrativeController.TextItems.length)">
      <div class="text-cc-overline mb-2">ADDITIONAL DETAIL</div>
      <section-editor :item="item" :readonly="readonly" />
    </div>

    <div v-if="!readonly || (readonly && item.NarrativeController.Clocks.length)">
      <v-divider class="my-2" />
      <div class="text-cc-overline mb-2">CLOCKS</div>
      <cc-clock
        v-for="c in item.NarrativeController.Clocks"
        :clock="c"
        class="mx-1 my-2"
        :readonly="readonly"
        @delete="item.NarrativeController.DeleteClock(c)" />
      <cc-button
        v-if="!readonly"
        color="primary"
        block
        prepend-icon="mdi-plus"
        size="x-small"
        @click="item.NarrativeController.AddClock()">
        Add New Clock
      </cc-button>
    </div>

    <div v-if="!readonly || (readonly && item.NarrativeController.Tables.length)">
      <v-divider class="my-2" />
      <div
        v-if="!readonly || (readonly && item.NarrativeController.Tables.length)"
        class="text-cc-overline mb-2">
        TABLES
      </div>
      <cc-rollable-table
        v-for="t in item.NarrativeController.Tables"
        :table="t"
        class="mx-1 my-2"
        :readonly="readonly"
        @delete="item.NarrativeController.DeleteTable(t)" />
      <cc-button
        color="primary"
        block
        prepend-icon="mdi-plus"
        size="x-small"
        @click="item.NarrativeController.AddTable()">
        Add New Table
      </cc-button>
    </div>
  </editor-base>
</template>

<script lang="ts">
import { Faction } from '@/classes/narrative/Faction';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import { NarrativeStore } from '@/stores';
import RelationshipEditor from '../../_components/RelationshipEditor.vue';
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'gm-faction-editor-base',
  components: { EditorBase, RelationshipEditor },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    readonly: false,
  }),
  emits: ['exit'],
  computed: {
    isRemote() {
      return (this.item as any).SaveController.IsRemote;
    },
  },
  methods: {
    exit() {
      this.$emit('exit');
    },
    async save() {
      await NarrativeStore().SaveItemData();
      this.exit();
    },
    deleteItem() {
      (this.item as Faction).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      NarrativeStore().CloneItem(this.item as Faction);
      this.$emit('exit');
    },
    exportItem(item) {
      exportAsJson(Faction.Serialize(item), `${item.Name}.json`);
    },
  },
};
</script>
