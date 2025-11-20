<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-row
        v-bind="props"
        dense
        :class="`${isHovering && !missingContent ? 'cOutline' : ''} ${
          missingContent ? 'cToolbar-missing bg-missing' : ''
        }`"
        style="position: relative; cursor: pointer; border-radius: 2px"
        :style="`background-color: ${odd ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05'}; ${
          missingContent ? 'cursor: not-allowed' : ''
        }`"
        @click="$emit('open', item)">
        <v-col cols="auto">
          <v-card variant="tonal" class="rounded-0">
            <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" width="75" />
          </v-card>
        </v-col>

        <v-col>
          <div
            :class="`heading h3 ${
              missingContent ? 'text-disabled' : isHovering ? 'text-accent' : ''
            }`">
            <slot name="title">
              {{ item.Name }}
              <span v-if="item.NpcClassController.Class">
                &mdash; T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
              </span>
              <span class="px-4">
                <v-chip
                  v-for="t in item.NpcTemplateController.Templates"
                  size="x-small"
                  variant="plain"
                  label
                  color="primary"
                  class="mr-3 mt-n1">
                  <v-icon icon="cc:npc_template" start />
                  {{ t.Name }}
                </v-chip>
              </span>
            </slot>
          </div>
          <slot />
          <cc-missing-content-list v-if="missingContent" :controller="item.BrewController" />
        </v-col>
        <v-col v-if="item.NpcClassController?.Class" cols="auto">
          <v-icon size="40" :icon="item.NpcClassController?.Class.Icon" />
        </v-col>
        <sort-chips :grouping="grouping" :sorting="sorting" :controller="item.BrewController" />
      </v-row>
    </template>
  </v-hover>
</template>

<script lang="ts">
import SortChips from './_subcomponents/sortChips.vue';

export default {
  name: 'gm-list-item-base',
  components: { SortChips },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: [Object, String], required: false, default: '' },
  },
  emits: ['open'],
  computed: {
    missingContent() {
      return this.item.BrewController?.IsUnableToLoad;
    },
  },
};
</script>

<style scoped>
.cOutline {
  outline: 2px solid rgb(var(--v-theme-primary));
}

.cToolbar {
  background-color: rgb(var(--v-theme-primary));
}

.cToolbar-missing {
  border: 3px double rgb(var(--v-theme-error));
}

.bg-missing {
  background: repeating-linear-gradient(
    45deg,
    rgba(182, 184, 191, 0.3),
    rgba(182, 184, 191, 0.3) 10px,
    rgba(142, 147, 165, 0.3) 10px,
    rgba(142, 147, 165, 0.3) 20px
  );
}
</style>
