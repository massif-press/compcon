// Shared composable for common active effect input logic
import { ref, computed } from 'vue';
import { Damage } from '@/classes/Damage';

export function useActiveEffectInput(initialEffect, targets) {
  const selectedTargets = ref([null]);
  const targetSaves = ref([null]);
  const aoe = ref(false);

  const filteredTargets = computed(() => {
    return targets.value.filter((t) => !selectedTargets.value.includes(t));
  });

  const aoeIcon = computed(() => {
    let aoeValue = aoe.value;
    if (typeof aoeValue === 'boolean') {
      aoeValue = aoeValue ? 'true' : 'false';
    }
    return Damage.getAoeIcon(aoeValue);
  });

  const isReady = computed(() => {
    return (
      selectedTargets.value.every((t) => t != null) &&
      (!initialEffect.value?.Save || targetSaves.value.every((s) => s != null && s > 0))
    );
  });

  const reset = (effect) => {
    selectedTargets.value = [null];
    targetSaves.value = [null];
    aoe.value = effect?.AoE || false;
  };

  const toggleAoe = (effectAoE) => {
    if (aoe.value) {
      aoe.value = false;
    } else {
      aoe.value = effectAoE || true;
    }
    if (!aoe.value) {
      selectedTargets.value = [selectedTargets.value[0]];
      targetSaves.value = [targetSaves.value[0]];
    }
  };

  const addTarget = () => {
    selectedTargets.value.push(null);
    targetSaves.value.push(null);
  };

  const cancelTarget = (idx) => {
    if (idx === 0 && selectedTargets.value.length === 1) {
      selectedTargets.value = [null];
      targetSaves.value = [null];
      return;
    }
    selectedTargets.value.splice(idx, 1);
    targetSaves.value.splice(idx, 1);
  };

  return {
    selectedTargets,
    targetSaves,
    aoe,
    filteredTargets,
    aoeIcon,
    isReady,
    reset,
    toggleAoe,
    addTarget,
    cancelTarget,
  };
}

export function useSaveRolling(owner, targetSaves, selectedTargets) {
  const saveTarget = computed(() => {
    return owner.value?.CombatController?.SaveTarget || 10;
  });

  const rollSave = (idx, saveStat) => {
    const target = selectedTargets.value[idx];
    if (!target) {
      targetSaves.value[idx] = 0;
      return;
    }

    const bonus = target.actor.CombatController.getSavingThrowBonus(saveStat);
    const roll = Math.floor(Math.random() * 20) + 1;
    targetSaves.value[idx] = roll + bonus;
  };

  const overrideSave = (idx) => {
    if (targetSaves.value[idx] == null) return;
    if (targetSaves.value[idx] < saveTarget.value) {
      targetSaves.value[idx] = 20;
    } else {
      targetSaves.value[idx] = 1;
    }
  };

  return {
    saveTarget,
    rollSave,
    overrideSave,
  };
}
