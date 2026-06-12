<template>
  <v-chip label
    variant="elevated"
    color="panel"
    class="ma-1"
    @click="dialog = true">
    <v-icon v-if="editable"
      icon="mdi-pencil-outline"
      start
      color="accent" />
    <span v-if="originItem"
      class="pr-1">{{ originItem.Name }}</span>
    <v-icon icon="mdi-minus" />
    <v-chip size="x-small"
      class="mx-n1"
      variant="outlined">{{ item.relationship }}</v-chip>
    <v-icon icon="mdi-arrow-right" />
    <span class="pl-1">{{ item.name }}</span>

    <v-menu open-on-hover
      activator="parent">
      <v-card style="width: 50vw"
        variant="elevated">
        <v-toolbar density="compact"
          class="pl-4 pr-2"
          :color="color">
          <span v-if="originItem"
            class="pr-1">{{ originItem.Name }}</span>
          <v-icon icon="mdi-minus" />
          <v-chip size="x-small"
            class="mx-n1"
            variant="outlined">{{ item.relationship }}</v-chip>
          <v-icon icon="mdi-arrow-right" />
          <span class="pl-1">{{ item.name }}</span>
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <v-row dense>
            <v-col v-if="linkedItem"
              cols="auto">
              <v-avatar size="64"
                class="mr-2">
                <v-img :src="linkedItem.Portrait" />
              </v-avatar>
            </v-col>
            <v-col>
              <p v-if="item.notes"
                v-html-safe="item.notes" />
              <v-row v-else
                align="center"
                justify="center">
                <v-col cols="auto"
                  class="mt-5">
                  <i class="text-caption text-disabled">{{ $t('ui.widget.noData') }}</i>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-dialog v-model="dialog"
      :max-width="editable ? '1200px' : ''">
      <v-card v-if="editable"
        tile>
        <v-toolbar class="px-3"
          tile>
          <v-row dense>
            <v-col cols="5">
              <v-autocomplete v-model="item.id"
                density="compact"
                variant="solo"
                hide-details
                auto-select-first="exact"
                label="Entity"
                :items="allCollectionItems"
                item-title="Name"
                item-value="ID"
                @update:model-value="setName(item)" />
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="item.relationship"
                density="compact"
                hide-details
                variant="solo"
                label="Relationship" />
            </v-col>
            <v-col align-self="center">
              <v-menu v-if="item.id.length && linkedItem"
                location="right">
                <template #activator="{ props }">
                  <cc-button icon="mdi-lightbulb"
                    color="primary"
                    v-bind="props" />
                </template>
                <v-card>
                  <v-list>
                    <v-list-item v-for="(s, index) in (linkedItem as any).GetRelationshipSuggestions(
                      originItem.ItemType
                    )"
                      :key="`suggestion-${index}`"
                      :title="s"
                      @click="item.relationship = s" />
                  </v-list>
                </v-card>
              </v-menu>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
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
                    {{ $t('ui.relationship.deleteConfirm') }}
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn size="small"
                      color="error"
                      @click="$emit('delete', item.id)">
                      {{ $t('common.confirmDeletion') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-card-text class="pt-1">
          <div class="text-caption">{{ $t('ui.widget.detail') }}</div>
          <cc-rich-text-area v-model="item.notes" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text"
            size="small"
            color="accent"
            @click="dialog = false">
            {{ $t('common.saveAndClose') }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <CCNarrativeItemContent :item="item"
          :origin-item="originItem"
          :linked-item="linkedItem" />
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1"
            variant="text"
            @click="dialog = false">{{ $t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-chip>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CCNarrativeItemContent from './CCNarrativeItemContent.vue'
import { CollectionItem } from '@/classes/narrative/CollectionItem'

const props = withDefaults(defineProps<{
  item: Record<string, any>
  collectionItems?: any[]
  color?: string
  editable?: boolean
  originItem: Record<string, any>
}>(), { collectionItems: () => [], color: 'primary', editable: false })

defineEmits<{ delete: [id: string] }>()

const dialog = ref(false)

const allCollectionItems = computed(() =>
  props.collectionItems.filter(
    (i: any) => !i.SaveController.IsDeleted && i.ID !== props.item.ID && i.ID !== props.originItem.ID
  )
)

const linkedItem = computed<CollectionItem | null>(() =>
  props.collectionItems.find((i: any) => i.ID === props.item.id) ?? null
)

function setName(r: any) {
  const item = allCollectionItems.value.find((i: any) => i.ID === r.id)
  if (item) r.name = item.Name
}

function openDialog() {
  dialog.value = true
}

defineExpose({ openDialog })
</script>
