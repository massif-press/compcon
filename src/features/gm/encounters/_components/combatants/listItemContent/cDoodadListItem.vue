<template>
  <c-list-item-base :item="item" :readonly="readonly">
    <template #title>
      <v-icon size="30" icon="mdi-cube-outline" class="mt-n1" />
      {{ item.actor.Name }}
    </template>

    <div class="text-caption">
      <stat-chips :stat-controller="item.actor.StatController" />
    </div>
  </c-list-item-base>
</template>

<script lang="ts">
import StatChips from '../../../../_views/_components/gmItemCards/_subcomponents/statChips.vue';
import cListItemBase from './cListItemBase.vue';

export default {
  name: 'gm-combatant-doodad-list-item',
  components: { StatChips, cListItemBase },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
};
</script>
