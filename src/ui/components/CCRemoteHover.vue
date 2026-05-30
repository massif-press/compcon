<template>
  <v-tooltip v-if="remoteResource"
    location="top"
    max-width="300px">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        :color="color"
        size="small">mdi-broadcast</v-icon>
    </template>
    <div class="text-center">
      <div class="font-weight-bold"
        style="letter-spacing: 3px">
        <span v-if="collectionResource">COLLECTION RESOURCE</span>
        <span v-else>REMOTE RESOURCE</span>
      </div>
      <v-divider />
      <i v-if="collectionResource"
        class="text-caption">
        This {{ itemType }} is linked to a content collection. It is read-only and will receive
        updates when a new version of the collection is published by the collection's author.
      </i>
      <i v-else
        class="text-caption">
        This {{ itemType }} is a remote resource linked to another user's account. It is read-only
        and will receive updates from the linked account.
      </i>
    </div>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  item?: object
  color?: string
}>(), {
  color: ''
})

const remoteResource = computed(() => {
      return props.item && props.item.SaveController && props.item.SaveController.IsRemote;
    })
const collectionResource = computed(() => {
      return props.item && props.item.SaveController && props.item.SaveController.IsCollectionItem;
    })
const itemType = computed(() => {
      return (props.item as any).ItemType.toLowerCase() || 'item';
    })
</script>
