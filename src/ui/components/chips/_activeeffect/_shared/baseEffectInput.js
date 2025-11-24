import {
  generateBaseSummary,
  executeBaseApply,
  createSummaryText,
  validateTarget,
} from './_effectUtils.js';

// Base composable for active effect input components
export function useActiveEffectBase(props) {
  const data = {
    selectedTargets: [],
    targetSaves: [],
    aoe: null,
  };

  const mounted = function () {
    this.reset();
  };

  const computed = {
    isReady() {
      return (
        this.selectedTargets.every((t) => t != null) &&
        (!this.getSaveData?.() || this.targetSaves.every((s) => s != null && s > 0))
      );
    },
  };

  const methods = {
    reset() {
      this.selectedTargets = [null];
      if (this.self) this.selectedTargets = [this.targets[0]];
      this.targetSaves = [null];
      this.aoe = this.getAoeValue?.() || false;
      this.resetCustomFields?.();
    },

    toggleAoe() {
      const effectAoe = this.getAoeValue?.();
      if (this.aoe) {
        this.aoe = false;
      } else {
        this.aoe = effectAoe || true;
      }
      if (!this.aoe) {
        this.selectedTargets = [this.selectedTargets[0]];
        this.targetSaves = [this.targetSaves[0]];
      }
    },

    addTarget() {
      this.selectedTargets.push(null);
      this.targetSaves.push(null);
    },

    cancelTarget(idx) {
      if (idx === 0 && this.selectedTargets.length === 1) {
        this.selectedTargets = [null];
        this.targetSaves = [null];
        return;
      }
      this.selectedTargets.splice(idx, 1);
      this.targetSaves.splice(idx, 1);
    },

    getSummary() {
      return generateBaseSummary(this.selectedTargets, (target, idx) => {
        return this.createTargetSummary(target, idx);
      });
    },

    apply() {
      const saveData = this.getSaveData?.();
      const saveTarget = this.owner?.CombatController?.SaveTarget;

      executeBaseApply(
        this.selectedTargets,
        this.targetSaves,
        saveTarget,
        !!saveData,
        (target, idx) => {
          this.applyToTarget(target, idx);
        }
      );
    },

    createTargetSummary(target, idx) {
      throw new Error('createTargetSummary must be implemented by component');
    },

    applyToTarget(target, idx) {
      throw new Error('applyToTarget must be implemented by component');
    },

    getAoeValue() {
      return false;
    },

    getSaveData() {
      return null;
    },

    resetCustomFields() {
      // override
    },

    getData() {
      return {
        AoE: this.aoe,
        Targets: this.selectedTargets.map((t) => (t ? t.actor.Id : null)),
        Saves: this.getSaveData() ? this.targetSaves.map((s) => (s != null ? s : 0)) : null,
      };
    },
  };

  return {
    data: () => data,
    mounted,
    computed,
    methods,
  };
}
