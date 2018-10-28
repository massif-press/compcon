const $ = require("jquery");
const fs = require("fs");
const Handlebars = require("handlebars");
const mechSidebar = require("./mech-sidebar");
const pilotSheet = require("./pilot-sheet");
//data
const pilots = require("../resources/data/pilots.json");
//templates
const pilotTemplate = fs.readFileSync(__dirname  + "/templates/pilot-expander.hbs", "utf8");

var template = Handlebars.compile(pilotTemplate);
$("#pilot-sidebar-output").html(template({"pilots": pilots}));

$(".pilot-expander, .pilot-sheet-btn").click(function() {
  var id = $(this).attr('data-id');

  $('.main').load('./html/pilot-sheet.html', function () {
    pilotSheet(pilots[id]);
  });

  $('.mech-sidebar').load('./html/mech-sidebar.html', function () {
    mechSidebar(pilots[id]);
  });
})



