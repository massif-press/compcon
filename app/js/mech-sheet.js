const $ = require('jquery');
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

function loadMech(config, pilot) {
  config.shell.ult_active = Tags.parse(config.shell.ult_active);

  $(".main-scroll").scrollTop(1);
  var stats = Stats.getMechStats(config, pilot)

  var wp = [];
  var sys = [];
  
  if (config.shell.ult_passive_weapon) wp.push(Search.byID(weapons, config.shell.ult_passive_weapon));

  if (pilot.talent_weapons) {
    for (var i = 0; i < pilot.talent_weapons.length; i++) {
      wp.push(Search.byID(weapons, pilot.talent_weapons[i]));
    }
  }

  for (var i = 0; i < config.weapons.length; i++) {
    var add = Search.byID(weapons, config.weapons[i].id)
    if (config.weapons[i].mod) {
      add.mod = Search.byID(mods, config.weapons[i].mod);
      add.mod.effect = Tags.parse(add.mod.effect);
    }
    wp.push(add);
  }

  for (var i = 0; i < config.systems.length; i++) {
    sys.push(Search.byID(systems, config.systems[i]));
  }
  
  wp = Tags.expand(wp);
  sys = Tags.expand(sys);

  //collect all licenses required
  var isEverest = config.shell.id === "everest"
  config.licenses = [{
    "source": config.shell.source,
    "name": isEverest ? "" : config.shell.name,
    "level": isEverest ? "" : 2,
    "items": `${config.shell.source} ${config.shell.name} Shell`
  }]

  var items = wp.concat(sys);

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
  wp.sort(function(a, b) {
    var sortOrder = {
      "Main": 0,
      "Auxiliary": 1,
      "Heavy": 2,
      "Superheavy": 3,
      "Special": 4
  }
    return sortOrder[a.mount] < sortOrder[b.mount] ? -1 : sortOrder[a.mount] > sortOrder[b.mount] ? 1 : 0;
  })

  var info_template = Handlebars.compile($('#mech-info-template').html());
  $("#mech-info-output").html(info_template(config));

  var stat_template = Handlebars.compile($('#mech-stats-template').html());
  $("#mech-stats-output").html(stat_template(stats));

  var gear_template = Handlebars.compile($('#mech-gear-template').html());
  $("#mech-gear-output").html(gear_template({
    "weapons": wp,
    "systems": sys,
    "shell": config.shell
  }));
  
  Charts(wp, aptitudes);

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

  var shell_info_template = Handlebars.compile($('#shell-info-modal-template').html());
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