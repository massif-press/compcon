<template>
  <div class="text-cc-overline">// WEAPONS</div>
  <cc-masonry-grid :items="mounts"
    :xl-columns="xlColumns">
    <template #default="{ item }">
      <fieldset :class="mobile ? 'pa-1' : 'pb-2 px-3'"
        style="border-color: rgba(155, 155, 155, 0.6)">
        <legend class="heading h4 mx-2 px-2 text-accent">
          {{ item.mount.Name }}
          <span v-if="item.isImpArm"
            class="text-cc-overline">(IMPROVED ARMAMENT)</span>
          <span v-if="item.isSuperheavy"
            class="text-cc-overline">(SUPERHEAVY MOUNTING)</span>
        </legend>

        <mech-mount-bonus-card v-for="b in item.mount.Bonuses"
          :key="b.ID"
          :bonus="b"
          :mech="mech"
          :owner="owner"
          :encounter-instance="encounterInstance"
          @deploy="$emit('deploy', $event)" />

        <sh-lock-card v-if="item.mount.IsLocked" />
        <div v-for="(s, idx) in item.mount.Slots"
          :key="`slot-${idx}`">
          <div v-if="Number(idx) > 0"
            class="my-4" />
          <mech-weapon-card v-if="s && s.Weapon"
            :key="s.ID"
            :owner="owner"
            :item="s.Weapon"
            :mech="mech"
            :mount="item.mount"
            :encounter-instance="encounterInstance"
            :int-weapon="item.isIntWeapon || item.isIntegrated"
            @deploy="$emit('deploy', $event)" />
        </div>
      </fieldset>
    </template>
  </cc-masonry-grid>
  <div class="text-cc-overline mt-2">// SYSTEMS</div>
  <cc-masonry-grid :items="systems"
    :xl-columns="xlColumns">
    <template #default="{ item }">
      <fieldset class="pb-2 px-3"
        style="border-color: rgba(155, 155, 155, 0.6)">
        <legend class="heading h4 mx-2 px-2 text-accent">
          {{ (item as any).Name }}
        </legend>
        <mech-system-card :key="(item as any).ID"
          :owner="owner"
          :item="<any>item"
          :mech="mech"
          :encounter-instance="encounterInstance"
          @deploy="$emit('deploy', $event)" />
      </fieldset>
    </template>
  </cc-masonry-grid>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { Mech } from '@/classes/mech/Mech'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import ShLockCard from '@/features/pilot_management/_components/loadout/mech_loadout/components/mount/_ShLockCard.vue';
import MechSystemCard from './_mechSystemCard.vue';
import MechWeaponCard from './_mechWeaponCard.vue';
import MechMountBonusCard from './_mechMountBonusCard.vue';

const _display = useDisplay()

const props = defineProps<{
  mech: Mech
  encounterInstance: EncounterInstance
  owner: CombatantData
}>()

const emit = defineEmits<{
  'deploy': []
}>()

const xlColumns = computed(() => {
      if (mobile.value) return 1
      else return props.encounterInstance.MaxMasonryColumns
    })
const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
const systems = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.AllActiveSystems;
    })
const mounts = computed(() => {
      const items = [] as {
        mount: any;
        isIntegrated: boolean;
        isIntWeapon: boolean;
        isImpArm: boolean;
        isSuperheavy: boolean;
      }[];

      props.mech.MechLoadoutController.ActiveLoadout.IntegratedMounts.forEach((im) => {
        items.push({
          mount: im,
          isIntegrated: true,
          isIntWeapon: false,
          isImpArm: false,
          isSuperheavy: false,
        });
      });

      if (props.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'))
        items.push({
          mount: props.mech.MechLoadoutController.ActiveLoadout.IntegratedWeaponMount,
          isIntegrated: false,
          isIntWeapon: true,
          isImpArm: false,
          isSuperheavy: false,
        });

      if (props.mech.MechLoadoutController.ActiveLoadout.EquippableMounts.length < 3) {
        if (props.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting'))
          items.push({
            mount: props.mech.MechLoadoutController.ActiveLoadout.SuperheavyMount,
            isIntegrated: false,
            isIntWeapon: false,
            isImpArm: false,
            isSuperheavy: true,
          });
        else if (props.mech.Pilot.has('CoreBonus', 'cb_improved_armament'))
          items.push({
            mount: props.mech.MechLoadoutController.ActiveLoadout.ImprovedArmamentMount,
            isIntegrated: false,
            isIntWeapon: false,
            isImpArm: true,
            isSuperheavy: false,
          });
      }

      for (const m of props.mech.MechLoadoutController.ActiveLoadout.EquippableMounts) {
        // if (m.Bonuses.some((b) => b.ID === 'cb_mount_retrofitting')) continue;
        items.push({
          mount: m,
          isIntegrated: false,
          isIntWeapon: false,
          isImpArm: false,
          isSuperheavy: false,
        });
      }

      return items;
    })
</script>
