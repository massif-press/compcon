var $ = require("jquery");
var Handlebars = require("handlebars");
var configs = require("../resources/data/configurations.json");
var shells = require("../resources/data/shells.json");
var loadMech = require("./mech-sheet")

Handlebars.registerHelper('checkStripes', function (status) {
  var ok = status.toUpperCase() === "AVAILABLE" || status.toUpperCase() === "ACTIVE";
  return ok ? "" : "warning-stripes";
});

Handlebars.registerHelper('checkAvail', function (status) {
  if (status.toUpperCase() === "AVAILABLE") return ""
  else if (status.toUpperCase() === "ACTIVE") return "active"
  else if (status.toUpperCase() === "DESTROYED") return "destroyed"
  else return "unavailable"
  });

function loadMecha(idArray) {
  var configArray = [];

  for (var i = 0; i < configs.length; i++) {
    configs[i].shell = shells.find(s => s.id == configs[i].shell_id);;
  }

  for (var i = 0; i < idArray.length; i++) {
    var id = idArray[i];
    configArray.push(configs.find(function (c) { return c.id == id; }))
  }

  var template = Handlebars.compile($('#mech-sidebar-template').html());

  $("#mech-sidebar-output").html(template({"configs": configArray}));

  $('.mech-expander').click(function () {
    if ($(this).hasClass('btn')) {
      toggleExpander('mech', this);
      var id = $(this).attr("id");
      
      $('.main').load('./resources/html/mech-sheet.html', function () {
        loadMech(configArray.find(function (c) { return c.id == id; }));
      });
    }
  });

}

//TODO: refactor
function toggleExpander(expanderType, element) {
  $(element).toggleClass('open btn');
  $($(element).find("." + expanderType + '-sub')).toggle();
  $($(element).find("." + expanderType + '-open-info')).toggle("swing");

  $('.' + expanderType + '-expander').each(function () {
    if (this !== element && $(this).hasClass('open')) {
      $(this).toggleClass('open btn');
      $($(this).find("." + expanderType + '-sub')).toggle();
      $($(this).find("." + expanderType + '-open-info')).toggle("swing");
    }
  });
}

module.exports = loadMecha;