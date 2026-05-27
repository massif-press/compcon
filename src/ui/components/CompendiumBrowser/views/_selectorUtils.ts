import type { Manufacturer } from '@/classes/Manufacturer';

export function getChartAxes(itemType: string, opts: { includeSize?: boolean; heatCapKey?: string } = {}) {
  const { includeSize = false, heatCapKey = 'heatcap' } = opts;
  switch (itemType) {
    case 'Frame': {
      const axes = [
        { title: 'HP', value: 'hp' },
        { title: 'Evasion', value: 'evasion' },
        { title: 'Armor', value: 'armor' },
        { title: 'E-Defense', value: 'edef' },
        { title: 'Heat Capacity', value: 'heatcap' },
        { title: 'Repair Capacity', value: 'repcap' },
        { title: 'Sensors', value: 'sensor_range' },
        { title: 'Tech Attack', value: 'tech_attack' },
        { title: 'Save', value: 'save' },
        { title: 'Speed', value: 'speed' },
        { title: 'System Points', value: 'sp' },
      ];
      if (includeSize) axes.push({ title: 'Size', value: 'size' });
      return axes;
    }
    case 'PilotArmor':
      return [
        { title: 'Armor', value: 'armor' },
        { title: 'HP Bonus', value: 'hp' },
        { title: 'E-Defense', value: 'edef' },
        { title: 'Evasion', value: 'evasion' },
        { title: 'Speed', value: 'speed' },
      ];
    case 'PilotWeapon':
      return [
        { title: 'Range', value: 'range' },
        { title: 'Total Damage', value: 'damage' },
      ];
    case 'NpcClass':
      return [
        { title: 'Hull', value: 'hull' },
        { title: 'Agility', value: 'agi' },
        { title: 'Systems', value: 'sys' },
        { title: 'Engineering', value: 'eng' },
        { title: 'Armor', value: 'armor' },
        { title: 'HP', value: 'hp' },
        { title: 'HeatCap', value: heatCapKey },
        { title: 'Evade', value: 'evasion' },
        { title: 'E-Defense', value: 'edef' },
        { title: 'Speed', value: 'speed' },
        { title: 'Sensor Range', value: 'sensorRange' },
        { title: 'Save Target', value: 'saveTarget' },
      ];
    default:
      return [
        { title: 'Range', value: 'range' },
        { title: 'Total Damage', value: 'damage' },
        { title: 'Threat', value: 'threat' },
        { title: 'Thrown', value: 'thrown' },
        { title: 'Line', value: 'line' },
        { title: 'Blast', value: 'blast' },
        { title: 'Burst', value: 'burst' },
        { title: 'Cone', value: 'cone' },
        { title: 'Kinetic Damage', value: 'kineticDamage' },
        { title: 'Energy Damage', value: 'energyDamage' },
        { title: 'Heat Damage', value: 'heatDamage' },
        { title: 'Explosive Damage', value: 'explosiveDamage' },
        { title: 'Variable Damage', value: 'variableDamage' },
      ];
  }
}

export function findManufacturer(manufacturers: Manufacturer[], id: string) {
  return (
    manufacturers.find((x) => x.ID === id) || {
      GetColor: () => 'black',
      Name: 'err',
      LogoIsExternal: false,
      Icon: 'gms',
    }
  );
}
