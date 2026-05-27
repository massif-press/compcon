import { CompendiumStore } from '@/stores';
import { PilotEquipment } from '@/classes/pilot/components/Loadout/equipment/PilotEquipment';
import { flavorID } from '@/io/Generators';

export const PLCardMixin = {
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    extended: {
      type: Boolean,
      required: false,
    },
    readonly: {
      type: Boolean,
    },
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    allGear(this: any): PilotEquipment[] {
      if (!this.pilot.LcpConfig) return CompendiumStore().PilotGear as PilotEquipment[];
      return CompendiumStore().PilotGear.filter(
        (x: any) =>
          !x.InLcp ||
          this.pilot.LcpConfig?.packList.some((y: any) => y.packID === x.Brew?.LcpId) ||
          this.pilot.LcpConfig?.packList.some((y: any) => y.packName === x.Brew?.LcpName)
      ) as PilotEquipment[];
    },
  },
  methods: {
    fID(this: any, template: string): string {
      return flavorID(template);
    },
  },
};
