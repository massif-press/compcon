<template>
  <div>
    <div v-if="item.NarrativeController.TextItems.length">
      <v-card v-for="(s, index) in item.NarrativeController.TextItems"
        :key="`section-${index}`"
        variant="tonal"
        class="mb-2">
        <v-toolbar density="compact"
          class="px-3">
          <div class="heading h3">
            <cc-short-string-editor large
              @set="s.header = $event">
              {{ s.header }}
            </cc-short-string-editor>
          </div>
          <div style="width: 100px" />

          <v-checkbox-btn v-model="s.GmOnly"
            hide-details
            @update:model-value="debouncedSave">
            <template #label>
              {{ $t('gm.sectionEditor.gmOnly') }}
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon class="fade-select"
                    size="small"
                    end
                    icon="mdi-information-outline"
                    v-bind="props" />
                </template>
                <div>
                  {{ $t('gm.sectionEditor.gmOnlyTooltip') }}
                </div>
              </v-tooltip>
            </template>
          </v-checkbox-btn>

          <v-menu offset-x
            left>
            <template #activator="{ props }">
              <v-btn size="small"
                icon
                color="error"
                variant="plain"
                v-bind="props">
                <v-icon icon="mdi-delete" />
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                {{ $t('gm.sectionEditor.confirmDelete', { title: s.header }) }}
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn size="small"
                  color="error"
                  @click="deleteTextItem(s)">
                  {{ $t('common.confirmDeletion') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-toolbar>
        <div class="pa-2">
          <cc-rich-text-area v-model="s.body"
            @update:model-value="debouncedSave" />
        </div>
      </v-card>
    </div>
    <v-menu v-if="!readonly"
      v-model="textItemMenu"
      offset-x
      left
      :close-on-click="false"
      :close-on-content-click="false">
      <template #activator="{ props }">
        <cc-button block
          size="x-small"
          prepend-icon="mdi-plus"
          color="primary"
          @click="props.onClick($event)">
          {{ $t('gm.sectionEditor.addSection') }}
        </cc-button>
      </template>
      <v-card>
        <v-card-text>
          <v-combobox v-if="item.SectionSuggestions"
            v-model="newTextItemHeader"
            label="Title"
            :items="item.SectionSuggestions" />
          <v-text-field v-else
            v-model="newTextItemHeader"
            label="New Title"
            density="compact"
            hide-details
            variant="outlined" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn variant="text"
            @click="textItemMenu = false">{{ $t('common.cancel') }}</v-btn>
          <v-spacer />
          <v-btn color="secondary"
            @click="addTextItem">{{ $t('common.add') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'CampaignItemTextItemEditor' })

const props = withDefaults(defineProps<{
  item: object
  readonly?: boolean
}>(), {
  readonly: false
})

const textItemMenu = ref(false)
const newTextItemHeader = ref('')
const _saveTimer = ref(null as ReturnType<typeof setTimeout> | null)

function save() {
      props.item.SaveController.save();
    }
function debouncedSave() {
      if (_saveTimer.value) clearTimeout(_saveTimer.value)
      _saveTimer.value = setTimeout(() => { save() }, 500)
    }
function addTextItem() {
      props.item.NarrativeController.AddTextItem({
        header: newTextItemHeader.value,
        body: '',
      });
      newTextItemHeader.value = '';
      textItemMenu.value = false;
    }
function deleteTextItem(s) {
      const idx = props.item.NarrativeController.TextItems.findIndex(
        (x) => x.header === s.header && x.body === s.body
      );
      if (idx === -1) return;
      props.item.NarrativeController.TextItems.splice(idx, 1);
    }
</script>
