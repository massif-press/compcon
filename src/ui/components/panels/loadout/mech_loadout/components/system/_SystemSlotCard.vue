<template>
  <div>
    <slot-card-base ref="base" :item="item">
      <div slot="header">
        <span v-if="item">
          <equipment-options :item="item" />
          <span v-if="!item.Destroyed" :key="item.Name" class="ml-n2">
            {{ item.Name }}
            <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
          </span>
          <span v-else :key="item.Name + '_dest'" class="py-1 error" style="letter-spacing: 3px">
            &emsp;/ / {{ item.Name }} DESTROYED / /&emsp;
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
          v-if="item.IsCascading"
          dense
          tile
          color="error"
          class="text-center white--text stat-text"
          style="letter-spacing: 3px;"
        >
          / / AI IN CASCADE / /
        </v-alert>
        <v-row dense align="center" class="mt-n2">
          <v-col cols="auto" class="mr-3">
            <span class="heading h2" :style="`color: ${color}`">{{ item.SP }}</span>
            <span class="heading h3">SP</span>
          </v-col>
          <v-col v-if="item.IsLimited" cols="auto" class="mr-2">
            <cc-item-uses
              :item="item"
              :bonus="mech.Pilot.LimitedBonus"
              :color="color"
              class="d-inline"
            />
            <span class="overline">
              ({{ item.Uses }}/{{ item.MaxUses + mech.Pilot.LimitedBonus }}) USES
            </span>
          </v-col>
          <v-col v-if="item.IsLoading" cols="auto" dense>
            <v-btn
              small
              dark
              :color="item.Loaded ? 'pilot' : 'grey'"
              @click.stop="item.Loaded = !item.Loaded"
            >
              <v-icon left small>mdi-progress-{{ item.Loaded ? 'upload' : 'download' }}</v-icon>
              {{ item.Loaded ? 'LOADED' : 'NOT LOADED' }}
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <cc-tags small :tags="item.Tags" :color="color" />
          </v-col>
        </v-row>

        <cc-item-effect-panel v-if="item.Effect" :effects="item.Effect" transparent class="mt-n3" />
      </div>
      <system-selector slot="selector" :mech="mech" :equipped="item" @equip="equip($event)" />
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
    index: {
      type: Number,
      required: false,
      default: -1,
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
    equip(sys: MechSystem) {
      if (this.item) {
        this.mech.ActiveLoadout.ChangeSystem(this.index, sys)
      } else {
        this.mech.ActiveLoadout.AddSystem(sys)
      }
      this.$refs.base.$refs.selectorDialog.hide()
    },
    remove(sys: MechSystem) {
      this.mech.ActiveLoadout.RemoveSystem(sys)
    },
  },
})
</script>
