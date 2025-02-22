<template>
  <div v-if="show">
    <v-card-text class="py-2">
      <div v-if="action.Damage.length || action.Range.length" class="my-2">
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
      <div v-if="action.Init" v-html-safe="action.Init" class="mb-3" />
      <div v-if="!action.Frequency.Unlimited" class="mb-3">
        <div class="text-disabled text-cc-overline">Frequency</div>
        <div v-html-safe="action.Frequency.ToString()" class="ml-2" />
      </div>
      <div v-if="action.Trigger" class="mb-3">
        <div class="text-disabled text-cc-overline">Trigger</div>
        <div v-html-safe="action.Trigger" class="ml-2" />
      </div>
      <div v-if="action.Detail">
        <div class="text-disabled text-cc-overline">Effect</div>
        <div v-html-safe="action.getDetail(tier)" class="ml-2" />
      </div>
    </v-card-text>
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
        this.action.Damage.length ||
        this.action.Range.length ||
        this.action.Init ||
        !this.action.Frequency.Unlimited ||
        this.action.Trigger ||
        this.action.Detail
      );
    },
  },
};
</script>
