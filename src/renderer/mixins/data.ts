// These mixins provide access to the datastore.ts getters without having to re-write a method for every component

// specific getters should be preferred over item, if possible
const item = {
  methods: {
    getItem(category: string, id: string): CCItem {
      return (this as any).$store.getters['getItemById'](category, id)
    },
  },
}

const background = {
  methods: {
    getBackground(id: string): Background {
      return (this as any).$store.getters['getItemById']('Backgrounds', id)
    },
  },
}

const talent = {
  methods: {
    getTalent(id: string): Talent {
      return (this as any).$store.getters['getItemById']('Talents', id)
    },
  },
}

const skills = {
  methods: {
    getSkill(id: string): Skill {
      return (this as any).$store.getters['getItemById']('Skills', id)
    },
  },
}

const corebonus = {
  methods: {
    getCoreBonus(id: string): CoreBonus {
      return (this as any).$store.getters['getItemById']('CoreBonuses', id)
    },
  },
}

const frame = {
  methods: {
    getFrame(id: string): Frame {
      return (this as any).$store.getters['getItemById']('Frames', id)
    },
  },
}

const manufacturer = {
  methods: {
    getManufacturer(id: string): Manufacturer {
      return (this as any).$store.getters['getItemById']('Manufacturers', id)
    },
  },
}

const weapon = {
  methods: {
    getWeapon(id: string): Weapon {
      return (this as any).$store.getters['getItemById']('MechWeapons', id)
    },
  },
}

const mod = {
  methods: {
    getMod(id: string): WeaponMod {
      return (this as any).$store.getters['getItemById']('WeaponMods', id)
    },
  },
}

const system = {
  methods: {
    getSystem(id: string): System {
      return (this as any).$store.getters['getItemById']('MechSystems', id)
    },
  },
}

const pilotgear = {
  methods: {
    getPilotGear(id: string): PilotGear {
      return (this as any).$store.getters['getItemById']('PilotGear', id)
    },
  },
}

const tag = {
  methods: {
    getTag(id: string): Tag {
      return (this as any).$store.getters['getItemById']('Tags', id)
    },
  },
}

const status = {
  methods: {
    getStatus(id: string): Status {
      return (this as any).$store.getters['getItemById']('Statuses', id)
    },
  },
}

const quirk = {
  methods: {
    getQuirk(id: string): string {
      return (this as any).$store.getters['getItemById']('Quirks', id)
    },
  },
}

const brew = {
  methods: {
    getBrew(id: string): Brew {
      return (this as any).$store.getters['getItemById']('Brews', id)
    },
  },
}

const license = {
  methods: {
    getLicense(name: string): PilotLicense {
      return (this as any).$store.getters['getLicenseByName'](name)
    },
  },
}

export {
  item,
  background,
  talent,
  skills,
  corebonus,
  frame,
  manufacturer,
  weapon,
  mod,
  system,
  pilotgear,
  tag,
  status,
  quirk,
  brew,
  license,
}
