<template>
  <div class="text-overline">RELATIONSHIPS</div>

  <v-card v-for="r in item.NarrativeController.Relationships" class="mb-2">
    <v-card variant="tonal">
      <v-toolbar density="compact" class="px-3">
        <v-row dense>
          <v-col>
            <v-autocomplete
              v-model="r.id"
              density="compact"
              hide-details
              variant="outlined"
              auto-select-first="exact"
              :items="allCollectionItems"
              item-title="Name"
              item-value="ID"
              @update:modelValue="setName(r)" />
          </v-col>
          <v-col>
            <v-text-field
              v-model="r.relationship"
              density="compact"
              hide-details
              variant="outlined"
              placeholder="Relationship" />
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
                  <v-btn size="small" color="error" @click="removeRelationship(r)"
                    >Confirm Deletion</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-toolbar>
      <div class="pa-2">
        <div class="text-caption">DETAIL</div>
        <cc-rich-text-area :item="r" note-property="note" />
      </div>
    </v-card>
  </v-card>

  <div class="text-right">
    <v-btn variant="tonal" size="small" color="accent" @click="addRelationship()"
      ><v-icon start icon="mdi-heart-plus-outline" />Add Relationship</v-btn
    >
  </div>

  <cc-relationship-item v-for="l in linkedRelationships" :item="l" />
</template>

<script lang="ts">
import { NarrativeStore } from '../store/narrative_store';

export default {
  name: 'relationship-editor',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    allCollectionItems() {
      return NarrativeStore().CollectionItems.filter((i) => i.ID !== this.item.ID);
    },
    linkedRelationships() {
      return NarrativeStore().getItemRelationships(this.item.ID);
    },
  },
  methods: {
    addRelationship() {
      this.item.NarrativeController.Relationships.push({
        id: '',
        name: '',
        relationship: '',
        notes: '',
      });
    },
    removeRelationship(index: number) {
      this.item.NarrativeController.Relationships.splice(index, 1);
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
