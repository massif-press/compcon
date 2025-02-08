<template>
  <v-col :cols="portrait ? 12 : landscape ? 6 : 4">
    <v-hover>
      <template #default="{ isHovering, props }">
        <cc-modal :icon="item.Icon" :title="itemDialogTitle">
          <template #activator="{ open }">
            <div :class="`pip bg-${isHovering ? 'accent' : 'panel'}`" />
            <v-card
              v-bind="props"
              :color="isHovering ? '' : 'panel'"
              flat
              tile
              style="clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)"
              variant="outlined"
              @click="open()"
              @keydown.enter="open()">
              <component
                :is="componentLoader"
                v-if="componentLoader"
                :item="item"
                :hover="isHovering"
                :highlighted="highlighted"
                :small="small || portrait || landscape" />
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
          <v-card-text style="position: relative">
            <cc-item-card :item="item" />
            <item-card-link :item="item" />
          </v-card-text>
        </cc-modal>
      </template>
    </v-hover>
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
    portrait() {
      return this.$vuetify.display.xs;
    },
    landscape() {
      return this.$vuetify.display.smAndDown;
    },
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

<style scoped>
.v-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.v-card:hover {
  filter: brightness(1.1) saturate(110%);
}

.icn {
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.pip {
  width: 17px;
  height: 17px;
  position: absolute;
  opacity: 0.5;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .pip {
  opacity: 1;
  filter: brightness(1.2) saturate(150%) hue-rotate(20deg);
}
</style>
