import { thisPilotGear } from '@/data_interfaces/type_guards'
import { rules } from "lancer-data";

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
  // TODO: refactor these statblocks
  pilotStatblock(pilot: Pilot, loadout: PilotLoadout, state: AppState): string {
    const pStats = this.pilotStats(pilot, loadout, state)
    let pOutput = `>> ${pilot.callsign.toUpperCase()} <<\n  ${pilot.name}\n  `
    pOutput += `${state.Backgrounds.find((x: Background) => x.id === pilot.background)!.name}, LL${pilot.level}\n  `
    pOutput += `GRIT:${pStats.grit} // H:${pStats.mech.hull} A:${pStats.mech.agi} S:${pStats.mech.sys} E:${pStats.mech.eng}\n`
    pOutput += '[ SKILL TRIGGERS ]\n  '
    for (let i = 0; i < pilot.skills.length; i++) {
      const s = state.Skills.find((x: any) => x.id === pilot.skills[i].id)
      pOutput += `${s.trigger} (+${pilot.skills[i].bonus})`
      if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== pilot.skills.length) { pOutput += '\n  ' }
      else if (i + 1 < pilot.skills.length) { pOutput += ', ' }
      else { pOutput += '\n' }
    }
    if (pilot.invocations && pilot.invocations.length) {
      pOutput += '[ INVOCATIONS ]\n  '
      for (let i = 0; i < pilot.invocations.length; i++) {
        let pi = pilot.invocations[i]
        let tr = pi.trigger
        if (tr.length > 15) { tr = tr.substring(0, 15) + '…' }
        pOutput += `${tr} (${pi.accuracy ? '+' : '-'})`
        if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== pilot.invocations.length) { pOutput += '\n  ' }
        else if (i + 1 < pilot.invocations.length) { pOutput += ', ' }
        else { pOutput += '\n' }
      }
    }
    pOutput += '[ TALENTS ]\n  '
    for (let i = 0; i < pilot.talents.length; i++) {
      const t = state.Talents.find((x: any) => x.id === pilot.talents[i].id)
      pOutput += `${t!.name} ${pilot.talents[i].rank}`
      if (i > 0 && i % 3 === 0 && i + 1 !== pilot.talents.length) { pOutput += '\n  ' }
      else if (i + 1 < pilot.talents.length) { pOutput += ', ' }
      else { pOutput += '\n' }
    }
    if (pilot.licenses.length) { pOutput += '[ LICENSES ]\n  ' }
    for (let i = 0; i < pilot.licenses.length; i++) {
      const l = pilot.licenses[i]
      pOutput += `${l.source} ${l.name} ${l.level}`
      if (i > 0 && i % (i + 1) % 2 === 0 && i + 1 !== pilot.licenses.length) { pOutput += '\n  ' }
      else if (i + 1 < pilot.licenses.length) { pOutput += ', ' }
      else { pOutput += '\n' }
    }
    if (pilot.core_bonuses.length) { pOutput += '[ CORE BONUSES ]\n  ' }
    for (let i = 0; i < pilot.core_bonuses.length; i++) {
      const cb = state.CoreBonuses.find((x: any) => x.id === pilot.core_bonuses[i])
      pOutput += `${cb!.name}`
      if (i > 0 && i % 3 === 0 && i + 1 !== pilot.core_bonuses.length) { pOutput += '\n  ' }
      else if (i + 1 < pilot.core_bonuses.length) { pOutput += ', ' }
      else { pOutput += '\n' }
    }
    if (loadout && loadout.items) {
      pOutput += '[ GEAR ]\n  '
      let allgear = loadout.items.armor.concat(loadout.items.weapon).concat(loadout.items.gear)
      for (let i = 0; i < allgear.length; i++) {
        if (allgear[i]) {
          const pg = state.PilotGear.find((x: any) => x.id === allgear[i]!.id)!.name
          pOutput += `${pg}`
          if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== allgear.length) { pOutput += '\n  ' }
          else if (i + 1 < allgear.length) { pOutput += ', ' }
        }
      }
    }
    return pOutput
  },
  mechStatblock(pilot: Pilot, config: MechConfig, loadout: MechLoadout, state: AppState): string {
    let mStats = this.mechStats(pilot, config, loadout, state)
    let frame = state.Frames.find((x) => x.id === config.frame_id)

    let mOutput = `>> ${config.name.toUpperCase()} <<\n  ${frame!.source} ${frame!.name}\n  `
    mOutput += `H:${mStats.hull} A:${mStats.agi} S:${mStats.sys} E:${mStats.eng} SIZE:${frame!.stats.size}\n  `
    mOutput += `STRUCTURE:${config.current_structure || mStats.structure}`
    if (config.active) mOutput += `/${mStats.structure}`
    mOutput += ` HP:${config.current_hp || mStats.hp}`
    if (config.active) mOutput += `/${mStats.hp}`
    mOutput += ` ARMOR:${mStats.armor}\n  `
    mOutput += `STRESS:${config.current_stress || mStats.heatstress}`
    if (config.active) mOutput += `/${mStats.heatstress}`
    mOutput += ` HEAT:${config.current_heat || mStats.heatcap}`
    if (config.active) mOutput += `/${mStats.heatcap}`
    mOutput += ` REPAIR:${config.current_repairs || mStats.repcap}`
    if (config.active) mOutput += `/${mStats.repcap}`
    mOutput += `\n  ATK BONUS:${mStats.attack_bonus} TECH ATK:${mStats.tech_attack} LTD BONUS:${mStats.limited_bonus}\n  `
    mOutput += `SPD:${mStats.speed} EVA:${mStats.evasion} EDEF:${mStats.edef} SENS:${mStats.sensor_range} SAVE:${mStats.save_target}\n`
    mOutput += '[ TALENTS ]\n  '
    for (let i = 0; i < pilot.talents.length; i++) {
      const t = state.Talents.find((x: any) => x.id === pilot.talents[i].id)
      mOutput += `${t!.name} ${pilot.talents[i].rank}`
      if (i > 0 && i % 3 === 0 && i + 1 !== pilot.talents.length) { mOutput += '\n  ' }
      else if (i + 1 < pilot.talents.length) { mOutput += ', ' }
      else { mOutput += '\n' }
    }
    if (pilot.core_bonuses.length) { mOutput += '[ CORE BONUSES ]\n  ' }
    for (let i = 0; i < pilot.core_bonuses.length; i++) {
      const cb = state.CoreBonuses.find((x: any) => x.id === pilot.core_bonuses[i])
      mOutput += `${cb!.name}`
      if (i > 0 && i % 3 === 0 && i + 1 !== pilot.core_bonuses.length) { mOutput += '\n  ' }
      else if (i + 1 < pilot.core_bonuses.length) { mOutput += ', ' }
      else { mOutput += '\n' }
    }
    if (!loadout) { return mOutput }

    mOutput += '[ WEAPONS ]\n'

    if (frame!.core_system.integrated) {
      mOutput += `  CORE INTEGRATED MOUNT: ${frame!.core_system.integrated.name}\n`
    }
    // for (let i = 0; i < mStats.integrated_mounts.length; i++) {
    for (const integratedMount of mStats.integrated_mounts) {
      const w = state.MechWeapons.find((x: any) => x.id === integratedMount)
      mOutput += `  INTEGRATED MOUNT: ${w!.name}\n`
    }

    for (const mount of loadout.mounts) {
      if (mount.imparm || (mount.imparm && pilot.core_bonuses.includes('imparm'))) {
        continue
      }
      mOutput += `  ${mount.mount_type.toUpperCase()} MOUNT: `
      if (mount.sh_lock) {
        mOutput += 'SUPERHEAVY WEAPON BRACING'
      } else {
        for (let j = 0; j < mount.weapons.length; j++) {
          const w = state.MechWeapons.find((x: any) => x.id === mount.weapons[j].id)
          mOutput += `${w!.name}`
          if (j + 1 < mount.weapons.length) { mOutput += ' / ' }
        }
      }
      mOutput += '\n'
    }

    mOutput += '[ SYSTEMS ]\n  '
    const allsys = mStats.integrated_systems.concat(loadout.systems.map((x: any) => x.id))
    for (let i = 0; i < allsys.length; i++) {
      const sys = state.MechSystems.find((x: any) => x.id === allsys[i])
      mOutput += `${sys!.name}`
      if (i > 0 && i % 3 === 0 && i + 1 !== allsys.length) { mOutput += '\n  ' }
      else if (i + 1 < allsys.length) { mOutput += ', ' }
    }

    return mOutput
  },
}
