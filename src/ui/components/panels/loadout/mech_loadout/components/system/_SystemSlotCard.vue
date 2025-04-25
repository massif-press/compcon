<template>
  <slot-card-base
    ref="base"
    :item="item"
    :color="color"
    :mech="mech"
    :empty="empty"
    @selector-close="$emit('done')">
    <template #header>
      <div v-if="item" class="pt-1">
        <equipment-options v-if="!readonly && !integrated" :item="item" />
        <span v-else>&nbsp;</span>
        {{ item.Name }}
      </div>
      <div v-else class="text-disabled">&nbsp;EMPTY SYSTEM SLOT</div>
    </template>

    <template v-if="item" #header-items>
      <div v-if="!mobile" style="margin-top: -2px">
        {{ item.SP }}
        <span style="font-size: 13px; margin-left: 2px">SP</span>
      </div>
      <v-divider v-if="!readonly && !mobile" vertical class="ml-3" />
      <div v-if="!readonly && !integrated" :class="!mobile && 'mt-n1'">
        <v-btn
          v-if="item"
          size="x-small"
          icon
          tile
          variant="plain"
          color="error"
          class="d-inline"
          @click.stop="remove(item as MechSystem)">
          <v-icon icon="mdi-delete" />
        </v-btn>
        <v-btn
          size="x-small"
          icon
          class="d-inline"
          tile
          variant="plain"
          @click.stop="($refs as any).base.selectorDialog = true">
          <v-icon :icon="item ? 'mdi-swap-vertical-variant' : 'add'" />
        </v-btn>
      </div>
    </template>

    <cc-alert v-if="item && integrated" class="mt-2" icon="mdi-link">
      <div class="text-cc-overline">
        Integrated Equipment
        <cc-slashes />
        <v-icon :icon="item.IntegratedOrigin.Icon" class="pb-1" />
        {{ item.IntegratedOrigin.Name }}
      </div>
    </cc-alert>

    <v-table v-if="item && item.Ammo && item.Ammo.length" class="mt-2" hover density="compact">
      <tbody>
        <tr v-for="a in item.Ammo">
          <td v-if="!portrait" style="min-width: 120px" class="text-accent">
            <v-icon icon="cc:ammo" size="small" class="mt-n1 mr-1" />
            <b>{{ a.name }}</b>
          </td>

          <td>
            <div v-if="portrait" class="text-accent">
              <v-icon icon="cc:ammo" size="small" start />
              <b>{{ a.name }}</b>
            </div>
            <span v-html-safe="a.detail" />
          </td>
        </tr>
      </tbody>
    </v-table>

    <template #selector>
      <system-selector :mech="mech" :equipped="item" @equip="handleEquip($event)" />
    </template>
  </slot-card-base>
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
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    empty: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
    integrated: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['done'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    portrait() {
      return this.$vuetify.display.xs;
    },
  },
  methods: {
    remove(sys: MechSystem) {
      this.mech.MechLoadoutController.ActiveLoadout.RemoveSystem(sys);
      this.$emit('done');
    },
    handleEquip(sys: MechSystem) {
      this.$notify({
        title: 'Mech System Installed',
        text: `${sys.Name} added.`,
        data: { icon: 'cc:system', color: 'system' },
      });

      if (this.mech.FreeSP <= 0) this.$emit('done');
    },
  },
};
</script>
