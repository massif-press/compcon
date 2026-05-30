<template>
  <editor-base :item="item"
    :readonly="readonly"
    :hide-toolbar="hideToolbar"
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
      <persistent-traits />
    </template>
    <tier-selector v-if="!readonly"
      :item="item" />
    <eidolon-layer-editor :item="item"
      :readonly="readonly" />
  </editor-base>
</template>

<script setup lang="ts">
import EditorBase from '../../../gm/_components/EditorBase.vue';
import EidolonLayerEditor from './_components/EidolonLayerEditor.vue';
import { NpcStore } from '@/stores';
import Builder from './builder.vue';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import PersistentTraits from './_components/PersistentTraits.vue';
import TierSelector from './_components/TierSelector.vue';
import exportAsJson from '@/util/jsonExport';

defineOptions({ name: 'GmEidolonEditorBase' })

const props = withDefaults(defineProps<{
  item: object
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
      (props.item as Eidolon).SaveController.Delete();
      emit('exit');
    }
function dupe() {
      NpcStore().CloneNpc(props.item as Eidolon);
      emit('exit');
    }
function exportItem(item) {
      exportAsJson(Eidolon.Serialize(item), `${item.Name}.json`);
    }
</script>
