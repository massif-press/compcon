<template>
  <panel-base :item="item">
    <template #name-block>
      <div class="heading h2">{{ item.Name }}</div>
      <div class="heading h4">
        T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
        <span v-if="item.NpcTemplateController.Templates.length">
          {{ item.NpcTemplateController.Templates.map((x) => x.Name).join(' / ') }}
        </span>
      </div>
    </template>
  </panel-base>
</template>

<script>
import PanelBase from './_PanelBase.vue';

export default {
  name: 'NpcPanel',
  components: {
    PanelBase,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
