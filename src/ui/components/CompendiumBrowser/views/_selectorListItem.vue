<template>
  <div v-if="item"
    class="pa-1"
    style="position: relative; border: 1px solid rgba(155, 155, 155, 0.1)">
    <v-row v-if="!hideTitle"
      no-gutters
      class="heading h2 bg-surface"
      align="start"
      style="font-size: calc(14px + 1vw)"
      :class="highlighted ? 'text-secondary' : 'text-accent'">
      <v-col v-if="item.Manufacturer"
        cols="auto"
        class="px-2">
        <cc-logo v-if="item.Manufacturer.LogoIsExternal"
          :source="item.Manufacturer"
          size="large" />
        <v-icon v-else-if="item.Manufacturer.Icon"
          :icon="item.Manufacturer.Icon"
          :color="item.Manufacturer.Color" />
      </v-col>
      <v-col>
        <v-icon v-if="item.Icon && !item.Manufacturer"
          :icon="item.Icon" />
        {{ item.Name }}
      </v-col>
      <v-col cols="auto"
        class="ml-auto text-caption px-2">
        <cc-lcp-info :item="item" />
      </v-col>
    </v-row>

    <CCBondInfo v-if="item.ItemType === 'Bond'"
      :bond="(item as any)" />

    <cc-talent v-else-if="item.ItemType === 'Talent'"
      :talent="item"
      hide-change />

    <cc-panel v-else
      color="surface">
      <div v-if="useCard">
        <div v-if="item.Detail"
          v-html-safe="item.Detail"
          class="body-text" />
        <div v-else
          v-html-safe="item.Description"
          class="body-text" />
      </div>

      <div v-else-if="item.ItemType === 'Status'"
        class="pb-2">
        <v-row align="center">
          <v-col v-if="!mobile"
            cols="auto">
            <v-icon v-if="item.Icon"
              size="80"
              color="accent"
              :icon="item.Icon" />
          </v-col>
          <v-col>
            <div class="flavor-text"
              v-text="item.StatusType" />
            <v-divider class="my-1" />
            <p v-html-safe="item.Effects" />
          </v-col>
        </v-row>
      </div>

      <cc-item-card v-else
        :item="item"
        charts />
    </cc-panel>

    <item-card-link :item="item" />

    <div v-if="selectable">
      <cc-button block
        size="small"
        color="success"
        :prepend-icon="item.Icon || undefined"
        style="max-width: calc(100% - 55px);"
        class="mx-4 mt-n1"
        @click="$emit('select', item)">
        {{ $t('ui.selector.select', { name: item.Name }) }}
        <template #info>
          <v-icon icon="mdi-plus" />
        </template>
      </cc-button>
    </div>
  </div>
  <div v-else
    style="height: 100px">
    <div class="heading h2 light-text-panel text-center"
      style="margin-top: calc(50vh - 150px)">
      {{ $t('ui.widget.noSelection') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import CCBondInfo from '../../CCBondInfo.vue'
import ItemCardLink from '../../cards/items/_components/ItemCardLink.vue';

const props = defineProps({
    item: {
      type: Object,
      required: false,
    },
    highlighted: {
      type: Boolean,
    },
    hideTitle: {
      type: Boolean,
    },
    selectable: {
      type: Boolean,
    },
  })

const emit = defineEmits(['select'])

const { smAndDown: mobile, xs: portrait } = useDisplay()

const useCard = computed(() => {
  switch (props.item && (props.item as any).ItemType) {
    case 'Skill':
    case 'Tag':
      return true
    default:
      return false
  }
})
</script>
