<template>
  <slot-card-base ref="base" :item="item" :color="color" :mech="mech" :empty="empty">
    <template #header>
      <span v-if="item">
        <equipment-options v-if="!readonly" :item="item" />
        {{ item.Name }}
        <span
          v-if="item.FlavorName && !mobile"
          class="text-caption text-uppercase"
          style="opacity: 0.6">
          //{{ item.TrueName }}
        </span>
      </span>
      <span v-else class="text-disabled">&nbsp;EMPTY SYSTEM SLOT</span>
    </template>

    <template v-if="item" #header-items>
      <span v-if="!mobile">
        {{ item.SP }}
        <span style="font-size: 13px; margin-left: 2px">SP</span>
      </span>
      <v-divider v-if="!readonly && !mobile" vertical class="ml-3" />
      <div v-if="!readonly">
        <v-btn
          v-if="item"
          size="x-small"
          icon
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
          variant="plain"
          @click.stop="($refs as any).base.selectorDialog = true">
          <v-icon :icon="item ? 'mdi-swap-vertical-variant' : 'add'" />
        </v-btn>
      </div>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
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
