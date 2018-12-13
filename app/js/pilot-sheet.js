const { dialog } = require('electron').remote;

const $ = require("jquery");
const Handlebars = require("handlebars");
const fs = require("fs");
const Tags = require("./util/taghelper");
const io = require("./util/io");
const Search = require("./util/search");
const Stats = require("./util/stats");
const Expander = require("./util/expander");
const LP = require("./wizards/levelpilot");
const Sidebar = require("./pilot-sidebar");
//data
const pilotGear = require("../extraResources/data/pilot_gear.json");
const talents = require("../extraResources/data/pilot_talents.json");
const coreBonuses = require("../extraResources/data/core_bonus.json");
//templates
const sheetTemplate = io.readTemplate('pilot-sheet');
const weaponTemplate = io.readTemplate('pilot-weapon');
const armorTemplate = io.readTemplate('pilot-armor');
const gearTemplate = io.readTemplate('pilot-gear');
const levelTemplate = io.readTemplate('wizards/pilot-level');
//wizard template

function loadPilot(pilot) {
  var disp = Object.assign({}, pilot)

  disp.hp = Stats.getPilotHP(pilot.level);

  var expandedTalents = [];
  for (var i = 0; i < pilot.talents.length; i++) {
    var talent = Search.byID(talents, pilot.talents[i].id);
    talent.rank = pilot.talents[i].rank;

    expandedTalents.push(talent);
  }
  disp.talents = expandedTalents;

  var expandedCoreBonuses = [];
  for (var i = 0; i < pilot.core_bonuses.length; i++) {
    var bonus = Search.byID(coreBonuses, pilot.core_bonuses[i]);

    expandedCoreBonuses.push(bonus);
  }
  disp.bonuses = expandedCoreBonuses;

  var info_template = Handlebars.compile(sheetTemplate);
  $("#pilot-info-output").html(info_template(disp));
  
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


  if (pilot.level < 12) {
    $("#plvl-btn").click(function () {
      $('#levelPilotModal').css("display", "block");
      var template = Handlebars.compile(levelTemplate);
      $("#plvl-modal-body").html(template(pilot));
      LP.init(pilot);
    });
  } else {
    $("#plvl-btn").addClass("warning-stripes disabled")
  }



  $("#pilot-delete-btn").off();
  $("#pilot-delete-btn").click(function(){deletePilot(pilot)});

  $("#pilot-clone-btn").off();
  $("#pilot-clone-btn").click(function () { clonePilot(pilot) });

  // $("#edit-pilot-btn").off();
  // $("#edit-pilot-btn").click(function () { 
  //   $(".edit").each(function(){$(this).toggleClass("hidden")});
  //   $(".main").animate({ scrollTop: 0 }, "slow");
  // });

//   $("#save-pilot-btn").off();
//   $("#save-pilot-btn").click(function () {
//     //save changes to pilot
//     //write pilots to json
//     $(".edit").each(function () { $(this).toggleClass("hidden") });
//   });

  Expander.bindEquipment();
  Expander.bindModalClose();

}

function exportPilot(pilot){

}

function clonePilot(pilot) {
  var newpilot = Object.assign({}, pilot);
  newpilot.id = io.newID();
  newpilot.name = `${pilot.name} (CLONE)`;
  newpilot.callsign = `${pilot.callsign}*`;
  Sidebar.init(newpilot);
}

function deletePilot(pilot) {
  dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Delete Pilot',
      message: `Are you sure you want to delete Pilot ${pilot.name} (${pilot.callsign})? This action cannot be undone.`
    }, function(response) {
      if (response === 0) { //yes
        Sidebar.remove(pilot)
      } else {
        return;
      }
  });
}

module.exports = loadPilot;