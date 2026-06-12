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
        class="text-disabled">&nbsp;{{ $t('pm.loadout.emptySYSTEMSLOT') }}</div>
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
          <span style="font-size: 13px; margin-left: -4px">{{ $t('stats.sp') }}</span>
        </v-col>
        <v-col v-if="!readonly && !integrated"
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

    <cc-alert v-if="item && integrated && item.IntegratedOrigin"
      class="mt-2"
      icon="mdi-link">
      <div class="text-cc-overline">
        {{ $t('pm.loadout.integratedEquipment') }}
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
        <tr v-for="(a, index) in item.Ammo"
          :key="`ammo-${index}`">
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

<script setup lang="ts">
import { ref, useSlots } from 'vue';
import { notify } from '@/util/notify'
import SlotCardBase from '../_SlotCardBase.vue';
import EquipmentOptions from '../_EquipmentOptions.vue';
import { Mech } from '@/classes/mech/Mech'
import { MechSystem } from '@/classes/mech/components/equipment/MechSystem'
import { useDisplay } from 'vuetify';

const { smAndDown: mobile, xs: portrait } = useDisplay()
const slots = useSlots()

const props = withDefaults(defineProps<{
  mech: Mech
  item?: MechSystem | null
  color?: string
  empty?: boolean
  readonly?: boolean
  integrated?: boolean
}>(), {
  item: null,
  color: 'primary',
  integrated: false
})

const emit = defineEmits<{
  'remove': []
  'done': []
  'equip': []
  'selector-open': []
  'switch': []
}>()

const base = ref<any>(null)

function remove(sys: MechSystem) {
  props.mech.MechLoadoutController.ActiveLoadout.RemoveSystem(sys);
  emit('remove', sys);
}
function handleSwap() {
  if (slots.selector) {
    base.value.selectorDialog = true;
  } else emit('switch', props.item);
}
function save() {
  props.mech.Parent.SaveController.save();
}
</script>
