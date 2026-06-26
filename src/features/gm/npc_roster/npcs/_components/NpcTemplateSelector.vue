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
        {{ item.NpcTemplateController.Templates.length ? $t('gm.npcTemplate.editTemplates') : $t('gm.npcTemplate.assignTemplates') }}
      </cc-button>
    </v-col>
  </v-row>

  <cc-modal v-model="dialog"
    :title="$t('gm.titles.selectTemplate')"
    icon="cc:npc_template">
    <v-card-text v-if="!templates.length">
      <v-container class="mt-n4">
        <cc-missing-gm-lcp-text />
      </v-container>
    </v-card-text>
    <v-layout v-else
      style="height: 90vh; overflow-y: scroll">
      <div style="position: absolute; z-index: 999"
        :style="`left: ${showNav ? (mobile ? '322' : '352') : '3'}px; top: 6px`">
        <cc-button :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
          size="small"
          color="primary"
          @click="(showNav as any) = !showNav" />
      </div>
      <v-navigation-drawer v-model="showNav"
        :width="mobile ? 320 : 350">
        <v-text-field v-model="search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          variant="outlined"
          clearable />
        <v-list density="compact"
          slim>
          <v-list-item v-for="item in filteredTemplates"
            :key="item.ID"
            :color="selected === item ? '' : 'accent'"
            :class="isAssigned(item) ? 'bg-primary' : ''"
            :value="item"
            @click="selected = item">
            <template #title>
              <span class="heading">{{ item.Name }}</span>
            </template>
            <template #append>
              <v-tooltip v-if="isAssigned(item)"
                location="top">
                <template #activator="{ props }">
                  <cc-button v-bind="props"
                    size="small"
                    variant="outlined"
                    icon="mdi-minus"
                    color="error"
                    @click="removeTemplate(item)" />
                </template>
                {{ $t('gm.npcTemplate.removeTemplate') }}
              </v-tooltip>

              <v-icon v-else-if="templateConflict(item).length"
                icon="mdi-cancel"
                size="large"
                disabled></v-icon>

              <v-tooltip v-else>
                <template #activator="{ props }">
                  <cc-button v-bind="props"
                    size="small"
                    variant="outlined"
                    icon="mdi-plus"
                    color="secondary"
                    @click="addTemplate(item)" />
                </template>
                {{ $t('gm.npcTemplate.assignTemplate') }}
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="py-3">
        <v-container v-if="selected"
          class="py-2 px-6">
          <v-row dense
            align="center"
            class="mt-n8">
            <v-col cols="auto">
              <span class="heading mech">
                {{ selected.Name }}
              </span>
            </v-col>
            <v-col v-if="selected.InLcp"
              cols="auto"
              class="ml-auto">
              <div class="heading h3 text-text">
                {{ selected.LcpName }}
              </div>
            </v-col>
          </v-row>
          <cc-item-card :item="selected" />
          <cc-button v-if="isAssigned(selected)"
            size="small"
            block
            color="error"
            @click="removeTemplate(selected)">
            <v-icon start>mdi-minus</v-icon>
            {{ $t('gm.npcTemplate.removeTemplate') }}
          </cc-button>

          <cc-button v-else-if="templateConflict(selected).length"
            size="small"
            block
            disabled>
            <v-icon start
              icon="mdi-cancel" />
            {{ $t('gm.npcTemplate.cannotAssign', { conflict: templateConflict(selected) }) }}
          </cc-button>

          <cc-button v-else
            size="small"
            block
            color="secondary"
            @click="addTemplate(selected)">
            <v-icon start>mdi-plus</v-icon>
            {{ $t('gm.npcTemplate.assignTemplate') }}
          </cc-button>
        </v-container>
        <v-row v-else
          align="center"
          justify="center"
          style="width: 100%; height: 100%">
          <v-col cols="auto">
            <span class="heading h1 text-disabled text--lighten-2">{{ $t('gm.npcTemplate.selectNpcTemplate') }}</span>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </cc-modal>
</template>

<script setup lang="ts">
import type { Unit } from '@/classes/npc/unit/Unit'
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores';
import PanelView from '../../../_components/PanelView.vue';

const _display = useDisplay()

defineOptions({ name: 'npc-template-selector' })

const props = withDefaults(defineProps<{
  item: Unit
  readonly?: boolean
}>(), {
  readonly: false
})

const dialog = ref(false)
const selected = ref(null as any)
const search = ref('')
const showNav = ref(true)

const templates = computed(() => {
      return CompendiumStore().NpcTemplates;
    })
const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
const filteredTemplates = computed(() => {
      const q = search.value?.toLowerCase() || '';
      return templates.value.filter((t) => t.Name.toLowerCase().includes(q));
    })

function templateConflict(t) {
      if (!t) return '';
      return props.item.NpcTemplateController.Templates.filter((x) =>
        x.ProhibitTemplates.includes(t.ID)
      )
        .map((x) => x.Name)
        .join(', ');
    }
function isAssigned(t) {
      if (!t) return false;
      return props.item.NpcTemplateController.Templates.some((x) => x.ID === t.ID);
    }
function addTemplate(t) {
      if (!t) return;
      props.item.NpcTemplateController.AddTemplate(t);
    }
function removeTemplate(t) {
      if (!t) return;
      props.item.NpcTemplateController.RemoveTemplate(t);
    }
</script>
