<template>
  <editor-base
    :item="item"
    @exit="$emit('exit')"
    @add-new="saveAsNew()"
    @save="save()"
    @delete="deleteItem()"
    @copy="dupe()"
  >
    <template v-slot:builder>
      <v-row dense>
        <v-col>
          <div class="heading mech mt-n5" style="min-width: 30vw">
            <cc-short-string-editor
              large
              justify="start"
              :placeholder="item.Name"
              @set="item.Name = $event"
            >
              <div class="heading-block">
                {{ item.Name }}
              </div>
            </cc-short-string-editor>
          </div>
          <div class="heading h2">
            <v-text-field placeholder="Title" v-model="item.Title" style="width: 30vw" />
          </div>
        </v-col>
        <v-col cols="auto">
          <v-combobox
            v-model="item.Pronouns"
            density="compact"
            :items="['He/Him', 'She/Her', 'They/Them']"
            variant="underlined"
            hide-details
            label="Pronouns"
            style="width: 135px"
          />
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
import { Character } from '@/classes/narrative/Character';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import { NarrativeStore } from '@/stores';
import RelationshipEditor from '../../_components/RelationshipEditor.vue';

export default {
  name: 'gm-character-editor-base',
  components: { EditorBase, RelationshipEditor },
  props: {
    item: { type: Object, required: true },
  },
  emits: ['exit'],
  methods: {
    exit() {
      this.$emit('exit');
    },
    saveAsNew() {
      NarrativeStore().AddItem(this.item as Character);
      this.exit();
    },
    save() {
      NarrativeStore().SaveItemData();
      this.$emit('exit');
    },
    deleteItem() {
      (this.item as Character).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      NarrativeStore().CloneItem(this.item as Character);
      this.$emit('exit');
    },
  },
};
</script>
