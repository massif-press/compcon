import type { Manufacturer } from '@/classes/Manufacturer';
import { i18n } from '@/i18n'

export function getChartAxes(itemType: string, opts: { includeSize?: boolean; heatCapKey?: string } = {}) {
  const { includeSize = false, heatCapKey = 'heatcap' } = opts;
  switch (itemType) {
    case 'Frame': {
      const axes = [
        { title: 'HP', value: 'hp' },
        { title: i18n.global.t('stats.evasion'), value: 'evasion' },
        { title: i18n.global.t('stats.armor'), value: 'armor' },
        { title: i18n.global.t('ui.titles.eDefense'), value: 'edef' },
        { title: i18n.global.t('ui.titles.heatCapacity'), value: 'heatcap' },
        { title: i18n.global.t('ui.titles.repairCapacity'), value: 'repcap' },
        { title: i18n.global.t('stats.sensors'), value: 'sensor_range' },
        { title: i18n.global.t('common.techAttack'), value: 'tech_attack' },
        { title: i18n.global.t('common.save'), value: 'save' },
        { title: i18n.global.t('stats.speed'), value: 'speed' },
        { title: i18n.global.t('common.systemPoints'), value: 'sp' },
      ];
      if (includeSize) axes.push({ title: i18n.global.t('ui.titles.size'), value: 'size' });
      return axes;
    }
    case 'PilotArmor':
      return [
        { title: i18n.global.t('stats.armor'), value: 'armor' },
        { title: i18n.global.t('common.hpBonus'), value: 'hp' },
        { title: i18n.global.t('ui.titles.eDefense'), value: 'edef' },
        { title: i18n.global.t('stats.evasion'), value: 'evasion' },
        { title: i18n.global.t('stats.speed'), value: 'speed' },
      ];
    case 'PilotWeapon':
      return [
        { title: i18n.global.t('ui.titles.range'), value: 'range' },
        { title: i18n.global.t('ui.titles.totalDamage'), value: 'damage' },
      ];
    case 'NpcClass':
      return [
        { title: i18n.global.t('ui.titles.hull'), value: 'hull' },
        { title: i18n.global.t('stats.agility'), value: 'agi' },
        { title: i18n.global.t('stats.systems'), value: 'sys' },
        { title: i18n.global.t('stats.engineering'), value: 'eng' },
        { title: i18n.global.t('stats.armor'), value: 'armor' },
        { title: 'HP', value: 'hp' },
        { title: i18n.global.t('ui.titles.heatcap'), value: heatCapKey },
        { title: i18n.global.t('ui.titles.evade'), value: 'evasion' },
        { title: i18n.global.t('ui.titles.eDefense'), value: 'edef' },
        { title: i18n.global.t('stats.speed'), value: 'speed' },
        { title: i18n.global.t('common.sensorRange'), value: 'sensorRange' },
        { title: i18n.global.t('ui.titles.saveTarget'), value: 'saveTarget' },
      ];
    default:
      return [
        { title: i18n.global.t('ui.titles.range'), value: 'range' },
        { title: i18n.global.t('ui.titles.totalDamage'), value: 'damage' },
        { title: i18n.global.t('ui.titles.threat'), value: 'threat' },
        { title: i18n.global.t('ui.titles.thrown'), value: 'thrown' },
        { title: i18n.global.t('ui.titles.line'), value: 'line' },
        { title: i18n.global.t('ui.titles.blast'), value: 'blast' },
        { title: i18n.global.t('ui.titles.burst'), value: 'burst' },
        { title: i18n.global.t('ui.titles.cone'), value: 'cone' },
        { title: i18n.global.t('ui.titles.kineticDamage'), value: 'kineticDamage' },
        { title: i18n.global.t('ui.titles.energyDamage'), value: 'energyDamage' },
        { title: i18n.global.t('ui.titles.heatDamage'), value: 'heatDamage' },
        { title: i18n.global.t('ui.titles.explosiveDamage'), value: 'explosiveDamage' },
        { title: i18n.global.t('ui.titles.variableDamage'), value: 'variableDamage' },
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
