/* eslint-disable @typescript-eslint/indent */
import { Pilot, RangeType } from '@/class'
import Mech from '@/classes/mech/Mech'

interface IRoll20Data {
  ////////
  // PILOT
  ////////
  pilot: {
    name: string
    level: number
    // Player: does not apply
    callsign: string
    background: string
    //
    hp: number
    // Mech skills
    hull: number
    agility: number
    systems: number
    engineering: number
    // Triggers
    triggers: {
      name: string
      bonus: number
    }[]
    notes: string
    //
    backstory: string
    appearance: string
    gear: string
    armor: {
      name: string
      armor: number
      evade: number
      edef: number
      speed: number
      bonusHP: number
    }
    weapons: {
      name: string
      range: number
      damage: string
      type: string
      tags: string
    }[]
    //
    licenses: {
      name: string
      rank: number
    }[]
    coreBonuses: string
  }
  //   reserves: string
  ////////
  // TALENTS
  ////////
  talents: {
    name: string
    ranks: {
      name: string
      description: string
    }[]
    currentRank: number
  }[]
  ////////
  // FRAME
  ////////
  frame: {
    name: string
    type: string
    size: number
    sp: number
    armor: number
    evasion: number
    edefense: number
    speed: number
    sensors: number
    techAttack: number
    mounts: string[]
    weapons: {
      name: string
      type: string
      range: number
      altRanges: string
      damage: string
      damageType: string
      tags: string
      notes: string
    }[]
    corePassive: string
    coreActive: string
    traits: {
      name: string
      description: string
    }[]
    systems: {
      name: string
      tags: string
      sp: number
      effect: string
    }[]
  }
}

function strip(text: string): string {
  text = text.replace(/<br\/?>/gi, '\n')
  const doc = new DOMParser().parseFromString(text, 'text/html')
  return doc.body.textContent || ''
}

export default function pilotToRoll20(pilot: Pilot, mech: Mech): IRoll20Data {
  const output = {
    pilot: {
      name: pilot.Name,
      level: pilot.Level,
      callsign: pilot.Callsign,
      background: pilot.Background,
      hp: pilot.MaxHP,
      //
      hull: pilot.MechSkills.Hull,
      agility: pilot.MechSkills.Agi,
      systems: pilot.MechSkills.Sys,
      engineering: pilot.MechSkills.Eng,
      //
      triggers: pilot.Skills.map(skill => ({
        name: skill.Title,
        bonus: skill.Bonus,
      })),
      notes: pilot.Notes,
      //
      backstory: pilot.History,
      appearance: pilot.TextAppearance,
      gear: pilot.Loadout.Gear.map(gear =>
        gear ? gear.Name + (gear.MaxUses ? ` x${gear.MaxUses}` : '') : ''
      ).join('\n'),
      armor: pilot.Loadout.Armor.map(armor =>
        armor
          ? {
              name: armor.Name,
              armor: armor.Armor,
              evade: armor.Evasion,
              edef: armor.EDefense,
              speed: armor.Speed,
              bonusHP: armor.HPBonus,
            }
          : null
      )[0],
      weapons: pilot.Loadout.Weapons.map(weapon =>
        weapon
          ? {
              name: weapon.Name,
              // filter out blast since it's never used as the only "range" really
              range: weapon.Range.filter(r => r.Type != RangeType.Blast)[0].Max,
              damage: weapon.Damage.map(dmg => dmg.Value).join('+'),
              type: weapon.Damage[0].Type,
              tags: weapon.Tags.map(tag => tag.GetName(pilot.LimitedBonus)).join(', '),
            }
          : null
      ).slice(0, 2),
      licenses: pilot.Licenses.map(l => ({
        name: `${l.License.Source} ${l.License.Name}`,
        rank: l.Rank,
      })),
      coreBonuses: pilot.CoreBonuses.map(cb => cb.Name + '\n' + cb.Description).join('\n'),
    },
    //
    //
    talents: pilot.Talents.map(talent => ({
      name: talent.Talent.Name,
      ranks: talent.Talent.Ranks.map(rank => ({
        name: rank.name,
        description: strip(rank.description),
      })),
      currentRank: talent.Rank,
    })),
    //
    //
    frame: {
      name: mech.Name,
      type: mech.Frame.ID === 'everest' ? 'GMS EVEREST' : mech.Frame.Name.toUpperCase(),
      size: mech.Size,
      sp: mech.MaxSP,
      armor: mech.Armor,
      evasion: mech.Evasion,
      edefense: mech.EDefense,
      speed: mech.Speed,
      sensors: mech.SensorRange,
      techAttack: mech.TechAttack,
      mounts: [mech.Frame.Mounts[0], mech.Frame.Mounts[1], mech.Frame.Mounts[2]],
      weapons: mech.ActiveLoadout.Weapons.map(weapon => ({
        name: weapon.Name,
        type: `${weapon.Size} ${weapon.Type}`,
        range: weapon.Range.filter(r => r.Type != RangeType.Blast)[0].Max,
        altRanges: weapon.Range.filter(r => r.Type != RangeType.Range)
          .map(r => r.Text)
          .join('|'),
        damage: weapon.Damage.map(dmg => dmg.Value).join('|'),
        damageType: weapon.Damage.map(dmg => dmg.Type).join('|'),
        tags: weapon.Tags.map(tag => tag.GetName(pilot.LimitedBonus)).join(', '),
        notes: weapon.Note,
      })),
      corePassive: `${mech.Frame.CoreSystem.PassiveName}\n${mech.Frame.CoreSystem.PassiveEffect}`,
      coreActive: `${mech.Frame.CoreSystem.ActiveName}\n${mech.Frame.CoreSystem.ActiveEffect}`,
      traits: mech.Frame.Traits.map(rank => ({
        name: rank.name,
        description: strip(rank.description),
      })),
      systems: mech.ActiveLoadout.Systems.map(system => ({
        name: system.Name,
        tags: system.Tags.map(tag => tag.GetName(pilot.LimitedBonus)).join(', '),
        sp: system.SP,
        effect: system.Effect.map(effect => effect.toString()).join('\n'),
      })),
    },
  }
  return output
}
