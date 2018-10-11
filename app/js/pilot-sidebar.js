var $ = require("jquery");
var Handlebars = require("handlebars");
var pilots = require("../resources/data/pilots.json");

var mechSidebar = require("./mech-sidebar");
var pilotSheet = require("./pilot-sheet");

var template = Handlebars.compile($('#pilot-sidebar-template').html());

// helpers
Handlebars.registerHelper('allCaps', function (str) {
  return str.toUpperCase();
});

Handlebars.registerHelper('statusStripes', function (status) {
  return status.toUpperCase() === "DECEASED" ? "warning-stripes" : "";
});

Handlebars.registerHelper('statusStyle', function (status) {
  if (status.toUpperCase() === "AVAILABLE") return "";
  else if (status.toUpperCase() === "INACTIVE") return "";
  else if (status.toUpperCase() === "ACTIVE") return "active";
  else if (status.toUpperCase() === "DECEASED") return "destroyed";
  else if (status.toUpperCase() === "DESTROYED") return "destroyed";
  return "unavailable";
});

Handlebars.registerHelper('activeStatus', function (status) {
  return status.toUpperCase() === "ACTIVE" ? "active" : "";
});
// end helpers

$("#pilot-sidebar-output").html(template({"pilots": pilots}));

$(".pilot-expander, .pilot-sheet-btn").click(function() {
  var id = $(this).attr('data-id');

  $('.main').load('./resources/html/pilot-sheet.html', function () {
    pilotSheet(pilots[id]);
  });

  $('.mech-sidebar').load('./resources/html/mech-sidebar.html', function () {
    mechSidebar(pilots[id].configs);
  });
})



