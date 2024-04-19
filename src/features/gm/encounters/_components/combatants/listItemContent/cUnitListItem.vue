<template>
  <c-list-item-base :item="item" :readonly="readonly">
    <template #title>
      <v-icon :icon="item.npc.NpcClassController.Class.Icon" class="mt-n1 ml-1" />
      {{ item.npc.Name }}

      <span v-if="item.npc.NpcClassController.HasClass">
        &mdash; T{{ item.npc.NpcClassController.Tier }} {{ item.npc.NpcClassController.Class.Name }}
      </span>
      <span class="px-4">
        <v-chip
          v-for="t in item.npc.NpcTemplateController.Templates"
          size="x-small"
          variant="flat"
          label
          color="primary"
          class="mr-3 mt-n1">
          <v-icon icon="cc:npc_template" start />
          {{ t.Name }}
        </v-chip>
      </span>
    </template>

    <div class="text-caption mt-1">
      <stat-chips :stat-controller="item.npc.StatController" />
    </div>
    <div class="text-caption">
      <cc-item-chip
        v-for="f in item.npc.NpcFeatureController.Features"
        :item="f"
        :tier="item.npc.NpcClassController.Tier"
        size="x-small"
        variant="elevated"
        class="ma-1" />
    </div>
  </c-list-item-base>
</template>

<script lang="ts">
import cListItemBase from './cListItemBase.vue';
import StatChips from '../../../../_views/_components/gmItemCards/_subcomponents/statChips.vue';

export default {
  name: 'gm-combatant-unit-list-item',
  components: { StatChips, cListItemBase },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
};
</script>
