const $ = require("jquery");
const fs = require("fs");
const Handlebars = require("handlebars");
const Tablesorter = require("tablesorter");
//data
const manufacturers = require("../resources/data/manufacturers.json");
const core_bonuses = require("../resources/data/core_bonus.json");
const pilot_gear = require("../resources/data/pilot_gear.json");
const shells = require("../resources/data/shells.json");
const weapons = require("../resources/data/weapons.json");
const systems = require("../resources/data/systems.json");
//templates
const manufacturerTemplate = fs.readFileSync(__dirname + "/templates/catalog/manufacturers.hbs", "utf8");
const pilotArmorTemplate = fs.readFileSync(__dirname + "/templates/catalog/pilot-armor.hbs", "utf8");
const pilotWeaponTemplate = fs.readFileSync(__dirname + "/templates/catalog/pilot-weapons.hbs", "utf8");
const pilotGearTemplate = fs.readFileSync(__dirname + "/templates/catalog/pilot-gear.hbs", "utf8");
const bonusTemplate = fs.readFileSync(__dirname + "/templates/catalog/core-bonuses.hbs", "utf8");
const shellTemplate = fs.readFileSync(__dirname + "/templates/catalog/shells.hbs", "utf8");
const weaponTemplate = fs.readFileSync(__dirname + "/templates/catalog/weapons.hbs", "utf8");
const systemTemplate = fs.readFileSync(__dirname + "/templates/catalog/systems.hbs", "utf8");

Handlebars.registerHelper('haseString', function (stats, prop) {
  return stats[prop] ? stats[prop] : 0;
});

Handlebars.registerHelper('mountString', function (mounts, prop) {
  var count = 0;
  for (var i = 0; i < mounts.length; i++) {
    if (mounts[i] == prop) count ++
  }
  return count;
});
  

var template = Handlebars.compile(manufacturerTemplate);
$("#manufacturer-sidebar").html(template({"manufacturers": manufacturers}));

$(".manu-block").click(function(){
  $(this).toggleClass('selected');
})

//type selector
$("#type-dropdown").change(function() {
  var val = $(this).val();

  $(".subtype-dropdown").each(function(){$(this).hide(300)});

  var template;
  var itemObj = {};
  switch (val) {
    case "pilot_gear":
      $("#subtype-pg-dropdown").show(300);
      break;
    case "core_bonuses":
      var template = Handlebars.compile(bonusTemplate);
      itemObj.items = core_bonuses;
      break;
    case "shells":
      var template = Handlebars.compile(shellTemplate);
      itemObj.items = shells;
      break;
    case "weapons":
      var template = Handlebars.compile(weaponTemplate);
      itemObj.items = weapons;
      break;
    case "systems":
      var template = Handlebars.compile(systemTemplate);
      itemObj.items = systems;
      break;
    default:
      break;
  }

  $("#scroll-body").html(template(itemObj));
  tableInit()
})

//pilot gear type selector
$("#subtype-pg-dropdown").change(function () {
  var val = $(this).val();

  var template;
  var itemObj = {};
  switch (val) {
    case "armor":
      var template = Handlebars.compile(pilotArmorTemplate)
      itemObj.items = pilot_gear.armor;
      break;
    case "weapons":
      var template = Handlebars.compile(pilotWeaponTemplate);
      itemObj.items = pilot_gear.weapons;
      break;
    case "gear":
      var template = Handlebars.compile(pilotGearTemplate);
      itemObj.items = pilot_gear.gear;
      break;
    default:
      break;
  }

  $("#scroll-body").html(template(itemObj));
  tableInit()
})

//select/unselect all
$("#select-all").click(function() {
  $(".manu-block").each(function(){
    $(this).addClass('selected')
  })
})

$("#select-none").click(function () {
  $(".manu-block").each(function () {
    $(this).removeClass('selected')
  })
})


// Manufacturer info modal button
$(".manu-modal-btn").click(function () {
  let modalID = $(this).data("modal");
  $('#' + modalID).css("display", "block");
  console.log($(this).data("description"));
  $('.modal-body').html($(this).data("description"));
});

$('.close').click(function () {
  let modalID = $(this).data("modal");
  $('#' + modalID).css("display", "none");
});

function tableInit() {
  $('.tablesorter-childRow td').hide();
  $(".tablesorter").tablesorter({cssChildRow: "tablesorter-childRow"})
  $('.tablesorter').delegate('.toggle', 'click', function () {
    $(this).closest('tr').toggleClass('catalog-open')
    $(this).closest('tr').nextUntil('tr.tablesorter-hasChildRow').find('td').toggle();
    return false;
  });
}