<template>
  <div>
    <v-row v-if="empty && mech.FreeSP <= 0" no-gutters justify="end">
      <v-col cols="auto">
        <v-btn
          text
          dark
          small
          color="primary"
          variant="plain"
          prepend-icon="mdi-plus"
          @click.stop="($refs as any).selectorDialog.show()"
        >
          Add Additional System
        </v-btn>
        <cc-solo-dialog ref="selectorDialog" no-confirm title="SELECT EQUIPMENT" fullscreen no-pad>
          <system-selector :mech="mech" @equip="equipExtra($event)" />
        </cc-solo-dialog>
      </v-col>
    </v-row>

    <slot-card-base v-else ref="base" :item="item" :color="color" :mech="mech" :empty="empty">
      <template #header>
        <v-row v-if="item" dense align="center">
          <v-col cols="auto">
            <equipment-options :item="item" />
          </v-col>
          <v-col cols="auto">
            {{ item.Name }}
            <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
          </v-col>
        </v-row>
        <span v-else>System</span>
      </template>
      <template #header-items>
        <v-row v-if="item" align="center" no-gutters>
          <v-col cols="auto" class="pr-4">
            <v-icon v-for="n in item.SP" icon="cc:system_point" class="mr-1" />
          </v-col>
          <v-col cols="auto" style="border-left: 1px solid #616161">
            <v-btn
              v-if="item"
              size="small"
              icon
              variant="plain"
              color="error"
              @click.stop="remove(item as MechSystem)"
            >
              <v-icon icon="mdi-delete" />
            </v-btn>
            <v-btn
              size="small"
              icon
              variant="plain"
              @click.stop="($refs as any).base.$refs.selectorDialog.show()"
            >
              <v-icon :icon="item ? 'mdi-swap-vertical-variant' : 'add'" />
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <div v-if="item">
        <div v-if="item && item.Effect">
          <div class="text-overline mt-2 text-disabled">
            <v-icon icon="cc:system" />
            EQUIPMENT EFFECT
          </div>
          <div v-html-safe="item.Effect" />
        </div>
      </div>
      <div v-if="item && item.Ammo && item.Ammo.length">
        <div v-for="a in item.Ammo" class="body-text">
          <b>{{ a.name }}</b>
          :
          <span v-html-safe="a.detail" />
        </div>
      </div>
      <template #selector>
        <system-selector :mech="mech" :equipped="item" @equip="equip($event)" />
      </template>
    </slot-card-base>
  </div>
</template>

<script lang="ts">
import SlotCardBase from '../_SlotCardBase.vue';
import SystemSelector from './_SystemSelector.vue';
import EquipmentOptions from '../_EquipmentOptions.vue';
import { MechSystem } from '@/class';

export default {
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
    empty: {
      type: Boolean,
    },
  },
  methods: {
    equipExtra(sys: MechSystem) {
      this.mech.MechLoadoutController.ActiveLoadout.AddSystem(sys);
      (this.$refs.selectorDialog as any).hide();
    },
    equip(sys: MechSystem) {
      if (this.item) {
        this.mech.MechLoadoutController.ActiveLoadout.ChangeSystem(this.index, sys);
      } else {
        this.mech.MechLoadoutController.ActiveLoadout.AddSystem(sys);
      }
      ((this.$refs as any).base.$refs.selectorDialog as any).hide();
    },
    remove(sys: MechSystem) {
      this.mech.MechLoadoutController.ActiveLoadout.RemoveSystem(sys);
    },
  },
};
</script>
