<template>
  <v-col cols="12" md="4">
    <v-lazy>
      <v-hover v-slot="{ isHovering }">
        <v-card
          class="clipped-large"
          :color="isHovering ? 'panel lighten-1' : 'panel'"
          tile
          @click="($refs.dialog as any).show()"
          @keydown.enter="($refs.dialog as any).show()"
        >
          <frame-card-content
            v-if="item.ItemType === 'Frame'"
            :item="item"
            :hover="isHovering"
            :small="small"
            :equipment-add="equipmentAdd"
            @add="$emit('add', $event)"
            @equip="$emit('equip', $event)"
          />
          <weapon-card-content
            v-else-if="item.ItemType === 'MechWeapon'"
            :item="item"
            :hover="isHovering"
            :small="small"
            :equipment-add="equipmentAdd"
            @add="$emit('add', $event)"
            @equip="$emit('equip', $event)"
          />
          <system-card-content
            v-else-if="item.ItemType === 'MechSystem'"
            :item="item"
            :hover="isHovering"
            :small="small"
            :equipment-add="equipmentAdd"
            @add="$emit('add', $event)"
            @equip="$emit('equip', $event)"
          />
          <gear-card-content
            v-else
            :item="item"
            :hover="isHovering"
            :small="small"
            @equip="$emit(equipmentAdd ? 'add' : 'equip', $event)"
          />
        </v-card>
      </v-hover>
    </v-lazy>
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
    equipmentAdd: { type: Boolean },
  },
};
</script>
