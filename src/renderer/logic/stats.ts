import io from '../store/data_io'
import { thisPilotGear } from '../data_interfaces/type_guards'

const rules: any = io.loadData('rules')

interface AppState {
  UserDataPath: '',
  Backgrounds: Background[],
  Talents: Talent[],
  Skills: any[],
  CoreBonuses: CoreBonus[],
  Frames: Frame[],
  Manufacturers: object[],
  MechWeapons: Weapon[],
  WeaponMods: WeaponMod[],
  MechSystems: System[],
  PilotGear: PilotItem[],
  Tags: Tag[],
  Statuses: Status[],
  Brews: object[],
  Licenses: PilotLicense[]
}

function addLicenseRequirement(item: CCItem, reqArray: LicenseReq[]): LicenseReq[] {
  if (item.source === 'GMS') {
    const gmsIdx = reqArray.findIndex((x) => x.name === 'GMS')
    if (gmsIdx > -1) {
      reqArray[gmsIdx].items.push(item.name)
    } else {
      reqArray.push({ name: 'GMS', rank: 0, items: [item.name] })
    }
  } else {
    const licenseIndex = reqArray.findIndex((x) => x.name === `${item.source} ${item.license}` && x.rank === item.license_level)
    if (licenseIndex > -1) {
      reqArray[licenseIndex].items.push(item.name)
    } else {
      reqArray.push({ name: `${item.source} ${item.license}`, rank: item.license_level, items: [item.name] })
    }
  }
  return reqArray
}

export default {
  mechStats(pilot: Pilot, config: MechConfig, loadout: MechLoadout, state: AppState): MechStats {
    const frames = state.Frames
    const systems = state.MechSystems
    const weapons = state.MechWeapons
    const mods = state.WeaponMods

    const frame = frames.find((x) => x.id === config.frame_id)
    if (!frame) { throw new Error('frame not found!') }

    const grit = Math.ceil(pilot.level / 2)

    const output: MechStats = {
      size: frame.stats.size,
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
      required_licenses: [],
    }

    // add frame to required licenses
    output.required_licenses.push(frame.name === 'EVEREST'
      ? { name: 'GMS', rank: 0, items: ['EVEREST Frame'] }
      : { name: `${frame.source} ${frame.name}`, rank: 2, items: [`${frame.name.toUpperCase()} Frame`] },
    )

    if (loadout) {
      if (loadout.systems && loadout.systems.length) {
        for (const loadoutSys of loadout.systems) {
          const sys = systems.find((x) => x.id === loadoutSys.id)
          if (sys) {
            output.used_sp += sys.sp || 0
            output.required_licenses = addLicenseRequirement(sys, output.required_licenses)
          }
        }
      }
      for (const mount of loadout.mounts) {
        for (const weapon of mount.weapons) {
          if (!weapon) { continue }
          const w = weapons.find((x) => x.id === weapon.id)
          if (w) {
            output.used_sp += w && w.sp ? w.sp : 0
            if (w) { output.required_licenses = addLicenseRequirement(w, output.required_licenses) }
            if (weapon.mod) {
              const m = mods.find((x) => x.id === weapon.mod)
              if (m) {
                output.used_sp += m.sp
                output.required_licenses = addLicenseRequirement(m, output.required_licenses)
              }
            }
          }
        }
      }
    }

    // mark licenses missing on pilot
    for (const licenseReq of output.required_licenses) {
      if (licenseReq.name === 'GMS') { continue }
      licenseReq.missing = !pilot.licenses.find((x) => `${x.source} ${x.name}` === licenseReq.name || x.level < licenseReq.rank)
    }
    output.required_licenses.sort(
      (a, b) => {
        return (a.rank < b.rank) ? -1 : (a.rank > b.rank) ? 1 : 0
      },
    )

    // system personalizations adds +2 hp
    if (loadout && loadout.systems && loadout.systems.length && loadout.systems.find((x) => x.id === 'personalizations')) { output.hp += 2 }

    // fomorian frame reinforcement core bonus adds size (up to 3)
    if (pilot.core_bonuses.includes('fomorian')) {
      if (frame.stats.size === 0.5) { output.size = 1 }
      else if (frame.stats.size < 3) { output.size = frame.stats.size + 1 }
    } else {
      output.size = frame.stats.size
    }

    // ipsn reinforced frame core bonus adds 5 hp
    if (pilot.core_bonuses.includes('frame')) { output.hp += 5 }

    // ipsn sloped plating core bonus adds 1 armor, up to 4
    if (pilot.core_bonuses.includes('plating') && output.armor < 4) { output.armor += 1 }

    // ssc full subjectivity sync adds 2 evasion
    if (pilot.core_bonuses.includes('fssync')) { output.evasion += 2 }

    // horus open door adds +2 save
    if (pilot.core_bonuses.includes('opendoor')) { output.save_target += 2 }

    // horus open door adds +2 edef
    if (pilot.core_bonuses.includes('disbelief')) { output.edef += 2 }

    // ha superior by design core bonus adds 2 heatcap
    if (pilot.core_bonuses.includes('superior')) { output.heatcap += 2 }

    // ha ammofeeds adds a +1 bonus to limited items
    if (pilot.core_bonuses.includes('ammofeeds')) { output.limited_bonus += 2 }

    // talent:armsman adds ammo case item
    const pilotArmsmanTalent = pilot.talents.find((x) => x.id === 'armsman')
    if (pilotArmsmanTalent) { output.integrated_systems.push(`armsman${pilotArmsmanTalent.rank}`) }

    // talent:technophile adds custom ai item
    const pilotTechnophileTalent = pilot.talents.find((x) => x.id === 'techno')
    if (pilotTechnophileTalent) { output.integrated_systems.push(`techno${pilotTechnophileTalent.rank}`) }

    // talent:engineer adds prototype weapon
    const pilotEngineerTalent = pilot.talents.find((x) => x.id === 'eng')
    if (pilotEngineerTalent) { output.integrated_mounts.push(`prototype${pilotEngineerTalent.rank}`) }

    // talent:nuclear cavalier rank 3 adds fuel rod gun
    const pilotNCavalierTalent = pilot.talents.find((x) => x.id === 'ncavalier')
    if (pilotNCavalierTalent && pilotNCavalierTalent.rank === 3) { output.integrated_mounts.push('fuelrod') }

    return output
  },
  pilotStats(pilot: Pilot, loadout: PilotLoadout, state: AppState): PilotStats {
    const armor = state.PilotGear.filter(thisPilotGear.isPilotArmor)

    const output = {
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
        eng: pilot.mechSkills.eng,
      },
    }

    if (loadout && loadout.items) {
      for (const myArmor of loadout.items.armor) {
        if (!myArmor) { continue }

        const e = armor.find((x) => {
          const curArmor = myArmor
          return (curArmor !== null) && x.id === curArmor.id
        })

        if (e) {
          if (e.armor) { output.armor += e.armor }
          if (e.edef) { output.edef = e.edef }
          if (e.evasion) { output.evasion = e.evasion }
          if (e.evasion_bonus) { output.evasion += e.evasion_bonus }
          if (e.speed) { output.speed = e.speed }
          if (e.speed_bonus) { output.speed += e.speed_bonus }
          if (e.hp_bonus) { output.hp += e.hp_bonus }
        }
      }
    }

    return output
  },
  limitedBonus(pilot: Pilot) {
    let bonus = 0
    if (pilot.core_bonuses.includes('ammofeeds')) { bonus += 2 }
    bonus += Math.floor(pilot.mechSkills.eng / 2)
    return bonus
  },
  pilotStatblock(pilot: Pilot, loadout: PilotLoadout, state: AppState): string {
    var pStats = this.pilotStats(pilot, loadout, state)
    let pOutput = `${pilot.name} // "${pilot.callsign}"\n`
    pOutput += `${state.Backgrounds.find((x: Background) => x.id === pilot.background)!.name}, LL${pilot.level}\n`
    pOutput += `GRIT: ${pStats.grit} // H:${pStats.mech.hull} A:${pStats.mech.agi} S:${pStats.mech.sys} E:${pStats.mech.eng}\n`
    pOutput += `[ SKILL TRIGGERS ]:\n  `
    for (var i = 0; i < pilot.skills.length; i++) {
      var s = state.Skills.find((x: any) => x.id === pilot.skills[i].id)
      if (s) pOutput += `${s.trigger} (+${pilot.skills[i].bonus})`
      if (i + 1 < pilot.skills.length) pOutput += " | "
      else pOutput += "\n"
    }
    pOutput += `[ TALENTS ]:\n  `
    for (var i = 0; i < pilot.talents.length; i++) {
      var t = state.Talents.find((x: any) => x.id === pilot.talents[i].id)
      if (t) pOutput += `${t.name} ${pilot.talents[i].rank}`
      if (i + 1 < pilot.talents.length) pOutput += " | "
      else pOutput += "\n"
    }    
    if (pilot.licenses.length) pOutput += `[ LICENSES ]:\n  `
    for (var i = 0; i < pilot.licenses.length; i++) {
      var l = pilot.licenses[i]
      pOutput += `${l.source} ${l.name} ${l.level}`
      if (i + 1 < pilot.licenses.length) pOutput += " | "
      else pOutput += "\n"
    }
    if (pilot.core_bonuses.length) pOutput += `[ CORE BONUSES ]:\n  `
    for (var i = 0; i < pilot.core_bonuses.length; i++) {
      var cb = state.CoreBonuses.find((x: any) => x.id === pilot.core_bonuses[i])
      if (cb) pOutput += `${cb.name}`
      if (i + 1 < pilot.core_bonuses.length) pOutput += " | "
      else pOutput += "\n"
    }
    if (loadout) pOutput += `[ GEAR ]:\n  `
    return pOutput
  }
}
