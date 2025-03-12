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
            v-model="item.Pronouns"
            :readonly="isRemote"
            density="compact"
            :items="['He/Him', 'She/Her', 'They/Them']"
            variant="outlined"
            hide-details
            label="Pronouns"
            style="width: 200px" />
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col>
          <cc-text-field
            :readonly="isRemote"
            color="primary"
            variant="outlined"
            label="Title"
            v-model="item.Title" />
        </v-col>
        <v-col>
          <cc-text-field
            :readonly="isRemote"
            color="primary"
            variant="outlined"
            label="Alias"
            v-model="item.Alias" />
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
import { Character } from '@/classes/narrative/Character';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import NarrativeBlock from './narrativeBlock.vue';
import { NarrativeStore } from '@/stores';
import RelationshipEditor from '../../_components/RelationshipEditor.vue';
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'gm-character-editor-base',
  components: { EditorBase, RelationshipEditor, NarrativeBlock },
  props: {
    item: { type: Object, required: true },
  },
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
      (this.item as Character).SaveController.Delete();
      this.exit();
    },
    dupe() {
      NarrativeStore().CloneItem(this.item as Character);
      this.exit();
    },
    exportItem(item) {
      exportAsJson(Character.Serialize(item), `${item.Name}.json`);
    },
  },
};
</script>
