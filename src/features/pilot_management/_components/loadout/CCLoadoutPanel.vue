<template>
  <div>
    <v-toolbar v-if="!noFrame"
      :color="color"
      flat
      :height="mobile ? 22 : 36">
      <v-menu offset-y
        top>
        <template #activator="{ props }">
          <v-btn size="small"
            icon
            variant="plain"
            v-bind="props">
            <v-icon icon="mdi-menu" />
          </v-btn>
        </template>
        <v-list density="compact">
          <div class="text-overline px-3">{{ $t('pm.loadout.availableLoadouts') }}</div>
          <v-list-item v-for="(l, index) in loadouts"
            :key="`loadout-${index}`"
            :title="(l as Loadout).Name"
            @click="$emit('set-active', l)" />
          <v-divider v-if="!readonly" />
          <v-list-item v-if="!readonly"
            prepend-icon="mdi-plus"
            :title="$t('pm.titles.addNewLoadout')"
            @click="$emit('add-loadout')" />
        </v-list>
      </v-menu>
      <cc-short-string-editor :readonly="readonly"
        :placeholder="activeLoadout.Name"
        min-width="250px"
        @set="activeLoadout.Name = $event">
        <span class="heading h3">{{ activeLoadout.Name }}</span>
      </cc-short-string-editor>
      <v-spacer />
      <v-btn v-if="!readonly && loadouts.length > 1"
        size="small"
        variant="plain"
        icon
        @click="$emit('remove-loadout')">
        <v-icon icon="mdi-delete" />
      </v-btn>
    </v-toolbar>
    <v-card flat
      tile
      :variant="!noFrame ? 'outlined' : 'text'"
      :color="color">
      <v-card-text :class="noFrame ? 'pa-0' : mobile ? 'px-0' : ''">
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Loadout from '@/classes/Loadout'
import { useDisplay } from 'vuetify';

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  loadouts: Loadout[]
  activeLoadout: object
  color?: string
  readonly?: boolean
  noFrame?: boolean
}>(), {
  color: 'primary',
  noFrame: false
})

const emit = defineEmits<{
  'remove-loadout': []
  'add-loadout': []
  'set-active': []
}>()

const confirmMenu = ref(false)

function removeConfirm() {
      confirmMenu.value = false;
      emit('remove-loadout');
    }
</script>
