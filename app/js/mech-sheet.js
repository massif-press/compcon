var $ = require("jquery");
var Handlebars = require("handlebars");
var Stats = require('./util/stats');
var Tags = require('./util/taghelper');
var Dicemath = require('./util/dicemath');
var Charts = require("./util/chartbuilder");
var weapons = require("../resources/data/weapons.json");
var systems = require("../resources/data/systems.json");
var mods = require("../resources/data/mods.json");

Handlebars.registerHelper('longSource', function (source) {
  switch (source) {
    case "IPS-N": return "IPS-Northstar"
    case "SSC": return "Smith Shimano Corpo"
    case "HA": return "Harrison Armory"
    case "GMS": return "General Massive Systems"
    default: return source
  }
});

Handlebars.registerHelper('ifElse', function (a, b) {
  return a ? a : b;
});

Handlebars.registerHelper('plusMinus', function (val) {
  return val >= 0 ? "+" + val : val;
});

Handlebars.registerHelper('balloonSize', function (str) {
  str.split(' ');
  if (str.length < 10) return 'small';
  if (str.length < 30) return 'medium';
  if (str.length < 100) return 'large';
  return 'xlarge';
});

Handlebars.registerHelper('dmgFormat', function (dmg) {
if (dmg.override) return dmg.override;

  var outArr = [];
  for (var key in dmg) {
    if(dmg[key].toString() === "0") continue;
    outArr.push(`<span class="${key}">${dmg[key]} ${key.charAt(0).toUpperCase() + key.slice(1)} Damage</span>`)
  }

  return outArr.join(', ');
});

Handlebars.registerHelper('dmgRange', function (dmg) {
  if (!dmg) return "";
  var d = Dicemath.parse(dmg);

  var h = d.min.heat > 0 ? `, + ${d.min.heat} - ${d.max.heat} Heat` : "";
  var ha = d.min.heat > 0 ? ` (${d.avg.heat} Heat)` : ''

  return `${d.min.total} - ${d.max.total}${h}   (${d.avg.total}) ${ha}`;
});

function loadMech(config, pilot) {
  config.shell.ult_active = Tags.parse(config.shell.ult_active);

  $(".main-scroll").scrollTop(1);
  var stats = Stats.getStats(config, pilot)

  var wp = [];
  var sys = [];
  
  if (config.shell.ult_passive_weapon) wp.push(weapons.find(w => w.id == config.shell.ult_passive_weapon));

  //I think this is only the fuel rod gun. If not, make this a loop
  if (pilot.talent_weapon) wp.push(weapons.find(w => w.id == pilot.talent_weapon));

  for (var i = 0; i < config.weapons.length; i++) {
    var add = weapons.find(w => w.id == config.weapons[i].id);
    if (config.weapons[i].mod) {
      var m = mods.find(w => w.id == config.weapons[i].mod);
      add.mod = m;
    }
    wp.push(add);
  }

  for (var i = 0; i < config.systems.length; i++) {
    sys.push(systems.find(s => s.id == config.systems[i]));
  }

  wp = Tags.expand(wp);
  sys = Tags.expand(sys);

  //collect all licenses required
  var isEverest = config.shell.id === "sh_everest"
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
      if (config.licenses[lIndex].level < wp.license_level) {
        config.licenses.push({
          "source": item.source,
          "name": item.license,
          "level": item.license_level,
          "items": item.name
        })
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

  bindEquipmentExpanders();
}

//TODO: offload these
function bindEquipmentExpanders() {
  $('.equip-expander-header').click(function () {
    $(this).toggleClass('sweep-btn bold');
    var parent = $(this).closest('.equip-expander');
    $(parent).toggleClass('open');
    $($(parent).find(".equip-open-info")).toggle("swing");
  });
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