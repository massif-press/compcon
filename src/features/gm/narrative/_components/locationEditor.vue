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
import { Location } from '@/classes/narrative/Location';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import NarrativeBlock from './narrativeBlock.vue';
import { NarrativeStore } from '@/stores';
import RelationshipEditor from '../../_components/RelationshipEditor.vue';
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'gm-location-editor-base',
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
      (this.item as Location).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      NarrativeStore().CloneItem(this.item as Location);
      this.$emit('exit');
    },
    exportItem(item) {
      exportAsJson(Location.Serialize(item), `${item.Name}.json`);
    },
  },
};
</script>
