<template>
  <div v-if="show">
    <v-card-text class="pt-0">
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
      <div v-if="action.Init" v-html-safe="action.Init" class="body-text text-stark mt-2" />
      <div v-if="!action.Frequency.Unlimited">
        <div class="text-disabled text-overline mb-n2">Frequency</div>
        <div v-html-safe="action.Frequency.ToString()" class="body-text text-stark" />
      </div>
      <div v-if="action.Trigger">
        <div class="text-disabled text-overline mb-n2">Trigger</div>
        <div v-html-safe="action.Trigger" class="body-text text-stark" />
      </div>
      <div v-if="action.Detail">
        <div class="text-disabled text-overline mb-n2">Effect</div>
        <div v-html-safe="action.getDetail(tier)" class="body-text text-stark" />
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
