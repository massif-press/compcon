// Shared equipment action handlers for combat card components.
// Requires the host component to have an `item` prop and declare `deploy` in emits.
export const useEquipmentActions = {
  methods: {
    handleActivation(this: any, cost: number) {
      if (cost && this.item.MaxUses) {
        this.item.Uses = (this.item.Uses || 0) + cost
      }
    },
    handleRefund(this: any, cost: number) {
      if (cost && this.item.MaxUses) {
        this.item.Uses = (this.item.Uses || 0) - cost
      }
      if (this.item.Uses < 0) this.item.Uses = 0
    },
    handleDeploy(this: any, deployable: any) {
      if (this.item.MaxUses) {
        this.item.Uses = (this.item.Uses || 0) + deployable.Cost || 1
      }
      const inst = deployable.Instances || 1
      for (let index = 0; index < inst; index++) {
        this.$emit('deploy', deployable)
      }
    },
  },
}
