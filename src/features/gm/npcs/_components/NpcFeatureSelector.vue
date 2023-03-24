<template>
  <v-container>
    <v-container>
      <draggable
        class="list-group"
        :list="npc.NpcFeatureController.Items"
        @change="moveItem($event)"
      >
        <cc-npc-item-card
          v-for="item in npc.NpcFeatureController.Items"
          :key="item.ID"
          :item="item"
          class="list-group-item"
          @remove-feature="npc.RemoveFeature(item)"
        />
      </draggable>
    </v-container>
    <npc-feature-select-menu :npc="npc" />
  </v-container>
</template>

<script lang="ts">
import NpcFeatureSelectMenu from './_subcomponents/NpcFeatureSelectMenu.vue';
import draggable from 'vuedraggable';

export default {
  name: 'npc-feature-selector',
  components: { NpcFeatureSelectMenu, draggable },
  props: {
    npc: { type: Object, required: true },
  },
  methods: {
    moveItem(event) {
      console.log(event.moved.newIndex, event.moved.oldIndex);
      console.log(
        this.npc.NpcFeatureController.Items.map((x) => x.Feature.Name)
      );
      // if (event.moved) {
      //   this.npc.SaveController.save()
      // }
    },
  },
};
</script>
