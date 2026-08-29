import type { PrintOption } from './types'

function opt(key: string, title: string, icon?: string): PrintOption {
  return { key, title, icon }
}

const LAYOUT = {
  minimal: opt('minimal', 'Minimal', 'mdi-text-short'),
  terse: opt('terse', 'Terse', 'mdi-file-document-outline'),
  standard: opt('standard', 'Standard', 'mdi-book-open'),
  expanded: opt('expanded', 'Expanded', 'mdi-book-open-page-variant-outline'),
  cards: opt('cards', 'Cards', 'mdi-cards-outline'),
} as const

const ORIENTATION = {
  portrait: opt('portrait', 'Portrait', 'mdi-file'),
  landscape: opt('landscape', 'Landscape', 'mdi-note'),
} as const

const PAPER = {
  letter: opt('letter', 'Letter', 'mdi-text-box-check-outline'),
  a4: opt('a4', 'A4', 'mdi-file-star-four-points-outline'),
} as const

const CONTENT = {
  pilot: opt('pilot', 'Pilot', 'cc:pilot'),
  blank: opt('blank', 'Blank', 'mdi-checkbox-blank-badge-outline'),
} as const

const BONDS = {
  include: opt('bondsInclude', 'Include', 'mdi-link'),
  omit: opt('bondsOmit', 'Omit', 'mdi-link-off'),
} as const

const CARD = {
  standardActions: opt('standardActions', 'Include Standard Actions', 'mdi-hexagon-slice-3'),
  statusCards: opt('statusCards', 'Include Status/Condition Cards', 'cc:eclipse'),
} as const

const INCLUDE = {
  pilotPortrait: opt('pilotPortrait', 'Pilot Portrait'),
  separateTalentDetail: opt('separateTalentDetail', 'Separate Talent Detail'),
  appearanceNotes: opt('appearanceNotes', 'Appearance Notes'),
  pilotBiography: opt('pilotBiography', 'Pilot Biography'),
  pilotNotes: opt('pilotNotes', 'Pilot Notes'),
  expandedTags: opt('expandedTags', 'Show Expanded Tags'),
  extraEquipmentSpace: opt('extraEquipmentSpace', 'Extra Equipment Space'),
  extraReserveSpace: opt('extraReserveSpace', 'Extra Reserve Space'),
  expandedMissionLog: opt('expandedMissionLog', 'Expanded Mission Log'),
  mechImage: opt('mechImage', 'Mech Image'),
  mechNotes: opt('mechNotes', 'Mech Notes'),
  extraMountPanel: opt('extraMountPanel', 'Extra Mount Panel'),
  extraSystemSpace: opt('extraSystemSpace', 'Extra System Space'),
  image: opt('image', 'Include Image'),
  map: opt('map', 'Include Map'),
  additionalDetail: opt('additionalDetail', 'Additional Detail'),
  clocks: opt('clocks', 'Clocks'),
  tables: opt('tables', 'Tables'),
  gmNotes: opt('gmNotes', 'GM Notes'),
  passiveFeatures: opt('passiveFeatures', 'Passive Features'),
  appendLined: opt('appendLined', 'Append Lined Section'),
  appendUnlined: opt('appendUnlined', 'Append Unlined Section'),
} as const

const EXTRA = {
  tagRef: opt('tagRef', 'Relevant Tag Reference'),
  triggerRef: opt('triggerRef', 'Relevant Trigger Reference'),
  combatRef: opt('combatRef', 'Combat Quick Reference'),
  actionRef: opt('actionRef', 'Action Reference'),
  downtimeRef: opt('downtimeRef', 'Downtime Quick Reference'),
  gmTracker: opt('gmTracker', 'GM Tracker'),
} as const

function has(list: PrintOption[] | undefined, key: string): boolean {
  return list?.some(x => x?.key === key) ?? false
}

export { LAYOUT, ORIENTATION, PAPER, CONTENT, BONDS, CARD, INCLUDE, EXTRA, has }
