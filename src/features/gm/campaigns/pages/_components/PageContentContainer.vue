<template>
  <v-card class="my-2">
    <v-toolbar density="compact">
      <div class="mx-2 text-left" style="min-width: 200px">
        <cc-short-string-editor justify="start" @set="item.Title = $event">
          <div class="heading">
            {{ item.Title }}
          </div>
        </cc-short-string-editor>
      </div>
      <v-spacer />
      <v-menu>
        <template #activator="{ props }">
          <v-icon v-bind="props" :icon="getTypeIcon(item.ContentType)" class="fade-select mx-2" />
        </template>
        <v-card>
          <v-list two-lines>
            <v-list-item
              prepend-icon="mdi-text-long"
              title="Text Section"
              @click="setContentType('text')" />
            <v-list-item prepend-icon="mdi-image" title="Image" @click="setContentType('image')" />
            <v-list-item
              prepend-icon="mdi-table"
              title="Rollable Table"
              @click="setContentType('table')" />
            <v-list-item prepend-icon="mdi-clock" title="Clock" @click="setContentType('clock')" />
            <v-list-item
              prepend-icon="mdi-puzzle"
              title="Narrative Element"
              @click="setContentType('narrative')" />
            <v-list-item
              prepend-icon="cc:encounter"
              title="Combat Encounter"
              @click="setContentType('encounter')" />
          </v-list>
        </v-card>
      </v-menu>
      <v-divider vertical class="mx-2" />
      <v-menu>
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            :icon="item.HeaderType ? `mdi-format-${item.HeaderType}` : 'mdi-eye-off-outline'"
            class="fade-select mx-2" />
        </template>
        <v-card>
          <v-card-text>
            <v-card
              class="pa-2 pt-4 pr-4 my-1 rounded-0 clipped"
              :color="item.Color || 'primary'"
              variant="elevated"
              @click="item.HeaderType = 'header-1'">
              <span class="heading h1">{{ $t('gm.pageContent.h1') }}</span>
            </v-card>
            <v-card
              class="pa-1 pr-4 my-1 rounded-0 clipped"
              :color="item.Color || 'primary'"
              variant="elevated"
              @click="item.HeaderType = 'header-2'">
              <span class="heading h3">{{ $t('gm.pageContent.h2') }}</span>
            </v-card>
            <v-card class="pa-1 pr-4 my-1" variant="plain" @click="item.HeaderType = 'header-3'">
              <span class="heading h3">{{ $t('gm.pageContent.h3') }}</span>
            </v-card>
            <v-card class="pa-1 pr-4 my-1" variant="plain" @click="item.HeaderType = 'header-4'">
              <span class="heading" :class="`text-${item.Color}`">{{ $t('gm.pageContent.h4') }}</span>
            </v-card>
            <v-card class="pa-2 my-1" variant="text" @click="item.HeaderType = ''">
              <span class="">{{ $t('gm.pageContent.hideTitle') }}</span>
            </v-card>
          </v-card-text>
        </v-card>
      </v-menu>
      <v-menu>
        <template #activator="{ props }">
          <v-icon v-bind="props" :icon="getIcon(item.Variant)" class="fade-select mx-2" />
        </template>
        <v-card>
          <v-card-text>
            <v-card
              class="pa-2 my-1"
              :color="item.Color || 'primary'"
              variant="outlined"
              @click="item.Variant = 'outlined'">
              <span class="text-text">{{ $t('gm.pageContent.outlined') }}</span>
            </v-card>
            <v-card
              class="pa-2 my-1"
              :color="item.Color || 'primary'"
              variant="tonal"
              @click="item.Variant = 'tonal'">
              <span class="text-text">{{ $t('gm.pageContent.tonal') }}</span>
            </v-card>
            <v-card
              class="pa-2 my-1 rounded-0"
              :color="item.Color || 'primary'"
              variant="elevated"
              @click="item.Variant = 'block'">
              <span>{{ $t('gm.pageContent.block') }}</span>
            </v-card>
            <v-card
              class="pa-2 pr-4 my-1 rounded-0 clipped"
              :color="item.Color || 'primary'"
              variant="elevated"
              @click="item.Variant = 'clipped'">
              {{ $t('gm.pageContent.clippedBlock') }}
            </v-card>
            <v-card
              class="pa-2 my-1"
              :color="item.Color || 'primary'"
              variant="text"
              @click="item.Variant = 'quote'">
              <div
                :class="`bg-${item.Color || 'panel'} d-inline-block`"
                style="width: 8px; border-radius: 4px">
                &emsp;
              </div>
              <span class="text-text pl-2">{{ $t('gm.pageContent.quote') }}</span>
            </v-card>
            <v-card class="pa-2 my-1" variant="text" @click="item.Variant = ''">
              <span class="text-text">{{ $t('gm.pageContent.none') }}</span>
            </v-card>
          </v-card-text>
        </v-card>
      </v-menu>
      <v-menu max-width="480px" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-badge :color="item.Color" dot>
            <v-icon v-bind="props" icon="mdi-palette" class="mx-2 fade-select" />
          </v-badge>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-tabs v-model="colorTab" grow>
              <v-tab>{{ $t('gm.pageContent.themeAwareColors') }}</v-tab>
              <v-tab>{{ $t('gm.pageContent.palette') }}</v-tab>
            </v-tabs>
            <v-card-text>
              <v-window v-model="colorTab">
                <v-window-item>
                  <div class="text-caption text-center mb-4">
                    <i>{{ $t('gm.pageContent.themeColorsHelp') }}</i>
                  </div>
                  <v-row dense justify="center" align="center">
                    <v-col cols="3" v-for="color in colorSelections" :key="color">
                      <v-card
                        class="pa-2 pr-4 text-capitalize text-caption"
                        :color="color"
                        variant="elevated"
                        @click="item.Color = color">
                        {{ color }}
                      </v-card>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item>
                  <v-row dense justify="center" align="center">
                    <div class="text-caption text-center mb-4">
                      <i18n-t keypath="gm.pageContent.paletteColorsHelp" tag="i" scope="global">
                        <template #strong><b class="text-accent">{{ $t('gm.pageContent.willNot') }}</b></template>
                      </i18n-t>
                    </div>
                    <v-col cols="3" v-for="color in colorPalette" :key="color">
                      <v-card
                        class="pa-2 pr-4 text-capitalize text-caption"
                        :color="color"
                        variant="elevated"
                        @click="
                          item.Color = color;
                          isActive.value = false;
                        ">
                        {{ color }}
                      </v-card>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </template>
      </v-menu>
      <v-divider vertical class="mx-2" />
      <v-menu>
        <template #activator="{ props }">
          <v-icon v-bind="props" icon="mdi-delete" class="ml-2 mr-4 fade-select" />
        </template>
        <v-card>
          <v-card-text>{{ $t('gm.pageContent.deleteItemConfirm') }}</v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn small color="error" @click="$emit('delete-item')">{{ $t('common.confirmDeletion') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-row dense>
      <v-col>
        <cc-rollable-table
          v-if="item.ContentType === 'table'"
          :table="item.Content"
          no-delete
          density="compact" />
        <cc-clock
          v-else-if="item.ContentType === 'clock'"
          :clock="item.Content"
          density="compact"
          no-delete />
        <div v-else-if="item.ContentType === 'image'" class="text-center">
          <img v-if="item.Content.ImageUrl" :src="item.Content.ImageUrl" />
          <v-card v-else color="panel" variant="outlined" class="pa-2 ma-4">
            <i class="text-caption text-disabled">{{ $t('gm.pageContent.noImage') }}</i>
          </v-card>
          <v-text-field
            v-model="item.Content.ImageUrl"
            label="Image URL"
            hide-details
            class="my-2 mx-2"
            density="compact" />
          <v-text-field
            v-model="item.Content.Caption"
            label="Caption"
            hide-details
            class="my-2 mx-2"
            density="compact" />
        </div>
        <narrative-content-container
          v-else-if="item.ContentType === 'narrative'"
          :item="item.Content" />
        <encounter-container v-else-if="item.ContentType === 'encounter'" :item="item.Content" />
        <cc-rich-text-area v-else v-model="item.Content.Body" />
      </v-col>
      <v-col cols="auto" class="pr-3 py-2" style="position: relative; min-height: 65px">
        <cc-button icon="mdi-arrow-up" class="fade-select" @click="item.MoveUp()" />
        <cc-button
          icon="mdi-arrow-down"
          class="fade-select"
          style="position: absolute; bottom: 8px"
          @click="item.MoveDown()" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NarrativeContentContainer from './NarrativeContentContainer.vue';
import EncounterContainer from './EncounterContainer.vue';
import { campaignColorSelections, campaignColorPalette } from '@/shared/campaignColorOptions';

defineOptions({ name: 'campaign-page-content-container' })

const props = defineProps<{
  item: object
}>()

const colorTab = ref(0)
const colorSelections = ref(campaignColorSelections)
const colorPalette = ref(campaignColorPalette)

function getIcon(variant: string) {
      switch (variant) {
        case 'outlined':
          return 'mdi-card-outline';
        case 'tonal':
          return 'mdi-square-opacity';
        case 'block':
          return 'mdi-square-rounded';
        case 'clipped':
          return 'mdi-rounded-corner';
        case 'quote':
          return 'mdi-format-quote-open';
        default:
          return 'mdi-square-off-outline';
      }
    }
function getTypeIcon(type: string) {
      switch (type) {
        case 'text':
          return 'mdi-text';
        case 'image':
          return 'mdi-image';
        case 'table':
          return 'mdi-table';
        case 'clock':
          return 'mdi-clock';
        case 'encounter':
          return 'cc:encounter';
        default:
          return 'mdi-puzzle';
      }
    }
function setContentType(type: string) {
      props.item.ContentType = type;
    }
</script>
