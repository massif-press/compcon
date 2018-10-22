var $ = require("jquery");
var Handlebars = require("handlebars");
var Stats = require('./util/stats');
var Tags = require('./util/taghelper');
var Dicemath = require('./util/dicemath');
var Charts = require("./util/chartbuilder");
var weapons = require("../resources/data/weapons.json");
var systems = require("../resources/data/systems.json");

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
  if (config.shell.ult_passive_weapon) config.weapons.push(config.shell.ult_passive_weapon);
  if (pilot.talent_weapons) config.weapons = config.weapons.concat(pilot.talent_weapons);

  $(".main-scroll").scrollTop(1);
  var stats = Stats.getStats(config, pilot)

  var wp = [];
  var sys = [];
  
  for (var i = 0; i < config.weapons.length; i++) {
    wp.push(weapons.find(w => w.id == config.weapons[i]));
  }

  for (var i = 0; i < config.systems.length; i++) {
    sys.push(systems.find(s => s.id == config.systems[i]));
  }

  wp = Tags.expand(wp);
  sys = Tags.expand(sys);

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
  
  Charts(wp);

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


module.exports = loadMech;