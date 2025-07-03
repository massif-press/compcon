<template>
  <scan-menu :item="combatant.actor" />

  <panel-base :item="combatant.actor">
    <template #name-block>
      <div class="heading h2">
        {{ combatant.actor.Name }}
        <span class="text-accent" v-text="`#${combatant.number}`" />
      </div>
      <div class="heading h4">
        T{{ combatant.actor.NpcClassController.Tier }}
        {{ combatant.actor.NpcClassController.Class.Name }}
        <span v-if="combatant.actor.NpcTemplateController.Templates.length">
          {{ combatant.actor.NpcTemplateController.Templates.map((x) => x.Name).join(' / ') }}
        </span>
      </div>
    </template>
  </panel-base>
</template>

<script>
import ScanMenu from './_components/ScanMenu.vue';
import PanelBase from './_PanelBase.vue';

export default {
  name: 'NpcPanel',
  components: {
    PanelBase,
    ScanMenu,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
  },
};
</script>
