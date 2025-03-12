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
      <v-row dense class="my-n4" align="center">
        <cc-remote-hover :item="item" />

        <v-col class="heading h1">
          <cc-short-string-editor
            large
            justify="start"
            :readonly="isRemote"
            :placeholder="item.Name"
            @set="item.Name = $event">
            <div style="line-height: 0.9em">
              {{ item.Name }}
            </div>
          </cc-short-string-editor>
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
      <narrative-block :readonly="isRemote" :item="item" />
    </template>
  </editor-base>
</template>

<script lang="ts">
import { Faction } from '@/classes/narrative/Faction';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import NarrativeBlock from './narrativeBlock.vue';
import { NarrativeStore } from '@/stores';
import RelationshipEditor from '../../_components/RelationshipEditor.vue';
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'gm-faction-editor-base',
  components: { EditorBase, RelationshipEditor, NarrativeBlock },
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
