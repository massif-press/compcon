import { Bond } from '@/classes/pilot/components/bond/Bond'
/* eslint-disable @typescript-eslint/indent */
import { Pilot, Mech, Npc, PilotWeapon, MechWeapon } from '../class'

function linebreak(i: number, length: number): string {
  if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== length) {
    return ',\n  '
  } else if (i + 1 < length) {
    return ', '
  } else {
    return '\n'
  }
}

function addWeaponToOutput(output: string, discordEmoji: boolean, w: MechWeapon | null): string {
  if (w) output += `${w.TrueName}`
  if (discordEmoji) {
    if (w.Range) {
      const ranges: string[] = []
      w.Range.forEach(r => {
        ranges.push(`${r.DiscordEmoji} ${r.Value}`)
      })
      output += ` ${ranges.join(' ')}`
    }
    if (w.Damage) {
      const damages: string[] = []
      w.Damage.forEach(d => {
        damages.push(`${d.DiscordEmoji} ${d.Value}`)
      })
      output += ` ${damages.join(' ')}`
    }
  }

  return output
}

class Statblock {
  public static Generate(pilot: Pilot, mech: Mech, discordEmoji: boolean, view: string): string {
    let output = ''

    if (view == 'pilotBuild' || 'full') {
      output += `» ${pilot.Name} // ${pilot.Callsign.toUpperCase()} «\n  `
      if (pilot.Background) {
        output += `${pilot.Background}, `
      }
      output += `LL${pilot.Level}\n`
      output += `[ SKILL TRIGGERS ]\n  `
      for (let i = 0; i < pilot.SkillsController.Skills.length; i++) {
        const s = pilot.SkillsController.Skills[i]
        output += `${s.Skill.Trigger} (+${s.Bonus})${linebreak(
          i,
          pilot.SkillsController.Skills.length
        )}`
      }

      const loadout = pilot.PilotLoadoutController.Loadout
      if (loadout) {
        output += '[ GEAR ]\n  '
        for (let i = 0; i < loadout.Items.length; i++) {
          if (loadout.Items[i]) {
            output += `${loadout.Items[i].TrueName}${linebreak(i, loadout.Items.length)}`
            if (discordEmoji) {
              const weapon = loadout.Items[i] as PilotWeapon
              if ('Range' in weapon) {
                const ranges: string[] = []
                weapon.Range.forEach(r => {
                  ranges.push(`${r.DiscordEmoji} ${r.Value}`)
                })
                output += ` ${ranges.join(' ')}`
              }
              if ('Damage' in weapon) {
                const damages: string[] = []
                weapon.Damage.forEach(d => {
                  damages.push(`${d.DiscordEmoji} ${d.Value}`)
                })
                output += ` ${damages.join(' ')}`
              }
            }
          }
        }
      }

      const bond = pilot.BondController
      if (bond.Bond) {
        output += '[ BOND ]\n  '
        output += `${bond.Bond.Name.toUpperCase()}\n`
        if (bond.BondPowers) {
          output += '  Powers: '
          for (let i = 0; i < bond.BondPowers.length; i++) {
            output += `${bond.BondPowers[i].name.toUpperCase()}${linebreak(
              i,
              bond.BondPowers.length
            )}`
          }
        }
      }

      if (view == 'full') {
        output += '***\n'
      }

      if (view == 'pilotBuild') {
        output += '[ MECH SKILLS ]\n  '
        output += `GRIT:${pilot.Grit} // H:${pilot.MechSkillsController.MechSkills.Hull} A:${pilot.MechSkillsController.MechSkills.Agi} S:${pilot.MechSkillsController.MechSkills.Sys} E:${pilot.MechSkillsController.MechSkills.Eng}\n`
      }
      output += '[ TALENTS ]\n  '
      for (let i = 0; i < pilot.TalentsController.Talents.length; i++) {
        const t = pilot.TalentsController.Talents[i]
        output += `${t.Talent.Name} ${t.Rank}${linebreak(
          i,
          pilot.TalentsController.Talents.length
        )}`
      }

      if (pilot.LicenseController.Licenses.length) {
        output += '[ LICENSES ]\n  '
        for (let i = 0; i < pilot.LicenseController.Licenses.length; i++) {
          const l = pilot.LicenseController.Licenses[i]
          output += `${l.License.Source} ${l.License.Name} ${l.Rank}${linebreak(
            i,
            pilot.LicenseController.Licenses.length
          )}`
        }
      }

      if (pilot.CoreBonusController.CoreBonuses.length) {
        output += '[ CORE BONUSES ]\n  '
        for (let i = 0; i < pilot.CoreBonusController.CoreBonuses.length; i++) {
          const cb = pilot.CoreBonusController.CoreBonuses[i]
          output += `${cb.Name}${linebreak(i, pilot.CoreBonusController.CoreBonuses.length)}`
        }
      }
    }

    if (mech) {
      if (view == 'full') {
        output += `[ MECH ]\n  « ${mech.Name.toUpperCase()} »\n  ${mech.Frame.Source} ${
          mech.Frame.Name
        }\n`
        output += `  H:${mech.Hull} A:${mech.Agi} S:${mech.Sys} E:${mech.Eng} SIZE:${mech.Size}\n`
        output += `  STRUCTURE:${mech.CurrentStructure}${
          mech.IsActive ? '/' + mech.MaxStructure : ''
        }`
        output += ` HP:${mech.CurrentHP}${mech.IsActive ? '/' + mech.MaxHP : ''}`
        output += ` ARMOR:${mech.Armor}\n`
        output += `  STRESS:${mech.CurrentStress}${mech.IsActive ? '/' + mech.MaxStress : ''}`
        output += ` HEAT:${mech.CurrentHeat}${mech.IsActive ? '/' + mech.HeatCapacity : ''}`
        output += ` REPAIR:${mech.CurrentRepairs}${
          mech.IsActive ? '/' + mech.RepairCapacity : ''
        }\n`
        output += `  ATK BONUS:${mech.AttackBonus} TECH ATK:${mech.TechAttack} LTD BONUS:${mech.LimitedBonus}\n`
        output += `  SPD:${mech.Speed} EVA:${mech.Evasion} EDEF:${mech.EDefense} SENS:${mech.SensorRange} SAVE:${mech.SaveTarget}\n`

        output += '[ WEAPONS ]\n'
        for (const im of mech.MechLoadoutController.ActiveLoadout.IntegratedMounts) {
          for (const mw of im.Weapons) {
          output += '  INTEGRATED MOUNT: '
          output = addWeaponToOutput(output, discordEmoji, mw)
          output += '\n'
          }
        }
        const loadout = mech.MechLoadoutController.ActiveLoadout
          ? mech.MechLoadoutController.ActiveLoadout
          : mech.MechLoadoutController.Loadouts[0]
        if (loadout) {
          for (const mount of loadout.AllEquippableMounts(
            pilot && pilot.has('CoreBonus', 'cb_improved_armament'),
            pilot && pilot.has('CoreBonus', 'cb_integrated_weapon')
          )) {
            output += `  ${mount.Name.toUpperCase()}: `
            if (mount.IsLocked) {
              output += 'SUPERHEAVY WEAPON BRACING'
            } else {
              mount.Weapons.forEach((w, idx) => {
                output = addWeaponToOutput(output, discordEmoji, w)
                if (w.Mod) output += ` (${w.Mod.TrueName})`
                if (idx + 1 < mount.Weapons.length) output += ' / '
              })
            }

            if (mount.Bonuses.length > 0) {
              output += ' // ' + mount.Bonuses.map(bonus => bonus.Name).join(', ')
            }

            output += '\n'
          }

          output += '[ SYSTEMS ]\n  '
          const allsys = mech.MechLoadoutController.ActiveLoadout.IntegratedSystems.concat(
            loadout.Systems
          )
          allsys.forEach((sys, i) => {
            output += `${sys.TrueName}${linebreak(i, allsys.length)}`
          })
        }
      }
    } else if (view == 'full') {
      output += '\n>> NO MECH SELECTED <<'
    }
    return output
  }

  public static GenerateBuildSummary(pilot: Pilot, mech: Mech, discordEmoji: boolean): string {
    if (mech) {
      const mechLoadout = mech.MechLoadoutController.ActiveLoadout
        ? mech.MechLoadoutController.ActiveLoadout
        : mech.MechLoadoutController.Loadouts[0]
      return `-- ${mech.Frame.Source} ${mech.Frame.Name} @ LL${pilot.Level} --
[ LICENSES ]
  ${
    pilot.LicenseController.Licenses.length
      ? `${pilot.LicenseController.Licenses.map(
          l => `${l.License.Source} ${l.License.Name} ${l.Rank}`
        ).join(', ')}`
      : 'N/A'
  }
[ CORE BONUSES ]
  ${
    pilot.CoreBonusController.CoreBonuses.length
      ? `${pilot.CoreBonusController.CoreBonuses.map(cb => cb.Name).join(', ')}`
      : 'N/A'
  }
[ TALENTS ]
  ${pilot.TalentsController.Talents.map(t => `${t.Talent.Name} ${t.Rank}`).join(', ')}
[ STATS ]
  HULL:${pilot.MechSkillsController.MechSkills.Hull} AGI:${
        pilot.MechSkillsController.MechSkills.Agi
      } SYS:${pilot.MechSkillsController.MechSkills.Sys} ENGI:${
        pilot.MechSkillsController.MechSkills.Eng
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
  ${mech.MechLoadoutController.ActiveLoadout.IntegratedMounts.map(
    mount =>
      `Integrated: ${mount.Weapon ? mount.Weapon.TrueName : 'N/A  '}${
        discordEmoji && mount.Weapon && mount.Weapon.Range
          ? ' ' +
          mount.Weapon.Range.filter(Boolean)
              .map(r => `${r.DiscordEmoji}${r.Value}`)
              .join(' ')
          : ''
      }${
        discordEmoji && mount.Weapon && mount.Weapon.Damage
          ? ' ' +
          mount.Weapon.Damage.filter(Boolean)
              .map(d => `${d.DiscordEmoji}${d.Value}`)
              .join(' ')
          : ''
      }\n  `
  ).join('')}${mechLoadout
        .AllEquippableMounts(
          pilot.has('CoreBonus', 'cb_improved_armament'),
          pilot.has('CoreBonus', 'cb_integrated_weapon'),
          pilot.has('CoreBonus', 'cb_superheavy_mounting')
        )
        .map(mount => {
          let out = `${mount.Name.toUpperCase()}: `
          if (mount.IsLocked) out += 'SUPERHEAVY WEAPON BRACING'
          else
            out += mount.Weapons.filter(Boolean)
              .map(
                weapon =>
                  `${weapon.TrueName}${
                    discordEmoji && weapon.Range
                      ? ' ' +
                        weapon.Range.filter(Boolean)
                          .map(r => `${r.DiscordEmoji}${r.Value}`)
                          .join(' ')
                      : ''
                  }${
                    discordEmoji && weapon.Damage
                      ? ' ' +
                        weapon.Damage.filter(Boolean)
                          .map(d => `${d.DiscordEmoji}${d.Value}`)
                          .join(' ')
                      : ''
                  }${weapon.Mod ? ` (${weapon.Mod.TrueName})` : ''}`
              )
              .join(' / ')

          if (mount.Bonuses.length > 0)
            out += ' // ' + mount.Bonuses.map(bonus => bonus.Name).join(', ')

          return out
        })
        .join('\n  ')}
[ SYSTEMS ]
  ${mechLoadout.Systems.map(sys => {
    let out = sys.TrueName
    if (sys.IsLimited) out += ` x${sys.getTotalUses(mech.LimitedBonus)}`
    return out
  }).join(', ')}`
    } else return '>> NO MECH SELECTED <<'
  }

  public static GenerateNPC(npc: Npc, genRadio: string="compact"): string {
    let output = `// ${npc.Name} //\n`
    output += `${npc.Class.Name.toUpperCase()}`
    if (npc.Templates) output += ` ${npc.Templates.map(t => t.Name).join(' ')}`
    output += typeof npc.Tier === 'number' ? `, Tier ${npc.Tier} ` : ', Custom '
    output += `${npc.Tag}\n`
    output += '[ STATS ]\n'
    output += `  H: ${npc.Stats.Hull} | A: ${npc.Stats.Agility} | S: ${npc.Stats.Systems} | E: ${npc.Stats.Engineering}\n`
    output += `  STRUCT: ${npc.CurrentStructure}/${npc.Stats.Structure} | ARMOR: ${npc.Stats.Armor} | HP: ${npc.CurrentHP}/${npc.Stats.HP}\n`
    output += `  STRESS: ${npc.CurrentStress}/${npc.Stats.Stress} | HEATCAP: ${npc.CurrentHeat}/${npc.Stats.HeatCapacity} | SPD: ${npc.Stats.Speed}\n`
    output += `  SAVE: ${npc.Stats.Save} | EVADE: ${npc.Stats.Evade} | EDEF: ${npc.Stats.EDefense}\n`
    output += `  SENS: ${npc.Stats.Sensor} | SIZE: ${npc.Stats.Size} | ACT: ${npc.Stats.Activations}\n`
    output += '[ FEATURES ]\n'
    if (genRadio == "detailed"){
      output += npc.Items.map(
        (item) =>
          `${item.generateStatblock()}`
      ).join('\n')
    }
    if (genRadio == "compact"){
      output += "  "
      output += npc.Items.map(
        (item, index) =>
          `${item.Name} (${'I'.repeat(item.Tier)})${linebreak(index, npc.Items.length)}`
      ).join('')
    }
    return output
  }
}

export default Statblock
