<template>
  <v-container>
    <v-container>
      <cc-npc-item-card
        v-for="item in npc.NpcFeatureController.Items"
        :item="item"
        class="list-group-item"
        @remove-feature="npc.RemoveFeature(item)"
      />
    </v-container>
    <npc-feature-select-menu :npc="npc" />
  </v-container>
</template>

<script lang="ts">
import NpcFeatureSelectMenu from './_subcomponents/NpcFeatureSelectMenu.vue';

export default {
  name: 'npc-feature-selector',
  components: { NpcFeatureSelectMenu },
  props: {
    npc: { type: Object, required: true },
  },
};
</script>
