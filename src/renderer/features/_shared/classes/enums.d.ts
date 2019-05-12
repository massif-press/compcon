declare enum MountType {
  Main = "Main",
  Heavy = "Heavy",
  AuxAux = "Aux/Aux",
  MainAux = "Main/Aux",
  Flex = "Flex",
  Integrated = "Integrated"
}

// governs what can be added to a mount (weapon slot)
declare enum FittingSize {
  Auxiliary = "Auxiliary",
  Main = "Main",
  Flex = "Flex",
  Heavy = "Heavy",
  Integrated = "Integrated"
}

declare enum WeaponSize {
  Aux = "Auxiliary",
  Main = "Main",
  Heavy = "Heavy",
  Superheavy = "Superheavy"
}

declare enum WeaponType {
  Rifle = "Rifle",
  Cannon = "Cannon",
  Launcher = "Launcher",
  CQB = "CQB",
  Nexus = "Nexus",
  Melee = "Melee"
}

declare enum ItemType {
  None = "",
  Action = "Action",
  Background = "Background",
  CoreBonus = "CoreBonus",
  Frame = "Frame",
  PilotArmor = "PilotArmor",
  PilotWeapon = "PilotWeapon",
  PilotGear = "PilotGear",
  Skill = "Skill",
  Talent = "Talent",
  Tag = "Tag",
  MechWeapon = "MechWeapon",
  MechSystem = "MechSystem",
  Mod = "Mod"
}

declare enum SystemType {
  System = "System",
  AI = "AI",
  Shield = "Shield",
  Deployable = "Deployable",
  Drone = "Drone",
  Tech = "Tech",
  Armor = "Armor",
  FlightSystem = "Flight System",
  Integrated = "Integrated"
}

declare enum SkillFamily {
  str = 'str',
  dex = 'dex',
  int = 'int',
  cha = 'cha'
}

declare enum RangeType {
  Range = 'Range',
  Threat = 'Threat',
  Thrown = 'Thrown',
  Line = 'Line',
  Cone = 'Cone',
  Blast = 'Blast',
  Burst = 'Burst'
}

declare enum DamageType {
  Kinetic = 'Kinetic',
  Energy = 'Energy',
  Explosive = 'Explosive',
  Heat = 'Heat',
  Burn = 'Burn',
  Variable = 'Variable'
}