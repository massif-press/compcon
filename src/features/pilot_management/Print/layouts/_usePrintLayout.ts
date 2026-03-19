import { Pilot, Mech } from '@/class';

export const usePrintLayout = {
  props: {
    selectedPilot: {
      type: Pilot,
      required: false,
      default: null,
    },
    selectedMech: {
      type: Mech,
      required: false,
    },
    options: {
      type: Object,
      required: true,
    },
    hasBonds: {
      type: Boolean,
    },
  },
  computed: {
    showBondPrint(this: any) {
      if (!this.selectedPilot) return false;
      if (!this.hasBonds) return false;
      if (this.options.bonds.title === 'Omit') return false;
      return this.options.content.title === 'Blank' || this.selectedPilot.BondController.Bond;
    },
  },
};
