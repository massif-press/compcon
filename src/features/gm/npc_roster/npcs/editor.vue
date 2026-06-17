<template>
  <editor-base :item="item"
    :readonly="readonly"
    :hide-toolbar="hideToolbar"
    :hide-footer="hideFooter"
    @exit="exit()"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()">
    <template #builder>
      <builder :item="item"
        :readonly="readonly" />
    </template>
    <template #stats>
      <npc-tier-selector :item="item"
        :readonly="readonly"
        class="mt-4" />
      <stat-editor :item="item"
        :controller="item.NpcClassController"
        :bonuses="item.FeatureController.Bonuses"
        :readonly="readonly" />
    </template>
    <template #footer>
      <cc-button prepend-icon="mdi-upload"
        size="small"
        class="ml-2"
        @click="exportV2Item(item)">
        {{ $t('gm.npcEditor.v2Export') }}
      </cc-button>
      <cc-modal :title="$t('gm.titles.npcStatblock')"
        icon="mdi-text-account"
        shrink
        max-width="1200px">
        <template #activator="{ open }">
          <cc-button prepend-icon="mdi-text-account"
            size="small"
            class="ml-2"
            @click="open">
            {{ $t('gm.npcEditor.statblock') }}
          </cc-button>
        </template>
        <template #default="{ close }">
          <npc-statblock :item="<Unit>item"
            @close="close" />
        </template>
      </cc-modal>
    </template>
    <div v-if="item.NpcClassController?.HasClass">
      <features :npc="item"
        :readonly="readonly" />
    </div>
  </editor-base>
</template>

<script setup lang="ts">
import EditorBase from '../../../gm/_components/EditorBase.vue';
import StatEditor from '../../_components/StatEditor.vue';
import NpcTierSelector from './_components/NpcTierSelector.vue';
import NpcStatblock from './_components/NpcStatblock.vue';
import { NpcStore } from '@/stores';
import Features from './features.vue';
import Builder from './builder.vue';
import { Unit } from '@/classes/npc/unit/Unit';
import exportAsJson from '@/util/jsonExport';
import { convertTov2Npc } from '@/io/V2Exporter';

defineOptions({ name: 'GmEditorNpc' })

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
    }
function deleteItem() {
      (props.item as Unit).SaveController.Delete();
      exit();
    }
function dupe() {
      NpcStore().CloneNpc(props.item as Unit);
    }
function exportItem(item) {
      exportAsJson(Unit.Serialize(item, false), `${item.Name}.json`);
    }
function exportV2Item(item) {
      const data = convertTov2Npc(Unit.Serialize(item, true));
      exportAsJson(data, `${item.Name}-v2.json`);
    }
</script>
