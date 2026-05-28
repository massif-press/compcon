import type { Ref } from 'vue'

export function useEquipmentActions(item: Ref<any>, emit: (event: 'deploy', deployable: any) => void) {
  function handleActivation(cost: number) {
    if (cost && item.value.MaxUses) {
      item.value.Uses = (item.value.Uses || 0) + cost
    }
  }

  function handleRefund(cost: number) {
    if (cost && item.value.MaxUses) {
      item.value.Uses = (item.value.Uses || 0) - cost
    }
    if (item.value.Uses < 0) item.value.Uses = 0
  }

  function handleDeploy(deployable: any) {
    if (item.value.MaxUses) {
      item.value.Uses = (item.value.Uses || 0) + (deployable.Cost || 1)
    }
    const inst = deployable.Instances || 1
    for (let index = 0; index < inst; index++) {
      emit('deploy', deployable)
    }
  }

  return { handleActivation, handleRefund, handleDeploy }
}
