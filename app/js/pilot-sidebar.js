const $ = require("jquery");
const fs = require("fs");
const Handlebars = require("handlebars");
const mechSidebar = require("./mech-sidebar");
const pilotSheet = require("./pilot-sheet");
const Expander = require("./util/expander");
const Search = require("./util/search")
const NPW = require("./wizards/newpilot")
//mutable data
var pilots = require("../resources/data/pilots.json");
//templates
const pilotTemplate = fs.readFileSync(__dirname + "/templates/pilot-expander.hbs", "utf8");
const npwTemplate = fs.readFileSync(__dirname + "/templates/wizards/new-pilot.hbs", "utf8");

var template = Handlebars.compile(pilotTemplate);

function init(newpilot) {
  if (newpilot) {
    pilots.push(newpilot);
    fs.writeFile(__dirname + '/../resources/data/pilots.json', JSON.stringify(pilots), 'utf8', function(err) {
      if (err) alert(`ERROR: Unable to save pilot to pilots.json. Ensure you have write access to ${__dirname}/../resources/data/`);
    });
  }

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
}

function updatePilot(newpilot) {
  var idx = pilots.findIndex(p => p.id === newpilot.id)

  if (idx === -1) { 
    alert(`ERROR: Bad pilot ID!`); 
    return
  }
  pilots[idx] = newpilot;
  fs.writeFile(__dirname + '/../resources/data/pilots.json', JSON.stringify(pilots), 'utf8', function (err) {
    if (err) alert(`ERROR: Unable to save pilot to pilots.json. Ensure you have write access to ${__dirname}/../resources/data/`);
  });
  init();
  $('.main').load('./html/pilot-sheet.html', function () {
    pilotSheet(pilots[idx]);
});}

function removePilot(oldpilot) {
  var idx = pilots.findIndex(p => p.id === oldpilot.id)

  if (idx === -1) {
    alert(`ERROR: Bad pilot ID!`);
    return
  }
  pilots.splice(idx, 1) 
  fs.writeFile(__dirname + '/../resources/data/pilots.json', JSON.stringify(pilots), 'utf8', function (err) {
    if (err) alert(`ERROR: Unable to edit pilots.json. Ensure you have write access to ${__dirname}/../resources/data/`);
  });
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