<template>
  <div>
    <slot-card-base ref="base" :item="item" :color="color" :mech="mech" :empty="empty">
      <div slot="header">
        <span v-if="item">
          <equipment-options :item="item" :readonly="readonly" />
          <span v-if="!item.Destroyed" :key="item.Name" class="ml-n2">
            {{ item.Name }}
            <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
          </span>
          <span v-else :key="item.Name + '_dest'" class="py-1 error" style="letter-spacing: 3px">
            &nbsp;//
            <strike>{{ item.Name }}</strike>
            //&nbsp;
          </span>
        </span>
        <span v-else>System</span>
      </div>
      <div v-if="!readonly" slot="header-items" class="text-right">
        <div v-if="item" class="mr-3">
          <span class="heading h2">{{ item.SP }}</span>
          <span class="heading h3">SP</span>
        </div>
        <div
          v-if="!readonly"
          class="d-inline pl-3 ml-3 mr-3"
          style=" border-left: 1px solid #616161;"
        >
          <v-icon v-if="item" class="fadeSelect mt-n1" @click.stop="remove(item)">
            delete
          </v-icon>
          <v-icon
            class="fadeSelect mt-n1"
            @click.stop="$refs.base.$refs.selectorDialog.show()"
            v-html="item ? 'mdi-swap-vertical-variant' : 'add'"
          />
        </div>
      </div>
      <div v-if="item">
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
        <v-row dense align="center" class="mt-n1">
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
        </v-row>
        <div v-if="item && item.Effect">
          <div class="overline mb-n2">
            <v-icon>cci-system</v-icon>
            EQUIPMENT EFFECT
          </div>
          <p class="text--text body-text mb-1 mr-3 ml-7" v-html="item.Effect" />
        </div>
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
    empty: {
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
