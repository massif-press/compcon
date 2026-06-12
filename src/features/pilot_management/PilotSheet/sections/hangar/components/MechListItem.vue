<template>
  <mech-list-item-base :mech="mech"
    @go="$emit('go', $event)">
    <template #default="{ contentMargin }">
      <v-toolbar class="px-1"
        height="26"
        :color="mech.Frame.ManufacturerColor">
        <span class="heading h3"
          :style="`margin-left: ${contentMargin}px`">
          {{ mech.Name }}
        </span>
        <span class="text-cc-overline px-2">
          <cc-slashes />
          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
        </span>
        <v-spacer />
        <v-icon :icon="mech.Frame.ManufacturerIcon" />
      </v-toolbar>

      <div style="border-top: 0"
        class="light-panel">
        <div :style="`margin-left: ${contentMargin}px; margin-top: -1px; padding-left: 8px; min-height: 100px`">
          <div class="flavor-text text-text">
            <v-row align="center"
              dense>
              <v-col>
                <fieldset class="px-3">
                  <legend class="px-2">
                    {{ $t('pm.sheet.loadoutSlashes') }}{{
                      mech.MechLoadoutController.ActiveLoadout
                        ? mech.MechLoadoutController.ActiveLoadout.Name
                        : $t('pm.sheet.err')
                    }}
                  </legend>
                  <div v-if="mech.MechLoadoutController.ActiveLoadout"
                    class="pb-3">
                    <span v-for="(item, i) in loadoutWeapons"
                      :key="`weapon-${i}`">
                      <span v-html-safe="item" />
                      <cc-slashes v-if="i + 1 < loadoutWeapons.length"
                        class="px-2" />
                    </span>
                    <br />
                    <span v-for="(item, i) in loadoutSystems"
                      :key="`system-${i}`">
                      <span v-if="i > 0"> - </span>
                      <span v-html-safe="item" />
                    </span>
                  </div>
                </fieldset>
                <v-row no-gutters
                  justify="space-around">
                  <v-col cols="auto">
                    <span class="text-overline">
                      {{ $t('pm.sheet.str') }}
                      <b>{{ mech.MaxStructure }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical
                    class="mx-2" />
                  <v-col cols="auto">
                    <span class="text-overline">
                      {{ $t('stats.hp') }}
                      <b>{{ mech.MaxHP }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical
                    class="mx-2" />
                  <v-col cols="auto">
                    <span class="text-overline">
                      {{ $t('pm.sheet.stress') }}
                      <b>{{ mech.MaxStress }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical
                    class="mx-2" />
                  <v-col cols="auto">
                    <span class="text-overline">
                      {{ $t('pm.sheet.heat') }}
                      <b>{{ mech.HeatCapacity }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical
                    class="mx-2" />
                  <v-col cols="auto">
                    <span class="text-overline">
                      {{ $t('pm.sheet.repcap') }}
                      <b>{{ mech.RepairCapacity }}</b>
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="auto"
                class="pr-4">
                <v-tooltip location="top"
                  :text="mech.Parent.FavoriteMech?.ID === mech.ID ? 'Unfavorite Mech' : 'Favorite Mech'">
                  <template #activator="{ props }">
                    <v-btn v-bind="props"
                      size="x-small"
                      icon
                      :color="mech.Parent.FavoriteMech?.ID === mech.ID ? 'amber' : ''"
                      variant="plain"
                      @click.stop="mech.Parent.FavoriteMech?.ID === mech.ID ? mech.Parent.FavoriteMech = null : mech.Parent.FavoriteMech = mech">
                      <v-icon size="22"
                        :icon="mech.Parent.FavoriteMech?.ID === mech.ID ? 'mdi-star' : 'mdi-star-outline'" />
                    </v-btn>
                  </template>
                </v-tooltip>
                <cc-dialog :close-on-click="false"
                  title="Delete Mech"
                  color="error"
                  icon="mdi-delete">
                  <template #activator="{ open }">
                    <v-tooltip text="Delete Mech">
                      <template #activator="{ props }">
                        <v-btn size="x-small"
                          variant="text"
                          tile
                          icon
                          v-bind="props"
                          class="d-block"
                          color="error"
                          @click.stop="open">
                          <v-icon size="22">
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>
                  <cc-confirmation full-width
                    :content="`Lancer, please confirm deletion of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
                    @confirm="$emit('delete', mech)" />
                </cc-dialog>
                <cc-dialog :close-on-click="false"
                  title="Duplicate Mech"
                  icon="mdi-content-copy">
                  <template #activator="{ open }">
                    <v-tooltip text="Duplicate Mech">
                      <template #activator="{ props }">
                        <v-btn size="x-small"
                          variant="text"
                          icon
                          tile
                          v-bind="props"
                          class="d-block"
                          @click.stop="open">
                          <v-icon size="22">
                            mdi-content-copy
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>
                  <cc-confirmation :content="`Lancer, please confirm intention to create a duplicate of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
                    @confirm="$emit('copy', mech)" />
                </cc-dialog>
                <v-tooltip text="Print Mech Sheet">
                  <template #activator="{ props }">
                    <v-btn size="x-small"
                      variant="text"
                      icon
                      tile
                      v-bind="props"
                      class="d-block"
                      @click.stop="$router.push(`/print/${mech.Pilot.ID}/${mech.ID}`)">
                      <v-icon size="22">
                        mdi-printer
                      </v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </template>
  </mech-list-item-base>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MechListItemBase from './MechListItemBase.vue';
const router = useRouter()

defineOptions({ name: 'mech-list-item' })

const props = defineProps<{
  mech: Mech
}>()

const emit = defineEmits<{
  'go': []
  'delete': []
  'copy': []
}>()

const loadoutWeapons = computed(() => {
      const output = [] as string[];
      for (const mount of props.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        props.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        props.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        props.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
      )) {
        if (!mount.IsLocked) {
          let str = `<i style="opacity:0.5">${mount.Name}</i>:`;
          if (!mount.Weapons.length) str += ' EMPTY';
          else {
            mount.Weapons.forEach((w, i) => {
              str += ` ${w._name}`;
              if (w.Mod) str += ` (${w.Mod._name})`;
              if (i + 1 < mount.Weapons.length) str += ' /';
            });
          }
          output.push(str);
        }
      }
      return output;
    })
const loadoutSystems = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.AllActiveSystems.map((x) => x.Name);
    })
</script>
