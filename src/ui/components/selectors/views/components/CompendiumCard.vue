<template>
  <v-col cols="4">
    <v-hover v-slot="{ props, isHovering }">
      <v-card
        v-bind="props"
        :color="isHovering ? 'panel lighten-1' : 'panel'"
        @click="($refs.dialog as any).show()"
        @keydown.enter="($refs.dialog as any).show()"
      >
        <frame-card-content
          v-if="item.ItemType === 'Frame'"
          :item="item"
          :hover="isHovering"
          :small="small"
          :highlighted="highlighted"
          :equipment-add="equipmentAdd"
          :equipped="isEquippedItem"
          @add="$emit('add', $event)"
          @equip="$emit('equip', $event)"
        />
        <weapon-card-content
          v-else-if="item.ItemType === 'MechWeapon'"
          :item="item"
          :hover="isHovering"
          :highlighted="highlighted"
          :small="small"
          :equipment-add="equipmentAdd"
          :equipped="isEquippedItem"
          @add="$emit('add', $event)"
          @equip="$emit('equip', $event)"
        />
        <system-card-content
          v-else-if="item.ItemType === 'MechSystem'"
          :item="item"
          :hover="isHovering"
          :highlighted="highlighted"
          :small="small"
          :equipment-add="equipmentAdd"
          :equipped="isEquippedItem"
          @add="$emit('add', $event)"
          @equip="$emit('equip', $event)"
        />
        <gear-card-content
          v-else
          :item="item"
          :hover="isHovering"
          :highlighted="highlighted"
          :small="small"
          :equipped="isEquippedItem"
          @equip="$emit(equipmentAdd ? 'add' : 'equip', $event)"
        />
      </v-card>
    </v-hover>
    <cc-solo-dialog ref="dialog" :title="item.Name" :icon="item.Icon" large>
      <div class="pa-3">
        <cc-item-card :item="item" />
      </div>
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
    equipped: {
      type: Object,
      required: false,
    },
    small: {
      type: Boolean,
    },
    equipmentAdd: { type: Boolean },
    highlighted: { type: Boolean },
  },
  computed: {
    isEquippedItem() {
      return this.equipped && this.equipped.ID === this.item.ID;
    },
  },
};
</script>
