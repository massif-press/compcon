<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-row
        v-bind="props"
        dense
        :style="`position: relative; cursor: pointer; border-radius: 2px; background-color: ${
          isHovering
            ? odd
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.1)'
            : odd
              ? 'rgba(0,0,0,0.05)'
              : 'rgba(255,255,255,0.05'
        };`"
        @click="$emit('open', item)">
        <v-col cols="auto">
          <v-badge :content="item.index + 1" bordered color="panel">
            <v-card variant="tonal" class="rounded-0">
              <cc-img :aspect-ratio="1" :src="item.npc.PortraitController.Image" width="95" />
            </v-card>
          </v-badge>
        </v-col>

        <v-col>
          <v-toolbar density="compact" color="panel" class="pr-1" style="height: 40px">
            <div class="mt-n1" style="width: 100%">
              <v-row dense>
                <v-col cols="auto">
                  <div :class="`heading h3 ${isHovering ? 'text-accent' : ''}`">
                    <slot name="title" />
                  </div>
                </v-col>

                <v-col cols="auto" class="ml-auto pt-0">
                  <combatant-settings-menu :readonly="readonly" :item="item" />
                </v-col>

                <v-divider vertical />

                <v-col v-if="!readonly" cols="auto">
                  <v-menu v-model="deleteMenu">
                    <template #activator="{ props }">
                      <v-icon
                        v-bind.stop="props"
                        color="error"
                        icon="mdi-delete"
                        class="fade-select mx-2 mt-n1" />
                    </template>
                    <cc-confirmation
                      cancellable
                      :content="`Confirm deletion of ${item.npc.Name} from the encounter`"
                      @confirm="removeItem"
                      @cancel="deleteMenu = false" />
                  </v-menu>
                </v-col>
              </v-row>
            </div>
          </v-toolbar>
          <slot />
        </v-col>
        <v-tooltip v-if="!readonly" :open-delay="500" max-width="300px">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              size="small"
              :color="item.npc.IsLinked ? 'success' : 'rgba(150, 150, 150, 0.5)'"
              :icon="item.npc.IsLinked ? 'mdi-link-variant' : 'mdi-link-variant-off'"
              style="position: absolute; bottom: 2px; right: 2px" />
          </template>
          <span v-if="item.npc.IsLinked">
            The source of this NPC instance is present in your NPC roster (
            <b class="text-primary">{{ item.npc.GetLinkedItem().Name }}</b>
            ) and can receive updates from the original
          </span>
          <span v-else>This NPC instance is not linked to a valid source in your NPC roster</span>
        </v-tooltip>
      </v-row>
    </template>
  </v-hover>
</template>

<script lang="ts">
import CombatantSettingsMenu from '../_components/combatantSettingsMenu.vue';
import StatChips from '../../../../_views/_components/gmItemCards/_subcomponents/statChips.vue';

export default {
  name: 'gm-unit-list-item',
  components: { StatChips, CombatantSettingsMenu },
  props: {
    item: { type: Object, required: true },
    odd: { type: Boolean },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    deleteMenu: false,
  }),

  methods: {
    editUnit() {
      this.$emit('open', this.item);
    },
    removeItem() {
      this.deleteMenu = false;
      this.$emit('remove', this.item);
    },
  },
  emits: ['remove', 'open'],
};
</script>
