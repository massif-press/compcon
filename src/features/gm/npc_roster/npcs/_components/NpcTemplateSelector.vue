<template>
  <div v-if="readonly && item.NpcTemplateController.Templates.length === 0"
    class="mb-6">
    <v-card flat>
      <div class="text-disabled text-caption pl-2">
        <i>{{ $t('gm.npcTemplate.noTemplates') }}</i>
      </div>
    </v-card>
  </div>
  <v-row align="center">
    <v-col v-if="item.NpcTemplateController.Templates.length"
      cols="auto"
      dense
      align="center">
      <cc-chip v-for="t in item.NpcTemplateController.Templates"
        :key="t.ID"
        size="large"
        class="mr-4">
        <v-tooltip :text="t.Description || t.Tactics"
          max-width="350px">
          <template #activator="{ props }">
            <span v-bind="props"
              class="heading h4 pr-2">
              <v-icon icon="cc:npc_template"
                class="mt-n1" />
              {{ t.Name }}
            </span>
          </template>
        </v-tooltip>
      </cc-chip>
    </v-col>
    <v-col v-if="!readonly"
      cols="auto"
      :class="item.NpcTemplateController.Templates.length ? 'ml-auto' : ''">
      <cc-button color="primary"
        size="small"
        @click="dialog = true">
        {{ item.NpcTemplateController.Templates.length ? $t('gm.npcTemplate.editTemplates') :
          $t('gm.npcTemplate.assignTemplates') }}
      </cc-button>
    </v-col>
  </v-row>

  <cc-dialog v-model="dialog"
    :title="$t('gm.titles.selectTemplate')"
    icon="cc:npc_template" :close-on-click="false" major full-height max-width="90vw">
    <v-card-text v-if="!templates.length">
      <v-container class="mt-n4">
        <cc-missing-gm-lcp-text />
      </v-container>
    </v-card-text>
    <cc-compendium-browser v-else
      :items="templates"
      item-type="NpcTemplate"
      :options="options"
      :active-ids="activeIds"
      outline-selected
      view-key="sel-npc-template">
      <template #header>
        <div class="heading h3 text-center text-accent">
          {{ $t('gm.titles.selectTemplate') }}
        </div>
      </template>

      <template #nav-list="{ selectItem, selectedItem, shownItems }">
        <v-list-item v-for="t in shownItems"
          :key="t.ID"
          :active="selectedItem?.ID === t.ID"
          :class="isAssigned(t) ? 'bg-primary' : ''"
          color="accent"
          @click="selectItem(t)">
          <template #title>
            <span class="heading">{{ t.Name }}</span>
          </template>
          <template #append>
            <v-tooltip v-if="isAssigned(t)"
              location="top"
              :text="$t('gm.npcTemplate.removeTemplate')">
              <template #activator="{ props: tip }">
                <cc-button v-bind="tip"
                  size="small"
                  variant="outlined"
                  icon="mdi-minus"
                  color="error"
                  @click.stop="removeTemplate(t)" />
              </template>
            </v-tooltip>
            <v-icon v-else-if="templateConflict(t).length"
              icon="mdi-cancel"
              size="large"
              disabled />
            <v-tooltip v-else
              location="top"
              :text="$t('gm.npcTemplate.assignTemplate')">
              <template #activator="{ props: tip }">
                <cc-button v-bind="tip"
                  size="small"
                  variant="outlined"
                  icon="mdi-plus"
                  color="secondary"
                  @click.stop="addTemplate(t)" />
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </template>

      <template #item="{ item: template }">
        <div class="heading h2 mb-2 px-2">{{ template.Name }}</div>
        <cc-item-card :item="template" />
        <cc-button v-if="isAssigned(template)"
          size="small"
          block
          color="error"
          @click="removeTemplate(template)">
          <v-icon start>mdi-minus</v-icon>
          {{ $t('gm.npcTemplate.removeTemplate') }}
        </cc-button>
        <cc-button v-else-if="templateConflict(template).length"
          size="small"
          block
          disabled>
          <v-icon start
            icon="mdi-cancel" />
          {{ $t('gm.npcTemplate.cannotAssign', { conflict: templateConflict(template) }) }}
        </cc-button>
        <cc-button v-else
          size="small"
          block
          color="secondary"
          @click="addTemplate(template)">
          <v-icon start>mdi-plus</v-icon>
          {{ $t('gm.npcTemplate.assignTemplate') }}
        </cc-button>
      </template>
    </cc-compendium-browser>
  </cc-dialog>
</template>

<script setup lang="ts">
import type { Unit } from '@/classes/npc/unit/Unit'
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores'

defineOptions({ name: 'npc-template-selector' })

const props = withDefaults(defineProps<{
  item: Unit
  readonly?: boolean
}>(), {
  readonly: false
})

const dialog = ref(false)

const options = {
  views: ['single'],
  initialView: 'single',
  groups: ['none', 'lcp'],
  initialGroup: 'none',
  noSource: true,
}

const templates = computed(() => CompendiumStore().NpcTemplates)

const activeIds = computed<string[]>(() =>
  props.item.NpcTemplateController.Templates.map((x: any) => x.ID)
)

function templateConflict(t: any) {
  if (!t) return ''
  return props.item.NpcTemplateController.Templates.filter((x: any) =>
    x.ProhibitTemplates.includes(t.ID)
  )
    .map((x: any) => x.Name)
    .join(', ')
}
function isAssigned(t: any) {
  if (!t) return false
  return props.item.NpcTemplateController.Templates.some((x: any) => x.ID === t.ID)
}
function addTemplate(t: any) {
  if (!t) return
  props.item.NpcTemplateController.AddTemplate(t)
}
function removeTemplate(t: any) {
  if (!t) return
  props.item.NpcTemplateController.RemoveTemplate(t)
}
</script>
