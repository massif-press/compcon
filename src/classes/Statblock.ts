import { Pilot, Mech, Npc } from '@/class'

function linebreak(i: number, length: number): string {
  if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== length) {
    return '\n  '
  } else if (i + 1 < length) {
    return ', '
  } else {
    return '\n'
  }
}

class Statblock {
  public static Generate(pilot?: Pilot, mech?: Mech): string {
    let output = ''
    if (pilot) {
      output += `» ${pilot.Callsign.toUpperCase()} «\n`
      output += `${pilot.Name}\n${pilot.Background}, LL${pilot.Level}\n`
      output += `GRIT:${pilot.Grit} // H:${pilot.MechSkills.Hull} A:${pilot.MechSkills.Agi} S:${pilot.MechSkills.Sys} E:${pilot.MechSkills.Eng}\n`
      output += `[ SKILL TRIGGERS ]\n  `
      for (let i = 0; i < pilot.Skills.length; i++) {
        const s = pilot.Skills[i]
        output += `${s.Skill.Trigger} (+${s.Bonus})${linebreak(i, pilot.Skills.length)}`
      }

      output += '[ TALENTS ]\n  '
      for (let i = 0; i < pilot.Talents.length; i++) {
        const t = pilot.Talents[i]
        output += `${t.Talent.Name} ${t.Rank}${linebreak(i, pilot.Talents.length)}`
      }

      if (pilot.Licenses.length) {
        output += '[ LICENSES ]\n  '
        for (let i = 0; i < pilot.Licenses.length; i++) {
          const l = pilot.Licenses[i]
          output += `${l.License.Source} ${l.License.Name} ${l.Rank}${linebreak(
            i,
            pilot.Licenses.length
          )}`
        }
      }

      if (pilot.CoreBonuses.length) {
        output += '[ CORE BONUSES ]\n  '
        for (let i = 0; i < pilot.CoreBonuses.length; i++) {
          const cb = pilot.CoreBonuses[i]
          output += `${cb.Name}${linebreak(i, pilot.CoreBonuses.length)}`
        }
      }

      const loadout = pilot.Loadout
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
      output += `« ${mech.Name.toUpperCase()} »\n[ ${mech.Frame.Source} ${mech.Frame.Name} ]\n`
      if (!pilot)
        output += `H:${mech.Hull} A:${mech.Agi} S:${mech.Sys} E:${mech.Eng} SIZE:${mech.Size}\n`
      output += `  STRUCTURE:${mech.CurrentStructure}${
        mech.IsActive ? '/' + mech.MaxStructure : ''
        }`
      output += ` HP:${mech.CurrentHP}${mech.IsActive ? '/' + mech.MaxHP : ''}`
      output += ` ARMOR:${mech.Armor}\n`
      output += `  STRESS:${mech.CurrentStress}${mech.IsActive ? '/' + mech.MaxStress : ''}`
      output += ` HEAT:${mech.CurrentHeat}${mech.IsActive ? '/' + mech.HeatCapacity : ''}`
      output += ` REPAIR:${mech.CurrentRepairs}${mech.IsActive ? '/' + mech.RepairCapacity : ''}\n`
      output += `  ATK BONUS:${mech.AttackBonus} TECH ATK:${mech.TechAttack} LTD BONUS:${mech.LimitedBonus}\n`
      output += `  SPD:${mech.Speed} EVA:${mech.Evasion} EDEF:${mech.EDefense} SENS:${mech.SensorRange} SAVE:${mech.SaveTarget}\n`

      output += '[ WEAPONS ]\n'
      for (const im of mech.IntegratedMounts) {
        output += `  INTEGRATED MOUNT: ${im.Weapon ? im.Weapon.Name : ''}\n`
      }
      const loadout = mech.ActiveLoadout ? mech.ActiveLoadout : mech.Loadouts[0]
      if (loadout) {
        for (const mount of loadout.AllEquippableMounts(
          pilot && pilot.has('CoreBonus', 'cb_improved_armament'),
          pilot && pilot.has('CoreBonus', 'cb_integrated_weapon')
        )) {
          output += `  ${mount.Name}: `
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

  public static GenerateBuildSummary(pilot: Pilot, mech: Mech): string {
    const mechLoadout = mech.ActiveLoadout ? mech.ActiveLoadout : mech.Loadouts[0]
    return `-- ${mech.Frame.Source} ${mech.Frame.Name} @ LL${pilot.Level} --
[ LICENSES ]
  ${
      pilot.Licenses.length
        ? `${pilot.Licenses.map(l => `${l.License.Source} ${l.License.Name} ${l.Rank}`).join(', ')}`
        : 'N/A'
      }
[ CORE BONUSES ]
  ${pilot.CoreBonuses.length ? `${pilot.CoreBonuses.map(cb => cb.Name).join(', ')}` : 'N/A'}
[ TALENTS ]
  ${pilot.Talents.map(t => `${t.Talent.Name} ${t.Rank}`).join(', ')}
[ STATS ]
  HULL:${pilot.MechSkills.Hull} AGI:${pilot.MechSkills.Agi} SYS:${pilot.MechSkills.Sys} ENGI:${
      pilot.MechSkills.Eng
      }
  STRUCTURE:${mech.MaxStructure} HP:${mech.MaxHP} ARMOR:${mech.Armor}
  STRESS:${mech.MaxStress} HEATCAP:${mech.HeatCapacity} REPAIR:${mech.RepairCapacity}
  TECH ATK:${mech.TechAttack > 0 ? `+${mech.TechAttack}` : mech.TechAttack} LIMITED:+${
      mech.LimitedBonus
      }
  SPD:${mech.Speed} EVA:${mech.Evasion} EDEF:${mech.EDefense} SENSE:${mech.SensorRange} SAVE:${
      mech.SaveTarget
      }
[ WEAPONS ]
  ${mech.IntegratedMounts.map(mount => `Integrated: ${mount.Weapon ? mount.Weapon.Name : 'N/A'}`)}
  ${mechLoadout
        .AllEquippableMounts(
          pilot.has('CoreBonus', 'cb_improved_armament'),
          pilot.has('CoreBonus', 'cb_integrated_weapon')
        )
        .map(mount => {
          let out = `${mount.Name}: `
          if (mount.IsLocked) out += 'SUPERHEAVY WEAPON BRACING'
          else
            out += mount.Weapons.filter(Boolean)
              .map(weapon => `${weapon.Name}${weapon.Mod ? ` (${weapon.Mod.Name})` : ''}`)
              .join(' / ')

          if (mount.Bonuses.length > 0)
            out += ' // ' + mount.Bonuses.map(bonus => bonus.Name).join(', ')

          return out
        })
        .join('\n  ')}
[ SYSTEMS ]
  ${mechLoadout.Systems.map(sys => {
          let out = sys.Name
          if (sys.IsLimited) out += ` x${sys.MaxUses + mech.LimitedBonus}`
          return out
        }).join(', ')}`
  }

  public static GenerateNPC(npc: Npc): string {
    let output = `// ${npc.Name} //\n`
    output += `${npc.Class.Name.toUpperCase()}`
    if (npc.Templates) output += ` ${npc.Templates.map(t => t.Name).join(' ')}`
    output += typeof npc.Tier === 'number' ? `, Tier ${npc.Tier} ` : ', Custom '
    output += `${npc.Tag}\n`
    output += '[ STATS ]\n'
    output += `  H: ${npc.Stats.Hull} | A: ${npc.Stats.Agility} | S: ${npc.Stats.Systems} | E: ${npc.Stats.Engineering}\n`
    output += `  STRUCT: ${npc.Stats.Structure} | ARMOR: ${npc.Stats.Armor} | HP: ${npc.Stats.HP}\n`
    output += `  STRESS: ${npc.Stats.Stress} | HEATCAP: ${npc.Stats.HeatCapacity} | SPD: ${npc.Stats.Speed}\n`
    output += `  SAVE: ${npc.Stats.Save} | EVADE: ${npc.Stats.Evade} | EDEF: ${npc.Stats.EDefense}\n`
    output += `  SENS: ${npc.Stats.Sensor} | SIZE: ${npc.Stats.Size} | ACT: ${npc.Stats.Activations}\n`
    output += '[ FEATURES ]\n  '
    output += npc.Items.map((item, index) => `${item.Name} (${'I'.repeat(item.Tier)})${linebreak(index, npc.Items.length)}`).join("")
    console.log(npc.Items.map((item, index) => `${item.Name} (${'I'.repeat(item.Tier)})${linebreak(index, npc.Items.length)}`).join(""))
    return output
  }
}

export default Statblock
