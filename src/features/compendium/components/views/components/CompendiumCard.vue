<template>
  <v-col cols="12" md="4">
    <v-hover v-slot="{ hover }">
      <v-card
        class="clipped-large"
        :color="hover ? 'panel lighten-1' : 'panel'"
        tile
        @click="$refs.dialog.show()"
        @keydown.enter="$refs.dialog.show()"
      >
        <frame-card-content
          v-if="item.ItemType === 'Frame'"
          :item="item"
          :hover="hover"
          :small="small"
        />
        <weapon-card-content
          v-else-if="item.ItemType === 'MechWeapon'"
          :item="item"
          :hover="hover"
          :small="small"
        />
        <system-card-content
          v-else-if="item.ItemType === 'MechSystem'"
          :item="item"
          :hover="hover"
          :small="small"
        />
        <gear-card-content v-else :item="item" :hover="hover" :small="small" />
      </v-card>
    </v-hover>
    <cc-solo-dialog ref="dialog" :title="`${item.Source} ${item.Name}`" large>
      <cc-item-card :item="item" />
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import FrameCardContent from './_FrameCardContent.vue'
import WeaponCardContent from './_WeaponCardContent.vue'
import GearCardContent from './_GearCardContent.vue'
import SystemCardContent from './_SystemCardContent.vue'

export default Vue.extend({
  name: 'compendium-large-card',
  components: { FrameCardContent, WeaponCardContent, GearCardContent, SystemCardContent },
  props: {
    item: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
    },
  },
})
</script>
