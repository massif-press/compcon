import type { Ref } from 'vue'
import { useUserData } from '@/ui/providers'

export interface CompendiumViewStateInput {
  viewKey: () => string
  view: Ref<string>
  group: Ref<string>
  showNav: Ref<boolean>
  otherFilter: Ref<Record<string, any>>
}

export function useCompendiumViewState(state: CompendiumViewStateInput) {
  const userData = useUserData()

  function saveView() {
    const key = state.viewKey()
    if (!key) return
    userData.User.SetView(key, {
      view: state.view.value,
      group: state.group.value,
      showNav: state.showNav.value,
      otherFilter: state.otherFilter.value,
    })
  }

  function loadView() {
    const key = state.viewKey()
    if (!key) return
    const saved = userData.User.View(key, null)
    if (!saved) return
    if (saved.view !== undefined) state.view.value = saved.view
    if (saved.group !== undefined) state.group.value = saved.group
    if (saved.showNav !== undefined) state.showNav.value = saved.showNav
    if (saved.otherFilter !== undefined) state.otherFilter.value = saved.otherFilter
  }

  return { saveView, loadView }
}
