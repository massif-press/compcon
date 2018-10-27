var rules = require("../../resources/data/rules.json");

function getMechStats(config, pilot) {
  var stats = config.shell.stats;
  var core = pilot.core;

  var output = {
    hull: v(stats.hull) + core.hull,
    agi: v(stats.agi) + core.agi,
    sys: v(stats.hull) + core.hull,
    eng: v(stats.eng) + core.eng,
    structure: rules.base_structure,
    armor: config.shell.armor,
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
    max_sp: config.shell.sp + core.sp,
    sp_shell: config.shell.sp,
    sp_core_bonus: core.sp,
    grapple: rules.base_grapple,
    ram: rules.base_ram
  }

  //everest gets a +1 to any core stat, made at config creation TODO: add to config creation
  if (config.everest_bonus) output[config.everest_bonus]++;

  return output;
}

function getPilotHP(pilotLevel) {
   return rules.pilot_base_hp + pilotLevel;
}

function v(val) {
  return val ? val : 0;
}

module.exports.getMechStats = getMechStats;
module.exports.getPilotHP = getPilotHP;