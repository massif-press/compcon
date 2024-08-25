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
          <v-btn
            v-if="selectable"
            block
            color="secondary"
            size="small"
            rounded="0"
            prepend-icon="mdi-plus-box"
            @click.stop="$emit('select')">
            Select {{ item.Name }}
          </v-btn>
        </v-card>
      </template>
    </v-hover>
    <cc-solo-dialog ref="dialog" :icon="item.Icon" :title="itemDialogTitle" large no-actions>
      <v-card-text style="position: relative">
        <cc-item-card :item="item" />
        <item-card-link :item="item" />
      </v-card-text>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import * as content from './components';
import ItemCardLink from '@/ui/components/cards/items/_components/ItemCardLink.vue';

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
    selectable: {
      type: Boolean,
    },
  },
  components: {
    ItemCardLink,
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
    itemDialogTitle() {
      if (this.item.Source) return `${this.item.Source} ${this.item.Name}`;
      return this.item.Name;
    },
  },
};
</script>
