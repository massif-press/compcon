<template>
  <v-row dense align="center" style="height: 100%">
    <v-col cols="auto" style="height: 100%">
      <v-btn
        color="primary"
        variant="tonal"
        class="px-0 elevation-0"
        style="height: 100%"
        :disabled="isEquippedItem"
        @click="$emit('equip', item)"
      >
        <cc-tooltip simple :content="equipped ? 'Item Equipped' : `Equip ${item.Name}`">
          <v-icon size="70" icon="mdi-plus" />
        </cc-tooltip>
      </v-btn>
    </v-col>
    <v-col :style="isEquippedItem ? 'opacity: 0.3' : ''">
      <cc-dense-card :item="item" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'selector-list-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
    equipped: {
      type: Object,
      required: false,
    },
  },
  emits: ['equip'],
  computed: {
    isEquippedItem() {
      return this.equipped && this.equipped.ID === this.item.ID;
    },
  },
};
</script>
