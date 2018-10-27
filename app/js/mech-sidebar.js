const $ = require("jquery");
const Handlebars = require("handlebars");
const fs = require("fs");
const Load = require("./mech-sheet")
const Search = require("./util/search");
const Expander = require("./util/expander");
//data
const configs = require("../resources/data/configurations.json");
const shells = require("../resources/data/shells.json");
//templates
const mechTemplate = fs.readFileSync(__dirname + "/templates/config-expander.hbs", "utf8");

function loadMecha(pilot) {
  var configArray = [];

  for (var i = 0; i < configs.length; i++) {
    configs[i].shell = Search.byID(shells, configs[i].shell_id);
  }

  for (var i = 0; i < pilot.configs.length; i++) {
    configArray.push(Search.byID(configs, pilot.configs[i]));
  }

  var template = Handlebars.compile(mechTemplate);
  $("#mech-sidebar-output").html(template({
    "configs": configArray
  }));

  $('.mech-expander').click(function () {
    if ($(this).hasClass('btn')) {
      Expander.bind('mech', this);
      var id = $(this).attr("id");

      $('.main').load('./html/mech-sheet.html', function () {
        Load(configArray.find(function (c) {
          return c.id == id;
        }), pilot);
      });
    }
  });
}

module.exports = loadMecha;