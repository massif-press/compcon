import { MechWeapon } from './mech/components/equipment/MechWeapon'
import { Mech } from './mech/Mech'
import { PilotWeapon } from './pilot/components/Loadout/equipment/PilotWeapon'
import { Pilot } from './pilot/Pilot'
import { Action } from './Action'
import { NpcWeapon } from './npc/feature/NpcItem/NpcWeapon'
import { Unit } from './npc/unit/Unit'
import { ActiveEffect } from './components/feature/active_effects/ActiveEffect'

function linebreak(i: number, length: number): string {
  if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== length) {
    return ',\n  '
  } else if (i + 1 < length) {
    return ', '
  } else {
    return '\n'
  }
}

// Discord emoji range/damage suffix, shared by every weapon line.
function emojiWeaponStats(w: MechWeapon | PilotWeapon): string {
  let out = ''
  if (w.Range && w.Range.length)
    out += ' ' + w.Range.filter(Boolean).map(r => `${r.DiscordEmoji} ${r.Value}`).join(' ')
  if (w.Damage && w.Damage.length)
    out += ' ' + w.Damage.filter(Boolean).map(d => `${d.DiscordEmoji} ${d.Value}`).join(' ')
  return out
}

function addWeaponToOutput(output: string, discordEmoji: boolean, w: MechWeapon | null): string {
  if (w) output += `${w.TrueName}${discordEmoji ? emojiWeaponStats(w) : ''}`
  return output
}

// NPC "..., Tier N " / "..., Custom " + tag suffix, shared by NPC headers.
function npcSubtitle(npc: Unit): string {
  const tier =
    typeof npc.NpcClassController.Tier === 'number'
      ? `, Tier ${npc.NpcClassController.Tier} `
      : ', Custom '
  return `${tier}${npc.Tag}`
}

// "LABEL: max | LABEL: max ..." stat grid row.
function maxStats(npc: Unit, cols: [string, string][]): string {
  return cols.map(([label, key]) => `${label}: ${npc.StatController.getMax(key)}`).join(' | ')
}

class Statblock {
  public static Generate(pilot: Pilot, mech: Mech, discordEmoji: boolean, view: string): string {
    let output = ''

    if (view === 'pilotBuild' || view === 'full') {
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

      const loadout = pilot.PilotLoadoutController.ActiveLoadout
      if (loadout) {
        output += '[ GEAR ]\n  '
        for (let i = 0; i < loadout.Items.length; i++) {
          const item = loadout.Items[i]
          if (!item) continue
          let str = item.TrueName
          if (discordEmoji && ('Range' in item || 'Damage' in item))
            str += emojiWeaponStats(item as PilotWeapon)
          output += `${str}${linebreak(i, loadout.Items.length)}`
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
        output += '\n'
      }

      if (view === 'pilotBuild') {
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

          if (l.License)
            output += `${l.License.Source} ${l.License.Name} ${l.Rank}${linebreak(
              i,
              pilot.LicenseController.Licenses.length
            )}`
          else if (l.Stub)
            output += `${l.Stub.Source} ${l.Stub.Name}${linebreak(i, pilot.LicenseController.Licenses.length)}`
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
      if (view === 'full') {
        output += `[ MECH ]\n  « ${mech.Name.toUpperCase()} »\n  ${mech.Frame.Source} ${
          mech.Frame.Name
        }\n`
        output += `  H:${mech.Hull} A:${mech.Agi} S:${mech.Sys} E:${mech.Eng} SIZE:${mech.Size}\n`
        output += `  STRUCTURE:${mech.MaxStructure}`
        output += ` HP:${mech.MaxHP}`
        output += ` ARMOR:${mech.Armor}\n`
        output += `  STRESS:${mech.MaxStress}`
        output += ` HEAT:${mech.HeatCapacity}`
        output += ` REPAIR:${mech.RepairCapacity}\n`
        output += `  ATK BONUS:${mech.AttackBonus} TECH ATK:${mech.TechAttack} LTD BONUS:${mech.LimitedBonus}\n`
        output += `  SPD:${mech.Speed} EVA:${mech.Evasion} EDEF:${mech.EDefense} SENS:${mech.SensorRange} SAVE:${mech.SaveTarget}\n`

        const loadout = mech.MechLoadoutController.ActiveLoadout
        output += '[ WEAPONS ]\n'
        for (const im of loadout.IntegratedMounts) {
          for (const mw of im.Weapons) {
            output += '  INTEGRATED MOUNT: '
            output = addWeaponToOutput(output, discordEmoji, mw)
            output += '\n'
          }
        }
        for (const mount of loadout.AllEquippableMounts(
          pilot && pilot.has('CoreBonus', 'cb_improved_armament'),
          pilot && pilot.has('CoreBonus', 'cb_integrated_weapon'),
          pilot && pilot.has('CoreBonus', 'cb_superheavy_mounting')
        )) {
          output += `  ${mount.Name}: `
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
        const allsys = loadout.IntegratedSystems.concat(loadout.Systems)
        allsys.forEach((sys, i) => {
          output += `${sys.TrueName}${linebreak(i, allsys.length)}`
        })
      }
    } else if (view === 'full') {
      output += '\n>> NO MECH SELECTED <<'
    }
    return output
  }

  public static GenerateBuildSummary(pilot: Pilot, mech: Mech, discordEmoji: boolean): string {
    if (mech) {
      const mechLoadout = mech.MechLoadoutController.ActiveLoadout
      return `-- ${mech.Frame.Source} ${mech.Frame.Name} @ LL${pilot.Level} --
[ LICENSES ]
  ${
    pilot.LicenseController.Licenses.length
      ? `${pilot.LicenseController.Licenses.map(l => {
          if (l.License) return `${l.License.Source} ${l.License.Name} ${l.Rank}`
          else if (l.Stub) return `${l.Stub.Source} ${l.Stub.Name}`
        }).join(', ')}`
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
  ${mechLoadout.IntegratedMounts.map(
    mount =>
      `Integrated: ${mount.Weapon ? mount.Weapon.TrueName : 'N/A  '}${
        discordEmoji && mount.Weapon ? emojiWeaponStats(mount.Weapon) : ''
      }\n  `
  ).join('')}${mechLoadout
    .AllEquippableMounts(
      pilot.has('CoreBonus', 'cb_improved_armament'),
      pilot.has('CoreBonus', 'cb_integrated_weapon'),
      pilot.has('CoreBonus', 'cb_superheavy_mounting')
    )
    .map(mount => {
      let out = `${mount.Name}: `
      if (mount.IsLocked) out += 'SUPERHEAVY WEAPON BRACING'
      else
        out += mount.Weapons.filter(Boolean)
          .map(
            weapon =>
              `${weapon.TrueName}${discordEmoji ? emojiWeaponStats(weapon) : ''}${
                weapon.Mod ? ` (${weapon.Mod.TrueName})` : ''
              }`
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

  public static GenerateNPC(npc: Unit, includeNarrative: boolean, includeFeatures = false): string {
    let output = `// ${npc.Name} //\n`
    if (npc.NpcTemplateController.Templates)
      output += `${npc.NpcTemplateController.Templates.map(t => t.Name).join(' ')}`
    if (npc.NpcClassController.HasClass)
      output += ` ${npc.NpcClassController.Class!.Name.toUpperCase()}`
    output += npcSubtitle(npc)
    output += '\n'
    output += '[ STATS ]\n'
    output += `  ${maxStats(npc, [
      ['H', 'Hull'],
      ['A', 'Agi'],
      ['S', 'Sys'],
      ['E', 'Eng'],
    ])}\n`
    output += `  ${maxStats(npc, [
      ['STRUCT', 'Structure'],
      ['ARMOR', 'Armor'],
      ['HP', 'hp'],
    ])}\n`
    output += `  ${maxStats(npc, [
      ['STRESS', 'Stress'],
      ['HEATCAP', 'heatcap'],
      ['SPD', 'Speed'],
    ])}\n`
    output += `  ${maxStats(npc, [
      ['SAVE', 'SaveTarget'],
      ['EVADE', 'Evasion'],
      ['EDEF', 'EDefense'],
    ])}\n`
    output += `  ${maxStats(npc, [
      ['SENS', 'SensorRange'],
      ['SIZE', 'Size'],
      ['ACT', 'Activations'],
    ])}\n`
    const customStats = npc.StatController.CustomStats(npc.ItemType)
    if (customStats.length) {
      output += `  ${customStats.map(s => `${s.title.toUpperCase()}: ${npc.StatController.getMax(s.key)}`).join(' | ')}\n`
    }
    output += '[ FEATURES ]\n  '
    output += npc.NpcFeatureController.Features.map(
      (item, index) => `${item.Name}${linebreak(index, npc.NpcFeatureController.Features.length)}`
    ).join('')

    if (includeNarrative) output += this.generateNarrativeBlock(npc)

    if (includeFeatures) output += this.getFeatures(npc, true)

    return output
  }

  public static ScanNpc(npc: Unit, includeFeatures = false): string {
    let output = `[ ${npc.Name} ]\n`
    if (npc.NpcClassController.HasClass) output += `${npc.NpcClassController.Class!.Name}`
    if (npc.NpcTemplateController.Templates)
      output += ` ${npc.NpcTemplateController.Templates.map(t => t.Name).join(' ')}`
    output += npcSubtitle(npc)
    output += '\n\n'
    output += `ACTIVATIONS: ${npc.StatController.getCurrent('activations')} / ${npc.StatController.getMax('activations')}\n`

    output += `STRUCT: ${npc.StatController.getCurrent('structure')} / ${npc.StatController.getMax('structure')} | ARMOR: ${npc.StatController.getMax('armor')} | HP: ${npc.StatController.getCurrent('hp')} / ${npc.StatController.getMax('hp')}\n`
    output += `STRESS: ${npc.StatController.getCurrent('stress')} / ${npc.StatController.getMax('stress')} | HEAT: ${npc.StatController.getCurrent('heatcap')} / ${npc.StatController.getMax('heatcap')} | SPD: ${npc.StatController.getCurrent('speed')} / ${npc.StatController.getMax('speed')}\n\n`

    output += `${maxStats(npc, [
      ['H', 'Hull'],
      ['A', 'Agi'],
      ['S', 'Sys'],
      ['E', 'Eng'],
    ])}\n`
    output += `${maxStats(npc, [
      ['SAVE', 'SaveTarget'],
      ['EVADE', 'Evasion'],
      ['EDEF', 'EDefense'],
    ])}\n`
    output += `${maxStats(npc, [
      ['SENS', 'SensorRange'],
      ['TECH_ATK', 'Tech Attack'],
      ['SIZE', 'Size'],
    ])} \n\n`

    output += this.getFeatures(npc, includeFeatures)

    return output
  }

  private static getFeatures(npc: Unit, showFeatureDetails = false): string {
    let output = '[ FEATURES ]\n'
    if (showFeatureDetails) {
      output += npc.NpcFeatureController.Features.map(
        item =>
          `${item.Name}\n  ${(item.Description || item.EffectByTier(npc.Tier) || '')?.replace(/<[^>]*>/gi, '') || ''}${item.Actions ? mapNpcActions(item.Actions, npc.Tier) : ''}${mapNpcWeaponStats(item as NpcWeapon, npc.Tier)}`
      ).join('\n')
    } else {
      output += ' '
      output += npc.NpcFeatureController.Features.map(
        (item, index) => `${item.Name}${linebreak(index, npc.NpcFeatureController.Features.length)}`
      ).join('')
    }
    return output
  }

  private static generateNarrativeBlock(npc: Unit): string {
    let output = ''
    if (npc.NarrativeController.TextItems.length > 0) {
      output += '[ ADDITIONAL DETAIL ]\n'
      npc.NarrativeController.TextItems.forEach(item => {
        output += `  ${item.title || (item as any).header}\n   ${item.body.replace(
          /<[^>]*>/gi,
          ''
        )}\n`
      })
    }
    if (npc.NarrativeController.Clocks.length > 0) {
      output += '[ CLOCKS ]\n'
      npc.NarrativeController.Clocks.forEach(clock => {
        output += `  ${clock.Title}: ${'▣'.repeat(clock.Progress)}${'▢'.repeat(
          clock.Segments - clock.Progress
        )}\n`
      })
    }
    if (npc.NarrativeController.Tables.length > 0) {
      output += '[ TABLES ]\n'
      npc.NarrativeController.Tables.forEach(table => {
        output += `  ${table.Title} (${table.Mult}D${table.Die})\n`
        table.Results.forEach(result => {
          output += `    ${result.min} - ${result.max}: ${result.result}\n`
        })
      })
    }
    return output
  }
}

function mapNpcActions(actions: Action[], tier: number): string {
  let output = ''
  actions.forEach(action => {
    output += `\n    [ ${action.Name} - ${action.Activation} ]\n`
    if (action.Trigger) output += `    Trigger: ${action.getTrigger(tier)}\n`
    output += `    ${action.getDetail(tier).replace(/<[^>]*>/gi, '')}\n`
  })
  return output
}

function mapNpcWeaponStats(feature: NpcWeapon, tier: number): string {
  // Called for every feature; weapon-only details (tags like AP, on-hit/crit
  // effects) must be skipped for non-weapon features.
  if (!(feature instanceof NpcWeapon)) return ''

  let output = ''
  if (feature.DamageData) {
    feature.Damage(tier).forEach(d => {
      output += `${d.Value} ${d.Type}, `
    })
  }
  if (feature.RangeData) {
    feature.Range(tier).forEach(r => {
      output += `${r.Value} ${r.Type}, `
    })
  }
  if (feature.Accuracy && feature.Accuracy(tier)) {
    output += `${feature.Accuracy(tier)} Accuracy `
  }
  if (feature.AttackBonus && feature.AttackBonus(tier)) {
    output += `${feature.AttackBonus(tier)} Attack Bonus `
  }
  if (feature.Attacks && feature.Attacks[tier - 1]) {
    output += `${feature.Attacks[tier - 1]} Attacks/Activation `
  }

  const tags = feature.Tags.filter(t => !t.IsHidden).map(t => t.GetName(0, tier))
  if (tags.length) output += `\n  ${tags.join(', ')}`

  output += mapNpcWeaponEffect('On Attack', feature.OnAttack, tier)
  output += mapNpcWeaponEffect('On Hit', feature.OnHit, tier)
  output += mapNpcWeaponEffect('On Crit', feature.OnCrit, tier)
  output += mapNpcWeaponEffect('On Miss', feature.OnMiss, tier)

  return output
}

function mapNpcWeaponEffect(
  label: string,
  effect: ActiveEffect | undefined,
  tier: number
): string {
  const detail = effect?.getDetail(tier)
  if (!detail) return ''
  return `\n  ${label}: ${detail.replace(/<[^>]*>/gi, '')}`
}

export default Statblock
