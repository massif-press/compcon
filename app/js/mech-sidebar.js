const $ = require("jquery");
const Handlebars = require("handlebars");
const fs = require("fs");
const Load = require("./mech-sheet")
const Search = require("./util/search");
const Expander = require("./util/expander");
//data
var configs = require("../resources/data/configurations.json");
const shells = require("../resources/data/shells.json");
var pilots = require("../resources/data/pilots.json");
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
        Load(Search.byID(configArray, id), pilot);
      });
    }
  });

  $('#add-config-btn').off(); //prevent this from multiple binds
  $('#add-config-btn').click(function () {
    var id = Math.random().toString(36).substr(2, 9);
    configs.push({
      "id": id,
      "name": "new mech",
      "img": "",
      "shell_id": "everest",
      "status": "active",
      "weapons": [],
      "systems": []
    })
    Search.byID(pilots, pilot.id).configs.push(id);

    console.log(configs, pilot.configs);
    loadMecha(pilot)
  })
}



module.exports = loadMecha;