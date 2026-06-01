<template>
  <div class="text-overline">RELATIONSHIPS</div>
  <CCRelationshipItem
    v-for="(r, idx) in item.NarrativeController.Relationships"
    :key="`relationship-${idx}`"
    :item="r"
    :ref="(el) => { if (el) relationshipRefs[idx] = el }"
    :origin-item="item"
    :collection-items="allCollectionItems"
    editable
    @delete="removeRelationship(idx)" />

  <div class="d-flex justify-end">
    <cc-button
      v-if="!readonly"
      prepend-icon="mdi-heart-plus-outline"
      size="small"
      color="accent"
      @click="addRelationship()">
      Add Relationship
    </cc-button>
  </div>

  <div class="text-overline">LINKED ENTITIES</div>
  <CCRelationshipItem v-for="(l, index) in linkedRelationships"
    :key="`linked-${index}`"
    :item="l.item"
    :origin-item="l.origin"
    :collection-items="allCollectionItems" />
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import CCRelationshipItem from '@/ui/components/CCRelationshipItem.vue'
import { NarrativeStore } from '../store/narrative_store'

const props = withDefaults(defineProps<{
  item: Record<string, any>
  readonly?: boolean
}>(), { readonly: false })

const relationshipRefs = ref<any[]>([])

const allCollectionItems = computed(() =>
  NarrativeStore().CollectionItems.filter((i: any) => i.ID !== props.item.ID)
)

const linkedRelationships = computed(() => {
  const linkedItems = NarrativeStore().getItemRelationships(props.item.ID)
  let relationships: any[] = []
  linkedItems.forEach((l: any) => {
    const links = l.NarrativeController.Relationships.filter(
      (r: any) => r.id === props.item.ID
    ).map((r: any) => ({ item: r, origin: l }))
    relationships = relationships.concat(links)
  })
  return relationships
})

async function addRelationship() {
  props.item.NarrativeController.Relationships.push({
    id: '',
    name: 'New Relationship',
    relationship: '',
    notes: '',
  })
  await nextTick()
  const idx = props.item.NarrativeController.Relationships.length - 1
  relationshipRefs.value[idx]?.openDialog()
}

function removeRelationship(index: number) {
  props.item.NarrativeController.Relationships.splice(index, 1)
}
</script>
