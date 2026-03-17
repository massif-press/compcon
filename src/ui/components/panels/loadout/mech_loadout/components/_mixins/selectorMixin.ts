import { flavorID } from '@/io/Generators'
import { Bonus } from '@/classes/components/feature/bonus/Bonus'
import { Mech } from '@/class'

export const selectorMixin = {
  data: () => ({
    showUnlicensed: false,
    showOverSP: false,
  }),
  mounted() {
    this.options.initialView = this.$vuetify.display.smAndDown ? 'list' : 'single'
  },
  methods: {
    fID(template: string): string {
      return flavorID(template)
    },
    filterByLcp(items: any[]): any[] {
      if (!this.mech.Parent.LcpConfig) return items
      return items.filter(
        x =>
          !x.InLcp ||
          this.mech.Parent.LcpConfig?.packList.some(y => y.packID === x.Brew.LcpId) ||
          this.mech.Parent.LcpConfig?.packList.some(y => y.packName === x.Brew.LcpName)
      )
    },
    isLicensed(x: any): boolean {
      return !x.LicenseLevel || this.mech.Pilot.has('License', x.License, x.LicenseLevel)
    },
    isAICapacityFull(): boolean {
      return (
        this.mech.MechLoadoutController.ActiveLoadout.AICount >=
        1 + Bonus.get('ai_cap', this.mech as Mech)
      )
    },
  },
}
