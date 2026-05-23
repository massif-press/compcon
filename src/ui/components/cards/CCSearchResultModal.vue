<template>
  <cc-modal :title="item.Name"
    :icon="item.Icon"
    :color="item.Color"
    shrink>
    <template #activator="{ open }">
      <div class="clickable"
        @click="open">
        <v-hover>
          <template #default="{ props, isHovering }">
            <cc-panel v-bind="props"
              :title="(item.ItemType === 'Frame' ? `${item.Source} ` : '') + item.Name + ` (${sanitize(item.ItemType)})`"
              :icon="item.Icon"
              :title-color="item.Color"
              :color="isHovering ? 'panel' : 'surface'"
              class="item-description">
              <div style="
                max-height:
                40vh;
                overflow:
                hidden;
                text-overflow:
                ellipsis">
                <p v-html-safe="item.Terse ||
                  item.Effect ||
                  item.Description ||
                  item.Activation || ''"
                  class="mb-0" />
                <div class="text-caption text-disabled text-right"><i>{{ item.Brew?.LcpName ||
                  'Lancer Core Book' }}</i></div>
              </div>
            </cc-panel>
          </template>
        </v-hover>
      </div>
    </template>
    <v-card-text>
      <cc-lcp-info :item="item"
        style="position: absolute; right: 8px; top: 44px;" />
      <cc-item-card :item="item"
        hide-title />
    </v-card-text>
  </cc-modal>
</template>

<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

function sanitize(type: string) {
  if (!type) return ''
  return type.replace('Npc', 'NPC ')
}
</script>
