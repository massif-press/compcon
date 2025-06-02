<template>
  <cc-panel
    :title="bonus.Name"
    :icon="bonus.Icon"
    :title-color="bonus.Color"
    style="position: relative">
    <template #toolbar-items>
      <span v-if="!readonly" class="pr-1">
        <cc-broken-reference :item="bonus" end />
        <v-tooltip v-if="bonus.FromInstance" location="top" max-width="300">
          <template #activator="{ props }">
            <v-btn
              icon
              size="x-small"
              class="fade-select"
              v-bind="props"
              @click="$emit('remove', bonus)">
              <v-icon icon="mdi-delete" size="20" style="margin-top: -2px; margin-right: -4px" />
            </v-btn>
          </template>
          <div class="text-center">
            <div>Remove this CORE Bonus</div>
            <v-divider class="my-1" />
            <div class="text-caption">
              <b class="text-error">WARNING</b>
              This is an instanced item. If removed, this Core bonus will not be available until the
              associated LCP is installed.
            </div>
          </div>
        </v-tooltip>
      </span>
    </template>
    <div v-if="bonus.InLcp" style="position: absolute; top: 27px; right: 4px; z-index: 1">
      <cc-lcp-info v-if="bonus.InLcp" :item="bonus" />
    </div>
    <p v-html-safe="bonus.Effect" class="pb-1" />

    <div v-if="bonus.Actions.length">
      <div class="text-cc-overline text-disabled">CORE BONUS ACTIONS</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(a, i) in bonus.Actions" cols="auto">
          <cc-action :action="a" :panel="!terse" class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.Deployables.length">
      <div class="text-cc-overline text-disabled">CORE BONUS DEPLOYABLES</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(d, i) in bonus.Deployables" cols="auto">
          <cc-deployable-info
            :deployable="d"
            :panel="!terse"
            :name-override="bonus.Name"
            class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.IntegratedEquipment.length">
      <div class="text-cc-overline text-disabled">CORE BONUS INTEGRATED EQUIPMENT</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(x, i) in bonus.IntegratedEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="!terse" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.SpecialEquipment.length">
      <div class="text-cc-overline text-disabled">CORE BONUS ADDITIONAL EQUIPMENT</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(x, i) in bonus.SpecialEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="!terse" />
        </v-col>
      </v-row>
    </div>
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-core-bonus-item',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    terse: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
