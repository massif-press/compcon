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

function strip(text: string) {
  text = text.replace(/<br\/?>/gi, '\n')
  var doc = new DOMParser().parseFromString(text, 'text/html')
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
      gear: pilot.ActiveLoadout.Gear.map(
        gear => gear.Name + (gear.MaxUses ? ` x${gear.MaxUses}` : '')
      ).join('\n'),
      armor: pilot.ActiveLoadout.Armor.map(armor => ({
        name: armor.Name,
        armor: armor.Armor,
        evade: armor.Evasion,
        edef: armor.EDefense,
        speed: armor.Speed,
        bonusHP: armor.HPBonus,
      }))[0],
      weapons: pilot.ActiveLoadout.Weapons.map(weapon => ({
        name: weapon.Name,
        // filter out blast since it's never used as the only "range" really
        range: weapon.Range.filter(r => r.Type != RangeType.Blast)[0].Max,
        damage: weapon.Damage.map(dmg => dmg.Value).join('+'),
        type: weapon.Damage[0].Type,
        tags: weapon.Tags.map(tag => tag.GetName(pilot.LimitedBonus)).join(', '),
      })).slice(0, 2),
      licenses: pilot.Licenses.map(l => ({
        name: `${l.License.Source} ${l.License.Name}`,
        rank: l.Rank,
      })),
      coreBonuses: pilot.CoreBonuses.map(cb => cb.Name + '\n' + cb.Description).join('\n'),
    },
    //
    //
    talents: pilot.Talents.map(talent => ({
      ranks: talent.Talent.Ranks.map(rank => ({
        name: rank.name,
        description: strip(rank.description),
      })),
      currentRank: talent.Rank,
    })),
    //
    //
    frame: {
      name: mech.Frame.ID === 'everest' ? 'GMS EVEREST' : mech.Frame.Name.toUpperCase(),
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
        damage: weapon.Damage.map(dmg => dmg.Value).join('+'),
        damageType: weapon.Damage[0].Type,
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
        effect: strip(system.Effect),
      })),
    },
  }
  return output
}
