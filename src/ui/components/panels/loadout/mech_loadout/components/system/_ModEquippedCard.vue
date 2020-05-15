<template>
  <div>
    <slot-card-base ref="base" :item="mod">
      <div slot="header">
        <span v-if="mod">
          <equipment-options :item="mod" />
          <span v-if="!mod.Destroyed" class="ml-n2">
            {{ mod.Name }}
            <span v-if="mod.FlavorName" class="caption ml-2 my-n1">//{{ mod.TrueName }}</span>
          </span>
          <span v-else class="py-1 error" style="letter-spacing: 3px">
            &emsp;/ / {{ mod.Name }} DESTROYED / /&emsp;
          </span>
        </span>
      </div>
      <div slot="header-items" class="text-right">
        <v-btn v-if="mod" icon dark @click="$emit('remove')">
          <v-icon class="fadeSelect mt-n1">delete</v-icon>
        </v-btn>
      </div>
      <v-row dense no-gutters>
        <v-col cols="auto">
          <v-alert
            v-if="mod.IsCascading"
            dense
            tile
            color="error"
            class="text-center white--text stat-text"
            style="letter-spacing: 3px;"
          >
            / / AI IN CASCADE / /
          </v-alert>
          <div class="overline">APPLIED TO</div>
          <div class="heading h3 subtle--text text--darken-2 ml-3 mt-n1">{{ weapon.Name }}</div>
        </v-col>
        <v-col cols="auto" class="ml-auto mr-3">
          <span class="heading h2" :style="`color: ${color}`">{{ mod.SP }}</span>
          <span class="heading h3">SP</span>
        </v-col>
      </v-row>
    </slot-card-base>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SlotCardBase from '../_SlotCardBase.vue'
import EquipmentOptions from '../_EquipmentOptions.vue'

export default Vue.extend({
  name: 'mod-equipped-card',
  components: {
    SlotCardBase,
    EquipmentOptions,
  },
  props: {
    weapon: {
      type: Object,
      required: false,
      default: null,
    },
    mod: {
      type: Object,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
