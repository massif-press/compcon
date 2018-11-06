const $ = require("jquery");
const fs = require("fs");
const Handlebars = require("handlebars");
const mechSidebar = require("./mech-sidebar");
const pilotSheet = require("./pilot-sheet");
const Expander = require("./util/expander");
const Search = require("./util/search")
//data
var pilots = require("../resources/data/pilots.json");
//templates
const pilotTemplate = fs.readFileSync(__dirname  + "/templates/pilot-expander.hbs", "utf8");

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
  })

  $('.close').click(function () {
    let modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  $('.wizard-btn').off();
  $('.wizard-btn').click(function() {
    let step = $(this).data("step");   
    $(".np-wizard").hide()    
    $(`.np-wizard[data-step='${step}']`).show();
  })

}

$('#add-pilot-btn').click(function(){
  pilots.push(
    {
      "id": Math.random().toString(36).substr(2, 9),
      "callsign": "NEW",
      "name": "New Pilot",
      "level": 0,
      "background": "",
      "history": "",
      "fnf": [],
      "img-portrait": "",
      "img-appearance": "",
      "text-appearance": "",
      "hp_bonus": 0,
      "armor": 0,
      "ee": "10/10",
      "speed": 4,
      "status": "ACTIVE",
      "licenses": [],
      "gear": [],
      "skills": {
        "grit": 0,
        "acquire": 0,
        "brawl": 0,
        "flash": 0,
        "infiltrate": 0,
        "investigate": 0,
        "persuade": 0,
        "command": 0,
        "swindle": 0,
        "tech": 0,
        "survive": 0,
        "maneuver": 0,
        "notice": 0
      },
      "talents": [],
      "talent_weapons": [],
      "core": {
        "hull": 0,
        "agi": 0,
        "eng": 0,
        "sys": 0,
        "targeting": 0,
        "hp": 0,
        "sp": 0,
        "core_sp": 0
      },
      "core_bonuses": [],
      "notes": "",
      "configs": []
     }
  )
  init();
})

$(document).ready(function() {
  init();
})
