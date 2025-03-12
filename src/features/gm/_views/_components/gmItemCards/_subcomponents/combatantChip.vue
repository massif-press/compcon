<template>
  <v-menu open-on-hover open-delay="400" max-width="500px">
    <template #activator="{ props }">
      <v-chip v-bind="props" size="small" class="rounded-0" label style="margin: 2px">
        <v-icon
          :icon="item.npc.Icon"
          start
          size="x-large"
          :color="item.side === 'enemy' ? 'error' : item.side === 'ally' ? 'success' : ''" />
        <span v-if="!item.npc.IsNameless">
          {{ item.npc.IsNameless ? '' : item.npc.Name }}
          <v-icon v-if="item.npc.ItemType === 'Unit'" icon="mdi-vector-point" />
        </span>
        {{ item.npc.DefaultName }}
      </v-chip>
    </template>
    <v-card class="text-center" tile border>
      <v-toolbar
        height="26"
        dense
        :color="item.side === 'enemy' ? 'error' : item.side === 'ally' ? 'success' : ''">
        <div class="heading h3 px-2">
          {{ item.npc.Name }}
          <cc-slashes />
          {{ item.side }}
        </div>
      </v-toolbar>
      <v-card-text v-if="item.npc.NpcFeatureController" class="px-2 py-1">
        <div class="pa-1">
          <v-icon icon="itemc:structure" />
          {{ item.npc.StatController.getStat('structure') }}
          <v-icon icon="mdi-heart" class="ml-3" />
          {{ item.npc.StatController.getStat('hp') }}
          <v-icon icon="mdi-shield" class="ml-3" />
          {{ item.npc.StatController.getStat('armor') }}
          <v-icon icon="itemc:reactor" class="ml-3" />
          {{ item.npc.StatController.getStat('stress') }}
          <v-icon icon="itemc:heat" class="ml-3" />
          {{ item.npc.StatController.getStat('heat') }}
        </div>
        <cc-item-chip v-for="f in item.npc.NpcFeatureController.Features" :item="f" />
      </v-card-text>
      <v-card-text v-if="item.npc.Layers">
        <cc-item-chip v-for="l in item.npc.Layers" :item="l" />
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
