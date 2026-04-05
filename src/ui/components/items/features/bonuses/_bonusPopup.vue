<template>
  <v-menu location="top"
    open-on-hover
    max-width="500">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        color="exotic"
        :icon="bonus.Icon" />
    </template>
    <cc-panel tile
      color="surface">
      <template #toolbar>
        <v-toolbar density="compact"
          color="exotic"
          height="54">
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
  name: 'BonusPopup',
  components: { bonusBase },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
