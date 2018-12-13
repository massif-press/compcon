const $ = require("jquery");
const Handlebars = require("handlebars");
const Load = require("./mech-sheet")
const io = require("./util/io")
const Search = require("./util/search");
const Expander = require("./util/expander");
const ConfigWizard = require('./wizards/newconfig');
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

  $('#add-config-btn').off().click(function () {
    ConfigWizard(pilot);
  })
}

function addConfig(pilotID, newConfig){
  var pilotIndex = pilots.findIndex(p => p.id === pilotID);

  var c = {
    id: io.newID(),
    name: newConfig.name,
    img: newConfig.imgFilepath,
    shell_id: newConfig.shellID,
    status: "active",
    mounts: newConfig.mounts,
    systems: []
  }
  if (newConfig.everest_bonus) c.everest_bonus = newConfig.everest_bonus

  pilots[pilotIndex].configs.push(c.id);
  configs.push(c);
  io.writeJson('configurations', configs);
  io.writeJson('pilots', pilots);
  loadMecha(pilots[pilotIndex])
}

function deleteConfig(pilotID, configID) {
  var configIndex = configs.findIndex(c => c.id === configID);
  var pilotIndex = pilots.findIndex(p => p.id === pilotID);

  pilots[pilotIndex].configs = pilots[pilotIndex].configs.filter(x => x !== configID);
  configs.splice(configIndex, 1);
  io.writeJson('configurations', configs);
  io.writeJson('pilots', pilots);
  loadMecha(pilots[pilotIndex])
}

function updateMount(configID, newItem, itemIndex, pilotID) { 
  var configIndex = configs.findIndex(c => c.id === configID);
  var mountIndex = configs[configIndex].mounts.findIndex(m => m.mount_index == itemIndex);
  configs[configIndex].mounts[mountIndex] = newItem;
  io.writeJson('configurations', configs)
  Load(configs[configIndex], pilots[pilots.findIndex(p => p.id === pilotID)])
}

function addMount(configID, newItem) {
  var configIndex = configs.findIndex(c => c.id === configID);
  configs[configIndex].mounts.push(newItem);
}

function removeMount(configID, mountIndex) {
  var configIndex = configs.findIndex(c => c.id === configID);
  var spliceIndex = configs[configIndex].mounts.findIndex(m => m.mount_index === mountIndex);
  configs[configIndex].mounts.splice(spliceIndex, 1);
}

function unlockMount(configID, mountIndex) {
  setMountLock(configID, mountIndex);
}

function lockMount(configID, mountIndex, linkIndex) {
  setMountLock(configID, mountIndex, linkIndex);
}

function setMountLock(configID, mountIndex, linkIndex) {
  var configIndex = configs.findIndex(c => c.id === configID);
  var lockIndex = configs[configIndex].mounts.findIndex(m => m.mount_index === mountIndex);
  if (linkIndex) { 
    configs[configIndex].mounts[lockIndex].sh_lock = true
    configs[configIndex].mounts[lockIndex].linked_index = linkIndex;
  } else {
    delete configs[configIndex].mounts[lockIndex].sh_lock;
    delete configs[configIndex].mounts[lockIndex].linked_index;
  }
}

function updateSystem(configID, newItem, itemIndex, pilotID) {
  var configIndex = configs.findIndex(c => c.id === configID);
  if (itemIndex && newItem) configs[configIndex].systems[itemIndex] = newItem;  //replace
  else if (itemIndex && !newItem) configs[configIndex].systems.splice(itemIndex, 1); //remove
  else configs[configIndex].systems.push(newItem); //add
  io.writeJson('configurations', configs)
  Load(configs[configIndex], pilots[pilots.findIndex(p => p.id === pilotID)])
}

module.exports.loadMecha = loadMecha;
module.exports.addConfig = addConfig;
module.exports.deleteConfig = deleteConfig;
module.exports.updateMount = updateMount;
module.exports.addMount = addMount;
module.exports.removeMount = removeMount;
module.exports.updateSystem = updateSystem;
module.exports.lockMount = lockMount;
module.exports.unlockMount = unlockMount;