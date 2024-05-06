<template>
  <editor-base
    :item="item"
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
      <relationship-editor :item="item" />
    </template>
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
  emits: ['exit'],
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
