<template>
  <div>
    <slot-card-base ref="base" :item="item">
      <div slot="header">
        <span v-if="item">
          <equipment-options :item="item" />
          <span v-if="!item.Destroyed" class="ml-n2">
            {{ item.Name }}
          </span>
          <span v-else class="py-1 error" style="letter-spacing: 3px">
            &emsp;/ / EQUIPMENT DESTROYED / /&emsp;
          </span>
        </span>
        <span v-else>System</span>
      </div>
      <div v-if="!readonly" slot="header-items" class="text-right">
        <v-btn v-if="item" icon dark @click="remove(item)">
          <v-icon class="fadeSelect mt-n1">delete</v-icon>
        </v-btn>
        <v-btn icon dark @click="$refs.base.$refs.selectorDialog.show()">
          <v-icon class="fadeSelect mt-n1" v-html="item ? 'mdi-swap-vertical-variant' : 'add'" />
        </v-btn>
      </div>
      <div v-if="item">
        <v-row no-gutters align="center"></v-row>
        <v-alert
          v-if="item.IsUnshackled"
          dense
          tile
          color="error"
          class="text-center white--text stat-text"
          style="letter-spacing: 3px;"
        >
          / / AI UNSHACKLED / /
        </v-alert>
        <v-row v-if="item.Effect" dense>
          <v-col class="mr-3">
            <p class="effect-text mb-0" v-html="item.Effect" />
          </v-col>
          <v-col cols="auto" class="ml-auto mr-3">
            <span class="heading h2" :style="`color: ${color}`">{{ item.SP }}</span>
            <span class="heading h3">SP</span>
          </v-col>
        </v-row>
        <v-row v-if="item.IsLimited" dense no-gutters align="end" class="mt-n2">
          <v-col cols="12">
            <span class="overline">
              USES
            </span>
          </v-col>
          <v-col cols="auto">
            <cc-item-uses :item="item" :bonus="mech.Pilot.LimitedBonus" :color="color" />
          </v-col>
          <v-col cols="auto" class="ml-2 mb-1 overline">
            ({{ item.Uses }}/{{ item.MaxUses + mech.Pilot.LimitedBonus }})
          </v-col>
        </v-row>
        <v-row v-if="item.IsLoading" dense class="ml-1">
          <v-chip small dark label :color="item.Loaded ? 'pilot' : 'grey'">
            <v-icon left small>mdi-progress-{{ item.Loaded ? 'upload' : 'download' }}</v-icon>
            {{ item.Loaded ? 'LOADED' : 'NOT LOADED' }}
          </v-chip>
        </v-row>
        <v-row no-gutters align="center" class="ml-2 mr-6 mt-n1">
          <v-col cols="auto" class="ml-auto">
            <cc-tags small :tags="item.Tags" :color="color" />
          </v-col>
        </v-row>
      </div>
      <system-selector slot="selector" :mech="mech" @equip="equip($event)" />
    </slot-card-base>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SlotCardBase from '../_SlotCardBase.vue'
import SystemSelector from './_SystemSelector.vue'
import EquipmentOptions from '../_EquipmentOptions.vue'
import { MechSystem } from '@/class'

export default Vue.extend({
  name: 'system-slot-card',
  components: {
    SlotCardBase,
    EquipmentOptions,
    SystemSelector,
  },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    readonly: {
      type: Boolean,
    },
  },
  methods: {
    equip(item: MechSystem) {
      if (this.system) {
        this.mech.ActiveLoadout.ChangeSystem(item)
      } else {
        this.mech.ActiveLoadout.AddSystem(item)
      }
      this.$refs.base.$refs.selectorDialog.hide()
    },
    remove(item: MechSystem) {
      this.mech.ActiveLoadout.RemoveSystem(item)
    },
  },
})
</script>
