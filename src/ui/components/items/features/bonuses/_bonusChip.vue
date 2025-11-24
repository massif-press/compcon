<template>
  <v-menu open-on-hover>
    <template #activator="{ props }">
      <v-avatar
        v-if="icon"
        v-bind="props"
        size="18"
        color="exotic"
        class="mx-1"
        flat
        style="corner-shape: bevel; border-radius: 0; border-bottom-right-radius: 4px">
        <v-icon size="15" :icon="bonus.Icon" />
      </v-avatar>
      <cc-chip
        v-else
        v-bind="props"
        size="small"
        color="exotic"
        class="mx-1"
        :icon="bonus.Icon"
        :label="bonus.Title" />
    </template>
    <cc-panel tile color="surface">
      <template #toolbar>
        <v-toolbar density="compact" color="exotic" height="54">
          <div class="px-3 pt-1">
            <div class="text-cc-overline text-disabled">
              bonus
              <cc-slashes />
            </div>
            <div class="heading h4 mt-n1">
              {{ bonus.Title }}
            </div>
          </div>
        </v-toolbar>
      </template>
      <bonus-base :bonus="bonus" />
    </cc-panel>
  </v-menu>
</template>

<script lang="ts">
import bonusBase from './_bonusBase.vue';

export default {
  name: 'bonus-popup',
  components: { bonusBase },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
