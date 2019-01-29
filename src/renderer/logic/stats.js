/**
 * desc here
 * @module stats
 */

import io from '../store/data_io'

var rules = io.loadData('rules')
var frames = io.loadData('frames')
var armor = io.loadData('pilot_gear').armor

export default {
  /**
   * export default doc examples
   * @alias module:mechStats
   */
  mechStats (pilot, config) {
    var frame = frames.find(x => x.id === config.frame_id)

    var output = {
      structure: rules.base_structure,
      hull: pilot.core.mech.hull,
      agi: pilot.core.mech.agi,
      sys: pilot.core.mech.sys,
      eng: pilot.core.mech.eng,
      hp: (pilot.core.mech.hull * 2) + frame.stats.hp + pilot.core.grit,
      sp: frame.stats.sp + pilot.core.grit,
      armor: frame.stats.armor,
      repcap: frame.stats.repcap + Math.floor(pilot.core.mech.hull / 2),
      evasion: frame.stats.evasion + pilot.core.mech.agi,
      speed: frame.stats.evasion + Math.floor(pilot.core.mech.agi / 2),
      sensor_range: frame.stats.sensor_range + pilot.core.mech.sys,
      edef: frame.stats.edef + pilot.core.mech.sys,
      heatcap: frame.stats.heatcap + pilot.core.mech.eng,
      heatstress: rules.base_stress,
      limited_bonus: Math.floor(pilot.core.mech.sys / 2),
      attack_bonus: pilot.core.grit,
      tech_attack: frame.stats.tech_attack + pilot.core.mech.sys,
      grapple: rules.base_grapple,
      ram: rules.base_ram
    }

    // system personalizations adds +2 hp
    if (config.systems.find(x => x.id === 'personalizations')) output.hp += 2

    // fomorian frame reinforcement core bonus adds size (up to 3)
    if (pilot.core_bonuses.includes('fomorian') && frame.size < 3) output.size++

    // ipsn reinforced frame core bonus adds 5 hp
    if (pilot.core_bonuses.includes('frame')) output.hp += 5

    // ipsn sloped plating core bonus adds 1 armor, up to 4
    if (pilot.core_bonuses.includes('plating') && frame.armor < 4) output.armor += 1

    // horus open door adds 1 edef and 5 sensor range
    if (pilot.core_bonuses.includes('opendoor')) {
      output.edef += 1
      output.sensor_range += 5
    }

    // ha stasis shielding adds 2 repcap
    if (pilot.core_bonuses.includes('stasis')) output.repcap += 2

    // ha superior by design core bonus adds 2 heatcap
    if (pilot.core_bonuses.includes('superior')) output.heatcap += 2

    // ha ammofeeds adds a +1 bonus to limited items
    if (pilot.core_bonuses.includes('ammofeeds')) output.limited_bonus += 1

    return output
  },
  /**
   * export default doc examples
   * @alias module:pilot.core
   */
  pilotStats (pilot, loadout) {
    var output = {
      hp: rules.base_pilot_hp,
      armor: 0,
      evasion: rules.base_pilot_evasion,
      edef: rules.base_pilot_edef,
      speed: rules.base_pilot_speed,
      grit: Math.ceil(pilot.level / 2),
      mech: {
        hull: pilot.core.hull,
        agi: pilot.core.agi,
        sys: pilot.core.sys,
        eng: pilot.core.eng
      }
    }

    for (var i = 0; i < loadout.gear.length; i++) {
      var e = armor.find(x => x.id === loadout.gear[i])
      if (e) {
        if (e.armor) output.armor += e.armor
        if (e.edef) output.edef = e.edef
        if (e.evasion) output.evasion = e.evasion
        if (e.evasion_bonus) output.evasion += e.evasion_bonus
        if (e.speed) output.speed = e.speed
        if (e.speed_bonus) output.speed += e.speed_bonus
        if (e.hp_bonus) output.hp += e.hp_bonus
      }
    }

    return output
  }
}
