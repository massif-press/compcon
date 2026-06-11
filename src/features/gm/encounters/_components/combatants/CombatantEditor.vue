<template>
  <div class="text-overline mt-1">{{ $t('gm.combatant.combatants') }}</div>

  <v-card flat
    tile>
    <v-card-text class="py-2 px-4">
      <combatant-group type="enemy"
        :list="enemyCombatants"
        label="ENEMY FORCES"
        :transfer-key="transferKey"
        :readonly="readonly"
        is-first
        @drag-start="startDragScroll"
        @reorder="onCombatantReorder"
        @add="onCombatantAdded"
        @open="editUnit"
        @remove="removeCombatantById" />

      <combatant-group type="ally"
        :list="allyCombatants"
        label="ALLIED FORCES"
        :transfer-key="transferKey"
        :readonly="readonly"
        @drag-start="startDragScroll"
        @reorder="onCombatantReorder"
        @add="onCombatantAdded"
        @open="editUnit"
        @remove="removeCombatantById" />

      <combatant-group type="neutral"
        :list="neutralCombatants"
        label="NEUTRAL"
        :transfer-key="transferKey"
        :readonly="readonly"
        @drag-start="startDragScroll"
        @reorder="onCombatantReorder"
        @add="onCombatantAdded"
        @open="editUnit"
        @remove="removeCombatantById" />
    </v-card-text>
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title class="text-caption">
        <v-icon icon="cc:mech"
          class="mt-n1"
          color="error" />
        {{ enemyCombatants.length }}
        <cc-slashes class="mx-2" />
        <v-icon icon="cc:mech"
          class="mt-n1"
          color="success" />
        {{ allyCombatants.length }}
        <cc-slashes class="mx-2" />
        <v-icon icon="cc:mech"
          class="mt-n1" />
        {{ neutralCombatants.length }}
      </v-toolbar-title>
      <v-spacer />
      <cc-button v-if="!readonly"
        color="accent"
        prepend-icon="mdi-plus"
        class="mr-2"
        @click="addDialog = true">
        {{ $t('gm.combatant.addNpc') }}
      </cc-button>
    </v-toolbar>
  </v-card>

  <v-dialog v-if="!readonly"
    v-model="addDialog"
    fullscreen>
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title class="heading h3">
          <span>{{ $t('gm.combatant.selectNpc') }}</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon
          @click="addDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <combatant-selector :encounter="encounter"
        :mode="selectorView"
        @select="addUnit" />
    </v-card>
  </v-dialog>

  <v-dialog v-model="editDialog"
    fullscreen>
    <v-card>
      <v-toolbar class="pl-4 border-b"
        density="compact">
        <div>
          <div v-if="!readonly"
            class="text-caption text-disabled mb-n1">{{ $t('gm.combatant.currentlyEditing') }}</div>
          <div>
            <v-icon :icon="selected?.actor.Icon"
              size="x-small"
              class="mt-n1"
              start />
            <span class="heading">{{ selected?.actor.Name }}</span>
            <span class="text-caption text-disabled">
              &emsp;{{ $t('gm.combatant.encounterInstance', { n: selected.index }) }}
            </span>

            <span v-if="!readonly">
              <v-tooltip location="bottom"
                open-delay="200"
                max-width="300px">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    end
                    class="fade-select"
                    size="x-small"
                    icon="mdi-help-circle" />
                </template>
                <span>{{ $t('gm.combatant.uniqueInstanceHelp') }}</span>
              </v-tooltip>
            </span>
          </div>
        </div>
        <v-spacer />
        <combatant-settings-menu :readonly="readonly"
          :item="selected" />
        <v-spacer />
        <v-tooltip v-if="!readonly"
          location="bottom"
          open-delay="200"
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              :color="selected.actor.IsLinked ? 'success' : ''"
              :icon="selected.actor.IsLinked ? 'mdi-link-variant' : 'mdi-link-variant-off'"
              start />
          </template>
          <i18n-t v-if="selected.actor.IsLinked" keypath="gm.combatant.linkedSource" tag="span" scope="global">
            <template #name><b class="text-primary">{{ selected.actor.GetLinkedItem().Name }}</b></template>
          </i18n-t>
          <span v-else>{{ $t('gm.combatant.notLinkedSourceDot') }}</span>
        </v-tooltip>

        <b v-if="!readonly"
          :class="selected.actor.IsLinked ? 'text-accent' : 'text-disabled'">
          <v-menu :close-on-content-click="false"
            width="50vw">
            <template #activator="{ props }">
              <v-btn v-bind="props"
                size="x-small"
                variant="outlined"
                :disabled="!selected.actor.IsLinked">
                {{ selected.actor.IsLinked ? $t('gm.combatant.sourceLinked') : $t('gm.combatant.sourceUnavailable') }}
              </v-btn>
            </template>
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-caption text-disabled">{{ $t('gm.combatant.instanceSource') }}</div>
                <div class="heading">{{ selected.actor.GetLinkedItem().Name }}</div>
                <v-divider class="my-2" />
                <div class="text-caption text-disabled"></div>
                <div v-if="itemDiff && Object.keys(itemDiff).length">
                  <v-row dense
                    class="text-caption text-disabled">
                    <v-col>{{ $t('gm.combatant.change') }}</v-col>
                    <v-col>{{ $t('gm.combatant.thisInstance') }}</v-col>
                    <v-col>{{ $t('gm.combatant.source') }}</v-col>
                    <v-col cols="auto">{{ $t('common.update') }}</v-col>
                  </v-row>
                  <v-row v-for="key in Object.keys(itemDiff)"
                    :key="key"
                    dense>
                    <v-col>{{ key }}</v-col>
                    <v-col :class="itemDiff[key].instance.length > itemDiff[key].source.length
                      ? 'text-success'
                      : 'text-error'
                      ">
                      {{ itemDiff[key].instance }}
                    </v-col>
                    <v-col>{{ itemDiff[key].source }}</v-col>
                    <v-col cols="auto">
                      <v-tooltip location="bottom"
                        open-delay="200"
                        max-width="300px">
                        <template #activator="{ props }">
                          <v-btn icon
                            color="accent"
                            variant="text"
                            size="x-small"
                            class="mt-n1"
                            @click="diffUpdate(key)">
                            <v-icon v-bind="props"
                              size="large"
                              icon="mdi-update" />
                          </v-btn>
                        </template>
                        <span>{{ $t('gm.combatant.updateInstanceTooltip') }}</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <v-divider class="my-2" />
                  <v-row dense>
                    <v-col offset="10">
                      <v-tooltip location="bottom"
                        open-delay="200"
                        max-width="300px">
                        <template #activator="{ props }">
                          <v-btn v-bind="props"
                            size="small"
                            variant="tonal"
                            color="accent"
                            @click="diffUpdateAll(itemDiff)">
                            {{ $t('gm.combatant.updateAll') }}
                          </v-btn>
                        </template>
                        <span>{{ $t('gm.combatant.updateAllTooltip') }}</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </div>
                <div v-else
                  class="pl-2 font-italic">{{ $t('gm.combatant.noChanges') }}</div>
              </v-card-text>
            </v-card>
          </v-menu>
        </b>

        <v-spacer v-if="!readonly" />
        <v-btn icon
          @click="editDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div style="height: calc(100vh - 64px); overflow-y: auto; overflow-x: hidden; padding: 0 8px">
        <component :is="editorComponent"
          v-if="editorReady && selected"
          :item="selected.actor"
          :readonly="readonly"
          hide-toolbar
          hide-footer />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Npc } from '@/classes/npc/Npc'
import CombatantSelector from './CombatantSelector.vue'
import { UserStore } from '@/stores'
import { notify } from '@/util/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import CombatantGroup from './CombatantGroup.vue'
import UnitEditor from '../../../npc_roster/npcs/editor.vue'
import DoodadEditor from '../../../npc_roster/doodads/editor.vue'
import EidolonEditor from '../../../npc_roster/eidolons/editor.vue'
import CombatantSettingsMenu from './_components/combatantSettingsMenu.vue'
import { GenerateItemDiff, SetDiff } from '@/classes/npc/NpcDiff'
import { startDragScroll, stopDragScroll } from '@/composables/useScrollOnDrag'

const props = withDefaults(defineProps<{
  encounter: Record<string, any>
  readonly?: boolean
}>(), { readonly: false })

const selected = ref<any>(null)
const addDialog = ref(false)
const editDialog = ref(false)
const editorReady = ref(false)
const lastEditorType = ref<string | null>(null)
const selectorView = ref('list')
const transferKey = ref(0)

const enemyCombatants = computed(() => (props.encounter.Combatants as any[]).filter((x) => x.side === 'enemy'))
const allyCombatants = computed(() => (props.encounter.Combatants as any[]).filter((x) => x.side === 'ally'))
const neutralCombatants = computed(() => (props.encounter.Combatants as any[]).filter((x) => x.side === 'neutral'))

const editorComponent = computed(() => {
  if (!selected.value) return null
  switch (selected.value.actor.ItemType.toLowerCase()) {
    case 'eidolon': return EidolonEditor
    case 'doodad': return DoodadEditor
    case 'unit': return UnitEditor
    default: return null
  }
})

const itemDiff = computed(() => {
  if (selected.value && selected.value.actor.IsLinked)
    return GenerateItemDiff(selected.value.actor, selected.value.actor.GetLinkedItem())
  return null
})

watch(selectorView, (val) => { if (!val) return; UserStore().User.SetView('combatantSelectorView', val) })
watch(editDialog, (val) => { if (!val && selected.value) props.encounter.save() })

const user = UserStore().User
if (user?.View) {
  selectorView.value = user.View('combatantSelectorView', 'list')
}

function addUnit(item: Npc) {
  props.encounter.AddCombatant(item)
  notify({ title: t('gm.encounter.combatantAddedTitle', { name: item.Name }), text: t('gm.encounter.combatantAddedText', { name: item.Name, encounterName: props.encounter.Name }), data: { icon: 'cc:encounter' } })
}
function editUnit(item: any) {
  const newType = item.actor.ItemType
  selected.value = item
  editDialog.value = true
  if (newType !== lastEditorType.value) {
    editorReady.value = false
    lastEditorType.value = newType
    setTimeout(() => { editorReady.value = true }, 0)
  }
}
function onCombatantReorder(side: string, event: any) {
  stopDragScroll()
  if (event.from !== event.to) return
  if (event.oldIndex === event.newIndex) return
  const all = [...(props.encounter.Combatants as any[])]
  const sideItems = all.filter((c) => c.side === side)
  const [movedItem] = sideItems.splice(event.oldIndex, 1)
  sideItems.splice(event.newIndex, 0, movedItem)
  let sideIdx = 0
  props.encounter.Combatants = all.map((c) => (c.side === side ? sideItems[sideIdx++] : c))
  props.encounter.save()
}
function onCombatantAdded(side: string, event: any) {
  const itemId = event.item.dataset.combatantId
  const item = (props.encounter.Combatants as any[]).find((x) => x.id === itemId)
  if (!item) return
  item.side = side
  props.encounter.save()
  transferKey.value++
}
function removeCombatantById(id: string) {
  const idx = (props.encounter.Combatants as any[]).findIndex((c) => c.id === id)
  if (idx !== -1) props.encounter.RemoveCombatant(idx)
}
function diffUpdate(key: string) {
  SetDiff(selected.value.actor, key)
}
function diffUpdateAll(allDiffs: Record<string, any>) {
  Object.keys(allDiffs).forEach((key) => { SetDiff(selected.value.actor, key) })
}
</script>
