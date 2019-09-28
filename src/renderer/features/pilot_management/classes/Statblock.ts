import { Pilot, Mech } from '@/class'

class Statblock {
  public static Generate(pilot: Pilot | null, mech: Mech | null): string {
    function linebreak(i: number, length: number): string {
      if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== length) {
        return '\n  '
      } else if (i + 1 < length) {
        return ', '
      } else {
        return '\n'
      }
    }

    let output = ''
    if (pilot) {
      output += `» ${pilot.Callsign.toUpperCase()} «
  ${pilot.Name} 
  ${pilot.Background}, LL${pilot.Level}
  GRIT:${pilot.Grit} // H:${pilot.MechSkills.Hull} A:${pilot.MechSkills.Agi} S:${
  pilot.MechSkills.Sys
} E:${pilot.MechSkills.Eng}\n`

      output += `[ SKILL TRIGGERS ]\n`
      for (let i = 0; i < pilot.Skills.length; i++) {
        const s = pilot.Skills[i]
        output += `${s.Skill.Trigger} (+${s.Bonus})${linebreak(i, pilot.Skills.length)}`
      }

      output += '[ TALENTS ]\n  '
      for (let i = 0; i < pilot.Talents.length; i++) {
        const t = pilot.Talents[i]
        output += `${t.Talent.Name} ${t.Rank}${linebreak(i, pilot.Talents.length)}`
      }

      output += '[ LICENSES ]\n  '
      for (let i = 0; i < pilot.Licenses.length; i++) {
        const l = pilot.Licenses[i]
        output += `${l.License.Source} ${l.License.Name} ${l.Rank}${linebreak(
          i,
          pilot.Licenses.length
        )}`
      }

      output += '[ CORE BONUSES ]\n  '
      for (let i = 0; i < pilot.CoreBonuses.length; i++) {
        const cb = pilot.CoreBonuses[i]
        output += `${cb.Name}${linebreak(i, pilot.CoreBonuses.length)}`
      }

      const loadout = pilot.ActiveLoadout
      if (loadout) {
        output += '[ GEAR ]\n  '
        for (let i = 0; i < loadout.Items.length; i++) {
          if (loadout.Items[i]) {
            output += `${loadout.Items[i].Name}`
            if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== loadout.Items.length) {
              output += '\n  '
            } else if (i + 1 < loadout.Items.length) {
              output += ', '
            }
          }
        }
      }
    }

    if (pilot && mech) output += '\n----------\n'

    if (mech) {
      output += `« ${mech.Name.toUpperCase()} »\n  ${mech.Frame.Source} ${mech.Frame.Name}\n  `
      if (!pilot)
        output += `H:${mech.Hull} A:${mech.Agi} S:${mech.Sys} E:${mech.Eng} SIZE:${mech.Size}\n `
      output += ` STRUCTURE:${mech.CurrentStructure}${mech.IsActive ? '/' + mech.MaxStructure : ''}`
      output += ` HP:${mech.CurrentHP}${mech.IsActive ? '/' + mech.MaxHP : ''}`
      output += ` ARMOR:${mech.Armor}\n  `
      output += `STRESS:${mech.CurrentStress}${mech.IsActive ? '/' + mech.MaxStress : ''}`
      output += ` HEAT:${mech.CurrentHeat}${mech.IsActive ? '/' + mech.HeatCapacity : ''}`
      output += ` REPAIR:${mech.CurrentRepairs}${mech.IsActive ? '/' + mech.RepairCapacity : ''}`
      output += `\n  ATK BONUS:${mech.AttackBonus} TECH ATK:${mech.TechAttack} LTD BONUS:${mech.LimitedBonus}\n  `
      output += `SPD:${mech.Speed} EVA:${mech.Evasion} EDEF:${mech.EDefense} SENS:${mech.SensorRange} SAVE:${mech.SaveTarget}\n`

      output += '[ WEAPONS ]\n'
      for (const im of mech.IntegratedMounts) {
        output += `  INTEGRATED MOUNT: ${im.Weapon ? im.Weapon.Name : ''}\n`
      }
      const loadout = mech.ActiveLoadout ? mech.ActiveLoadout : mech.Loadouts[0]
      if (loadout) {
        for (const mount of loadout.AllEquippableMounts(
          pilot && pilot.has('CoreBonus', 'imparm'),
          pilot && pilot.has('CoreBonus', 'intweapon')
        )) {
          output += `  ${mount.MountName}: `
          if (mount.IsLocked) {
            output += 'SUPERHEAVY WEAPON BRACING'
          } else {
            mount.Weapons.forEach((w, idx) => {
              if (w) output += `${w.Name}`
              if (w.Mod) output += ` (${w.Mod.Name})`
              if (idx + 1 < mount.Weapons.length) output += ' / '
            })
          }
          output += '\n'
        }

        output += '[ SYSTEMS ]\n  '
        const allsys = mech.IntegratedSystems.concat(loadout.Systems)
        allsys.forEach((sys, i) => {
          output += `${sys.Name}${linebreak(i, allsys.length)}`
        })
      }
    }

    return output
  }
}

export default Statblock
