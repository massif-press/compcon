const $ = require('jquery');
const fs = require('fs');
const Handlebars = require('handlebars');
const Stats = require('./util/stats');
const Tags = require('./util/taghelper');
const Charts = require('./util/chartbuilder');
const Expander = require('./util/expander');
const Search = require('./util/search');
const mechSidebar = require("./mech-sidebar");
//data
const shells = require("../resources/data/shells.json");
const weapons = require("../resources/data/weapons.json");
const systems = require("../resources/data/systems.json");
const weapon_mods = require("../resources/data/mods.json");
//templates
const loadoutTemplate = fs.readFileSync(__dirname + "/templates/mech-loadout.hbs", "utf8");
const infoTemplate = fs.readFileSync(__dirname + "/templates/mech-info.hbs", "utf8");
const statsTemplate = fs.readFileSync(__dirname + "/templates/mech-stats.hbs", "utf8");
const shellModalTemplate = fs.readFileSync(__dirname + "/templates/mech-shell-modal.hbs", "utf8");
const equipModalTemplate = fs.readFileSync(__dirname + "/templates/editors/mount-editor.hbs", "utf8");
const systemModalTemplate = fs.readFileSync(__dirname + "/templates/editors/system-editor.hbs", "utf8");
const equipWeaponItemTemplate = fs.readFileSync(__dirname + "/templates/editors/mech-weapon.hbs", "utf8");
const systemItemTemplate = fs.readFileSync(__dirname + "/templates/editors/mech-system.hbs", "utf8");

function loadMech(config, pilot) {
  config.shell = Search.byID(shells, config.shell_id);

  config.shell.ult_active = Tags.parse(config.shell.ult_active);

  $(".main-scroll").scrollTop(1);
  var stats = Stats.getMechStats(config, pilot)

  var mounts = [];
  var sys = [];
  
  //add ult wewapon, if any
  if (config.shell.ult_passive_weapon) {
    var w = Search.byID(weapons, config.shell.ult_passive_weapon);
    mounts.push({
      mount: w.mount,
      weapon: Tags.expand(w),
      mods: []
    });
  }

  //add pilot talent weapons, if any
  if (pilot.talent_weapons) {
    for (var i = 0; i < pilot.talent_weapons.length; i++) {
      var w = Search.byID(weapons, pilot.talent_weapons[i]);
      mounts.push({
        mount: w.mount,
        weapon: Tags.expand(w),
        mods: []
      });
    }
  }

  //add weapons, per mount
  for (var i = 0; i < config.mounts.length; i++) {
    if (!config.mounts[i].weapon_id) {
      mounts.push({
        mount: config.mounts[i].mount,
      })
    } else {
      var w = Search.byID(weapons, config.mounts[i].weapon_id)
      var mods = config.mounts[i].mods ? config.mounts[i].mods : []; 
      mounts.push({ mount: config.mounts[i].mount, weapon: Tags.expand(w), mods: mods});
    }
  }

  //add indices, for preserving sort order
  for (var i = 0; i < mounts.length; i++) {
    mounts[i].idx = i;
  }

  //TODO: walk through core bonuses, talents, to add add linked mods (global_mods on pilot sheet?)
  //some mods only apply to eg. ranged or limited systems/items.

  for (var i = 0; i < mounts.length; i++) {
    if (mounts[i].mods && mounts[i].mods.length) {
      for (var j = 0; j < mounts[i].mods.length; j++) {
        var m = mounts[i].mods[j];
        var mod = Search.byID(weapon_mods, m);
        mod.effect = Tags.parse(mod.effect);
        mounts[i].weapon.sp += mod.sp;
        if (mounts[i].weapon.mods == null) mounts[i].weapon.mods = [];
        mounts[i].weapon.mods.push(mod);
      }
    }
  }

  for (var i = 0; i < config.systems.length; i++) {
    sys.push(Search.byID(systems, config.systems[i].id));
  }
  
  sys = Tags.expand(sys);

  //collect all licenses required
  var isEverest = config.shell.id === "everest"
  config.licenses = [{
    "source": config.shell.source,
    "name": isEverest ? "" : config.shell.name,
    "level": isEverest ? "" : 2,
    "items": `${config.shell.source} ${config.shell.name} Shell`
  }]

  var items = sys.concat(mounts.map(m => m.weapon).filter(x => x != null));

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.source == "Special") continue;
    var lIndex = config.licenses.findIndex(l => l.name === item.license);
    if (lIndex > -1) {
      if (config.licenses[lIndex].level < item.license_level) { //if our new item exceeds our current license level
        var upperIdx = config.licenses.findIndex(l => l.level === item.license_level);
        if (upperIdx < 0) { //if we don't already have this license recorded, add it
          config.licenses.push({ 
            "source": item.source,
            "name": item.license,
            "level": item.license_level,
            "items": item.name
          })
        } else {
          config.licenses[upperIdx].items += ", " + item.name;  //otherwise, mark the system on the higher level license
        }
      }
      config.licenses[lIndex].items += ", " + item.name;
    } else {
      config.licenses.push({
        "source": item.source,
        "name": item.license,
        "level": item.license_level,
        "items": item.name
      })
    }
  }

  var aptitudes = {
    "melee": 0,
    "ranged": 0,
    "tech": 0,
    "support": 0,
    "control": 0,
    "repair": 0
  };

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    for (key in item.aptitude) {
      aptitudes[key] += item.aptitude[key];
    }
  }

  for (var i = 0; i < config.licenses.length; i++) {
    var l = config.licenses[i];
    if (l.source === "GMS") {
      config.licenses[i].locked = false;
    } else {
      var lockIndex = pilot.licenses.findIndex(pl => pl.name === l.name);
      if (lockIndex == -1) config.licenses[i].locked = true;
      else if (pilot.licenses[lockIndex].level < l.level) config.licenses[i].locked = true;
      else config.licenses[i].locked = false;
    }
  }

  //move gms to the front of the license block
  var gmsIndex = config.licenses.findIndex(l => l.source === "GMS");
  if (gmsIndex > 0) move(config.licenses, gmsIndex, 0);

  //make sure the shell is the second item
  var shellIndex = config.licenses.findIndex(l => l.source === config.shell.source);
  if (shellIndex > 0) move(config.licenses, shellIndex, 1);

  //sort by mounts
  var sortedMounts = mounts;
  sortedMounts.sort(function(a, b) {
    var sortOrder = {
      "Main": 0,
      "Core": 1,
      "Auxiliary": 2,
      "Flex": 3,
      "Heavy": 4,
      "Superheavy": 5,
      "Special": 6,
      "Apocalypse": 7
  }
    return sortOrder[a.mount] < sortOrder[b.mount] ? -1 : sortOrder[a.mount] > sortOrder[b.mount] ? 1 : 0;
  })


  var info_template = Handlebars.compile(infoTemplate);
  $("#mech-info-output").html(info_template(config));

  var stat_template = Handlebars.compile(statsTemplate);
  $("#mech-stats-output").html(stat_template(stats));

  var sp = {
    max: stats.max_sp,
    free: stats.max_sp - items.filter(i => i.sp != null).reduce((a, b) => a + b.sp, 0)
  }

   var gear_template = Handlebars.compile(loadoutTemplate);
  $("#mech-gear-output").html(gear_template({
    "mounts": sortedMounts,
    "systems": sys,
    "shell": config.shell,
    "sp": sp
  }));
  
  Charts(mounts.map(m => m.weapon).filter(x => x != null), aptitudes);

  //TODO: animations aren't playing well with div show/hide. Fix via canvas?
  //bad hack incoming:
  $("#damage-mount-chart, #damage-type-chart").css('display', 'none');

  $('.chart-selector').on('change', function() {
    var t = $(this).val();
    switch (t) {
      case "range":
        $("#damage-mount-chart, #damage-type-chart").css('display', 'none');
        $("#damage-range-chart").css('display', 'block')
        break;
      case "mount":
        $("#damage-range-chart, #damage-type-chart").css('display', 'none');
        $("#damage-mount-chart").css('display', 'block')
        break;
      case "type":
        $("#damage-range-chart, #damage-mount-chart").css('display', 'none');
        $("#damage-type-chart").css('display', 'block')
        break;
      default:
        break;
    }
  })

  var shell_info_template = Handlebars.compile(shellModalTemplate);
  $("#shell-info-modal-output").html(shell_info_template(config.shell));

  $("#shell-info-btn").click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "block");
  });

  $('.close').click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  Expander.bindEquipment();

  //bind mount buttons
  $('.mount-btn').each(function(){
    var e = $(this);
    e.off();
    e.click(function() {
      openMountModal(mounts[parseInt(e.data('mount-idx'))], e.data('mount-idx'), pilot, config);
    })
  })

  //bind system buttons
  $('.system-btn').each(function () {
    var e = $(this);
    e.off();
    e.click(function () {
      openSystemModal(sys[parseInt(e.data('system-idx'))], e.data('system-idx'), pilot, config, sp);
    })
  })
}

function move (arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

function openMountModal(m, m_idx, pilot, config) {
  //apply modal template
  var equip_template = Handlebars.compile(equipModalTemplate);
  $("#mountEditorModal").html(equip_template(m));
  
  $('#mountEditorModal').css("display", "block");

  $('.close').click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  var validMounts = [m.mount];
  if (m.mount === "Flex") validMounts = ["Auxiliary", "Main"]
  if (m.mount === "Core") validMounts = ["Auxiliary", "Main", "Heavy"]
  if (m.mount === "Spinal") validMounts = ["Main", "Heavy"]
  if (m.mount === "Apocalypse") validMounts = ["Superheavy", "Heavy", "Main", "Auxiliary"]

  //TODO: if there's not another empty mount AND we're not apocalypse type, filter superheavy weapons and show a warning

  var availableWeapons = [];
  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    if (w.source !== "GMS") {
      var licenseIdx = pilot.licenses.findIndex(l => l.name === w.license);
      if (licenseIdx === -1) continue;
      if (licenses[licenseIdx].level < w.license_level) continue;
    }
    if (validMounts.includes(w.mount)) availableWeapons.push(Tags.expand(w))
  }

  //TODO: get all mods available for that mount
  //populate mod list

  var weapon_template = Handlebars.compile(equipWeaponItemTemplate);
  $("#available-weapons").append(weapon_template({weapons: availableWeapons}));
  
  $('.weapon-item').click(function() {
    var e = $(this);
    $('.weapon-item').each(function () {
      $(this).parent().removeClass("skill-upgrade")
      if ($(this).closest('.equip-expander').hasClass('open')) {
        var parent = $(this).closest('.equip-expander');
        $(this).removeClass('bold');
        $(parent).removeClass('open');
        $($(parent).find(".equip-open-info")).hide("swing");
      }
    });
    e.parent().addClass("skill-upgrade");
    $("#mount-install").removeClass("disabled").click(function(){
      //TODO: if weapon selected is superheavy AND we're not apoc type, select associated mount to disable
      addWeaponToMount(e.data("id"), m_idx, pilot, config);
      $('#mountEditorModal').css("display", "none");
    })
  });

  Expander.bindEquipment();
  
}

function addWeaponToMount(weapon_id, mount_idx, pilot, config){
  config.mounts[mount_idx].weapon_id = weapon_id;
  mechSidebar.updateConfig(config);
  loadMech(config, pilot)
}

function openSystemModal(s, s_idx, pilot, config, sp) {
  //apply modal template
  var equip_template = Handlebars.compile(systemModalTemplate);
  $("#systemEditorModal").html(equip_template(s));

  $('#systemEditorModal').css("display", "block");

  $('.close').click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });


  var availableSystems = [];
  var totalFreeSp = s ? sp.free + s.sp : sp.free; //include replacement sp
  for (var i = 0; i < systems.length; i++) {
    var s = systems[i];
    if (s.source !== "GMS") {
      var licenseIdx = pilot.licenses.findIndex(l => l.name === s.license);
      if (licenseIdx === -1) continue;
      if (licenses[licenseIdx].level < s.license_level) continue;
    }
    if (totalFreeSp >= s.sp) availableSystems.push(Tags.expand(s))
  }


  var system_template = Handlebars.compile(systemItemTemplate);
  $("#available-systems").append(system_template({
    systems: availableSystems
  }));

  $('.system-item').click(function () {
    var e = $(this);
    $('.system-item').each(function () {
      $(this).parent().removeClass("skill-upgrade")
      if ($(this).closest('.equip-expander').hasClass('open')) {
        var parent = $(this).closest('.equip-expander');
        $(this).removeClass('bold');
        $(parent).removeClass('open');
        $($(parent).find(".equip-open-info")).hide("swing");
      }
    });
    e.parent().addClass("skill-upgrade");
    $("#system-install").removeClass("disabled").click(function () {
      addSystem(e.data("id"), s_idx, pilot, config);
      $('#systemEditorModal').css("display", "none");
    })
  });

  Expander.bindEquipment();

}

function addSystem(system_id, idx, pilot, config) {
  if (idx != null) {
    config.systems[idx].id = system_id;
  } else {
    config.systems.push({id: system_id})
  }
  
  mechSidebar.updateConfig(config);
  loadMech(config, pilot)
}

module.exports = loadMech;