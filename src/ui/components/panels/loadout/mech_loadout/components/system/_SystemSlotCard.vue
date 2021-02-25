<template>
  <div>
    <v-row v-if="empty && mech.FreeSP <= 0" no-gutters justify="end">
      <v-col cols="auto">
        <v-btn
          text
          dark
          small
          color="primary"
          class="fadeSelect"
          @click.stop="$refs.selectorDialog.show()"
        >
          <v-icon small>mdi-plus</v-icon>
          Add Additional System
        </v-btn>
        <cc-solo-dialog ref="selectorDialog" no-confirm title="SELECT EQUIPMENT" fullscreen no-pad>
          <system-selector :mech="mech" @equip="equipExtra($event)" />
        </cc-solo-dialog>
      </v-col>
    </v-row>

    <slot-card-base
      v-else
      ref="base"
      :item="item"
      :color="color"
      :mech="mech"
      :empty="empty"
      :readonly="readonly"
    >
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
      <div v-if="!readonly" slot="header-items" class="text-right d-inline">
        <div v-if="item" style="display: inline-block">
          <span class="heading h2">{{ item.SP }}</span>
          <span class="heading h3">SP</span>
        </div>
        <div v-if="!readonly" class="d-inline pl-3 ml-3" style=" border-left: 1px solid #616161;">
          <v-icon v-if="item" dark class="fadeSelect mt-n1" @click.stop="remove(item)">
            delete
          </v-icon>
          <v-icon
            class="fadeSelect mt-n1"
            dark
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
        <div v-if="item && item.Effect">
          <div class="overline">
            <v-icon>cci-system</v-icon>
            EQUIPMENT EFFECT
          </div>
          <p class="text--text body-text mb-1 mr-3 ml-7" v-html-safe="item.Effect" />
        </div>
      </div>
      <div v-if="item && item.Ammo && item.Ammo.length">
        <div v-for="(a, i) in item.Ammo" :key="`${item.Name}_ammo_${i}`" class="body-text">
          <b>{{ a.name }}</b>
          :
          <span v-html="a.detail" />
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
    equipExtra(sys: MechSystem) {
      this.mech.ActiveLoadout.AddSystem(sys)
      this.$refs.selectorDialog.hide()
    },
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
