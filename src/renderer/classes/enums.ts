enum MountType {
  Main = 'Main',
  Heavy = 'Heavy',
  AuxAux = 'Aux/Aux',
  Aux = 'Aux',
  MainAux = 'Main/Aux',
  Flex = 'Flex',
  Integrated = 'Integrated',
}

// governs what can be added to a mount (weapon slot)
enum FittingSize {
  Auxiliary = 'Auxiliary',
  Main = 'Main',
  Flex = 'Flex',
  Heavy = 'Heavy',
  Integrated = 'Integrated',
}

enum WeaponSize {
  Aux = 'Auxiliary',
  Main = 'Main',
  Heavy = 'Heavy',
  Superheavy = 'Superheavy',
}

enum WeaponType {
  Rifle = 'Rifle',
  Cannon = 'Cannon',
  Launcher = 'Launcher',
  CQB = 'CQB',
  Nexus = 'Nexus',
  Melee = 'Melee',
}

enum ItemType {
  None = '',
  Action = 'Action',
  CoreBonus = 'CoreBonus',
  Frame = 'Frame',
  PilotArmor = 'PilotArmor',
  PilotWeapon = 'PilotWeapon',
  PilotGear = 'PilotGear',
  Skill = 'Skill',
  Talent = 'Talent',
  Tag = 'Tag',
  MechWeapon = 'MechWeapon',
  MechSystem = 'MechSystem',
  WeaponMod = 'WeaponMod',
}

enum SystemType {
  System = 'System',
  AI = 'AI',
  Shield = 'Shield',
  Deployable = 'Deployable',
  Drone = 'Drone',
  Tech = 'Tech',
  Armor = 'Armor',
  FlightSystem = 'Flight System',
  Integrated = 'Integrated',
  Mod = 'Mod',
}

enum SkillFamily {
  str = 'str',
  dex = 'dex',
  int = 'int',
  cha = 'cha',
}

enum RangeType {
  Range = 'Range',
  Threat = 'Threat',
  Thrown = 'Thrown',
  Line = 'Line',
  Cone = 'Cone',
  Blast = 'Blast',
  Burst = 'Burst',
}

enum DamageType {
  Kinetic = 'Kinetic',
  Energy = 'Energy',
  Explosive = 'Explosive',
  Heat = 'Heat',
  Burn = 'Burn',
  Variable = 'Variable',
}

enum MechType {
  Balanced = 'Balanced',
  Artillery = 'Artillery',
  Striker = 'Striker',
  Controller = 'Controller',
  Support = 'Support',
  Defender = 'Defender',
}

enum HASE {
  H = 'hull',
  A = 'agi',
  S = 'sys',
  E = 'eng',
}

enum ReserveType {
  Narrative = 'Narrative',
  Tactical = 'Tactical',
  Mech = 'Mech',
  Project = 'Project',
  Organization = 'Organization',
}

enum OrgType {
  Military = 'Military',
  Scientific = 'Scientific',
  Academic = 'Academic',
  Criminal = 'Criminal',
  Humanitarian = 'Humanitarian',
  Industrial = 'Industrial',
  Entertainment = 'Entertainment',
  Political = 'Political',
}

enum EncounterSide {
  Enemy = 'Enemy',
  Ally = 'Ally',
  Neutral = 'Neutral',
}

export {
  MountType,
  FittingSize,
  WeaponSize,
  WeaponType,
  ItemType,
  SystemType,
  SkillFamily,
  RangeType,
  DamageType,
  HASE,
  MechType,
  ReserveType,
  OrgType,
  EncounterSide,
}
