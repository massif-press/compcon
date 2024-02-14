<template>
  <v-col :cols="4">
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-card
          v-bind="props"
          class="clipped-large"
          :color="isHovering ? '' : 'panel'"
          variant="outlined"
          @click="($refs.dialog as any).show()"
          @keydown.enter="($refs.dialog as any).show()">
          <component
            :is="componentLoader"
            v-if="componentLoader"
            :item="item"
            :hover="isHovering"
            :highlighted="highlighted"
            :small="small" />
        </v-card>
      </template>
    </v-hover>
    <cc-solo-dialog ref="dialog" :title="`${item.Source} ${item.Name}`" large>
      <v-card-text>
        <cc-item-card :item="item" />
      </v-card-text>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import * as content from './components';

export default {
  name: 'compendium-large-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
    },
    highlighted: {
      type: Boolean,
    },
  },
  computed: {
    componentLoader(): any {
      if (!this.item) {
        console.error('No item provided to CompendiumCard');
        return null;
      }

      if (!this.item.ItemType && !this.item.type) {
        console.error('No item type provided to CompendiumCard');
        return null;
      }

      let t = this.item.ItemType ? this.item.ItemType : `Npc${this.item.type}`;

      t += 'Content';

      if (!content[t]) {
        console.error(`No card found for item type ${t}`);
        return null;
      }

      return content[t];
    },
  },
};
</script>
