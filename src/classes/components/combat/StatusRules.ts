type DifficultyKind = 'attack' | 'save' | 'check' | 'ranged' | 'melee' | 'tech'
type CheckKey = 'hull' | 'agi' | 'sys' | 'eng'

interface IStatusRule {
  difficulty?: Partial<Record<DifficultyKind, number>>
  accuracyAgainst?: number
  difficultyAgainst?: number
  autoFail?: CheckKey[]
  denies?: string[]
  permits?: string[]
  caps?: Record<string, number>
  implies?: string[]
  immuneIf?: string[]
  untargetable?: boolean
  missChance?: number
  dropsOnAttack?: boolean
  dropsOnHostileAction?: boolean
  immuneToAlliedTech?: boolean
  immuneToTech?: boolean
  fromTechAction?: boolean
}

const STATUS_RULES: Record<string, IStatusRule> = {
  impaired: {
    difficulty: { attack: 1, save: 1, check: 1 },
  },
  stunned: {
    denies: ['*'],
    permits: ['mount', 'dismount', 'eject', 'act_boot_up'],
    caps: { evasion: 5 },
    autoFail: ['hull', 'agi'],
  },
  slow: {
    denies: ['boost'],
  },
  immobilized: {
    denies: ['move', 'boost'],
  },
  prone: {
    accuracyAgainst: 1,
    implies: ['slow'],
    immuneIf: ['flying'],
  },
  invisible: {
    missChance: 0.5,
  },
  engaged: {
    difficulty: { ranged: 1 },
  },
  hidden: {
    untargetable: true,
    dropsOnAttack: true,
    dropsOnHostileAction: true,
  },
  jammed: {
    denies: ['*'],
    permits: ['move', 'boost', 'improvised_attack', 'grapple', 'ram'],
    immuneToAlliedTech: true,
  },
  downandout: {
    denies: ['*'],
  },
  'shut-down': {
    implies: ['stunned'],
    permits: ['act_boot_up'],
    immuneToTech: true,
  },
  lockon: {
    fromTechAction: true,
  },
}

const DIFFICULTY_KINDS: Record<string, DifficultyKind[]> = {
  ranged: ['attack', 'ranged'],
  melee: ['attack', 'melee'],
  tech: ['attack', 'tech'],
}

function ruleFor(statusID: string): IStatusRule | undefined {
  return STATUS_RULES[statusID.toLowerCase()]
}

function kindsFor(kind: string): DifficultyKind[] {
  return DIFFICULTY_KINDS[kind.toLowerCase()] ?? [kind.toLowerCase() as DifficultyKind]
}

const CUSTOM_STATUS_RULES: Record<string, IStatusRule> = {
  'brace cooldown': {
    denies: ['*'],
    permits: ['quick', 'quick1', 'quick2'],
  },
}

function customRuleFor(attribute: string): IStatusRule | undefined {
  return CUSTOM_STATUS_RULES[attribute.toLowerCase()]
}

export { STATUS_RULES, CUSTOM_STATUS_RULES, ruleFor, customRuleFor, kindsFor }
export type { IStatusRule, DifficultyKind, CheckKey }
