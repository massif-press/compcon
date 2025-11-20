enum Duration {
  Free = 'Free',
  Turn = 'Turn',
  NextTurn = 'Next Turn',
  Round = 'Round',
  NextRound = 'Next Round',
  Scene = 'Scene',
  Encounter = 'Encounter',
  Mission = 'Mission',
}

enum ActivationType {
  None = 'None',
  Free = 'Free',
  Protocol = 'Protocol',
  Quick = 'Quick',
  Full = 'Full',
  Invade = 'Invade',
  FullTech = 'Full Tech',
  QuickTech = 'Quick Tech',
  Reaction = 'Reaction',
  Move = 'Move',
}

enum MountType {
  Main = 'Main',
  Heavy = 'Heavy',
  AuxAux = 'Aux/Aux',
  Aux = 'Aux',
  MainAux = 'Main/Aux',
  Flex = 'Flex',
  Integrated = 'Integrated',
  Superheavy = 'Superheavy',
}

// governs what can be added to a mount (weapon slot)
enum FittingSize {
  Auxiliary = 'Auxiliary',
  Main = 'Main',
  Flex = 'Flex',
  Heavy = 'Heavy',
  Integrated = 'Integrated',
  Superheavy = 'Superheavy',
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
  All = '???',
  Improvised = 'Improvised',
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
  SystemMod = 'SystemMod',
  NpcFeature = 'NpcFeature',
  Character = 'Character',
  Location = 'Location',
  Faction = 'Faction',
  Reserve = 'Reserve',
  NpcClass = 'NpcClass',
  NpcTemplate = 'NpcTemplate',
  NpcWeapon = 'NpcWeapon',
  NpcSystem = 'NpcSystem',
  NpcTech = 'NpcTech',
  NpcTrait = 'NpcTrait',
  NpcReaction = 'NpcReaction',
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
  Mine = 'Mine',
  Grenade = 'Grenade',
  Charge = 'Charge',
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
  Resources = 'Resources',
  Tactical = 'Tactical',
  Mech = 'Mech',
  Project = 'Project',
  Organization = 'Organization',
  Bonus = 'Bonus',
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

enum ImageTag {
  Pilot = 'pilot',
  NPC = 'npc',
  Enemy = 'enemy',
  Frame = 'frame',
  Mech = 'mech',
  Map = 'map',
  Location = 'location',
  Object = 'object',
  Logo = 'logo',
  Misc = 'misc',
  Emblem = 'emblem',
}

export {
  Duration,
  ActivationType,
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
  ImageTag,
};
