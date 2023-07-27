<template>
  <v-col :cols="4">
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-card
          v-bind="props"
          class="clipped-large"
          :color="isHovering ? '' : 'panel'"
          variant="outlined"
          @click="($refs.dialog as any).show()"
          @keydown.enter="($refs.dialog as any).show()"
        >
          <frame-card-content
            v-if="item.ItemType === 'Frame'"
            :item="item"
            :hover="isHovering"
            :highlighted="highlighted"
            :small="small"
          />
          <weapon-card-content
            v-else-if="item.ItemType === 'MechWeapon'"
            :item="item"
            :hover="isHovering"
            :highlighted="highlighted"
            :small="small"
          />
          <system-card-content
            v-else-if="item.ItemType === 'MechSystem'"
            :item="item"
            :hover="isHovering"
            :highlighted="highlighted"
            :small="small"
          />
          <gear-card-content
            v-else
            :item="item"
            :hover="isHovering"
            :highlighted="highlighted"
            :small="small"
          />
        </v-card>
      </template>
    </v-hover>
    <cc-solo-dialog ref="dialog" :title="`${item.Source} ${item.Name}`" large>
      <v-card-text>
        <cc-item-card :item="item" />
      </v-card-text>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import FrameCardContent from './_FrameCardContent.vue';
import WeaponCardContent from './_WeaponCardContent.vue';
import GearCardContent from './_GearCardContent.vue';
import SystemCardContent from './_SystemCardContent.vue';

export default {
  name: 'compendium-large-card',
  components: {
    FrameCardContent,
    WeaponCardContent,
    GearCardContent,
    SystemCardContent,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
    },
    highlighted: {
      type: Boolean,
    },
  },
};
</script>
