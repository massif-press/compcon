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

        <v-col v-if="itemType === 'Character'"
          cols="auto">
          <v-combobox v-model="item.Pronouns"
            :readonly="isRemote"
            density="compact"
            :items="['He/Him', 'She/Her', 'They/Them']"
            variant="outlined"
            hide-details
            :label="$t('gm.fields.pronouns')"
            style="width: 200px" />
        </v-col>
        <v-col v-else-if="itemType === 'Faction'"
          cols="auto">
          <v-combobox v-model="item.FactionType"
            :readonly="isRemote"
            density="compact"
            :items="item.TypeSuggestions"
            variant="outlined"
            hide-details
            :label="$t('ui.fields.organizationType')"
            style="width: 335px" />
        </v-col>
      </v-row>

      <v-row v-if="itemType === 'Character'"
        class="mb-4">
        <v-col>
          <cc-text-field v-model="item.Title"
            :readonly="isRemote"
            color="primary"
            variant="outlined"
            :label="$t('ui.fields.title')" />
        </v-col>
        <v-col>
          <cc-text-field v-model="item.Alias"
            :readonly="isRemote"
            color="primary"
            variant="outlined"
            :label="$t('gm.fields.alias')" />
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
import { Character } from '@/classes/narrative/Character'
import { Faction } from '@/classes/narrative/Faction'
import { Location } from '@/classes/narrative/Location'
import EditorBase from '../../../gm/_components/EditorBase.vue'
import NarrativeBlock from './narrativeBlock.vue'
import RelationshipEditor from '../../_components/RelationshipEditor.vue'
import { NarrativeStore } from '@/stores'
import exportAsJson from '@/util/jsonExport'

defineOptions({ name: 'NarrativeItemEditor' })

const props = defineProps<{
  item: object
  itemType: 'Character' | 'Faction' | 'Location'
}>()

const emit = defineEmits<{
  'exit': []
}>()

const isRemote = computed(() => (props.item as any).SaveController.IsRemote)

async function save() {
  await NarrativeStore().SaveItemData()
  emit('exit')
}

function deleteItem() {
  ;(props.item as any).SaveController.Delete()
  emit('exit')
}

function dupe() {
  NarrativeStore().CloneItem(props.item as any)
  emit('exit')
}

function exportItem(item: any) {
  if (props.itemType === 'Character')
    exportAsJson(Character.Serialize(item), `${item.Name}.json`)
  else if (props.itemType === 'Faction')
    exportAsJson(Faction.Serialize(item), `${item.Name}.json`)
  else
    exportAsJson(Location.Serialize(item), `${item.Name}.json`)
}
</script>
