const $ = require("jquery");
const fs = require("fs");
const Handlebars = require("handlebars");
//data
const manufacturers = require("../resources/data/manufacturers.json");
//templates
const pilotTemplate = fs.readFileSync(__dirname + "/templates/manufacturers.hbs", "utf8");

var template = Handlebars.compile(pilotTemplate);
$("#manufacturer-sidebar").html(template({"manufacturers": manufacturers}));

// $(".pilot-expander, .pilot-sheet-btn").click(function () {
//   var id = $(this).attr('data-id');

//   $('.main').load('./html/pilot-sheet.html', function () {
//     pilotSheet(pilots[id]);
//   });

//   $('.mech-sidebar').load('./html/mech-sidebar.html', function () {
//     mechSidebar(pilots[id]);
//   });
// })

// Manufacturer info modal button
$(".manu-modal-btn").click(function () {
  let modalID = $(this).data("modal");
  $('#' + modalID).css("display", "block");
  $('.modal-body').html($(this).data("description"));
});

$('.close').click(function () {
  let modalID = $(this).data("modal");
  $('#' + modalID).css("display", "none");
});