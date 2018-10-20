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

Handlebars.registerHelper('titleCase', function (str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
});

Handlebars.registerHelper('talentLock', function (level, itemRank, retTrue, retFalse) {
  if (level >= itemRank) return retTrue;
  return retFalse
});

function loadPilot(pilot) {  

  $("#pilot-info-output").empty();

  var expandedTalents = [];
  for (var i = 0; i < pilot.talents.length; i++) {
    var pRef = pilot.talents[i];
    var talent = talents.find(function (t) { return t.id === pRef.id; });
    talent.rank = pRef.rank;

    expandedTalents.push(talent);
  }
  pilot.talents = expandedTalents;

  var expandedCoreBonuses = [];
  for (var i = 0; i < pilot.core_bonuses.length; i++) {
    var pRef = pilot.core_bonuses[i];
    var bonus = coreBonuses.find(function (b) { return b.id === pRef; });

    expandedCoreBonuses.push(bonus);
  }
  pilot.bonuses = expandedCoreBonuses;

  var info_template = Handlebars.compile($('#pilot-info-template').html());
  $("#pilot-info-output").html(info_template(pilot));

  for (var i = 0; i < pilot.gear.length; i++) {
    var pRef = pilot.gear[i];
    var item = allGear.find(function (g) {
      return g.id === pRef.id;
    });
    item.notes = pRef.notes;
    item = Tags.expand(item);

    var template = Handlebars.compile($("#p_" + item.type + "-template").html())
    $("#pilot-gear-output").append(template(item));
  }

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


module.exports = loadPilot;