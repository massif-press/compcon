/**
 * desc here
 * @module stats
 */

import io from '../store/data_io'

var rules = io.loadData('rules')
var frames = io.loadData('frames')
var armor = io.loadData('pilot_gear').filter(x => x.type === 'armor')

export default {
  /**
   * export default doc examples
   * @alias module:mechStats
   */
  mechStats (pilot, config, loadout) {
    var frame = frames.find(x => x.id === config.frame_id)

    var grit = Math.ceil(pilot.level / 2)

    var output = {
      structure: rules.base_structure,
      hull: pilot.mechSkills.hull,
      agi: pilot.mechSkills.agi,
      sys: pilot.mechSkills.sys,
      eng: pilot.mechSkills.eng,
      hp: (pilot.mechSkills.hull * 2) + frame.stats.hp + grit,
      sp: frame.stats.sp + grit + Math.floor(pilot.mechSkills.sys / 2),
      armor: frame.stats.armor,
      save_target: frame.stats.save + grit,
      repcap: frame.stats.repcap + Math.floor(pilot.mechSkills.hull / 2),
      evasion: frame.stats.evasion + pilot.mechSkills.agi,
      speed: frame.stats.speed + Math.floor(pilot.mechSkills.agi / 2),
      sensor_range: frame.stats.sensor_range + pilot.mechSkills.sys,
      edef: frame.stats.edef + pilot.mechSkills.sys,
      heatcap: frame.stats.heatcap + pilot.mechSkills.eng,
      heatstress: rules.base_stress,
      limited_bonus: Math.floor(pilot.mechSkills.sys / 2),
      attack_bonus: grit,
      tech_attack: frame.stats.tech_attack + pilot.mechSkills.sys,
      grapple: rules.base_grapple,
      ram: rules.base_ram,
      save_bonus: grit
    }

    // system personalizations adds +2 hp
    if (loadout && loadout.systems.find(x => x.id === 'personalizations')) output.hp += 2

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
        hull: pilot.mechSkills.hull,
        agi: pilot.mechSkills.agi,
        sys: pilot.mechSkills.sys,
        eng: pilot.mechSkills.eng
      }
    }

    if (loadout && loadout.items) {
      for (var i = 0; i < loadout.items.armor.length; i++) {
        if (!loadout.items.armor[i]) continue

        var e = armor.find(x => x.id === loadout.items.armor[i].id)

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
    }

    return output
  }
}
