<template>
  <slot-card-base ref="base" :item="item" :mech="mech" :readonly="readonly" title-color="mod">
    <template #header>
      <div v-if="item" class="pt-1">
        <v-icon icon="cc:weaponmod" />
        <cc-broken-reference v-if="item" :item="item" />
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
      <div v-if="!readonly" :class="!mobile && 'mt-n1'">
        <v-btn
          v-if="item"
          size="x-small"
          icon
          tile
          variant="plain"
          color="error"
          class="d-inline"
          @click.stop="$emit('remove')">
          <v-icon icon="mdi-delete" />
        </v-btn>
      </div>
    </template>

    <div class="text-caption mt-1">
      APPLIED TO:
      <b class="heading text-accent">
        {{ weapon.Name }}
      </b>
    </div>
  </slot-card-base>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { ref } from 'vue'
import SlotCardBase from '../_SlotCardBase.vue';
import EquipmentOptions from '../_EquipmentOptions.vue';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'mod-equipped-card' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  mech: Mech
  weapon?: object
  item?: object
  color?: string
  readonly?: boolean
  integrated?: boolean
}>(), {
  weapon: null,
  item: null,
  color: 'primary',
  integrated: false
})

const emit = defineEmits<{
  'remove': []
  'switch': []
}>()

const base = ref<any>(null)

const hide = ref(false)
</script>
