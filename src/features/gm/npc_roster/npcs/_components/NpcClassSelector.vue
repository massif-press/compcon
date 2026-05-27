<template>
  <v-card-text v-if="!classes.length"
    class="mt-n4">
    <v-container>
      <cc-missing-gm-lcp-text />
    </v-container>
  </v-card-text>
  <div v-else
    style="overflow-y: hidden">
    <cc-compendium-browser ref="browser"
      :items="classes"
      item-type="NpcClass"
      :table-headers="headers"
      :tier="selectedTier"
      :options="options"
      view-key="sel-npc-class"
      equippable
      @equip="SetClass($event)"
      @view-change="toggleTieredView">
      <template #header>
        <div class="heading h3 text-center text-accent">NPC Classes</div>
        <v-slide-y-transition>
          <div v-if="tieredView"
            class="text-center my-n1">
            <v-btn-toggle v-model="selectedTier"
              density="compact"
              color="secondary-darken-3"
              mandatory
              style="height: 15px">
              <v-btn size="x-small"
                :value="1">Tier 1</v-btn>
              <v-btn size="x-small"
                :value="2">Tier 2</v-btn>
              <v-btn size="x-small"
                :value="3">Tier 3</v-btn>
            </v-btn-toggle>
          </div>
        </v-slide-y-transition>
      </template>
    </cc-compendium-browser>
  </div>
</template>

<script lang="ts">
import { npcClassSelectorMixin } from './_npcClassSelectorMixin';

export default {
  name: 'NpcClassSelector',
  mixins: [npcClassSelectorMixin],
  props: {
    item: { type: Object, required: true },
  },
  emits: ['close'],
  created() {
    this.selectedTier = this.item.NpcClassController?.Tier || 1;
  },
  methods: {
    getRoleIcon(role: string) {
      if (role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
      return `cc:role_${role.toLowerCase()}`;
    },
    SetClass(c) {
      this.item.NpcClassController.SetClass(c, this.item.NpcClassController.Tier);
      this.$emit('close');
    },
  },
};
</script>
