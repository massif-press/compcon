function getStats(config, pilot) {
  var stats = config.shell.stats;
  var core = pilot.core;

  // console.log(stats, core);

  var output = {
    hull: v(stats.hull) + core.hull,
    agi: v(stats.agi) + core.agi,
    sys: v(stats.hull) + core.hull,
    eng: v(stats.eng) + core.eng,
    structure: 4,
    hp: 10 + v(stats.hull) + core.hull + core.hp,
    armor: config.shell.armor,
    hp_core_bonus: core.hull + core.hp,
    hp_level_bonus: 3, //TODO: make getPilotLevel()
    hp_hull_bonus: v(stats.hull) + core.hull,
    stress: 4,
    heatcap: 6 + v(stats.eng) + v(stats.heatcap) + core.eng, //HA GENGHIS
    heat_eng_bonus: v(stats.eng) + core.eng,
    overcharge_active: 1,
    overcharge_remaining: 3,
    speed: 4 + v(stats.agi) + core.agi, //TODO:check math
    speed_agi_bonus: v(stats.agi) + core.agi,
    evasion: 8 + v(stats.agi) + core.agi,
    evasion_agi_bonus: v(stats.agi) + core.agi,
    edef: 8 + v(stats.sys) + core.sys,
    edef_sys_bonus: v(stats.sys) + core.sys,
    repcap: 6 + v(stats.eng) + core.eng,
    repcap_eng_bonus: v(stats.eng) + core.eng,
    targeting: core.targeting,
    targeting_eng_bonus: core.targeting,
    max_sp: config.shell.sp + core.sp,
    sp_shell: config.shell.sp,
    sp_core_bonus: core.sp,
    grapple: 0,
    ram: 0
  }

  //everest gets a +1 to any core stat, made at config creation TODO: add to config creation
  if (config.everest_bonus) output[config.everest_bonus]++;

  return output;
}

function v(val) {
  return val ? val : 0;
}

module.exports.getStats = getStats;