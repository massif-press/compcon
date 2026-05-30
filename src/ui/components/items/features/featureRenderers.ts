import type { Component } from 'vue'

export type FeatureType = 'action' | 'bonus' | 'deployable' | 'integrated'
export type DisplayMode = 'button' | 'hover' | 'panel' | 'popup'

import ActionButton from './actions/_actionButton.vue'
import ActionHover from './actions/_actionHover.vue'
import ActionPanel from './actions/_actionPanel.vue'
import ActionPopup from './actions/_actionPopup.vue'

import BonusChip from './bonuses/_bonusChip.vue'
import BonusBase from './bonuses/_bonusBase.vue'
import BonusPopup from './bonuses/_bonusPopup.vue'

import DeployableInfoHover from './deployables/_deployableInfoHover.vue'
import DeployableInfoPanel from './deployables/_deployableInfoPanel.vue'
import DeployableInfoPopup from './deployables/_deployableInfoPopup.vue'

import IntegratedInfoHover from './integrated/_integratedInfoHover.vue'
import IntegratedInfoPanel from './integrated/_integratedInfoPanel.vue'
import IntegratedInfoPopup from './integrated/_integratedInfoPopup.vue'

export const featureRenderers: Record<FeatureType, Record<DisplayMode, Component>> = {
  action: {
    button: ActionButton,
    hover: ActionHover,
    panel: ActionPanel,
    popup: ActionPopup,
  },
  bonus: {
    button: BonusChip,
    hover: BonusBase,
    panel: BonusBase,
    popup: BonusPopup,
  },
  deployable: {
    button: DeployableInfoPopup,
    hover: DeployableInfoHover,
    panel: DeployableInfoPanel,
    popup: DeployableInfoPopup,
  },
  integrated: {
    button: IntegratedInfoPopup,
    hover: IntegratedInfoHover,
    panel: IntegratedInfoPanel,
    popup: IntegratedInfoPopup,
  },
}

export function getFeatureRenderer(type: FeatureType, mode: DisplayMode): Component {
  return featureRenderers[type][mode]
}
