<template>
  <c-list-item-base :item="item" :readonly="readonly">
    <template #title>
      <v-icon :icon="item.actor.NpcClassController.Class.Icon" class="mt-n1 ml-1" />
      {{ item.actor.Name }}

      <span v-if="item.actor.NpcClassController.HasClass && !item.actor.IsNameless">
        &mdash; T{{ item.actor.NpcClassController.Tier }}
        {{ item.actor.NpcClassController.Class.Name }}
      </span>
      <span class="px-4">
        <cc-chip
          v-for="t in item.actor.NpcTemplateController.Templates"
          size="small"
          variant="flat"
          label
          color="primary"
          class="mr-3 mt-n1">
          <v-icon icon="cc:npc_template" start />
          {{ t.Name }}&emsp;
        </cc-chip>
      </span>
    </template>

    <div class="py-1">
      <cc-item-chip
        v-for="f in item.actor.NpcFeatureController.Features"
        :item="f"
        :tier="item.actor.NpcClassController.Tier"
        style="margin: 2px" />
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
