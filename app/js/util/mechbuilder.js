
const Tags = require('./taghelper');
const Stats = require('./stats');
const Search = require('./search');
const LicenseManager = require("./licensemanager");
//data
const shells = require("../../extraResources/data/shells.json");
const weapons = require("../../extraResources/data/weapons.json");
const systems = require("../../extraResources/data/systems.json");
const weapon_mods = require("../../extraResources/data/mods.json");

function buildMech(config, pilot) {
  //presort config mounts
  config.mounts.sort(mountsort);

  var mech = {
    pilot_id: pilot.id,
    stats: Stats.getMechStats(config, pilot),
    mounts: getMountedWeapons(config, pilot),
    systems: getInstalledSystems(config, pilot),
    shell: getShell(config.shell_id),
    config: Object.assign({}, config),
    pilot_licenses: pilot.licenses
  }

  var items = mech.systems.concat(mech.mounts.map(m => m.weapon).filter(x => x != null));

  mech.licenses = LicenseManager.getLicenseRequirements(mech.shell, items, pilot);

  mech.sp = {
    max: mech.stats.max_sp,
    free: mech.stats.max_sp - items.filter(i => i.sp != null).reduce((a, b) => a + b.sp, 0)
  }

  return mech;
}

function getShell(id) {
  var s = Search.byID(shells, id)
  s.ult_active = Tags.parse(s.ult_active);
  return s;
}

function getMountedWeapons(config, pilot) {
  var shell = Search.byID(shells, config.shell_id) 
  var mounts = [];
  //add ult wewapon, if any
  if (shell.ult_passive_weapon) {
    var w = Search.byID(weapons, shell.ult_passive_weapon);
    w.isUnique = true;
    mounts.push({
      mount: w.mount,
      weapon: w,
      mod_ids: [],
      specialMount: "Ultimate Weapon",
      mount_index: -1
    });
  }

  //add pilot talent weapons, if any
  for (var i = 0; i < pilot.talents.length; i++) {
    var t = pilot.talents[i];
    if (t.id === "ncavalier" && t.rank == 3) {
      var w = Search.byID(weapons, "fuelrod");
      w.isUnique = true;
      mounts.push({
        mount: w.mount,
        weapon: w,
        mod_ids: [],
        specialMount: "Talent Weapon",
        mount_index: -1
      });
    }    
  }

  //add weapons, per mount
  for (var i = 0; i < config.mounts.length; i++) {
    if (!config.mounts[i].weapon_id) {
      mounts.push({
        mount: config.mounts[i].mount,
        sh_lock: config.mounts[i].sh_lock || null,
        mount_index: config.mounts[i].mount_index
      })
    } else {
      var w = Search.byID(weapons, config.mounts[i].weapon_id)
      if (w.tags.findIndex(t => t.id === "unique") > -1) w.isUnique = true;
      var mods = config.mounts[i].mods ? config.mounts[i].mods : [];
      mounts.push({
        mount: config.mounts[i].mount,
        weapon: w,
        mod_ids: mods,
        mount_index: config.mounts[i].mount_index
      });
    }
  }

  //talent-based mods
  if (pilot.talents.some(t => t.id === "monkey" && t.rank == 3)) {
    for (var i = 0; i < mounts.length; i++) {
      if (mounts[i].weapon && mounts[i].weapon.tags.find(t => t.id === "limited")) { //limited weapons only
        mounts[i].mod_ids.push("tal_monkey3");
        mounts[i].weapon.tags.find(t => t.id === "limited").val += " +1"
      }
    }
  }

  //core-bonus-based mods
  for (var i = 0; i < mounts.length; i++) {
    if (!mounts[i].weapon) continue;
    if (pilot.core_bonuses.includes("neurolinked") && mounts[i].weapon.type !== "Melee") {
      mounts[i].mod_ids.push("cb_neurolinked");
    }
    if (pilot.core_bonuses.includes("ammofeeds") && mounts[i].weapon.tags.find(t => t.id === "limited")) {
      mounts[i].mod_ids.push("cb_ammofeeds");
      mounts[i].weapon.tags.find(t => t.id === "limited").val += " +1"
    }
    if (pilot.core_bonuses.includes("fomorian") && (mounts[i].weapon.type === "Melee" || mounts[i].weapon.type == "Melee or CQB")) {
      mounts[i].mod_ids.push("cb_fomorian");
    }
  }

  for (let i = 0; i < mounts.length; i++) {
    if (mounts[i].weapon) Tags.expand(mounts[i].weapon);
    if (mounts[i].mod_ids == null) continue;
    var hydratedMods = [];
    var modSP = 0;
    for (let j = 0; j < mounts[i].mod_ids.length; j++) {
      var m_id = mounts[i].mod_ids[j];
      var newMod = Search.byID(weapon_mods, m_id);
      newMod.effect = Tags.parse(newMod.effect);
      modSP += newMod.sp;
      newMod.isSpecialType = newMod.modType === "Core Bonus" || "Talent";
      hydratedMods.push(newMod)
    }
    mounts[i].mods = hydratedMods;
    mounts[i].modSP = modSP;
  }

  return mounts.sort(mountsort);
}

function getInstalledSystems(config, pilot) {
  var sys = [];

  for (var i = 0; i < config.systems.length; i++) {
    var s = Tags.expand(Search.byID(systems, config.systems[i].id));
    if (s.tags.findIndex(t => t.id === "unique") > -1) s.isUnique = true;
    if (s.tags.findIndex(t => t.type === "AI") > -1) s.isAi = true;
    sys.push(s);
  }

  var tp = pilot.talents.find(x => x.id === "techno");
  if (tp) {
    var ai = Tags.expand(Search.byID(systems, "techno" + tp.rank));
    ai.specialMount = "Custom AI";
    sys.push(ai);
  }

  if (pilot.talents.some(t => t.id === "monkey" && t.rank == 3)) {
    for (var j = 0; j < sys.length; j++) {
      if (sys[i].tags.find(t => t.id === "limited")) { //limited systems only
        if(sys[i].mods == null) sys[i].mods = [];
        sys[i].mods.push("tal_monkey3");
        sys[i].tags.find(t => t.id === "limited").val += " +1"
      }
    }
  }

  return sys;
}

var mountsort = function (a, b) {
    var sortOrder = {
      "Main": 0,
      "Core": 1,
      "Auxiliary": 2,
      "Flex": 3,
      "Heavy": 4,
      "Superheavy": 5,
      "Apocalypse": 6,
      "Special": 7,
      "Talent Weapon": 8,
    }
    return sortOrder[a.mount] < sortOrder[b.mount] ? -1 : sortOrder[a.mount] > sortOrder[b.mount] ? 1 : 0;
  };

module.exports = buildMech;