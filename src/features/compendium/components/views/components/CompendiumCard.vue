<template>
  <v-col cols="12" md="4">
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-card
          class="clipped-large"
          :color="isHovering ? '' : 'panel'"
          tile
          @click="($refs.dialog as any).show()"
          @keydown.enter="($refs.dialog as any).show()"
        >
          <frame-card-content
            v-if="item.ItemType === 'Frame'"
            :item="item"
            :hover="isHovering"
            :small="small"
          />
          <weapon-card-content
            v-else-if="item.ItemType === 'MechWeapon'"
            :item="item"
            :hover="isHovering"
            :small="small"
          />
          <system-card-content
            v-else-if="item.ItemType === 'MechSystem'"
            :item="item"
            :hover="isHovering"
            :small="small"
          />
          <gear-card-content v-else :item="item" :hover="isHovering" :small="small" />
        </v-card>
      </template>
    </v-hover>
    <cc-solo-dialog ref="dialog" :title="`${item.Source} ${item.Name}`" large>
      <cc-item-card :item="item" />
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
  },
};
</script>
