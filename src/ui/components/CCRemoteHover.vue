<template>
  <v-tooltip v-if="remoteResource" location="top" max-width="300px">
    <template #activator="{ props }">
      <v-icon v-bind="props" :color="color" size="small">mdi-broadcast</v-icon>
    </template>
    <div class="text-center">
      <div class="font-weight-bold" style="letter-spacing: 3px">
        <span v-if="collectionResource">COLLECTION RESOURCE</span>
        <span v-else>REMOTE RESOURCE</span>
      </div>
      <v-divider />
      <i v-if="collectionResource" class="text-caption">
        This {{ itemType }} is linked to a content collection. It is read-only and will receive
        updates when a new version of the collection is published by the collection's author.
      </i>
      <i v-else class="text-caption">
        This {{ itemType }} is a remote resource linked to another user's account. It is read-only
        and will receive updates from the linked account.
      </i>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'cc-remote-hover',
  props: {
    item: {
      type: Object,
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    remoteResource() {
      return this.item && this.item.SaveController && this.item.SaveController.IsRemote;
    },
    collectionResource() {
      return this.item && this.item.SaveController && this.item.SaveController.IsCollectionItem;
    },
    itemType() {
      return (this.item as any).ItemType.toLowerCase() || 'item';
    },
  },
};
</script>
