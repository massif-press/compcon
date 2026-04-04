<template>
  <v-menu open-on-hover open-delay="400" max-width="500px">
    <template #activator="{ props }">
      <v-chip v-bind="props" size="small" class="rounded-0" label style="margin: 2px">
        <v-icon
          :icon="item.actor.Icon"
          start
          size="x-large"
          :color="item.side === 'enemy' ? 'error' : item.side === 'ally' ? 'success' : ''" />
        <span v-if="!item.actor.IsNameless">
          {{ item.actor.IsNameless ? '' : item.actor.Name }}
          <v-icon v-if="item.actor.ItemType === 'Unit'" icon="mdi-vector-point" />
        </span>
        {{ item.actor.DefaultName }}
      </v-chip>
    </template>
    <v-card class="text-center" tile border>
      <v-toolbar
        height="26"
        dense
        :color="item.side === 'enemy' ? 'error' : item.side === 'ally' ? 'success' : ''">
        <div class="heading h3 px-2">
          {{ item.actor.Name }}
          <cc-slashes />
          {{ item.side }}
        </div>
      </v-toolbar>
      <v-card-text v-if="item.actor.NpcFeatureController" class="px-2 py-1">
        <div class="pa-1">
          <v-icon icon="itemc:structure" />
          {{ item.actor.StatController.getMax('structure') }}
          <v-icon icon="mdi-heart" class="ml-3" />
          {{ item.actor.StatController.getMax('hp') }}
          <v-icon icon="mdi-shield" class="ml-3" />
          {{ item.actor.StatController.getMax('armor') }}
          <v-icon icon="itemc:reactor" class="ml-3" />
          {{ item.actor.StatController.getMax('stress') }}
          <v-icon icon="itemc:heat" class="ml-3" />
          {{ item.actor.StatController.getMax('heat') }}
        </div>
        <cc-item-chip v-for="f in item.actor.NpcFeatureController.Features" :key="f.ID" :item="f" />
      </v-card-text>
      <v-card-text v-if="item.actor.Layers">
        <cc-item-chip v-for="l in item.actor.Layers" :key="l.ID" :item="l" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'combatant-chip',
  props: {
    item: { type: Object, required: true },
  },
};
</script>
