<template>
  <div v-if="show">
    <div v-if="action.Damage.length || action.Range.length">
      <v-row dense align="center">
        <v-col cols="auto">
          <cc-range-element :range="action.Range" />
        </v-col>
        <v-col cols="auto">
          <cc-damage-element :damage="action.Damage" />
        </v-col>
      </v-row>
      <v-divider class="my-1" />
    </div>
    <div v-if="action.Init" v-html-safe="action.Init" />
    <div v-if="!action.Frequency.Unlimited">
      <div class="text-cc-overline" style="opacity: 0.4">Frequency</div>
      <div v-html-safe="action.Frequency.ToString()" class="ml-2" />
    </div>
    <div v-if="action.Trigger">
      <div class="text-cc-overline" style="opacity: 0.4">Trigger</div>
      <div v-html-safe="action.Trigger" class="ml-2" />
    </div>
    <div v-if="action.Detail">
      <div class="text-cc-overline" style="opacity: 0.4">Effect</div>
      <div v-html-safe="action.getDetail(tier)" class="ml-2" />
    </div>
    <div v-if="action.Description">
      <div class="text-cc-overline" style="opacity: 0.4">Compendium Entry</div>
      <div v-html-safe="action.Description" class="ml-2" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'action-base',
  props: {
    action: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
  computed: {
    show() {
      return (
        this.action.Damage?.length ||
        this.action.Range?.length ||
        !this.action.Frequency.Unlimited ||
        this.action.Trigger ||
        this.action.Detail
      );
    },
  },
  emits: ['close'],
};
</script>
