const $ = require('jquery');
const fs = require('fs');
const Handlebars = require('handlebars');
const Stats = require('./util/stats');
const Tags = require('./util/taghelper');
const Charts = require('./util/chartbuilder');
const Expander = require('./util/expander');
const Search = require('./util/search');
//data
const weapons = require("../resources/data/weapons.json");
const systems = require("../resources/data/systems.json");
const mods = require("../resources/data/mods.json");
//templates
const loadoutTemplate = fs.readFileSync(__dirname + "/templates/mech-loadout.hbs", "utf8");
const infoTemplate = fs.readFileSync(__dirname + "/templates/mech-info.hbs", "utf8");
const statsTemplate = fs.readFileSync(__dirname + "/templates/mech-stats.hbs", "utf8");
const shellModalTemplate = fs.readFileSync(__dirname + "/templates/mech-shell-modal.hbs", "utf8");


function loadMech(config, pilot) {
  config.shell.ult_active = Tags.parse(config.shell.ult_active);

  $(".main-scroll").scrollTop(1);
  var stats = Stats.getMechStats(config, pilot)

  var mounts = [];
  var sys = [];
  
  //add ult wewapon, if any
  if (config.shell.ult_passive_weapon) {
    var w = Search.byID(weapons, config.shell.ult_passive_weapon);
    mounts.push({
      mount: w.mount,
      weapon: Tags.expand(w)
    });
  }

  //add pilot talent weapons, if any
  if (pilot.talent_weapons) {
    for (var i = 0; i < pilot.talent_weapons.length; i++) {
      var w = Search.byID(weapons, pilot.talent_weapons[i]);
      mounts.push({
        mount: w.mount,
        weapon: Tags.expand(w)
      });
    }
  }

  //add weapons, per mount
  for (var i = 0; i < config.mounts.length; i++) {
    if (!config.mounts[i].weapon_id) {
      mounts.push({
        mount: config.mounts[i].mount
      })
    } else {
      var w = Search.byID(weapons, config.mounts[i].weapon_id)
      mounts.push({ mount: config.mounts[i].mount, weapon: Tags.expand(w)});
    }
  }

  //TODO: walk through core bonuses, talents, to add add linked mods (global_mods on pilot sheet?)
  //some mods only apply to eg. ranged or limited systems/items.

  for (var i = 0; i < config.mounts.length; i++) {
    if (config.mounts[i].mods) {
      w.mods = [];
      for (var j = 0; j < config.mounts[i].mods.length; i++) {
        var m = config.mounts[i].mods[j];
        var mod = Search.byID(mods, m);
        mod.effect = Tags.parse(mod.effect);
        w.sp += mod.sp;
        w.mods.push(mod);
      }
    }
  }


  for (var i = 0; i < config.systems.length; i++) {
    sys.push(Search.byID(systems, config.systems[i]));
  }
  
  sys = Tags.expand(sys);

  //collect all licenses required
  var isEverest = config.shell.id === "everest"
  config.licenses = [{
    "source": config.shell.source,
    "name": isEverest ? "" : config.shell.name,
    "level": isEverest ? "" : 2,
    "items": `${config.shell.source} ${config.shell.name} Shell`
  }]

  var items = sys.concat(mounts.map(m => m.weapon).filter(x => x != null));

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.source == "Special") continue;
    var lIndex = config.licenses.findIndex(l => l.name === item.license);
    if (lIndex > -1) {
      if (config.licenses[lIndex].level < item.license_level) { //if our new item exceeds our current license level
        var upperIdx = config.licenses.findIndex(l => l.level === item.license_level);
        if (upperIdx < 0) { //if we don't already have this license recorded, add it
          config.licenses.push({ 
            "source": item.source,
            "name": item.license,
            "level": item.license_level,
            "items": item.name
          })
        } else {
          config.licenses[upperIdx].items += ", " + item.name;  //otherwise, mark the system on the higher level license
        }
      }
      config.licenses[lIndex].items += ", " + item.name;
    } else {
      config.licenses.push({
        "source": item.source,
        "name": item.license,
        "level": item.license_level,
        "items": item.name
      })
    }
  }

  var aptitudes = {
    "melee": 0,
    "ranged": 0,
    "tech": 0,
    "support": 0,
    "control": 0,
    "repair": 0
  };

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    for (key in item.aptitude) {
      aptitudes[key] += item.aptitude[key];
    }
  }

  for (var i = 0; i < config.licenses.length; i++) {
    var l = config.licenses[i];
    if (l.source === "GMS") {
      config.licenses[i].locked = false;
    } else {
      var lockIndex = pilot.licenses.findIndex(pl => pl.name === l.name);
      if (lockIndex == -1) config.licenses[i].locked = true;
      else if (pilot.licenses[lockIndex].level < l.level) config.licenses[i].locked = true;
      else config.licenses[i].locked = false;
    }
  }

  //move gms to the front of the license block
  var gmsIndex = config.licenses.findIndex(l => l.source === "GMS");
  if (gmsIndex > 0) move(config.licenses, gmsIndex, 0);

  //make sure the shell is the second item
  var shellIndex = config.licenses.findIndex(l => l.source === config.shell.source);
  if (shellIndex > 0) move(config.licenses, shellIndex, 1);

  //sort by mounts
  mounts.sort(function(a, b) {
    var sortOrder = {
      "Main": 0,
      "Core": 1,
      "Auxiliary": 2,
      "Flex": 3,
      "Heavy": 4,
      "Superheavy": 5,
      "Special": 6,
      "Apocalypse": 7
  }
    return sortOrder[a.mount] < sortOrder[b.mount] ? -1 : sortOrder[a.mount] > sortOrder[b.mount] ? 1 : 0;
  })

  var info_template = Handlebars.compile(infoTemplate);
  $("#mech-info-output").html(info_template(config));

  var stat_template = Handlebars.compile(statsTemplate);
  $("#mech-stats-output").html(stat_template(stats));

  var sp = {
    max: stats.max_sp,
    free: stats.max_sp - items.filter(i => i.sp != null).reduce((a, b) => a + b, 0)
  }

  var gear_template = Handlebars.compile(loadoutTemplate);
  $("#mech-gear-output").html(gear_template({
    "mounts": mounts,
    "systems": sys,
    "shell": config.shell,
    "sp": sp
  }));
  
  Charts(mounts.map(m => m.weapon).filter(x => x != null), aptitudes);

  //TODO: animations aren't playing well with div show/hide. Fix via canvas?
  //bad hack incoming:
  $("#damage-mount-chart, #damage-type-chart").css('display', 'none');

  $('.chart-selector').on('change', function() {
    var t = $(this).val();
    switch (t) {
      case "range":
        $("#damage-mount-chart, #damage-type-chart").css('display', 'none');
        $("#damage-range-chart").css('display', 'block')
        break;
      case "mount":
        $("#damage-range-chart, #damage-type-chart").css('display', 'none');
        $("#damage-mount-chart").css('display', 'block')
        break;
      case "type":
        $("#damage-range-chart, #damage-mount-chart").css('display', 'none');
        $("#damage-type-chart").css('display', 'block')
        break;
      default:
        break;
    }
  })

  var shell_info_template = Handlebars.compile(shellModalTemplate);
  $("#shell-info-modal-output").html(shell_info_template(config.shell));

  $("#shell-info-btn").click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "block");
  });

  $('.close').click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  Expander.bindEquipment();
}

function move (arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

module.exports = loadMech;