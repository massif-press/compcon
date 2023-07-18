<template>
  <div>
    <v-row v-if="empty && mech.FreeSP <= 0" no-gutters justify="end">
      <v-col cols="auto">
        <v-btn
          text
          dark
          small
          color="primary"
          class="fade-select"
          @click.stop="($refs as any).selectorDialog.show()"
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
        <v-row v-if="item" no-gutters>
          <v-col cols="auto">
            <equipment-options :item="item" :readonly="readonly" />
          </v-col>
          <v-col cols="auto">
            <span v-if="!item.Destroyed" :class="`ml-n2 ${small ? 'text-white effect-text' : ''}`">
              {{ item.Name }}
              <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
            </span>
            <span v-else class="py-1 error" style="letter-spacing: 3px">
              &nbsp;//
              <strike>{{ item.Name }}</strike>
              //&nbsp;
            </span>
          </v-col>
        </v-row>
        <span v-else>System</span>
      </div>
      <v-row v-if="item" slot="header-items" justify="end" no-gutters>
        <div v-if="item" class="heading" style="display: inline-block">
          <span :class="small ? 'h3' : 'h2'">{{ item.SP }}</span>
          <span class="h3">SP</span>
        </div>
        <div v-if="!readonly" class="d-inline pl-3 ml-3" style="border-left: 1px solid #616161">
          <v-icon
            v-if="item"
            dark
            class="fade-select mt-n1"
            :small="small"
            @click.stop="remove(item)"
          >
            delete
          </v-icon>
          <v-icon
            class="fade-select mt-n1"
            :small="small"
            dark
            @click.stop="($refs as any).base.$refs.selectorDialog.show()"
            v-html="item ? 'mdi-swap-vertical-variant' : 'add'"
          />
        </div>
      </v-row>
      <div v-if="item">
        <v-alert
          v-if="item.IsCascading"
          density="compact"
          tile
          color="error"
          class="text-center text-white stat-text"
          style="letter-spacing: 3px"
        >
          / / AI IN CASCADE / /
        </v-alert>
        <div v-if="item && item.Effect">
          <div class="text-overline mt-2">
            <v-icon icon="cc:system" />
            EQUIPMENT EFFECT
          </div>
          <p v-html-safe="item.Effect" class="text-text body-text mb-1 mr-3 ml-7" />
        </div>
      </div>
      <div v-if="item && item.Ammo && item.Ammo.length">
        <div v-for="(a, i) in item.Ammo" class="body-text">
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
    readonly: {
      type: Boolean,
    },
    empty: {
      type: Boolean,
    },
  },
  computed: {
    small() {
      return this.$vuetify.display.smAndDown;
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
      (this.$refs.base.$refs.selectorDialog as any).hide();
    },
    remove(sys: MechSystem) {
      this.mech.MechLoadoutController.ActiveLoadout.RemoveSystem(sys);
    },
  },
};
</script>
