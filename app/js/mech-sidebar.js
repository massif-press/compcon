const $ = require("jquery");
const Handlebars = require("handlebars");
const fs = require("fs");
const Load = require("./mech-sheet")
const io = require("./util/io")
const Search = require("./util/search");
const Expander = require("./util/expander");
//data
var configs = require("../extraResources/data/configurations.json");
var pilots = require("../extraResources/data/pilots.json");
//templates
const mechTemplate = io.readTemplate('config-expander');

function loadMecha(pilot) {
  var configArray = [];

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
    // configs.push({
    //   "id": io.newID(),
    //   "name": "new mech",
    //   "img": "",
    //   "shell_id": "everest",
    //   "status": "active",
    //   "weapons": [],
    //   "systems": []
    // })
    // Search.byID(pilots, pilot.id).configs.push(id);
    // loadMecha(pilot)
  })
}

function updateMount(configID, newItem, itemIndex, pilot_id) { 
  var configIndex = configs.findIndex(c => c.id === configID);
  var mountIndex = configs[configIndex].mounts.findIndex(m => m.mount_index == itemIndex);
  configs[configIndex].mounts[mountIndex] = newItem;
  io.writeJson('configurations', configs)
  Load(configs[configIndex], pilots[pilots.findIndex(p => p.id === pilot_id)])
}

function updateSystem(configID, newItem, itemIndex, pilot_id) {
  var configIndex = configs.findIndex(c => c.id === configID);
  if (itemIndex) configs[configIndex].systems[itemIndex] = newItem;  //replace
  else if (newItem == null) configs[configIndex].systems.splice(itemIndex, 1); //remove
  else configs[configIndex].systems.push(newItem); //add
  io.writeJson('configurations', configs)
  Load(configs[configIndex], pilots[pilots.findIndex(p => p.id === pilot_id)])
}

module.exports.loadMecha = loadMecha;
module.exports.updateMount = updateMount;
module.exports.updateSystem = updateSystem;