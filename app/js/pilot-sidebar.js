const $ = require("jquery");
const fs = require("fs");
const Handlebars = require("handlebars");
const mechSidebar = require("./mech-sidebar");
const pilotSheet = require("./pilot-sheet");
const Expander = require("./util/expander");
const Search = require("./util/search")
//data
const backgrounds = require("../resources/data/backgrounds.json");
const talents = require("../resources/data/pilot_talents.json");
//mutable data
var pilots = require("../resources/data/pilots.json");
//templates
const pilotTemplate = fs.readFileSync(__dirname + "/templates/pilot-expander.hbs", "utf8");
const w_backgroundTemplate = fs.readFileSync(__dirname + "/templates/wizards/pilot-background.hbs", "utf8");
const w_talentTemplate = fs.readFileSync(__dirname  + "/templates/wizards/pilot-talents.hbs", "utf8");

var template = Handlebars.compile(pilotTemplate);

function init() {
  $("#pilot-sidebar-output").html(template({"pilots": pilots}));

  $('.pilot-expander').click(function () {
    if ($(this).hasClass('btn')) {
      Expander.bind('pilot', this);
    }
  });

  $(".pilot-expander, .pilot-sheet-btn").click(function() {
    var id = $(this).attr('data-id');

    $('.main').load('./html/pilot-sheet.html', function () {
      pilotSheet(Search.byID(pilots, id));
    });

    $('.mech-sidebar').load('./html/mech-sidebar.html', function () {
      mechSidebar(Search.byID(pilots, id));
    });
  });

  $('.close').click(function () {
    let modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  $('.wizard-btn').off();
  $('.wizard-btn').click(function() {
    if ($(this).hasClass('disabled')) return;
    let step = $(this).data("step");   
    $(".np-wizard").hide()    
    $(`.np-wizard[data-step='${step}']`).show();
  });

  //name
  $("line-input").off();
  $('.line-input').keyup(function(){
    if ($('#callsign-input').val().length && $('#name-input').val().length) $(`.wizard-btn[data-step='2']`).removeClass('disabled').addClass('btn');
    else $(`.wizard-btn[data-step='2']`).addClass('disabled').removeClass('btn');
  })

  //Backgrounds
  var bgTemp = Handlebars.compile(w_backgroundTemplate);
  $("#bg-options").html(bgTemp({"backgrounds": backgrounds}));

  $('.bg-selector').off()
  $('.bg-selector').click(function(){
    var element = $(this);

    $('.bg-selector').each(function(){
      e = $(this);
      // e.removeClass('selected')
      if (e !== element && e.hasClass('selected')) {
        e.toggleClass('selected');
        e.toggleClass('sweep-btn bold');
        var parent = e.closest('.equip-expander');
        $($(parent).find(".equip-open-info")).toggle("swing");
      }
    });

    $(this).addClass('selected');
    $('#bg-selection').html(`<b>"${$(this).data("name")}"</b> Selected`);
    $(`.wizard-btn[data-step='3']`).removeClass('disabled').addClass('btn');
  });

  //Skills

  //Talents 
  var talTemp = Handlebars.compile(w_talentTemplate);
  $("#talents-list").html(talTemp({ "talents": talents }));
  Expander.bindEquipment();

  var talent_selections = [];
  var talent_names = [];
  $('.talent-btn').click(function(){
    var e = $(this);
    var add = e.children(".add-button");
    var remove = e.children(".subtract-button");
    if (add.is(':visible') && talent_selections.length < 3) {
      talent_selections.push(e.data("talent"));
      talent_names.push(e.data("talent-name"));
      add.hide();
      remove.show();
    } else if (remove.is(':visible')) {
      talent_selections.pop(talent_selections.findIndex(x => x === e.data("talent")));
      talent_names.pop(talent_selections.findIndex(x => x === e.data("talent-name")));
      remove.hide();
      add.show();
    }
    $("#selected-talents").html("Selected Talents: <b>" + talent_names.join(", ") + "</b>");
    if (talent_selections.length === 3) $(`.wizard-btn[data-step='5']`).removeClass('disabled').addClass('btn');
    else $(`.wizard-btn[data-step='5']`).addClass('disabled').removeClass('btn');
  })



}

$('#add-pilot-btn').click(function(){
  pilots.push(getNewPilot());    
  init();
})

$(document).ready(function() {
  init();
})

function getNewPilot() {
  return {
    "id": Math.random().toString(36).substr(2, 9),
    "callsign": "NEW",
    "name": "New Pilot",
    "level": 0,
    "background": "N/A",
    "fnf": [],
    "hp_bonus": 0,
    "armor": 0,
    "ee": "10/10",
    "speed": 4,
    "status": "ACTIVE",
    "licenses": [],
    "gear": [],
    "skills": { "grit": 0, "acquire": 0, "brawl": 0, "flash": 0, "infiltrate": 0, "investigate": 0, "persuade": 0, "command": 0, "swindle": 0, "tech": 0, "survive": 0, "maneuver": 0, "notice": 0 },
    "talents": [],
    "talent_weapons": [],
    "core": {"hull": 0,"agi": 0,"eng": 0,"sys": 0,"targeting": 0,"hp": 0,"sp": 0,"core_sp": 0},
    "core_bonuses": [],
    "configs": []
  }
}
