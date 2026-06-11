<template>
  <v-layout>
    <div style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '322' : '352') : '3'}px; top: 6px`">
      <cc-button :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="(showNav as any) = !showNav" />
    </div>
    <v-navigation-drawer v-model="showNav"
      :width="mobile ? 320 : 350">
      <v-text-field v-model=search
        density="compact"
        hide-details
        clearable
        flat
        tile
        placeholder="Search"
        class="my-1"
        prepend-inner-icon="mdi-magnify" />

      <v-btn-toggle v-model="itemTypes"
        multiple
        mandatory
        density="compact"
        size="small"
        class="rounded-0"
        style="width: 100%; height: 26px">
        <v-btn flat
          tile
          style="width: 33%"
          value="unit"
          color="primary">{{ $t('gm.combatantSelector.npcs') }}</v-btn>
        <v-btn flat
          tile
          style="width: 33%"
          value="doodad"
          color="primary">{{ $t('gm.combatantSelector.doodads') }}</v-btn>
        <v-btn flat
          tile
          style="width: 33%"
          value="eidolon"
          color="primary">{{ $t('gm.combatantSelector.eidolons') }}</v-btn>
      </v-btn-toggle>
      <v-list class="mb-n3"
        style="height: 100%; min-height: calc(100vh - 86px); overflow-y: scroll">
        <v-list-item v-for="folder in Object.keys(npcsByFolder)"
          :key="folder">
          <v-list-item-subtitle>
            <v-icon icon="mdi-folder"
              start
              size="small"
              class="mt-n1" />
            {{ folder || 'No Folder' }}
          </v-list-item-subtitle>
          <v-divider />
          <v-list-item v-for="n in npcsByFolder[folder]"
            :key="n.ID"
            :prepend-icon="(n as Npc).Icon"
            @click="(selected as any) = n">
            {{ n.Name }}
            <template #append>
              <v-tooltip>
                <template #activator="{ props }">
                  <v-badge :color="itemCount(n) ? 'primary' : 'transparent'"
                    floating
                    :content="itemCount(n) || ''">
                    <cc-button v-bind="props"
                      variant="outlined"
                      icon="mdi-plus"
                      color="secondary"
                      @click.stop="$emit('select', n)"></cc-button>
                  </v-badge>
                </template>
                <span>{{ $t('gm.combatantSelector.addToEncounter') }}</span>
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="mt-2"
      style="overflow-y: scroll">
      <div v-if="editorReady && selected"
        class="px-3">
        <unit-editor v-if="(selected as any).ItemType.toLowerCase() === 'unit'"
          :item="selected"
          readonly />
        <doodad-editor v-if="(selected as any).ItemType.toLowerCase() === 'doodad'"
          :item="selected"
          readonly />
        <eidolon-editor v-if="(selected as any).ItemType.toLowerCase() === 'eidolon'"
          :item="selected"
          readonly />
      </div>
      <div v-else>
        <v-row justify="center"
          align="center"
          style="height: calc(100vh - 60px)">
          <v-col cols="auto"><i class="text-disabled">{{ $t('gm.combatantSelector.selectNpc') }}</i></v-col>
        </v-row>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { groupBy } from 'lodash-es'
import { NpcStore } from '@/stores'
import UnitEditor from '@/features/gm/npc_roster/npcs/editor.vue'
import DoodadEditor from '@/features/gm/npc_roster/doodads/editor.vue'
import EidolonEditor from '@/features/gm/npc_roster/eidolons/editor.vue'
import { Npc } from '@/classes/npc/Npc'

const props = defineProps<{ encounter: Record<string, any> }>()
defineEmits<{ select: [value: any] }>()

const { mdAndDown: mobile } = useDisplay()

const selected = ref<any>(null)
const editorReady = ref(false)
const lastSelectedType = ref<string | null>(null)
const itemTypes = ref(['unit', 'doodad', 'eidolon'])
const showNav = ref(true)
const search = ref('')

const npcs = computed(() => NpcStore().Npcs.filter((x: any) => !x.SaveController.IsDeleted))
const filteredNpcs = computed(() => {
  let out = npcs.value.filter((n: any) => itemTypes.value.includes(n.ItemType.toLowerCase()))
  if (search.value) {
    out = out.filter((x: any) => x.Name.toLowerCase().includes(search.value.toLowerCase()))
  }
  return out
})
const npcsByFolder = computed(() => groupBy(filteredNpcs.value, 'FolderController.Folder'))

watch(selected, (newVal: any) => {
  if (!newVal) return
  const newType = newVal.ItemType.toLowerCase()
  if (newType !== lastSelectedType.value) {
    editorReady.value = false
    lastSelectedType.value = newType
    setTimeout(() => { editorReady.value = true }, 0)
  }
})

function itemCount(item: any) {
  return props.encounter.Combatants.filter((x: any) => x.actor.ID === item.ID).length
}
</script>
