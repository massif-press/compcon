<template>
  <cc-modal :title="item.Name" :icon="item.Icon" :color="item.Color" shrink>
    <template #activator="{ open }">
      <div @click="open" class="clickable">
        <v-hover>
          <template #default="{ props, isHovering }">
            <cc-panel
              v-bind="props"
              :title="(item.ItemType === 'Frame' ? `${item.Source} ` : '') + item.Name"
              :icon="item.Icon"
              :title-color="item.Color"
              :color="isHovering ? 'panel' : 'surface'"
              class="item-description">
              <div
                style="max-height: 40vh; overflow: hidden; text-overflow: ellipsis"
                v-html-safe="
                  item.Terse ||
                  item.Effect ||
                  item.Description ||
                  item.Activation ||
                  `${item.Source || ''} ${item.ItemType}`
                " />
            </cc-panel>
          </template>
        </v-hover>
      </div>
    </template>
    <v-card-text>
      <cc-item-card :item="item" />
    </v-card-text>
  </cc-modal>
</template>

<script lang="ts">
export default {
  name: 'CCSearchResultModal',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
