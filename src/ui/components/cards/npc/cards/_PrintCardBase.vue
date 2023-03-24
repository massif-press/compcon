<template>
  <v-card variant="outlined" class="pa-1">
    <v-btn
      fab
      absolute
      top
      right
      x-small
      color="primary"
      class="fadeSelect mr-n6 no-print"
    >
      <cc-tooltip :content="item.HideOnPrint ? 'Show' : 'Hide'">
        <v-icon small @click="item.HideOnPrint = !item.HideOnPrint">
          {{ item.HideOnPrint ? 'mdi-eye-off' : 'mdi-eye' }}
        </v-icon>
      </cc-tooltip>
    </v-btn>
    <div :style="item.HideOnPrint ? 'opacity: 0.2' : ''">
      <slot name="top" />
      <div
        v-if="item.Description"
        v-html-safe="item.Description"
        class="caption"
      />
      <div
        v-if="item.Feature.Description"
        v-html-safe="item.Feature.Description"
        class="caption"
      />
      <slot />
      <v-row no-gutters>
        <v-col v-if="item.Feature.IsRecharging">
          <v-chip
            x-small
            variant="outlined"
            v-text="`Recharges on ${item.Feature.ChargeRoll}`"
          />
        </v-col>
        <v-col v-if="item.MaxUses">
          <span class="caption">USES:</span>
          <cc-item-uses class="d-inline" :item="item" />
        </v-col>
        <v-col>
          <v-chip
            v-for="t in item.Feature.Tags"
            :key="item.Feature.ID + t.ID"
            x-small
            variant="outlined"
            label
          >
            {{ t.Name }}
          </v-chip>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'npc-item-print-card-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
@media print {
  .no-print {
    visibility: hidden;
  }
}
</style>
