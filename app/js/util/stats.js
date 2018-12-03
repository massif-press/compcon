const Search = require("../util/search");
const shells = require("../../extraResources/data/shells.json");

var rules = require("../../extraResources/data/rules.json");

function getMechStats(config, pilot) {
  var shell = Search.byID(shells, config.shell_id) 
  var stats = shell.stats
  var core = pilot.core;

  var output = {
    hull: v(stats.hull) + core.hull,
    agi: v(stats.agi) + core.agi,
    sys: v(stats.hull) + core.hull,
    eng: v(stats.eng) + core.eng,
    structure: rules.base_structure,
    armor: shell.armor,
    hp: rules.base_hp + v(stats.hull) + core.hull + core.hp + pilot.level,
    hp_core_bonus: core.hp + pilot.level,
    hp_hull_bonus: v(stats.hull) + core.hull,
    stress: rules.base_stress,
    heatcap: rules.base_heatcap + v(stats.eng) + v(stats.heatcap) + core.eng, //HA GENGHIS
    heat_eng_bonus: v(stats.eng) + core.eng,
    overcharge_active: 1,
    overcharge_remaining: 3,
    speed: rules.base_speed + v(stats.agi) + core.agi, 
    speed_agi_bonus: v(stats.agi) + core.agi,
    evasion: rules.base_evasion + v(stats.agi) + core.agi,
    evasion_agi_bonus: v(stats.agi) + core.agi,
    edef: rules.base_edef + v(stats.sys) + core.sys,
    edef_sys_bonus: v(stats.sys) + core.sys,
    repcap: rules.base_repcap + v(stats.eng) + core.eng,
    repcap_eng_bonus: v(stats.eng) + core.eng,
    targeting: core.targeting,
    targeting_eng_bonus: core.targeting,
    max_sp: shell.sp + core.sp,
    sp_shell: shell.sp,
    sp_core_bonus: core.sp,
    grapple: rules.base_grapple,
    ram: rules.base_ram,
    size: shell.size,
    sensor_range: rules.base_sensor_range + core.sys,
    sensor_range_bonus: core.sys
  }

  //everest gets a +1 to any core stat, made at config creation TODO: add to config creation
  if (config.everest_bonus) output[config.everest_bonus]++;

  //system personalizations adds +2 hp
  if (config.systems.find(x => x.id === "personalizations")) {
    output.hp += 2;
    output.hp_core_bonus += 2;
  }

  //fomorian frame reinforcement core bonus adds size (up to 3)
  if (pilot.core_bonuses.includes("fomorian") && shell.size < 3) output.size++;

  //ipsn reinforced frame core bonus adds 5 hp
  if (pilot.core_bonuses.includes("frame")) {
    output.hp += 5;
    output.hp_core_bonus += 5;
  }

  //ipsn sloped plating core bonus adds 1 armor, up to 4
  if (pilot.core_bonuses.includes("plating") && shell.armor < 4) output.armor ++;

  //horus open door adds 1 edef and 5 sensor range
  if (pilot.core_bonuses.includes("opendoor")) {
    output.edef ++;
    output.edef_sys_bonus ++;
    output.sensor_range +=5;
    output.sensor_range_bonus += 5;
  }

  //ha stasis shielding adds 2 repcap 
  if (pilot.core_bonuses.includes("stasis")) {
    output.repcap += 2;
    output.repcap_eng_bonus += 2;
  }


  //ha superior by design core bonus adds 2 heatcap
  if (pilot.core_bonuses.includes("superior")) {
    output.heatcap += 2;
    output.heat_eng_bonus += 2;
  }


  return output;
}

function getPilotHP(pilotLevel) {
   return rules.base_pilot_hp + pilotLevel;
}

function v(val) {
  return val ? val : 0;
}

module.exports.getMechStats = getMechStats;
module.exports.getPilotHP = getPilotHP;