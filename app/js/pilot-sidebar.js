var $ = require("jquery");
var pilots = require("../resources/data/pilots.json");
var Handlebars = require("handlebars");

//-- Sidebar Templating -----------------------//
var info_template = Handlebars.compile($('#pilot-sidebar-template').html());

Handlebars.registerHelper('allCaps', function (str) {
  return str.toUpperCase();
});

Handlebars.registerHelper('statusStripes', function (status) {
  return status.toUpperCase() === "DECEASED" ? "warning-stripes" : "";
});

Handlebars.registerHelper('statusStyle', function (status) {
  if (status.toUpperCase() === "DECEASED") return "deceased";
  else if (status.toUpperCase() === "ACTIVE") return "active";
  return "inactive";
});

Handlebars.registerHelper('activeStatus', function (status) {
  return status.toUpperCase() === "ACTIVE" ? "active" : "";
});

$("#pilot-sidebar-output").html(info_template({"pilots": pilots}));
//-- End Sidebar Templating -------------------//


$(".pilot-expander, .pilot-sheet-btn").click(function() {
  var id = $(this).attr('data-id');
  $('.main').load('./resources/html/pilot-sheet.html', function () {
    loadPilot(id);
  });
})

function loadPilot(index) {
  var info_template = Handlebars.compile($('#pilot-info-template').html());
  var pilot = pilots[index];

  $("#pilot-info-output").html(info_template(pilot));
}

Handlebars.registerHelper('repeat', function (n, block) {
  var str = '';
  for (var i = 0; i < n; ++i)
    str += block.fn(i);
  return str;
});