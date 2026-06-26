<template>
  <editor-base :item="item"
    :readonly="readonly"
    hide-toolbar
    :hide-footer="hideFooter"
    @exit="$emit('exit')"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()">
    <template #builder>
      <builder :item="item"
        :readonly="readonly" />
    </template>
    <template #stats>
      <div class="my-6" />
      <stat-editor :item="item"
        :readonly="readonly" />
    </template>
  </editor-base>
</template>

<script setup lang="ts">
import { Doodad } from '@/classes/npc/doodad/Doodad';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import Builder from './builder.vue';
import { NpcStore } from '@/stores';
import StatEditor from '../../_components/StatEditor.vue';
import exportAsJson from '@/util/jsonExport';

defineOptions({ name: 'GmDoodadEditorBase' })

const props = withDefaults(defineProps<{
  item: Doodad
  readonly?: boolean
  hideToolbar?: boolean
  hideFooter?: boolean
}>(), {
  readonly: false,
  hideToolbar: false,
  hideFooter: false
})

const emit = defineEmits<{
  'exit': []
}>()

function exit() {
      emit('exit');
    }
async function save() {
      await NpcStore().SaveNpcData();
      emit('exit');
    }
function deleteItem() {
      (props.item as Doodad).SaveController.Delete();
      emit('exit');
    }
function dupe() {
      NpcStore().CloneNpc(props.item as Doodad);
      emit('exit');
    }
function exportItem(item) {
      exportAsJson(Doodad.Serialize(item, false), `${item.Name}.json`);
    }
</script>
