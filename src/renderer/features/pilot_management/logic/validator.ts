import { Pilot, Mech, MountType, EquippableMount, Frame } from '@/class'
import io from '@/features/_shared/data_io'
import store from '@/store'

function isValidJSON(text: string) {
  try {
    JSON.parse(text)
    return true
  } catch (e) {
    return false
  }
}

function convertPilot(old: any): IPilotData {
  return {
    id: old.id,
    gistID: '',
    level: old.level,
    callsign: old.callsign,
    name: old.name,
    text_appearance: old.text_appearance || '',
    notes: old.notes || '',
    history: old.history || '',
    portrait: old.portrait || '',
    cloud_portrait: '',
    quirk: '',
    current_hp: old.current_hp || 6,
    active: false,
    background: old.custom_background ? 'ai' : old.background,
    mechSkills: [
      old.mechSkills.hull,
      old.mechSkills.agi,
      old.mechSkills.sys,
      old.mechSkills.eng,
    ],
    licenses: old.licenses.map((x: any) => ({
      id: licenseNameToId(x.name),
      rank: x.level,
    })),
    skills: old.skills.map((x: any) => ({ id: x.id, rank: x.bonus / 2 })),
    talents: old.talents.map((x: any) => ({ id: x.id, rank: x.rank })),
    core_bonuses: old.core_bonuses,
    loadouts: old.loadouts
      ? old.loadouts.map((x: any) => convertPilotLoadouts(x))
      : [],
    active_loadout: null,
    mechs: old.configs ? old.configs.map((x: any) => convertMechs(x)) : [],
    active_mech: null,
    cc_ver: '1.3.7',
  }
}

function licenseNameToId(name: string): string {
  const frames = store.getters.getItemCollection('Frames') as Frame[]
  const match = frames.find(x => x.Name === name)
  return match ? match.ID : 'err'
}

function convertPilotLoadouts(old: any): IPilotLoadoutData {
  return {
    id: old.id,
    name: old.name,
    armor: old.items.armor.map((x: any) =>
      x ? { id: x.id, notes: [] } : null
    ),
    weapons: old.items.weapon.map((x: any) =>
      x ? { id: x.id, notes: [] } : null
    ),
    gear: old.items.gear.map((x: any) => (x ? { id: x.id, notes: [] } : null)),
  }
}

function convertMechs(old: any): IMechData {
  return {
    id: old.id,
    name: old.name,
    notes: '',
    portrait: old.portrait || '',
    cloud_portrait: '',
    frame: old.frame_id,
    active: false,
    current_structure: 0,
    current_hp: 0,
    current_stress: 0,
    current_heat: 0,
    current_repairs: 0,
    loadouts: old.loadouts.map((x: any) => convertMechLoadouts(x)),
    active_loadout: null,
    cc_ver: '1.3.7',
  }
}

function convertMechLoadouts(old: any): IMechLoadoutData {
  return {
    id: old.id,
    name: old.name,
    systems: old.systems.map((x: any) => ({ id: x.id, notes: [] })),
    mounts: old.mounts.map((x: any) => convertMountData(x)),
    improved_armament: EquippableMount.Serialize(
      new EquippableMount(MountType.Flex)
    ),
    integratedWeapon: EquippableMount.Serialize(
      new EquippableMount(MountType.Aux)
    ),
    retrofitIndex: null,
    retrofitOriginalType: null,
  }
}

function convertMountData(old: any): IMountData {
  return {
    mount_type: old.mount_type,
    lock: old.sh_lock || false,
    slots: old.weapons.map((x: any) => ({
      size: old.mount_type,
      weapon: {
        id: x.id,
        notes: [],
      },
    })),
    extra: [],
    bonus_effects: [],
  }
}

export default {
  pilot(data: Pilot) {
    return this.checkVersion([data])[0]
  },
  checkVersion(data: any): IPilotData[] {
    let output = [] as IPilotData[]
    let copyOld = false
    data.forEach((e: any) => {
      if (e.cc_ver) output.push(e)
      else {
        copyOld = true
        try {
          output.push(convertPilot(e))
        } catch (err) {
          console.error('Conversion failure: ' + err)
        }
      }
    })
    if (copyOld) io.backup(store.getters.getUserPath)
    return output
  },
  clipboardPilot(data: string, callback: (err: any, result: any) => void) {
    let err = null
    let result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Pilot data'
    } else {
      const p = JSON.parse(data)
      if (this.pilot(p)) {
        result = p
      } else {
        err = 'Invalid pilot data'
      }
    }
    callback(err, result)
  },
  checkMechVersion(data: any): IMechData {
    if (data.cc_ver) return data
    else return convertMechs(data)
  },
  clipboardConfig(data: string, callback: (err: any, result: any) => void) {
    let err = null
    let result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Config data'
    } else {
      const p = JSON.parse(data)
      if (this.checkMechVersion(p)) {
        result = p
      } else {
        err = 'Invalid config data'
      }
    }
    callback(err, result)
  },
}
