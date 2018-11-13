const $ = require("jquery");
const Handlebars = require("handlebars");
const fs = require("fs");
const Tags = require("./util/taghelper");
const Search = require("./util/search");
const Stats = require("./util/stats");
const Expander = require("./util/expander");
const LP = require("./wizards/levelpilot");
//data
const pilotGear = require("../resources/data/pilot_gear.json");
const talents = require("../resources/data/pilot_talents.json");
const coreBonuses = require("../resources/data/core_bonus.json");
//templates
const sheetTemplate = fs.readFileSync(__dirname + "/templates/pilot-sheet.hbs", "utf8");
const weaponTemplate = fs.readFileSync(__dirname + "/templates/pilot-weapon.hbs", "utf8");
const armorTemplate = fs.readFileSync(__dirname + "/templates/pilot-armor.hbs", "utf8");
const gearTemplate = fs.readFileSync(__dirname + "/templates/pilot-gear.hbs", "utf8");
//wizard template
const levelTemplate = fs.readFileSync(__dirname + "/templates/wizards/pilot-level.hbs", "utf8");

function loadPilot(pilot) {  
  pilot.hp = Stats.getPilotHP(pilot.level);

  var expandedTalents = [];
  for (var i = 0; i < pilot.talents.length; i++) {
    var talent = Search.byID(talents, pilot.talents[i].id);
    talent.rank = pilot.talents[i].rank;

    expandedTalents.push(talent);
  }
  pilot.talents = expandedTalents;

  var expandedCoreBonuses = [];
  for (var i = 0; i < pilot.core_bonuses.length; i++) {
    var bonus = Search.byID(coreBonuses, pilot.core_bonuses[i]);

    expandedCoreBonuses.push(bonus);
  }
  pilot.bonuses = expandedCoreBonuses;

  var info_template = Handlebars.compile(sheetTemplate);
  $("#pilot-info-output").html(info_template(pilot));
  
  var allGear = pilotGear.gear.concat(pilotGear.weapons, pilotGear.armor);

  for (var i = 0; i < pilot.gear.length; i++) {
    var item = Search.byID(allGear, pilot.gear[i].id);
    item.notes = pilot.gear[i].notes;
    Tags.expand(item);

    var itemTemplate = gearTemplate;
    if (item.type === "weapon") itemTemplate = weaponTemplate;
    if (item.type === "armor") itemTemplate = armorTemplate;

    var template = Handlebars.compile(itemTemplate);
    $("#pilot-gear-output").append(template(item));
  }

  $("#pilot-notes-output").html(pilot.notes);

  Expander.bindEquipment();

  if (pilot.level < 15) {
    $("#plvl-btn").click(function () {
      $('#levelPilotModal').css("display", "block");
      var template = Handlebars.compile(levelTemplate);
      $("#plvl-modal-body").html(template(pilot));
      LP.init(pilot);
    });
  } else {
    $("#plvl-btn").addClass("warning-stripes disabled")
  }

  $('.close').click(function () {
    let modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });
}

module.exports = loadPilot;