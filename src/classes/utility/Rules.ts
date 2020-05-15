import { rules } from 'lancer-data'

export class Rules {
  public static get BaseStructure(): number {
    return rules.base_structure
  }

  public static get BaseStress(): number {
    return rules.base_stress
  }

  public static get BaseGrapple(): number {
    return rules.base_grapple
  }

  public static get BaseRam(): number {
    return rules.base_ram
  }

  public static get BasePilotHP(): number {
    return rules.base_pilot_hp
  }

  public static get BasePilotEvasion(): number {
    return rules.base_pilot_evasion
  }

  public static get BasePilotEdef(): number {
    return rules.base_pilot_edef
  }

  public static get BasePilotSpeed(): number {
    return rules.base_pilot_speed
  }

  public static get MinimumPilotSkills(): number {
    return rules.minimum_pilot_skills
  }

  public static get MinimumMechSkills(): number {
    return rules.minimum_mech_skills
  }

  public static get MinimumPilotTalents(): number {
    return rules.minimum_pilot_talents
  }

  public static get TriggerBonusPerRank(): number {
    return rules.trigger_bonus_per_rank
  }

  public static get MaxTriggerRank(): number {
    return rules.max_trigger_rank
  }

  public static get MaxPilotLevel(): number {
    return rules.max_pilot_level
  }

  public static get MaxPilotWeapons(): number {
    return rules.max_pilot_weapons
  }

  public static get MaxPilotArmor(): number {
    return rules.max_pilot_armor
  }

  public static get MaxPilotGear(): number {
    return rules.max_pilot_gear
  }

  public static get MaxFrameSize(): number {
    return rules.max_frame_size
  }

  public static get MaxMechArmor(): number {
    return rules.max_mech_armor
  }

  public static get MaxHase(): number {
    return rules.max_hase
  }

  public static get MountFittings(): object {
    return rules.mount_fittings
  }

  public static Overcharge(): string[] {
    return rules.overcharge
  }
}
