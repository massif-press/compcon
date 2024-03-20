<template>
  <v-chip label variant="elevated" color="panel" class="ma-1" @click="dialog = true">
    <v-icon v-if="editable" icon="mdi-pencil-outline" start color="accent" />
    <span v-if="originItem" class="pr-1">{{ originItem.Name }}</span>
    <v-icon icon="mdi-minus" />
    <v-chip size="x-small" class="mx-n1" variant="outlined">{{ item.relationship }}</v-chip>
    <v-icon icon="mdi-arrow-right" />
    <span class="pl-1">{{ item.name }}</span>

    <v-menu open-on-hover activator="parent">
      <v-card style="width: 50vw" variant="elevated">
        <v-toolbar density="compact" class="pl-4 pr-2" :color="color">
          <span v-if="originItem" class="pr-1">{{ originItem.Name }}</span>
          <v-icon icon="mdi-minus" />
          <v-chip size="x-small" class="mx-n1" variant="outlined">{{ item.relationship }}</v-chip>
          <v-icon icon="mdi-arrow-right" />
          <span class="pl-1">{{ item.name }}</span>
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <v-row dense>
            <v-col v-if="linkedItem" cols="auto">
              <v-avatar size="64" class="mr-2">
                <v-img :src="linkedItem.Portrait" />
              </v-avatar>
            </v-col>
            <v-col>
              <p v-if="item.notes" v-html-safe="item.notes" />
              <v-row v-else align="center" justify="center">
                <v-col cols="auto" class="mt-5">
                  <i class="text-caption text-disabled">No Data</i>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-dialog v-model="dialog" :width="editable ? '90vw' : ''">
      <v-card v-if="editable">
        <v-toolbar class="px-3">
          <v-row dense>
            <v-col cols="5">
              <v-autocomplete
                v-model="item.id"
                density="compact"
                variant="solo"
                hide-details
                auto-select-first="exact"
                label="Entity"
                :items="allCollectionItems"
                item-title="Name"
                item-value="ID"
                @update:modelValue="setName(item)" />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="item.relationship"
                density="compact"
                hide-details
                variant="solo"
                label="Relationship" />
            </v-col>
            <v-col>
              <v-menu v-if="item.id.length && linkedItem" location="right">
                <template #activator="{ props }">
                  <v-btn size="small" icon color="secondary" variant="plain" v-bind="props">
                    <v-tooltip bottom>
                      <template #activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-lightbulb" />
                      </template>
                      <span>Suggestions</span>
                    </v-tooltip>
                  </v-btn>
                </template>
                <v-card>
                  <v-list>
                    <v-list-item
                      v-for="s in (linkedItem as any).GetRelationshipSuggestions(
                        originItem.ItemType
                      )"
                      @click="item.relationship = s"
                      :title="s" />
                  </v-list>
                </v-card>
              </v-menu>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-menu offset-x left>
                <template #activator="{ props }">
                  <v-btn size="small" icon color="error" variant="plain" v-bind="props">
                    <v-icon icon="mdi-delete" />
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    Do you want to delete this relationship? This action cannot be undone.
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn size="small" color="error" @click="$emit('delete', item.id)"
                      >Confirm Deletion</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-card-text class="pt-1">
          <div class="text-caption">DETAIL</div>
          <cc-rich-text-area :item="item" note-property="notes" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text size="small" color="accent" @click="dialog = false">Save and Close</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <cc-narrative-item-content :item="item" :origin-item="originItem" />
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-chip>
</template>

<script lang="ts">
import { CollectionItem } from '@/classes/narrative/CollectionItem';
import { NarrativeStore } from '@/stores';

export default {
  name: 'cc-relationship-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    editable: {
      type: Boolean,
      default: false,
    },
    originItem: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    allCollectionItems() {
      return NarrativeStore().CollectionItems.filter(
        (i) => i.ID !== this.item.ID && i.ID !== this.originItem.ID
      );
    },
    linkedItem(): CollectionItem | null {
      return NarrativeStore().getItemByID(this.item.id);
    },
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    setName(r: any) {
      const item = this.allCollectionItems.find((i) => i.ID === r.id);
      if (item) {
        r.name = item.Name;
      }
    },
  },
};
</script>
