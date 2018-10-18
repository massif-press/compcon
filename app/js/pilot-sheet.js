var $ = require("jquery");
var Handlebars = require("handlebars");
var Tags = require("./util/taghelper");

var pilotWeapons = require("../resources/data/pilot_weapons.json");
var pilotArmor = require("../resources/data/pilot_armor.json");
var pilotGear = require("../resources/data/pilot_gear.json");
var talents = require("../resources/data/pilot_talents.json");
var coreBonuses = require("../resources/data/core_bonus.json");

var allGear = pilotWeapons.concat(pilotArmor).concat(pilotGear);

Handlebars.registerHelper('repeat', function (n, block) {
  var str = '';
  for (var i = 0; i < n; ++i)
    str += block.fn(i);
  return str;
});

function loadPilot(pilot) {  
  var info_template = Handlebars.compile($('#pilot-info-template').html());

  $("#pilot-info-output").html(info_template(pilot));

  for (var i = 0; i < pilot.gear.length; i++) {
    var pRef = pilot.gear[i];
    var item = allGear.find(function (g) { return g.id === pRef.id; });
    item.notes = pRef.notes;

    var template_type = "gear"
    if (item.type === "pilot_weapon") template_type = "weapon"
    else if (item.type === "pilot_armor") template_type = "armor"

    var template = Handlebars.compile($("#p_" + template_type + "-template").html())
    $("#pilot-gear").append(template(item));
  }

  for (var i = 0; i < pilot.talents.length; i++) {
    var pRef = pilot.talents[i];
    var talent = talents.find(function (t) { return t.id === pRef.id; });
    talent.rank = pRef.rank;

    //TODO: change template based on talent rank

    var template = Handlebars.compile($("#p_talent-template").html())
    $("#pilot-talents").append(template(talent));
  }

  for (var i = 0; i < pilot.core_bonuses.length; i++) {
    var pRef = pilot.core_bonuses[i];
    var bonus = coreBonuses.find(function (b) { return b.id === pRef; });

    var template = Handlebars.compile($("#p_bonus-template").html())
    $("#pilot-bonuses").append(template(bonus));
  }

}


module.exports = loadPilot;