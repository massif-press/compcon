<template>
  <cc-modal
    v-model="dialog"
    width="50vw"
    shrink
    icon="cc:role_striker"
    title="Select Bracing Mount">
    <v-card-text class="text-center pt-0">
      <span class="text-cc-overline">{{ $t('pm.loadout.processINTERRUPTAUTHORIZATIONREQUIRED') }}</span>
      <div class="flavor-text">
        <span style="opacity: 0.4">{{ $t('pm.loadout.compCON') }}&nbsp;</span>
        <span>
          {{ $t('pm.loadout.lancerSuperheavyClassArmamentRequiresTwo') }}
          <span class="text-accent">{{ $t('pm.loadout.bracingMount') }}</span>
          {{ $t('pm.loadout.thisBracingMountWillBeNot') }}
        </span>
      </div>
      <div class="heading">
        <cc-button
          v-for="(m, index) in availableMounts"
          :key="`mount-${index}`"
          x-large
          block
          variant="outlined"
          color="accent"
          class="my-2"
          @click="$emit('select', m)">
          {{ m.Name }}
        </cc-button>
      </div>
      <div v-if="superheavySelect">
        <i>{{ $t('pm.loadout.theSUPERHEAVYMOUNTINGCoreBonusRequires') }}</i>
      </div>
    </v-card-text>
  </cc-modal>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { computed, ref } from 'vue'
import EquippableMount from '@/classes/mech/components/mount/EquippableMount'
import { MountType } from '@/classes/enums'

defineOptions({ name: 'sh-lock-dialog' })

const props = defineProps<{
  mech: Mech
  mount: object
}>()

const dialog = ref(false)

const availableMounts = computed(() => {
      let candidates = props.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        props.mech.Pilot.has('corebonus', 'cb_improved_armament'),
        false
      ) as EquippableMount[];
      if (superheavySelect.value) {
        candidates = props.mech.MechLoadoutController.ActiveLoadout.Mounts.filter(
          (m) => m.Type === MountType.Heavy
        );
      }
      return candidates.filter((x) => x.Name !== props.mount.Name);
    })
const superheavySelect = computed(() => {
      return (
        props.mech.Pilot.has('corebonus', 'cb_superheavy_mounting') &&
        props.mech.MechLoadoutController.ActiveLoadout.Mounts.some(
          (m) => m.Type === MountType.Heavy
        ) &&
        props.mount.Type !== MountType.Heavy
      );
    })

function show() {
      dialog.value = true;
    }
function hide() {
      dialog.value = false;
    }
</script>
