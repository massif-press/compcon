const $ = require("jquery");
const fs = require("fs");
const io = require("./util/io");
const Handlebars = require("handlebars");
const mechSidebar = require("./mech-sidebar");
const pilotSheet = require("./pilot-sheet");
const Expander = require("./util/expander");
const Search = require("./util/search")
const NPW = require("./wizards/newpilot")
//mutable data
var pilots = require("../extraResources/data/pilots.json");
//templates
const pilotTemplate = io.readTemplate('pilot-expander');
const npwTemplate = io.readTemplate('wizards/new-pilot');

var template = Handlebars.compile(pilotTemplate);

function init(newpilot) {
  if (newpilot) {
    pilots.push(newpilot);
    io.writeJson('pilots', pilots)
  }

  $("#pilot-sidebar-output").html(template({"pilots": pilots}));

  $('.pilot-expander').click(function () {
    if ($(this).hasClass('btn')) {
      Expander.bind('pilot', this);
    }
  });

  $(".pilot-expander, .pilot-sheet-btn").click(function() {
    var id = $(this).attr('data-id');

    $('#add-config-btn').addClass("btn menu-btn").text("Add Mech");

    $('.main').load('./html/pilot-sheet.html', function () {
      pilotSheet(Search.byID(pilots, id));
    });

    $('.mech-sidebar').load('./html/mech-sidebar.html', function () {
      mechSidebar.loadMecha(Search.byID(pilots, id));
    });
  });
}

function updatePilot(newpilot) {
  var idx = pilots.findIndex(p => p.id === newpilot.id)

  if (idx === -1) { 
    alert(`ERROR: Bad pilot ID!`); 
    return
  }
  
  pilots[idx] = newpilot;
  io.writeJson('pilots', pilots)
  init();
  $('.main').load('./html/pilot-sheet.html', function () {
    pilotSheet(pilots[idx]);
  });
}

function removePilot(oldpilot) {
  var idx = pilots.findIndex(p => p.id === oldpilot.id)

  if (idx === -1) {
    alert(`ERROR: Bad pilot ID!`);
    return
  }
  pilots.splice(idx, 1) 
  io.writeJson('pilots', pilots)
  init();
  $('.main').html('');
}

$("#add-pilot-btn").click(function() {
  $('#newPilotModal').css("display", "block");
  var npwt = Handlebars.compile(npwTemplate);
  $("#npw-modal-body").html(npwt());
  NPW.init();
});

$('#add-pilot-btn').click(function(){
  init();
})

$(document).ready(function() {
  init();
})

module.exports.init = init;
module.exports.update = updatePilot;
module.exports.remove = removePilot;