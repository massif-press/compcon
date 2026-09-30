import { MechWeapon } from './mech/components/equipment/MechWeapon'
import { Mech } from './mech/Mech'
import { PilotWeapon } from './pilot/components/Loadout/equipment/PilotWeapon'
import { Pilot } from './pilot/Pilot'
import { Action } from './Action'
import { NpcWeapon } from './npc/feature/NpcItem/NpcWeapon'
import { Unit } from './npc/unit/Unit'
import { ActiveEffect } from './components/feature/active_effects/ActiveEffect'
import { i18n } from '@/i18n'
import { enumLabel } from '@/i18n/enumLabel'

const tr = (key: string, params: Record<string, unknown> = {}) => i18n.global.t(key, params)
const TR = (key: string, params: Record<string, unknown> = {}) => tr(key, params).toUpperCase()
const hdr = (key: string) => `[ ${TR(key)} ]`

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
    out +=
      ' ' +
      w.Range.filter(Boolean)
        .map(r => `${r.DiscordEmoji} ${r.Value}`)
        .join(' ')
  if (w.Damage && w.Damage.length)
    out +=
      ' ' +
      w.Damage.filter(Boolean)
        .map(d => `${d.DiscordEmoji} ${d.Value}`)
        .join(' ')
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
      ? `, ${tr('common.tierN', { n: npc.NpcClassController.Tier })} `
      : `, ${tr('gm.stats.custom')} `
  return `${tier}${npc.Tag}`
}

// "LABEL: max | LABEL: max ..." stat grid row.
function maxStats(npc: Unit, cols: [string, string][], withBonuses = false): string {
  const sc = npc.StatController
  return cols
    .map(([label, key]) => `${label}: ${withBonuses ? sc.getMaxWithBonuses(key) : sc.getMax(key)}`)
    .join(' | ')
}

class Statblock {
  public static Generate(pilot: Pilot, mech: Mech, discordEmoji: boolean, view: string): string {
    let output = ''

    if (view === 'pilotBuild' || view === 'full') {
      output += `» ${pilot.Name} // ${pilot.Callsign.toUpperCase()} «\n  `
      if (pilot.Background) {
        output += `${pilot.Background}, `
      }
      output += `${tr('active.newSheet.llLevel', { n: pilot.Level })}\n`
      output += `${hdr('common.skillTriggers')}\n  `
      for (let i = 0; i < pilot.SkillsController.Skills.length; i++) {
        const s = pilot.SkillsController.Skills[i]
        output += `${s.Skill.Trigger} (+${s.Bonus})${linebreak(
          i,
          pilot.SkillsController.Skills.length
        )}`
      }

      const loadout = pilot.PilotLoadoutController.ActiveLoadout
      if (loadout) {
        output += `${hdr('common.gear')}\n  `
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
        output += `${hdr('pm.link.bond')}\n  `
        output += `${bond.Bond.Name.toUpperCase()}\n`
        if (bond.BondPowers) {
          output += `  ${tr('pm.sheet.powers')}: `
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
        output += `${hdr('pm.level.mechSkills')}\n  `
        const ms = pilot.MechSkillsController.MechSkills
        output += `${TR('pm.print.grit')}:${pilot.Grit} // ${tr('common.haseHullShort')}:${ms.Hull} ${tr('common.haseAgilityShort')}:${ms.Agi} ${tr('common.haseSystemsShort')}:${ms.Sys} ${tr('common.haseEngineeringShort')}:${ms.Eng}\n`
      }
      output += `${hdr('common.talents')}\n  `
      for (let i = 0; i < pilot.TalentsController.Talents.length; i++) {
        const t = pilot.TalentsController.Talents[i]
        output += `${t.Talent.Name} ${t.Rank}${linebreak(
          i,
          pilot.TalentsController.Talents.length
        )}`
      }

      if (pilot.LicenseController.Licenses.length) {
        output += `${hdr('common.licenses')}\n  `
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
        output += `${hdr('common.coreBonuses')}\n  `
        for (let i = 0; i < pilot.CoreBonusController.CoreBonuses.length; i++) {
          const cb = pilot.CoreBonusController.CoreBonuses[i]
          output += `${cb.Name}${linebreak(i, pilot.CoreBonusController.CoreBonuses.length)}`
        }
      }
    }

    if (mech) {
      if (view === 'full') {
        output += `${hdr('common.mech')}\n  « ${mech.Name.toUpperCase()} »\n  ${mech.Frame.Source} ${
          mech.Frame.Name
        }\n`
        output += `  ${tr('common.haseHullShort')}:${mech.Hull} ${tr('common.haseAgilityShort')}:${mech.Agi} ${tr('common.haseSystemsShort')}:${mech.Sys} ${tr('common.haseEngineeringShort')}:${mech.Eng} ${TR('stats.size')}:${mech.Size}\n`
        output += `  ${TR('stats.structure')}:${mech.MaxStructure}`
        output += ` ${TR('stats.hp')}:${mech.MaxHP}`
        output += ` ${TR('stats.armor')}:${mech.Armor}\n`
        output += `  ${TR('stats.stress')}:${mech.MaxStress}`
        output += ` ${TR('enums.damageType.heat')}:${mech.HeatCapacity}`
        output += ` ${TR('print.statblock.repair')}:${mech.RepairCapacity}\n`
        output += `  ${TR('pm.print.attackBonusShort')}:${mech.AttackBonus} ${TR('pm.print.techAtk')}:${mech.TechAttack} ${TR('pm.print.limitedBonusShort')}:${mech.LimitedBonus}\n`
        output += `  ${TR('print.statblock.speedShort')}:${mech.Speed} ${TR('print.statblock.evasionShort')}:${mech.Evasion} ${TR('print.statblock.edefShort')}:${mech.EDefense} ${TR('print.statblock.sensorsShort')}:${mech.SensorRange} ${TR('print.statblock.save')}:${mech.SaveTarget}\n`

        const loadout = mech.MechLoadoutController.ActiveLoadout
        output += `${hdr('active.mechLoadout.weapons')}\n`
        for (const im of loadout.IntegratedMounts) {
          for (const mw of im.Weapons) {
            output += `  ${TR('print.statblock.integratedMount')}: `
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
            output += TR('pm.loadout.superheavyWeaponBracing')
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

        output += `${hdr('stats.systems')}\n  `
        const allsys = loadout.IntegratedSystems.concat(loadout.Systems)
        allsys.forEach((sys, i) => {
          output += `${sys.TrueName}${linebreak(i, allsys.length)}`
        })
      }
    } else if (view === 'full') {
      output += `\n>> ${TR('print.statblock.noMechSelected')} <<`
    }
    return output
  }

  public static GenerateBuildSummary(pilot: Pilot, mech: Mech, discordEmoji: boolean): string {
    if (mech) {
      const mechLoadout = mech.MechLoadoutController.ActiveLoadout
      return `-- ${tr('print.statblock.buildHeader', { source: mech.Frame.Source, frame: mech.Frame.Name, n: pilot.Level })} --
${hdr('common.licenses')}
  ${
    pilot.LicenseController.Licenses.length
      ? `${pilot.LicenseController.Licenses.map(l => {
          if (l.License) return `${l.License.Source} ${l.License.Name} ${l.Rank}`
          else if (l.Stub) return `${l.Stub.Source} ${l.Stub.Name}`
          return ''
        }).join(', ')}`
      : tr('active.sheetItem.na')
  }
${hdr('common.coreBonuses')}
  ${
    pilot.CoreBonusController.CoreBonuses.length
      ? `${pilot.CoreBonusController.CoreBonuses.map(cb => cb.Name).join(', ')}`
      : tr('active.sheetItem.na')
  }
${hdr('common.talents')}
  ${pilot.TalentsController.Talents.map(t => `${t.Talent.Name} ${t.Rank}`).join(', ')}
${hdr('common.statsLabel')}
  ${TR('stats.hull')}:${pilot.MechSkillsController.MechSkills.Hull} ${TR('stats.agi')}:${
    pilot.MechSkillsController.MechSkills.Agi
  } ${TR('pm.link.sys')}:${pilot.MechSkillsController.MechSkills.Sys} ${TR('print.statblock.engi')}:${
    pilot.MechSkillsController.MechSkills.Eng
  }
  ${TR('stats.structure')}:${mech.MaxStructure} ${TR('stats.hp')}:${mech.MaxHP} ${TR('stats.armor')}:${mech.Armor}
  ${TR('stats.stress')}:${mech.MaxStress} ${TR('stats.heatCap')}:${mech.HeatCapacity} ${TR('print.statblock.repair')}:${mech.RepairCapacity}
  ${TR('pm.print.techAtk')}:${mech.TechAttack > 0 ? `+${mech.TechAttack}` : mech.TechAttack} ${TR('print.statblock.limited')}:+${
    mech.LimitedBonus
  }
  ${TR('print.statblock.speedShort')}:${mech.Speed} ${TR('print.statblock.evasionShort')}:${mech.Evasion} ${TR('print.statblock.edefShort')}:${mech.EDefense} ${TR('print.statblock.sense')}:${mech.SensorRange} ${TR('print.statblock.save')}:${
    mech.SaveTarget
  }
${hdr('active.mechLoadout.weapons')}
  ${mechLoadout.IntegratedMounts.map(
    mount =>
      `${tr('enums.mountType.integrated')}: ${mount.Weapon ? mount.Weapon.TrueName : `${tr('active.sheetItem.na')}  `}${
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
      if (mount.IsLocked) out += TR('pm.loadout.superheavyWeaponBracing')
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
${hdr('stats.systems')}
  ${mechLoadout.Systems.map(sys => {
    let out = sys.TrueName
    if (sys.IsLimited) out += ` x${sys.getTotalUses(mech.LimitedBonus)}`
    return out
  }).join(', ')}`
    } else return `>> ${TR('print.statblock.noMechSelected')} <<`
  }

  public static GenerateNPC(npc: Unit, includeNarrative: boolean, includeFeatures = false): string {
    let output = `// ${npc.Name} //\n`
    if (npc.NpcTemplateController.Templates)
      output += `${npc.NpcTemplateController.Templates.map(t => t.Name).join(' ')}`
    if (npc.NpcClassController.HasClass)
      output += ` ${npc.NpcClassController.Class!.Name.toUpperCase()}`
    output += npcSubtitle(npc)
    output += '\n'
    output += `${hdr('common.statsLabel')}\n`
    output += `  ${maxStats(
      npc,
      [
        [tr('common.haseHullShort'), 'Hull'],
        [tr('common.haseAgilityShort'), 'Agi'],
        [tr('common.haseSystemsShort'), 'Sys'],
        [tr('common.haseEngineeringShort'), 'Eng'],
      ],
      true
    )}\n`
    output += `  ${maxStats(
      npc,
      [
        [TR('print.statblock.structShort'), 'Structure'],
        [TR('stats.armor'), 'Armor'],
        [TR('stats.hp'), 'hp'],
      ],
      true
    )}\n`
    output += `  ${maxStats(
      npc,
      [
        [TR('stats.stress'), 'Stress'],
        [TR('stats.heatCap'), 'heatcap'],
        [TR('print.statblock.speedShort'), 'Speed'],
      ],
      true
    )}\n`
    output += `  ${maxStats(
      npc,
      [
        [TR('print.statblock.save'), 'SaveTarget'],
        [TR('ui.compendiumBrowser.evade'), 'Evasion'],
        [TR('print.statblock.edefShort'), 'EDefense'],
      ],
      true
    )}\n`
    output += `  ${maxStats(
      npc,
      [
        [TR('print.statblock.sensorsShort'), 'SensorRange'],
        [TR('stats.size'), 'Size'],
        [TR('print.statblock.act'), 'Activations'],
      ],
      true
    )}\n`
    const customStats = npc.StatController.CustomStats(npc.ItemType)
    if (customStats.length) {
      output += `  ${customStats.map(s => `${s.title.toUpperCase()}: ${npc.StatController.getMaxWithBonuses(s.key)}`).join(' | ')}\n`
    }
    output += `${hdr('common.features')}\n  `
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
    output += `${TR('active.customStatEditor.activations')}: ${npc.StatController.getCurrent('activations')} / ${npc.StatController.getMax('activations')}\n`

    output += `${TR('print.statblock.structShort')}: ${npc.StatController.getCurrent('structure')} / ${npc.StatController.getMax('structure')} | ${TR('stats.armor')}: ${npc.StatController.getMax('armor')} | ${TR('stats.hp')}: ${npc.StatController.getCurrent('hp')} / ${npc.StatController.getMax('hp')}\n`
    output += `${TR('stats.stress')}: ${npc.StatController.getCurrent('stress')} / ${npc.StatController.getMax('stress')} | ${TR('enums.damageType.heat')}: ${npc.StatController.getCurrent('heatcap')} / ${npc.StatController.getMax('heatcap')} | ${TR('print.statblock.speedShort')}: ${npc.StatController.getCurrent('speed')} / ${npc.StatController.getMax('speed')}\n\n`

    output += `${maxStats(npc, [
      [tr('common.haseHullShort'), 'Hull'],
      [tr('common.haseAgilityShort'), 'Agi'],
      [tr('common.haseSystemsShort'), 'Sys'],
      [tr('common.haseEngineeringShort'), 'Eng'],
    ])}\n`
    output += `${maxStats(npc, [
      [TR('print.statblock.save'), 'SaveTarget'],
      [TR('ui.compendiumBrowser.evade'), 'Evasion'],
      [TR('print.statblock.edefShort'), 'EDefense'],
    ])}\n`
    output += `${maxStats(npc, [
      [TR('print.statblock.sensorsShort'), 'SensorRange'],
      [TR('pm.print.techAtk'), 'Tech Attack'],
      [TR('stats.size'), 'Size'],
    ])} \n\n`

    output += this.getFeatures(npc, includeFeatures)

    return output
  }

  private static getFeatures(npc: Unit, showFeatureDetails = false): string {
    let output = `${hdr('common.features')}\n`
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
      output += `${hdr('gm.narrative.additionalDetail')}\n`
      npc.NarrativeController.TextItems.forEach(item => {
        output += `  ${item.header || (item as any).title}\n   ${item.body.replace(
          /<[^>]*>/gi,
          ''
        )}\n`
      })
    }
    if (npc.NarrativeController.Clocks.length > 0) {
      output += `${hdr('gm.narrative.clocks')}\n`
      npc.NarrativeController.Clocks.forEach(clock => {
        output += `  ${clock.Title}: ${'▣'.repeat(clock.Progress)}${'▢'.repeat(
          clock.Segments - clock.Progress
        )}\n`
      })
    }
    if (npc.NarrativeController.Tables.length > 0) {
      output += `${hdr('common.tables')}\n`
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
    output += `\n    [ ${action.Name} - ${enumLabel('activationType', action.Activation)} ]\n`
    if (action.Trigger) output += `    ${tr('common.trigger')}: ${action.getTrigger(tier)}\n`
    output += `    ${action.getDetail(tier).replace(/<[^>]*>/gi, '')}\n`
  })
  return output
}

function mapNpcWeaponStats(feature: NpcWeapon, tier: number): string {
  if (!(feature instanceof NpcWeapon)) return ''

  let output = ''
  if (feature.DamageData) {
    feature.Damage(tier).forEach(d => {
      output += `${d.Value} ${enumLabel('damageType', d.Type)}, `
    })
  }
  if (feature.RangeData) {
    feature.Range(tier).forEach(r => {
      output += `${r.Value} ${enumLabel('rangeType', r.Type)}, `
    })
  }
  if (feature.Accuracy && feature.Accuracy(tier)) {
    output += `${tr('print.statblock.accuracyValue', { n: feature.Accuracy(tier) })} `
  }
  if (feature.AttackBonus && feature.AttackBonus(tier)) {
    output += `${tr('print.statblock.attackBonusValue', { n: feature.AttackBonus(tier) })} `
  }
  if (feature.Attacks && feature.Attacks[tier - 1]) {
    output += `${tr('print.statblock.attacksPerActivation', { n: feature.Attacks[tier - 1] })} `
  }

  const tags = feature.Tags.filter(t => !t.IsHidden).map(t => t.GetName(0, tier))
  if (tags.length) output += `\n  ${tags.join(', ')}`

  output += mapNpcWeaponEffect(tr('pm.print.onAttack'), feature.OnAttack, tier)
  output += mapNpcWeaponEffect(tr('pm.print.onHit'), feature.OnHit, tier)
  output += mapNpcWeaponEffect(tr('pm.print.onCrit'), feature.OnCrit, tier)
  output += mapNpcWeaponEffect(tr('pm.print.onMiss'), feature.OnMiss, tier)

  return output
}

function mapNpcWeaponEffect(label: string, effect: ActiveEffect | undefined, tier: number): string {
  const detail = effect?.getDetail(tier)
  if (!detail) return ''
  return `\n  ${label}: ${detail.replace(/<[^>]*>/gi, '')}`
}

export default Statblock
