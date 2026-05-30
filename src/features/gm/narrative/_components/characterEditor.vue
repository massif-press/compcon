<template>
  <editor-base :key="item.ID"
    :item="item"
    :readonly="isRemote"
    @exit="$emit('exit')"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()">
    <template #builder>
      <v-row dense
        class="my-n4"
        align="center">
        <cc-remote-hover :item="item" />

        <v-col class="heading h1">
          <cc-short-string-editor large
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
          <v-combobox v-model="item.Pronouns"
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
          <cc-text-field v-model="item.Title"
            :readonly="isRemote"
            color="primary"
            variant="outlined"
            label="Title" />
        </v-col>
        <v-col>
          <cc-text-field v-model="item.Alias"
            :readonly="isRemote"
            color="primary"
            variant="outlined"
            label="Alias" />
        </v-col>
      </v-row>
    </template>
    <template #stats>
      <v-divider class="mt-4 mb-1" />
      <relationship-editor :readonly="isRemote"
        :item="item" />
      <narrative-block :readonly="isRemote"
        :item="item" />
    </template>
  </editor-base>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Character } from '@/classes/narrative/Character';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import NarrativeBlock from './narrativeBlock.vue';
import { NarrativeStore } from '@/stores';
import RelationshipEditor from '../../_components/RelationshipEditor.vue';
import exportAsJson from '@/util/jsonExport';

defineOptions({ name: 'GmCharacterEditorBase' })

const props = defineProps<{
  item: object
}>()

const emit = defineEmits<{
  'exit': []
}>()

const isRemote = computed(() => {
      return (props.item as any).SaveController.IsRemote;
    })

function exit() {
      emit('exit');
    }
async function save() {
      await NarrativeStore().SaveItemData();
      exit();
    }
function deleteItem() {
      (props.item as Character).SaveController.Delete();
      exit();
    }
function dupe() {
      NarrativeStore().CloneItem(props.item as Character);
      exit();
    }
function exportItem(item) {
      exportAsJson(Character.Serialize(item), `${item.Name}.json`);
    }
</script>
