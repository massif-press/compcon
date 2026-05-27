import { Rules } from '@/classes/utility/Rules';

export const trackableStatsMixin = {
  data: () => ({
    batteryIcons: [
      'mdi-battery-outline',
      'mdi-battery-low',
      'mdi-battery-medium',
      'mdi-battery-high',
    ],
    batteryIndex: 3,
  }),
  computed: {
    overchargeTrack(this: any) {
      return this.item.OverchangeTrack ? this.item.OverchangeTrack : Rules.Overcharge;
    },
  },
  methods: {
    getIcon(stat: string) {
      const icons: Record<string, string> = {
        structure: 'cc:structure',
        armor: 'mdi-shield-outline',
        hp: 'mdi-heart-outline',
        reactor: 'cc:reactor',
        heat: 'cc:heat',
        repair: 'cc:repair',
        techAttack: 'cc:quick_tech',
      };
      return icons[stat];
    },
    drainBattery(this: any) {
      if (this.batteryIndex > 0) {
        this.item.CombatController.CorePower = false;
        const interval = setInterval(() => {
          this.batteryIndex--;
          if (this.batteryIndex === 0) clearInterval(interval);
        }, 60);
      } else {
        this.item.CombatController.CorePower = true;
        this.batteryIndex = 3;
      }
    },
  },
};
