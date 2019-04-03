import io from '../store/data_io'

var rules = io.loadData('rules')
var frames = io.loadData('frames')
var armor = io.loadData('pilot_gear').filter(x => x.type === 'armor')
var systems = io.loadData('systems')
var weapons = io.loadData('weapons')
var mods = io.loadData('mods')

function addLicenseRequirement (item, reqArray) {
  if (item.source === 'GMS') {
    var gmsIdx = reqArray.findIndex(x => x.name === 'GMS')
    if (gmsIdx > -1) {
      reqArray[gmsIdx].items.push(item.name)
    } else {
      reqArray.push({ name: 'GMS', rank: 0, items: [item.name] })
    }
  } else {
    var licenseIndex = reqArray.findIndex(x => x.name === `${item.source} ${item.license}` && x.rank === item.license_level)
    if (licenseIndex > -1) {
      reqArray[licenseIndex].items.push(item.name)
    } else {
      reqArray.push({ name: `${item.source} ${item.license}`, rank: item.license_level, items: [item.name] })
    }
  }
  return reqArray
}

export default {
  mechStats (pilot, config, loadout) {
    var frame = frames.find(x => x.id === config.frame_id)

    var grit = Math.ceil(pilot.level / 2)

    var output = {
      structure: rules.base_structure + (frame.stats.structuremod || 0),
      hull: pilot.mechSkills.hull,
      agi: pilot.mechSkills.agi,
      sys: pilot.mechSkills.sys,
      eng: pilot.mechSkills.eng,
      hp: (pilot.mechSkills.hull * 2) + frame.stats.hp + grit,
      sp: frame.stats.sp + grit + Math.floor(pilot.mechSkills.sys / 2),
      used_sp: 0,
      armor: frame.stats.armor,
      save_target: frame.stats.save + grit,
      repcap: frame.stats.repcap + Math.floor(pilot.mechSkills.hull / 2),
      evasion: frame.stats.evasion + pilot.mechSkills.agi,
      speed: frame.stats.speed + Math.floor(pilot.mechSkills.agi / 2),
      sensor_range: frame.stats.sensor_range,
      edef: frame.stats.edef + pilot.mechSkills.sys,
      heatcap: frame.stats.heatcap + pilot.mechSkills.eng,
      heatstress: rules.base_stress + (frame.stats.stressmod || 0),
      limited_bonus: Math.floor(pilot.mechSkills.eng / 2),
      attack_bonus: grit,
      tech_attack: frame.stats.tech_attack + pilot.mechSkills.sys,
      grapple: rules.base_grapple,
      ram: rules.base_ram,
      save_bonus: grit,
      integrated_mounts: [],
      integrated_systems: [],
      required_licenses: []
    }

    // add frame to required licenses
    output.required_licenses.push(frame.name === 'EVEREST'
      ? {name: 'GMS', rank: 0, items: ['EVEREST Frame']}
      : {name: `${frame.source} ${frame.name}`, rank: 2, items: [`${frame.name.toUpperCase()} Frame`]}
    )

    if (loadout) {
      for (let i = 0; i < loadout.systems.length; i++) {
        var sys = systems.find(x => x.id === loadout.systems[i].id)
        output.used_sp += sys.sp || 0
        output.required_licenses = addLicenseRequirement(sys, output.required_licenses)
      }
      for (let i = 0; i < loadout.mounts.length; i++) {
        for (let j = 0; j < loadout.mounts[i].weapons.length; j++) {
          var w = weapons.find(x => x.id === loadout.mounts[i].weapons[j].id)
          output.used_sp += w && w.sp ? w.sp : 0
          if (w) output.required_licenses = addLicenseRequirement(w, output.required_licenses)
          if (loadout.mounts[i].weapons[j].mod) {
            var m = mods.find(x => x.id === loadout.mounts[i].weapons[j].mod)
            output.used_sp += m.sp
            output.required_licenses = addLicenseRequirement(m, output.required_licenses)
          }
        }
      }
    }

    // mark licenses missing on pilot
    for (var i = 0; i < output.required_licenses.length; i++) {
      if (output.required_licenses[i].name === 'GMS') continue
      output.required_licenses[i].missing = !pilot.licenses.find(x => `${x.source} ${x.name}` === output.required_licenses[i].name || x.level < output.required_licenses[i].rank)
    }
    output.required_licenses.sort(
      function (a, b) {
        return (a.rank < b.rank) ? -1 : (a.rank > b.rank) ? 1 : 0
      }
    )

    // system personalizations adds +2 hp
    if (loadout && loadout.systems && loadout.systems.find(x => x.id === 'personalizations')) output.hp += 2

    // fomorian frame reinforcement core bonus adds size (up to 3)
    if (pilot.core_bonuses.includes('fomorian')) {
      if (frame.size === 0.5) output.size = 1
      else if (frame.size < 3) output.size++
    }

    // ipsn reinforced frame core bonus adds 5 hp
    if (pilot.core_bonuses.includes('frame')) output.hp += 5

    // ipsn sloped plating core bonus adds 1 armor, up to 4
    if (pilot.core_bonuses.includes('plating') && output.armor < 4) output.armor += 1

    // ssc full subjectivity sync adds 2 evasion
    if (pilot.core_bonuses.includes('fssync')) output.evasion += 2

    // horus open door adds +2 save
    if (pilot.core_bonuses.includes('opendoor')) output.save_target += 2

    // horus open door adds +2 edef
    if (pilot.core_bonuses.includes('disbelief')) output.edef += 2

    // ha superior by design core bonus adds 2 heatcap
    if (pilot.core_bonuses.includes('superior')) output.heatcap += 2

    // ha ammofeeds adds a +1 bonus to limited items
    if (pilot.core_bonuses.includes('ammofeeds')) output.limited_bonus += 2

    // talent:armsman adds ammo case item
    if (pilot.talents.find(x => x.id === 'armsman')) output.integrated_systems.push(`armsman${pilot.talents.find(x => x.id === 'armsman').rank}`)

    // talent:technophile adds custom ai item
    if (pilot.talents.find(x => x.id === 'techno')) output.integrated_systems.push(`techno${pilot.talents.find(x => x.id === 'techno').rank}`)

    // talent:engineer adds prototype weapon
    if (pilot.talents.find(x => x.id === 'eng')) output.integrated_mounts.push(`prototype${pilot.talents.find(x => x.id === 'eng').rank}`)

    // talent:nuclear cavalier rank 3 adds fuel rod gun
    if (pilot.talents.find(x => x.id === 'ncavalier') && pilot.talents.find(x => x.id === 'ncavalier').rank === 3) output.integrated_mounts.push('fuelrod')

    return output
  },
  pilotStats (pilot, loadout) {
    var output = {
      hp: rules.base_pilot_hp + Math.ceil(pilot.level / 2),
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
  },
  limitedBonus (pilot) {
    var bonus = 0
    if (pilot.core_bonuses.includes('ammofeeds')) bonus += 2
    bonus += Math.floor(pilot.mechSkills.eng / 2)
    return bonus
  }
}
