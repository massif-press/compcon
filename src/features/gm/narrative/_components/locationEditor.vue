<template>
  <editor-base :key="item.ID"
    :item="item"
    :readonly="isRemote"
    @exit="$emit('exit')"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()">
    <template v-slot:builder>
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
      </v-row>
    </template>
    <template v-slot:stats>
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
import { Location } from '@/classes/narrative/Location';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import NarrativeBlock from './narrativeBlock.vue';
import { NarrativeStore } from '@/stores';
import RelationshipEditor from '../../_components/RelationshipEditor.vue';
import exportAsJson from '@/util/jsonExport';

defineOptions({ name: 'gm-location-editor-base' })

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
      (props.item as Location).SaveController.Delete();
      emit('exit');
    }
function dupe() {
      NarrativeStore().CloneItem(props.item as Location);
      emit('exit');
    }
function exportItem(item) {
      exportAsJson(Location.Serialize(item), `${item.Name}.json`);
    }
</script>
