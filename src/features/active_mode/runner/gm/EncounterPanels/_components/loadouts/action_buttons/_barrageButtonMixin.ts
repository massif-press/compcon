export const barrageButtonMixin = {
  created(this: any) {
    this.reset();
  },
  methods: {
    reset(this: any, clearAction = false) {
      if (clearAction) this.owner.CombatController.ClearActionUsed(this.action.ID);
      this.selectedWeapons = new Array(2);
      this.events = new Array(2);
      if (!this.selectedWeapons[0] && this.presetWeapon) {
        this.setSelected(0, this.presetWeapon);
      }
    },
    apply(this: any) {
      const actor = this.owner.actor.CombatController.ActiveActor.CombatController;
      this.selectedWeapons.forEach((w: any) => {
        actor.MarkActionUsed(w.InstanceID);
        if (w.IsLoading) w.Used = true;
      });
      this.reset();
    },
  },
};
