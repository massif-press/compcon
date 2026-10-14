import { UserStore } from '@/stores'

export type TurnWizardClosePolicy = 'ask' | 'keep' | 'undo'

export const TURN_WIZARD_CLOSE_POLICIES: TurnWizardClosePolicy[] = ['ask', 'keep', 'undo']

const CLOSE_POLICY_VIEW_KEY = 'turnWizardClosePolicy'

export function turnWizardClosePolicy(): TurnWizardClosePolicy {
  return UserStore().User.View(CLOSE_POLICY_VIEW_KEY, 'ask')
}

export function setTurnWizardClosePolicy(policy: TurnWizardClosePolicy): void {
  UserStore().User.SetView(CLOSE_POLICY_VIEW_KEY, policy)
}
