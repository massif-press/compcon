<template>
  <slot-card-base ref="base"
    :item="item"
    :color="color"
    :mech="mech"
    :empty="empty"
    @selector-open="$emit('selector-open')"
    @selector-close="$emit('done')">
    <template #header>
      <v-row v-if="item"
        no-gutters
        align="center"
        style="line-height: 18px;">
        <v-col cols="auto"
          class="mr-2">
          <equipment-options v-if="!readonly"
            :item="item"
            @update="save()" />
          <cc-broken-reference v-if="item"
            :item="item" />
        </v-col>
        <v-col>
          {{ item.Name }}
        </v-col>
      </v-row>
      <div v-else
        class="text-disabled">&nbsp;EMPTY SYSTEM SLOT</div>
    </template>

    <template v-if="item"
      #header-items>
      <v-row align="center"
        no-gutters
        justify="end"
        :style="mobile && 'margin-top: -12px'"
        class="pr-1">
        <v-col v-if="item && item.SP"
          cols="auto"
          class="pl-3">
          {{ item.SP }}
          <span style="font-size: 13px; margin-left: -4px">SP</span>
        </v-col>
        <v-col v-if="!readonly"
          cols="auto">
          <div class="ml-2"
            style="border-left: 1px solid rgba(155, 155, 155, 0.3)">
            <v-btn v-if="item"
              size="x-small"
              icon
              tile
              variant="plain"
              color="error"
              @click.stop="remove(item as MechSystem)">
              <v-icon size="20"
                icon="mdi-delete" />
            </v-btn>
            <v-btn size="x-small"
              icon
              tile
              variant="plain"
              @click.stop="handleSwap()">
              <v-icon size="20"
                :icon="item ? 'mdi-swap-vertical-variant' : 'mdi-add'" />
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <cc-alert v-if="item && integrated"
      class="mt-2"
      icon="mdi-link">
      <div class="text-cc-overline">
        Integrated Equipment
        <cc-slashes />
        <v-icon :icon="item.IntegratedOrigin.Icon"
          class="pb-1" />
        {{ item.IntegratedOrigin.Name }}
      </div>
    </cc-alert>

    <v-table v-if="item && item.Ammo && item.Ammo.length"
      class="mt-2"
      hover
      density="compact">
      <tbody>
        <tr v-for="a in item.Ammo">
          <td v-if="!portrait"
            style="min-width: 120px"
            class="text-accent">
            <v-icon icon="cc:ammo"
              size="small"
              class="mt-n1 mr-1" />
            <b>{{ a.name }}</b>
          </td>

          <td>
            <div v-if="portrait"
              class="text-accent">
              <v-icon icon="cc:ammo"
                size="small"
                start />
              <b>{{ a.name }}</b>
            </div>
            <span v-html-safe="a.detail" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </slot-card-base>
</template>

<script lang="ts">
import SlotCardBase from '../_SlotCardBase.vue';
import EquipmentOptions from '../_EquipmentOptions.vue';
import { Mech, MechSystem } from '@/class';
import { useMobile } from '@/mixins/useMobile';

export default {
  name: 'SystemSlotCard',
  components: { SlotCardBase, EquipmentOptions },
  mixins: [useMobile],
  props: {
    mech: {
      type: Mech,
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
  emits: ['remove', 'done', 'equip', 'selector-open', 'switch'],
  methods: {
    remove(sys: MechSystem) {
      this.mech.MechLoadoutController.ActiveLoadout.RemoveSystem(sys);
      this.$emit('remove', sys);
    },
    handleEquip(sys: MechSystem) {
      this.$notify({
        title: 'Mech System Installed',
        text: `${sys.Name} added.`,
        data: { icon: 'cc:system', color: 'system' },
      });

      if (this.mech.FreeSP <= 0) this.$emit('done');
      else this.$emit('equip', sys);
    },
    handleSwap() {
      if (this.$slots.selector) {
        (this.$refs as any).base.selectorDialog = true;
      } else this.$emit('switch', this.item);
    },
    save() {
      this.mech.Parent.SaveController.save();
    },
  },
};
</script>
