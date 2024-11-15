<template>
  <div class="text-overline">RELATIONSHIPS</div>
  <cc-relationship-item
    v-for="(r, idx) in item.NarrativeController.Relationships"
    :item="r"
    :ref="'relationship' + idx"
    :origin-item="item"
    editable
    @delete="removeRelationship(idx)" />

  <div class="text-right">
    <v-btn v-if="!readonly" variant="tonal" size="small" color="accent" @click="addRelationship()">
      <v-icon start icon="mdi-heart-plus-outline" />
      Add Relationship
    </v-btn>
  </div>

  <div class="text-overline">LINKED ENTITIES</div>
  <cc-relationship-item v-for="l in linkedRelationships" :item="l.item" :origin-item="l.origin" />
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
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    allCollectionItems() {
      return NarrativeStore().CollectionItems.filter((i) => i.ID !== this.item.ID);
    },
    linkedRelationships() {
      const linkedItems = NarrativeStore().getItemRelationships(this.item.ID);
      let relationships: any[] = [];
      linkedItems.forEach((l) => {
        const links = l.NarrativeController.Relationships.filter(
          (r: any) => r.id === this.item.ID
        ).map((r: any) => ({
          item: r,
          origin: l,
        }));
        relationships = relationships.concat(links);
      });

      return relationships;
    },
  },
  methods: {
    addRelationship() {
      this.item.NarrativeController.Relationships.push({
        id: '',
        name: 'New Relationship',
        relationship: '',
        notes: '',
      });
      this.$nextTick(() => {
        const idx = this.item.NarrativeController.Relationships.length - 1;
        (this.$refs['relationship' + idx] as any)[0].openDialog();
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
