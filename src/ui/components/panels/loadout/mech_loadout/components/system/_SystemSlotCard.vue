<template>
  <div>
    <v-row v-if="!readonly && empty && mech.FreeSP <= 0" no-gutters justify="end">
      <v-col cols="auto">
        <v-btn
          size="small"
          color="accent"
          variant="tonal"
          prepend-icon="mdi-plus"
          @click.stop="($refs as any).additionalSelect.show()">
          Add Additional System
        </v-btn>
        <cc-solo-dialog
          ref="additionalSelect"
          no-confirm
          title="SELECT EQUIPMENT"
          fullscreen
          no-pad>
          <system-selector :mech="mech" @equip="handleEquip($event)" />
        </cc-solo-dialog>
      </v-col>
    </v-row>

    <slot-card-base v-else ref="base" :item="item" :color="color" :mech="mech" :empty="empty">
      <template #header>
        <v-row v-if="item" dense align="center">
          <v-col cols="auto">
            <equipment-options v-if="!readonly" :item="item" />
          </v-col>
          <v-col cols="auto">
            {{ item.Name }}
            <span v-if="item.FlavorName" class="text-caption text-uppercase" style="opacity: 0.6">
              //{{ item.TrueName }}
            </span>
          </v-col>
        </v-row>
        <span v-else>System</span>
      </template>
      <template #header-items>
        <v-row v-if="item" align="center" no-gutters>
          <v-col cols="auto" class="pr-4">
            <span>{{ item.SP }}SP</span>
          </v-col>
          <v-col v-if="!readonly" cols="auto" style="border-left: 1px solid #616161">
            <v-btn
              v-if="item"
              size="small"
              icon
              variant="plain"
              color="error"
              @click.stop="remove(item as MechSystem)">
              <v-icon icon="mdi-delete" />
            </v-btn>
            <v-btn
              size="small"
              icon
              variant="plain"
              @click.stop="($refs as any).base.$refs.selectorDialog.show()">
              <v-icon :icon="item ? 'mdi-swap-vertical-variant' : 'add'" />
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-table v-if="item && item.Ammo && item.Ammo.length" class="mt-2" hover density="compact">
        <tbody>
          <tr v-for="a in item.Ammo">
            <td style="min-width: 120px">
              <v-icon icon="cc:ammo" class="mt-n1 mr-1" />
              <b>{{ a.name }}</b>
            </td>

            <td><span v-html-safe="a.detail" /></td>
          </tr>
        </tbody>
      </v-table>
      <template #selector>
        <system-selector :mech="mech" :equipped="item" @equip="handleEquip($event)" />
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
  },
  methods: {
    remove(sys: MechSystem) {
      this.mech.MechLoadoutController.ActiveLoadout.RemoveSystem(sys);
    },
    handleEquip(sys: MechSystem) {
      this.$notify({
        title: 'Mech System Installed',
        text: `${sys.Name} added.`,
        data: { icon: 'cc:system', color: 'system' },
      });

      if (this.mech.FreeSP <= 0 && (this.$refs as any).additionalSelect)
        (this.$refs as any).additionalSelect.hide();
    },
  },
};
</script>
