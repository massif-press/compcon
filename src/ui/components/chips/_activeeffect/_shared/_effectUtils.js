// Shared utilities for active effect operations
export function createSummaryText(action, target, details = '', saveInfo = null) {
  if (!target || !target.actor || !target.actor.CombatController) return '';

  let part = `${action} ${details} ${target.actor.CombatController.Name}`;

  if (saveInfo) {
    if (saveInfo.saveResult != null) {
      if (saveInfo.saveResult >= saveInfo.saveTarget) {
        part += ` [SAVED]`;
        if (saveInfo.onSaveSuccess) {
          part = saveInfo.onSaveSuccess(part);
        } else {
          part = part.replace(
            action.split(' ')[0],
            `Failed to ${action.split(' ')[0].toLowerCase()}`
          );
        }
      } else {
        part += ` [FAILED SAVE]`;
      }
    }
  }

  return part;
}

export function validateTarget(target) {
  return target && target.actor && target.actor.CombatController;
}

export function shouldSkipTarget(target, saveResult, saveTarget, hasSave) {
  if (!validateTarget(target)) return true;
  if (hasSave && saveResult != null && saveResult >= saveTarget) return true;
  return false;
}

export function generateBaseSummary(selectedTargets, createSummaryFn) {
  let summaries = [];
  selectedTargets.forEach((target, idx) => {
    if (!validateTarget(target)) return;
    const summary = createSummaryFn(target, idx);
    if (summary) summaries.push(summary);
  });
  summaries = summaries.filter((s) => s && s.trim().length > 0);
  return summaries.length > 0 ? summaries.join('; ') : '';
}

export function executeBaseApply(selectedTargets, targetSaves, saveTarget, hasSave, applyFn) {
  selectedTargets.forEach((target, idx) => {
    if (shouldSkipTarget(target, targetSaves[idx], saveTarget, hasSave)) return;
    applyFn(target, idx);
  });
}
