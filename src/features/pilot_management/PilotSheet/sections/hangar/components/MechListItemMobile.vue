<template>
  <mech-list-item-base :mech="mech"
    :portrait-width="75"
    @go="$emit('go', $event)">
    <template #default="{ contentMargin }">
      <v-toolbar class="px-1"
        height="22"
        :color="mech.Frame.ManufacturerColor">
        <span class="heading text-cc-overline"
          :style="`margin-left: ${contentMargin}px`">
          <v-icon :icon="mech.Frame.ManufacturerIcon" />
          {{ mech.Name }}
        </span>
      </v-toolbar>

      <div style="border-top: 0"
        class="light-panel">
        <div :style="`margin-left: ${contentMargin}px; margin-top: -1px; padding-left: 8px; min-height: 100px`">
          <div class="text-cc-overline pt-1">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>
          <div class="text-disabled text-cc-overline pb-1">
            <v-icon icon="mdi-sword-cross"
              size="small" />
            {{ $t('common.loadout') }} // {{ mech.MechLoadoutController.ActiveLoadout.Name || '---' }}
          </div>

          <v-row dense
            class="text-cc-overline"
            justify="space-around">
            <v-col cols="auto">
              <v-icon class="mr-1"
                icon="cc:structure" />
              <b class="text-accent">{{ mech.MaxStructure }}</b>
            </v-col>
            <v-col cols="auto">
              <v-icon class="mr-1"
                icon="mdi-shield-outline" />
              <b class="text-accent">{{ mech.Armor }}</b>
            </v-col>
            <v-col cols="auto">
              <v-icon class="mr-1"
                icon="mdi-heart-outline" />
              <b class="text-accent">{{ mech.MaxHP }}</b>
            </v-col>
            <v-col cols="auto">
              <v-icon class="mr-1"
                icon="cc:reactor" />
              <b class="text-accent">{{ mech.MaxStress }}</b>
            </v-col>
            <v-col cols="auto">
              <v-icon class="mr-1"
                icon="cc:heat" />
              <b class="text-accent">{{ mech.HeatCapacity }}</b>
            </v-col>
            <v-col cols="auto">
              <v-icon class="mr-1"
                icon="cc:repair" />
              <b class="text-accent">{{ mech.RepairCapacity }}</b>
            </v-col>
          </v-row>

          <v-row dense
            justify="space-around"
            style="position: absolute; bottom: 0">
            <v-col cols="auto">
              <cc-dialog :close-on-click="false"
                :title="$t('pm.titles.deleteMech')"
                color="error"
                icon="mdi-delete">
                <template #activator="{ open }">
                  <v-tooltip :text="$t('pm.titles.deleteMech')">
                    <template #activator="{ props }">
                      <v-btn size="x-small"
                        variant="text"
                        tile
                        v-bind="props"
                        icon="mdi-delete"
                        color="error"
                        @click.stop="open" />
                    </template>
                  </v-tooltip>
                </template>
                <cc-confirmation :content="`Lancer, please confirm deletion of Mech Configuration:
        <span class='text-accent'>
          ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
        </span>`"
                  @confirm="$emit('delete', mech)" />
              </cc-dialog>
            </v-col>

            <v-col cols="auto">
              <cc-dialog :close-on-click="false"
                :title="$t('pm.titles.duplicateMech')"
                icon="mdi-content-copy">
                <template #activator="{ open }">
                  <v-tooltip :text="$t('pm.titles.duplicateMech')">
                    <template #activator="{ props }">
                      <v-btn size="x-small"
                        variant="text"
                        tile
                        v-bind="props"
                        icon="mdi-content-copy"
                        @click.stop="open" />
                    </template>
                  </v-tooltip>
                </template>
                <cc-confirmation :content="`Lancer, please confirm intention to create a duplicate of Mech Configuration:
        <span class='text-accent'>
          ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
        </span>`"
                  @confirm="$emit('copy', mech)" />
              </cc-dialog>
            </v-col>

            <v-col cols="auto">
              <v-tooltip :text="$t('pm.tooltips.printMechSheet')">
                <template #activator="{ props }">
                  <v-btn size="x-small"
                    variant="text"
                    tile
                    v-bind="props"
                    icon="mdi-printer"
                    @click.stop="$router.push(`/print/${mech.Pilot.ID}/${mech.ID}`)" />
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </mech-list-item-base>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import MechListItemBase from './MechListItemBase.vue';
import { useRouter } from 'vue-router'
const router = useRouter()

defineOptions({ name: 'mech-list-item-mobile' })

const props = defineProps<{
  mech: Mech
}>()

const emit = defineEmits<{
  'go': []
  'delete': []
  'copy': []
}>()
</script>
