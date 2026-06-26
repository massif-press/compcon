<template>
  <v-col :cols="portrait ? 12 : landscape ? 6 : 4">
    <v-hover>
      <template #default="{ isHovering, props }">
        <cc-modal :icon="item.Icon"
          :title="itemDialogTitle">
          <template #activator="{ open }">
            <div style="position: relative">
              <div :class="`pip bg-${isHovering ? 'accent' : 'panel'}`" />
              <v-card v-bind="props"
                :color="isHovering ? '' : 'panel'"
                flat
                tile
                style="clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)"
                variant="outlined"
                @click="open()"
                @keydown.enter="open()">
                <component :is="componentLoader"
                  v-if="componentLoader"
                  :item="item"
                  :hover="isHovering"
                  :highlighted="highlighted"
                  :small="small || portrait || landscape" />
                <v-btn v-if="selectable"
                  block
                  color="success"
                  size="small"
                  rounded="0"
                  prepend-icon="mdi-plus-box"
                  @click.stop="$emit('select')">
                  {{ $t('compendium.selectItem', { name: item.Name }) }}
                </v-btn>
              </v-card>
            </div>
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

<script setup lang="ts">
import type { CompendiumItem } from '@/classes/CompendiumItem'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import logger from '@/user/logger';
import * as content from './components';
import ItemCardLink from '@/ui/components/cards/items/_components/ItemCardLink.vue';

const _display = useDisplay()

defineOptions({ name: 'CompendiumLargeCard' })

const props = defineProps<{
  item: CompendiumItem
  small?: boolean
  highlighted?: boolean
  selectable?: boolean
}>()

const portrait = computed(() => {
      return _display.xs.value;
    })
const landscape = computed(() => {
      return _display.smAndDown.value;
    })
const componentLoader = computed(() => {
      if (!props.item) {
        logger.error('No item provided to CompendiumCard', this);
        return null;
      }

      if (!props.item.ItemType && !props.item.type) {
        logger.error('No item type provided to CompendiumCard', this);
        return null;
      }

      let t = props.item.ItemType ? props.item.ItemType : `Npc${props.item.type}`;

      t += 'Content';

      if (!content[t]) {
        logger.error(`No card found for item type ${t}`, this);
        return null;
      }

      return content[t];
    })
const itemDialogTitle = computed(() => {
      if (props.item.Source) return `${props.item.Source} ${props.item.Name}`;
      return props.item.Name;
    })
</script>

<style scoped>
@import '../compendium-card-base.css';

.v-card:hover {
  filter: brightness(1.1) saturate(110%);
}

.top-element:hover .pip {
  opacity: 1;
  filter: brightness(1.2) saturate(150%) hue-rotate(20deg);
}
</style>
